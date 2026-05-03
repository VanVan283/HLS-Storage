#!/usr/bin/env php
<?php
declare(strict_types=1);

function arg(array $argv,string $k,?string $d=null): ?string { foreach($argv as $a){ if(str_starts_with($a,"--$k=")) return substr($a,strlen($k)+3);} return $d; }
function mk(string $d): void { if(!is_dir($d) && !mkdir($d,0775,true) && !is_dir($d)) throw new RuntimeException("mkdir failed: $d"); }

$argv=$_SERVER['argv']??[];
$root=rtrim((string)arg($argv,'root',dirname(__DIR__)),'/');
$backup=trim((string)arg($argv,'backup',''));
$backupRoot="$root/storage/app/patch-backups";
mk($backupRoot);

if($backup===''){
  $list=array_values(array_filter(scandir($backupRoot)?:[], fn($x)=>$x!=='.'&&$x!=='..'));
  rsort($list);
  $backup=$list[0]??'';
}
if($backup==='') throw new RuntimeException('Không có backup để rollback');
$backupDir=str_starts_with($backup,'/')?$backup:"$backupRoot/$backup";
if(!is_dir($backupDir)) throw new RuntimeException('Backup không tồn tại: '.$backupDir);

$it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($backupDir,FilesystemIterator::SKIP_DOTS));
foreach($it as $f){
  if(!$f->isFile()) continue;
  $src=$f->getPathname();
  $rel=str_replace('\\','/',substr($src,strlen($backupDir)+1));
  $dst="$root/$rel";
  $dir=dirname($dst); if(!is_dir($dir)) mkdir($dir,0775,true);
  copy($src,$dst);
}

echo "Rollback OK from: $backupDir\n";
