<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () {
    return redirect('/app');
});

$router->get('/health', function () {
    return response()->json(['message' => 'HLS service is running']);
});

$router->get('/embed-multi', 'VideoController@multiEmbedPlayer');
$router->get('/embed/{token}', 'VideoController@embedPlayer');

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('/auth/login', 'VideoController@adminLogin');

    $router->group(['middleware' => 'adminauth'], function () use ($router) {
    $router->post('/auth/logout', 'VideoController@adminLogout');
    $router->post('/auth/update-credentials', 'VideoController@updateAdminCredentials');
    // Import video (có/không HLS)
    $router->post('/videos/import', 'VideoController@import');
    $router->post('/videos/upload', 'VideoController@upload');
    $router->post('/queue/upload-temp-init', 'VideoController@queueUploadTempInit');
    $router->get('/queue/upload-temp-status/{token}', 'VideoController@queueUploadTempStatus');
    $router->post('/queue/upload-temp-chunk', 'VideoController@queueUploadTempChunk');
    $router->post('/queue/upload-temp-chunk-raw', 'VideoController@queueUploadTempChunkRaw');
    $router->post('/queue/upload-temp-complete', 'VideoController@queueUploadTempComplete');
    $router->post('/queue/upload-temp', 'VideoController@queueUploadTemp');
    $router->post('/queue/process-temp', 'VideoController@queueProcessTemp');
    $router->delete('/queue/temp/{token}', 'VideoController@queueDeleteTemp');
    $router->get('/jobs/recent', 'VideoController@recentJobs');
    $router->get('/jobs/{jobId}', 'VideoController@jobStatus');
    $router->post('/jobs/{jobId}/cancel', 'VideoController@cancelJob');
    $router->post('/jobs/{jobId}/run', 'VideoController@runJob');

    // Danh sách video
    $router->get('/videos', 'VideoController@index');

    // Xem chi tiết
    $router->get('/videos/{id}', 'VideoController@show');
    $router->get('/videos/{id}/embed', 'VideoController@embedInfo');
    $router->get('/videos/{id}/play', 'VideoController@playSource');
    $router->get('/videos/{id}/thumbnail', 'VideoController@videoThumbnail');
    $router->put('/videos/{id}/category', 'VideoController@updateCategory');

    // Xóa video
    $router->delete('/videos/{id}', 'VideoController@destroy');

    // Cấu hình hệ thống
    $router->get('/settings', 'VideoController@getSettings');
    $router->put('/settings', 'VideoController@updateSettings');
    $router->get('/license/status', 'VideoController@licenseStatus');
    $router->post('/license/activate', 'VideoController@activateLicense');
    $router->post('/license/refresh', 'VideoController@refreshLicense');
    $router->post('/settings/test', 'VideoController@testSettings');
    $router->get('/gdrive/auth-url', 'VideoController@gdriveAuthUrl');
    $router->post('/gdrive/account-auth-url', 'VideoController@gdriveAccountAuthUrl');
    $router->get('/gdrive/callback', 'VideoController@gdriveCallback');
    $router->post('/storage/account-test', 'VideoController@testStorageAccount');
    $router->post('/storage/account-usage', 'VideoController@getStorageAccountUsage');
    $router->get('/system/status', 'VideoController@systemStatus');
    $router->get('/patch/status', 'VideoController@patchUpdateStatus');
    $router->post('/patch/update', 'VideoController@runPatchUpdate');
    $router->post('/patch/rollback', 'VideoController@runPatchRollback');

    });

    // === STREAM HLS (public for embed/player) ===
    $router->get('/hls/{folder}/{file}', 'VideoController@streamHls');
    $router->get('/hls/{folder}', 'VideoController@streamHls'); // master.m3u8
    $router->get('/r2-hls/{folder}/{file}', 'VideoController@streamR2Hls');
    $router->get('/r2-hls/{folder}', 'VideoController@streamR2Hls');
    $router->get('/b2-hls/{folder}/{file}', 'VideoController@streamB2Hls');
    $router->get('/b2-hls/{folder}', 'VideoController@streamB2Hls');
    $router->get('/gdrive-hls/{token}/{file}', 'VideoController@streamGdriveHls');
    $router->get('/gdrive-hls/{token}', 'VideoController@streamGdriveHls');
    $router->get('/ttb-hls/{token}/{file}', 'VideoController@streamTtbHls');
    $router->get('/ttb-hls/{token}', 'VideoController@streamTtbHls');
    $router->get('/ttb-asset/{token}/raw', 'VideoController@streamTtbRawAsset');
    $router->get('/play/{token}', 'VideoController@playSourceByToken');
    $router->get('/play-id/{id}', 'VideoController@playSourcePublic');
    $router->get('/subtitle/{token}', 'VideoController@subtitleByToken');
    $router->get('/hls-key/{token}', 'VideoController@hlsKey');
});
