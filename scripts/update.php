#!/usr/bin/env php
<?php
declare(strict_types=1);

function arg(array $argv,string $k,?string $d=null): ?string { foreach($argv as $a){ if(str_starts_with($a,"--$k=")) return substr($a,strlen($k)+3);} return $d; }
function hasFlag(array $argv,string $k): bool { return in_array("--$k",$argv,true); }
function mk(string $d): void { if(!is_dir($d) && !mkdir($d,0775,true) && !is_dir($d)) throw new RuntimeException("mkdir failed: $d"); }
function rrmdir(string $dir): void { if(!is_dir($dir)) return; $it=scandir($dir); if($it===false) return; foreach($it as $x){ if($x==='.'||$x==='..') continue; $p="$dir/$x"; if(is_dir($p)&&!is_link($p)) rrmdir($p); else @unlink($p);} @rmdir($dir);} 
function getJson(string $url): array { $ctx=stream_context_create(['http'=>['timeout'=>30],'ssl'=>['verify_peer'=>false,'verify_peer_name'=>false]]); $raw=@file_get_contents($url,false,$ctx); if($raw===false) throw new RuntimeException("Fetch failed: $url"); $j=json_decode($raw,true); if(!is_array($j)) throw new RuntimeException("Invalid JSON: $url"); return $j; }
function getFile(string $url,string $to): void { $ctx=stream_context_create(['http'=>['timeout'=>120],'ssl'=>['verify_peer'=>false,'verify_peer_name'=>false]]); $raw=@file_get_contents($url,false,$ctx); if($raw===false) throw new RuntimeException("Download failed: $url"); file_put_contents($to,$raw); }
function sha(string $f): string { $h=hash_file('sha256',$f); if($h===false) throw new RuntimeException("hash failed: $f"); return $h; }

$argv=$_SERVER['argv']??[];
$root=rtrim((string)arg($argv,'root',dirname(__DIR__)),'/');
$feed=(string)arg($argv,'feed','');
$dryRun=hasFlag($argv,'dry-run');
if($feed===''){ fwrite(STDERR,"Usage: php scripts/update.php --feed=https://updates.example.com/hls-video/latest.json [--root=/opt/hls-video] [--dry-run]\n"); exit(1);} 

$tmp="$root/storage/app/patch-updater"; mk($tmp);
$backupRoot="$root/storage/app/patch-backups"; mk($backupRoot);
$logFile="$root/storage/logs/patch-update.log"; mk(dirname($logFile));
$lockFile="$tmp/update.lock";

$log=function(string $m) use($logFile){
  $line='['.date('Y-m-d H:i:s')."] $m\n";
  file_put_contents($logFile,$line,FILE_APPEND);
  echo $m."\n";
};

$lockFp=fopen($lockFile,'c+');
if(!$lockFp) throw new RuntimeException('Cannot open lock file');
if(!flock($lockFp,LOCK_EX|LOCK_NB)) {
  $log('Update skipped: another update is running');
  exit(2);
}

try {
  $latest=getJson($feed);
  $manifestUrl=(string)($latest['manifest']??'');
  $patchUrl=(string)($latest['patch']??'');
  $toVersion=(string)($latest['latest_version']??'');
  if($manifestUrl===''||$patchUrl===''||$toVersion==='') throw new RuntimeException('latest.json thiếu dữ liệu');

  $versionFile="$root/storage/app/current-version.txt";
  $current=is_file($versionFile)?trim((string)file_get_contents($versionFile)):'0.0.0';
  if($current===$toVersion){ $log("Đã ở bản mới nhất: $current"); exit(0);} 

  $manifest=getJson($manifestUrl);
  $changed=(array)($manifest['files']??[]); $deleted=(array)($manifest['delete']??[]);

  if($dryRun){
    $log("DRY-RUN from $current -> $toVersion");
    $log('Changed files: '.count($changed));
    $log('Deleted files: '.count($deleted));
    if(!empty($manifest['post_commands'])) $log('Post commands: '.json_encode($manifest['post_commands'],JSON_UNESCAPED_SLASHES));
    exit(0);
  }

  $work="$tmp/work_".date('Ymd_His'); mk($work);
  $zipPath="$work/patch.zip";
  getFile($patchUrl,$zipPath);
  $zip=new ZipArchive(); if($zip->open($zipPath)!==true) throw new RuntimeException('Cannot open patch.zip');
  $extract="$work/extract"; mk($extract); $zip->extractTo($extract); $zip->close();

  $backupDir="$backupRoot/backup_".date('Ymd_His'); mk($backupDir);

  foreach($changed as $path=>$meta){
    $src="$extract/files/$path"; $dst="$root/$path";
    if(!is_file($src)) throw new RuntimeException("Thiếu file trong patch: $path");
    if(isset($meta['sha256']) && sha($src)!==$meta['sha256']) throw new RuntimeException("Hash mismatch: $path");
    if(is_file($dst)){
      $b="$backupDir/$path"; mk(dirname($b)); copy($dst,$b);
    }
    mk(dirname($dst)); copy($src,$dst);
  }
  foreach($deleted as $path){
    $dst="$root/$path";
    if(is_file($dst)){
      $b="$backupDir/$path"; mk(dirname($b)); copy($dst,$b); unlink($dst);
    }
  }

  foreach((array)($manifest['post_commands']??[]) as $cmd){
    $cmd=trim((string)$cmd); if($cmd==='') continue;
    $full='cd '.escapeshellarg($root).' && '.$cmd.' 2>&1';
    passthru($full,$code);
    if($code!==0) throw new RuntimeException("Post command failed: $cmd");
  }

  file_put_contents($versionFile,$toVersion."\n");
  rrmdir($work);
  $log("Update OK: $current -> $toVersion");
  $log("Backup: $backupDir");
  exit(0);
} catch(Throwable $e){
  $log('Update failed: '.$e->getMessage());
  exit(1);
} finally {
  flock($lockFp,LOCK_UN);
  fclose($lockFp);
}
