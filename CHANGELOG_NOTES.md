# BetopiaERP Review Notes (2026-02-10)

This note summarizes the changes applied during the security + scalability review and tuning.

## Application Code Changes

### SSRF and download hardening
- Added URL validation and size-limited fetch helper.
  - File: `betopiaerp/tools/net.py`
  - Validates `http/https` only
  - Blocks private/reserved IPs (hostname resolution)
  - Streams with max size limits

- Hardened DB dump fetch in CLI.
  - File: `betopiaerp/cli/db.py`
  - Uses `fetch_url_content` with a 100MB cap and redirect validation

- Hardened XSD/ZIP download for XML utils.
  - File: `betopiaerp/tools/xml_utils.py`
  - Uses `fetch_url_content` with a 50MB cap
  - ZIP total size cap 100MB
  - Per‑file XSD cap 10MB

- Hardened forum URL title fetch.
  - File: `addons/website_forum/controllers/website_forum.py`
  - Public URL validation
  - Timeout and capped content read (256KB)
  - No redirects

- Hardened link preview fetch.
  - File: `addons/mail/tools/link_preview.py`
  - Public URL validation and redirect validation
  - Head read capped to 256KB

## BetopiaERP Runtime Config

- Updated worker configuration and limits for 24‑core / 48GB server.
  - File: `betopiaerp.conf`
  - `workers = 12`
  - `max_cron_threads = 2`
  - `limit_memory_soft = 2516582400`
  - `limit_memory_hard = 3145728000`
  - `limit_time_cpu = 120`
  - `limit_time_real = 240`
  - `limit_request = 8192`
  - `db_maxconn = 64`

## PostgreSQL Tuning (system file)

- File: `/etc/postgresql/16/main/postgresql.conf`
- Adjusted memory, WAL, parallelism, autovacuum, IO, and JIT:
  - `shared_buffers = 8GB`
  - `work_mem = 32MB`
  - `maintenance_work_mem = 1GB`
  - `autovacuum_work_mem = 512MB`
  - `effective_cache_size = 24GB`
  - `effective_io_concurrency = 200`
  - `maintenance_io_concurrency = 50`
  - `max_worker_processes = 24`
  - `max_parallel_workers = 12`
  - `max_parallel_workers_per_gather = 4`
  - `max_parallel_maintenance_workers = 4`
  - `wal_buffers = 16MB`
  - `checkpoint_timeout = 15min`
  - `max_wal_size = 4GB`
  - `min_wal_size = 1GB`
  - `log_autovacuum_min_duration = 5s`
  - `track_wal_io_timing = on`
  - `autovacuum_max_workers = 6`
  - `autovacuum_naptime = 30s`
  - `autovacuum_vacuum_scale_factor = 0.05`
  - `autovacuum_vacuum_insert_scale_factor = 0.05`
  - `autovacuum_analyze_scale_factor = 0.05`
  - `autovacuum_vacuum_cost_limit = 2000`
  - `random_page_cost = 1.1`
  - `jit = off`

## Nginx Tuning (system files)

- File: `/etc/nginx/nginx.conf`
  - `worker_rlimit_nofile = 65535`
  - `worker_connections = 4096`
  - `multi_accept on`
  - Enabled gzip and common types

- File: `/etc/nginx/sites-available/betopiaerp`
  - Added upstreams with keepalive for backend and longpolling
  - Added buffering and cache headers for `/web/static/` and `/web/image/`
  - Disabled buffering for websocket/longpolling
  - Added `X-Forwarded-*` headers

## Service Status

- Services were NOT restarted as part of this change.
- Required to apply:
  1. Restart PostgreSQL
  2. Reload/Restart Nginx
  3. Restart BetopiaERP service

## Notes

- These settings are a baseline for large internal user bases.
- They do not guarantee 10K *concurrent* users on a single host.
- Load testing is required to validate real capacity.
