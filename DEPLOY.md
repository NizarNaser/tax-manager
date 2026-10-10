# Deploying tax-manager to the VPS (MySQL)

The app now uses **MySQL** (via Sequelize) instead of MongoDB. It's deployed the same way the other apps on this VPS are: **PM2** running Next's standalone server, behind a shared **Nginx** config, with a **MySQL** database local to the box. There is no control panel involved — everything is plain Ubuntu, managed over SSH as root.

- Domain: `https://tax-manager.lughaty.cloud`
- VPS IP: `179.198.218.225`
- App port: `3004` (lughaty=3001, flexjob=3002, talker=3003 — already in use)
- App path on server: `/var/www/tax-manager`

## 1. DNS

Add an **A record** for `tax-manager.lughaty.cloud` → `179.198.218.225` wherever `lughaty.cloud`'s DNS is managed. Each subdomain here has its own A record and its own Let's Encrypt certificate (no wildcard), matching how `talker.lughaty.cloud` is set up.

## 2. Get the code onto the server

```bash
cd /var/www
git clone https://github.com/NizarNaser/tax-manager.git tax-manager
cd tax-manager
```

## 3. MySQL database

```bash
mysql -e "CREATE DATABASE tax_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER 'tax_manager'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';"
mysql -e "GRANT ALL PRIVILEGES ON tax_manager.* TO 'tax_manager'@'localhost'; FLUSH PRIVILEGES;"
echo 'STRONG_PASSWORD_HERE' > /root/.dbpw/tax_manager
```

(Same naming convention as the other apps on this box: database and user both named after the app, no account prefix.)

Tables are created automatically on first connection (`sequelize.sync()` in [lib/db.js](lib/db.js)). To pre-create them instead, import [database/schema.sql](database/schema.sql) with `mysql tax_manager < database/schema.sql`.

## 4. `.env`

Create `/var/www/tax-manager/.env`:

```
NEXTAUTH_URL=https://tax-manager.lughaty.cloud
CLOAPP_BASE_URL=https://tax-manager.lughaty.cloud
NEXTAUTH_SECRET=<openssl rand -base64 32>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MAIL_DB=...

DB_HOST=localhost
DB_PORT=3306
DB_NAME=tax_manager
DB_USER=tax_manager
DB_PASSWORD=<same password as step 3>

PORT=3004
UPLOADS_DIR=/var/www/tax-manager/uploads
```

`PORT` and `UPLOADS_DIR` matter specifically for this deployment style — see the Notes section below.

In Google Cloud Console, add `https://tax-manager.lughaty.cloud/api/auth/callback/google` as an authorized redirect URI for this OAuth client.

## 5. Install, build, start

```bash
npm ci
npm run build
```

`npm run build` automatically finishes the standalone bundle too (`postbuild` in `package.json` copies `public/` and `.next/static/` into `.next/standalone/`) — no separate manual copy step.

```bash
pm2 start .next/standalone/server.js \
  --name tax-manager \
  --cwd /var/www/tax-manager \
  --node-args="--env-file=/var/www/tax-manager/.env"
pm2 save
```

(Same invocation style as the `lughaty` process — `pm2 show lughaty` to compare.)

## 6. Nginx

Add a server block to `/etc/nginx/sites-available/apps.conf` (the same file every other app's block lives in), modeled on the `talker.lughaty.cloud` block already there:

```nginx
server { server_name tax-manager.lughaty.cloud; client_max_body_size 25m; location / { proxy_pass http://127.0.0.1:3004; include /etc/nginx/proxy_common.conf; } }
```

Then:

```bash
nginx -t && systemctl reload nginx
```

`nginx -t` first, always — `reload` (not `restart`) so the other sites on this box aren't disrupted.

## 7. SSL

Once DNS has propagated:

```bash
certbot --nginx -d tax-manager.lughaty.cloud
```

Certbot rewrites the block added in step 6 to add the `listen 443 ssl` lines and the matching HTTP→HTTPS redirect block, same as it did for the other domains.

## 8. Redeploying updates

```bash
cd /var/www/tax-manager
git pull
npm ci
npm run build
pm2 restart tax-manager
```

## Notes

- **Why `PORT` and `UPLOADS_DIR` are required, not optional**: Next's generated standalone server (`.next/standalone/server.js`) calls `process.chdir(__dirname)` on boot, so at runtime the process's cwd is always `.next/standalone` — regardless of PM2's `--cwd` setting. Since `next build` recreates `.next` (and therefore `.next/standalone`) from scratch on every deploy, anything written under a `process.cwd()`-relative path would be silently deleted on the next `npm run build`. `UPLOADS_DIR` in [lib/localUpload.js](lib/localUpload.js) points uploads at a fixed absolute path outside `.next` instead, so they survive redeploys. This was verified directly: uploaded a file, ran a full rebuild, confirmed the file and its serving URL still worked afterward.
- MongoDB is no longer used; `MONGO_URI` has been removed.
- Invoice `_id` values are now numeric MySQL auto-increment IDs (still returned as strings in API responses, so the existing frontend code needs no changes).
- **Image storage**: invoice images and company logos are no longer sent to Cloudinary. They're decoded from the base64 upload and written to `UPLOADS_DIR` ([lib/localUpload.js](lib/localUpload.js)), then served back through [app/api/uploads/[...path]/route.js](app/api/uploads/[...path]/route.js) (deliberately not through Next's static `/public` handling — see the note above on why that would break under standalone output). Back up `UPLOADS_DIR` along with the database.
- If you have existing data in the old MongoDB that needs migrating, export each collection to JSON and write a one-off script that reads it and calls `Invoice.create(...)` / `Settings.create(...)` against the new MySQL models — ask if you'd like this script written.
