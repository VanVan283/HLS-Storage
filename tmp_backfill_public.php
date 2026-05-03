<?php
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$gd = $app->make(App\Services\Storage\GoogleDriveStorage::class);
$mapPath = __DIR__ . '/storage/app/gdrive-hls/gdhls_69eb2f35923fb.json';
$map = json_decode(file_get_contents($mapPath), true) ?: [];
$files = $map['files'] ?? [];
$map['public_urls'] = $map['public_urls'] ?? [];
$ok=0; $fail=0;
foreach ($files as $name=>$id) {
  if (!empty($map['public_urls'][$name])) continue;
  try {
    $u = $gd->makeFilePublicAndGetUrl($id);
    if ($u) { $map['public_urls'][$name] = $u; $ok++; } else { $fail++; }
  } catch (Throwable $e) {
    $fail++;
    file_put_contents('php://stderr', "ERR $name: ".$e->getMessage()."\n");
  }
}
file_put_contents($mapPath, json_encode($map, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT));
echo "ok=$ok fail=$fail\n";
