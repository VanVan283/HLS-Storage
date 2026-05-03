<?php

namespace App\Http\Middleware;

use Closure;

class AdminAuthMiddleware
{
    public function handle($request, Closure $next)
    {
        $path = '/' . ltrim($request->path(), '/');
        if ($path === '/api/auth/login') {
            return $next($request);
        }

        $auth = (string)$request->header('Authorization', '');
        $token = '';
        if (preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
            $token = trim((string)($m[1] ?? ''));
        }
        if ($token === '') {
            $token = trim((string)$request->cookie('hls_admin_token', ''));
        }
        if ($token === '') {
            return response()->json(['status' => 'error', 'message' => 'Chưa đăng nhập'], 401);
        }
        $file = storage_path('app/admin-session.json');
        $data = [];
        if (is_file($file)) {
            $data = json_decode((string)@file_get_contents($file), true) ?: [];
        }

        $saved = (string)($data['token'] ?? '');
        $expiresAt = (int)($data['expires_at'] ?? 0);
        if ($token === '' || $saved === '' || !hash_equals($saved, $token) || ($expiresAt > 0 && time() > $expiresAt)) {
            return response()->json(['status' => 'error', 'message' => 'Phiên đăng nhập hết hạn'], 401);
        }

        return $next($request);
    }
}
