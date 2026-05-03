<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        // Kiểm tra kiểu response, sau đó set header tương ứng
        if (method_exists($response, 'header')) {
            // Response Laravel (Illuminate)
            $response->header('Access-Control-Allow-Origin', '*');
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Range');
        } else {
            // Response Symfony (BinaryFileResponse)
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Range');
        }

        // Nếu là preflight request (OPTIONS)
        if ($request->getMethod() === "OPTIONS") {
            $response->setStatusCode(200);
        }
        return $response;
    }
}
