# Changelog

## v1.0.0
- Official public source release (clean package)
- Encoded core backend files integrated
- Clean database seed included (`hlsvideo_database.sql`):
  - keep admin
  - remove videos
  - clear storage account credentials/config
  - clear embed domain whitelist/aliases
  - clear custom JW/player config
- Source cleanup for release:
  - removed lab/test pages
  - removed backup artifacts (`*.pre-ioncube-bak`, rollback files)
  - kept single env template (`.env.example`)
