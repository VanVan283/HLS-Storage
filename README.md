# HLS STORAGE

Cloud Video Platform for import/upload, HLS processing, embed playback, and multi-storage routing.

## Requirements

- PHP 8.3
- ionCube Loader (required)
- MySQL/MariaDB
- FFmpeg + FFprobe
- Web server (Nginx/Caddy/Apache)

## Quick Setup

1. Clone source and install dependencies
2. Prepare env:
   - nếu chưa có `.env`, copy từ `.env.example` (hoặc dùng `.env` mẫu trong release package)
3. Configure database in `.env`
4. Import database:
   - `hlsvideo_database.sql`
5. Set permissions để tránh HTTP 500:

```bash
sudo mkdir -p storage/logs storage/app storage/framework/cache storage/framework/sessions storage/framework/views public/hls bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache public/hls
sudo chmod -R 775 storage bootstrap/cache public/hls
```

## Notes

- This release ships with clean database seed (admin kept, runtime data removed).
- Storage account credentials are intentionally empty in clean DB.
- Embed whitelist/alias and custom JW settings are intentionally reset in clean DB.

## Security

- Keep `.env` private
- Restrict DB credentials
- Do not expose internal logs or backup dumps publicly

## Support

- Website: https://hlsstorage.com
- Telegram: https://t.me/alexvan283
