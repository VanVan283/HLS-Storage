<?php

namespace App\Services\Storage;

use App\Models\SiteSetting;

class FTPStorage implements StorageInterface
{
    protected $hostname;
    protected $port;
    protected $username;
    protected $password;
    protected $remotePath;
    protected $destPath;
    protected $accountLabel = 'FTP';
    protected $fallbackEnabled = true;
    protected $candidates = [];

    public function __construct()
    {
        StorageLicenseGuard::ensure('storage_ftp', 'ftp');
        $settings = SiteSetting::getSettings();

        $primary = [[
            'hostname' => $settings->ftp_hostname,
            'port' => $settings->ftp_port ?? 21,
            'user' => $settings->ftp_user,
            'pass' => $settings->ftp_pass,
            'path' => $settings->ftp_path ?? '/uploads/',
        ]];

        $multiEnabled = (bool)($settings->ftp_multi_enabled ?? false);
        $roundRobin = (bool)($settings->ftp_round_robin_enabled ?? true);
        $this->fallbackEnabled = (bool)($settings->ftp_fallback_enabled ?? true);
        $defaultIndex = (int)($settings->ftp_default_account_index ?? 0);

        $accounts = $this->parseAccountsJson($settings->ftp_accounts_json ?? null);
        $pool = ($multiEnabled && !empty($accounts)) ? $accounts : (!empty($accounts) ? $accounts : $primary);
        $this->candidates = $this->orderedCandidates('ftp', $pool, $roundRobin, $defaultIndex);

        $first = $this->candidates[0] ?? $primary[0];
        $this->hostname = $first['hostname'] ?? null;
        $this->port = (int)($first['port'] ?? 21);
        $this->username = $first['user'] ?? null;
        $this->password = $first['pass'] ?? null;
        $this->remotePath = $first['path'] ?? '/uploads/';
        $this->accountLabel = $first['name'] ?? ($this->hostname ? ('FTP: ' . $this->hostname) : 'FTP');
    }

    private function parseAccountsJson($json)
    {
        if (!is_string($json) || trim($json) === '') {
            return [];
        }
        $arr = json_decode($json, true);
        if (!is_array($arr)) {
            return [];
        }
        return array_values(array_filter($arr, function ($acc) {
            return is_array($acc)
                && !empty($acc['hostname'])
                && !empty($acc['user'])
                && array_key_exists('pass', $acc)
                && !empty($acc['path'])
                && (!array_key_exists('enabled', $acc) || $acc['enabled'] !== false);
        }));
    }

    private function orderedCandidates(string $type, array $accounts, bool $roundRobin, int $defaultIndex = 0)
    {
        if (empty($accounts)) {
            return [];
        }
        $ordered = array_values($accounts);
        if (!$roundRobin || count($ordered) < 2) {
            $start = max(0, min(count($ordered) - 1, $defaultIndex));
            return array_merge(array_slice($ordered, $start), array_slice($ordered, 0, $start));
        }
        $statePath = storage_path('app/storage-account-rr.json');
        $state = [];
        if (file_exists($statePath)) {
            $state = json_decode(file_get_contents($statePath), true) ?: [];
        }
        $idx = (int)($state[$type] ?? 0);
        $start = $idx % count($ordered);
        $state[$type] = ($idx + 1) % count($ordered);
        @file_put_contents($statePath, json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        return array_merge(array_slice($ordered, $start), array_slice($ordered, 0, $start));
    }

    private function ensureRemoteDir($ftp, string $dir): void
    {
        $dir = trim($dir);
        if ($dir === '' || $dir === '/') return;
        $parts = array_values(array_filter(explode('/', trim($dir, '/')), fn($p) => $p !== ''));
        $current = '';
        foreach ($parts as $part) {
            $current .= '/' . $part;
            if (@ftp_chdir($ftp, $current)) {
                @ftp_chdir($ftp, '/');
                continue;
            }
            @ftp_mkdir($ftp, $current);
        }
        @ftp_chdir($ftp, '/');
    }

    public function upload($localFile, $filename)
    {
        $errors = [];
        $list = !empty($this->candidates) ? $this->candidates : [[
            'hostname' => $this->hostname,
            'port' => $this->port,
            'user' => $this->username,
            'pass' => $this->password,
            'path' => $this->remotePath,
        ]];

        foreach ($list as $i => $acc) {
            $ftp = @ftp_connect($acc['hostname'], (int)($acc['port'] ?? 21), 30);
            if (!$ftp) {
                $errors[] = 'Không kết nối được FTP: ' . ($acc['hostname'] ?? 'unknown');
                if (!$this->fallbackEnabled || $i === count($list) - 1) break;
                continue;
            }

            $logged = @ftp_login($ftp, $acc['user'] ?? '', $acc['pass'] ?? '');
            if (!$logged) {
                @ftp_close($ftp);
                $errors[] = 'Sai tài khoản FTP: ' . ($acc['hostname'] ?? 'unknown');
                if (!$this->fallbackEnabled || $i === count($list) - 1) break;
                continue;
            }

            @ftp_pasv($ftp, true);
            $remoteFile = rtrim((string)($acc['path'] ?? '/uploads/'), '/') . '/' . ltrim((string)$filename, '/');
            $remoteDir = dirname($remoteFile);
            $this->ensureRemoteDir($ftp, $remoteDir);
            $uploadResult = @ftp_put($ftp, $remoteFile, $localFile, FTP_BINARY);
            @ftp_close($ftp);

            if (!$uploadResult) {
                $errors[] = 'Upload thất bại FTP: ' . ($acc['hostname'] ?? 'unknown');
                if (!$this->fallbackEnabled || $i === count($list) - 1) break;
                continue;
            }

            $this->hostname = $acc['hostname'];
            $this->port = (int)($acc['port'] ?? 21);
            $this->username = $acc['user'] ?? null;
            $this->password = $acc['pass'] ?? null;
            $this->remotePath = $acc['path'] ?? '/uploads/';
            $this->accountLabel = $acc['name'] ?? ('FTP: ' . ($acc['hostname'] ?? 'unknown'));
            $this->destPath = 'ftp://' . $this->hostname . $remoteFile;
            return true;
        }

        throw new \Exception('Upload lên FTP thất bại: ' . implode(' | ', $errors));
    }

    public function getPath()
    {
        return $this->destPath;
    }

    public function getMessage()
    {
        return 'Đã import và lưu lên FTP thành công!';
    }

    public function getAccountLabel()
    {
        return $this->accountLabel;
    }

    public function getConnectionInfo(): array
    {
        return [
            'hostname' => (string)$this->hostname,
            'port' => (int)$this->port,
            'user' => (string)$this->username,
            'pass' => (string)$this->password,
            'path' => (string)$this->remotePath,
        ];
    }

    public function getAccountIdentity(): array
    {
        return [
            'mode' => 'ftp',
            'label' => (string)$this->accountLabel,
            'hostname' => (string)$this->hostname,
            'port' => (int)$this->port,
            'user' => (string)$this->username,
            'path' => (string)$this->remotePath,
        ];
    }
}
