#!/usr/bin/env php
<?php
declare(strict_types=1);

function arg(array $argv,string $k,?string $d=null): ?string { foreach($argv as $a){ if(str_starts_with($a,"--$k=")) return substr($a,strlen($k)+3);} return $d; }
function mk(string $d): void { if(!is_dir($d) && !mkdir($d,0775,true) && !is_dir($d)) throw new RuntimeException("mkdir failed: $d"); }
function sha(string $f): string { $h=hash_file('sha256',$f); if($h===false) throw new RuntimeException("hash failed: $f"); return $h; }

$argv=$_SERVER['argv']??[];
$version=trim((string)arg($argv,'version',''));
if($version===''){fwrite(STDERR,"Usage: php scripts/build_patch.php --version=1.0.0 [--from-manifest=path] [--base-url=url]\n");exit(1);} 
$root=rtrim((string)arg($argv,'root',dirname(__DIR__)),'/');
$outRoot=rtrim((string)arg($argv,'out',"$root/build/patches"),'/');
$baseUrl=rtrim((string)arg($argv,'base-url',''),'/');
$fromManifest=(string)arg($argv,'from-manifest',"$outRoot/latest-manifest.json");

$exclude=['.git','.idea','.vscode','vendor','node_modules','build','storage/logs','storage/framework/cache','storage/framework/sessions','storage/framework/views','.env'];
$files=[];
$it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root,FilesystemIterator::SKIP_DOTS));
foreach($it as $f){
  /** @var SplFileInfo $f */
  if(!$f->isFile()) continue;
  $rel=str_replace('\\','/',substr($f->getPathname(),strlen($root)+1));
  $skip=false;
  foreach($exclude as $x){ if($rel===$x || str_starts_with($rel,$x.'/')){$skip=true;break;} }
  if($skip) continue;
  $files[$rel]=['sha256'=>sha($f->getPathname()),'size'=>$f->getSize()?:0];
}
ksort($files);

$prev=[]; $fromVersion='0.0.0';
if(is_file($fromManifest)){
  $j=json_decode((string)file_get_contents($fromManifest),true);
  if(is_array($j)){ $prev=(array)($j['files']??[]); $fromVersion=(string)($j['to_version']??$fromVersion); }
}

$changed=[]; $deleted=[];
foreach($files as $p=>$m){ if(!isset($prev[$p]) || ($prev[$p]['sha256']??'')!==$m['sha256']) $changed[$p]=$m; }
foreach($prev as $p=>$m){ if(!isset($files[$p])) $deleted[]=$p; }
sort($deleted);

$verDir="$outRoot/$version";
$filesDir="$verDir/files";
mk($filesDir);
foreach(array_keys($changed) as $p){
  $src="$root/$p"; $dst="$filesDir/$p"; mk(dirname($dst)); copy($src,$dst);
}

$manifest=[
  'from_version'=>$fromVersion,
  'to_version'=>$version,
  'built_at'=>gmdate('c'),
  'changed_count'=>count($changed),
  'delete_count'=>count($deleted),
  'files'=>$changed,
  'delete'=>$deleted,
  'post_commands'=>['php artisan migrate --force']
];
file_put_contents("$verDir/manifest.json",json_encode($manifest,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));

$zipPath="$verDir/patch.zip";
$zip=new ZipArchive();
if($zip->open($zipPath,ZipArchive::CREATE|ZipArchive::OVERWRITE)!==true) throw new RuntimeException('Cannot create patch.zip');
$iter=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($filesDir,FilesystemIterator::SKIP_DOTS));
foreach($iter as $f){ $abs=$f->getPathname(); $local='files/'.str_replace('\\','/',substr($abs,strlen($filesDir)+1)); $zip->addFile($abs,$local); }
$zip->addFile("$verDir/manifest.json",'manifest.json');
$zip->close();

$latest=[
  'latest_version'=>$version,
  'published_at'=>gmdate('c'),
  'manifest'=>($baseUrl?"$baseUrl/$version/manifest.json":"$version/manifest.json"),
  'patch'=>($baseUrl?"$baseUrl/$version/patch.zip":"$version/patch.zip")
];
file_put_contents("$outRoot/latest.json",json_encode($latest,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
$full=['to_version'=>$version,'files'=>$files,'built_at'=>gmdate('c')];
file_put_contents("$outRoot/latest-manifest.json",json_encode($full,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));

echo "OK\n";
echo "Version: $version\nChanged: ".count($changed)."\nDeleted: ".count($deleted)."\n";
echo "Patch: $zipPath\nLatest: $outRoot/latest.json\n";
