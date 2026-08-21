# Federico CMS API — Render + MongoDB Atlas

## Why MongoDB?

Render Free wipes local files (`server/data/`, `server/uploads/`) when the service sleeps or redeploys.  
With **MongoDB Atlas (free tier)**, admin edits and uploads persist.

## 1. Create a free MongoDB Atlas cluster

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a free **M0** cluster (choose a region close to Italy, e.g. Frankfurt / Ireland if available)
3. **Database Access** → Add user → create username + password (save them)
4. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)  
   (needed because Render’s IPs change)
5. **Database** → **Connect** → **Drivers** → copy the connection string  
   Example shape:  
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`  
   Replace `PASSWORD` with the real password (URL-encode special characters if needed)

## 2. Render settings

| Field | Value |
|-------|--------|
| **Root Directory** | *(blank — repo root)* |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free is fine with MongoDB |

## 3. Environment variables (Render → Environment)

| Key | Value |
|-----|--------|
| `MONGODB_URI` | Your Atlas connection string |
| `MONGODB_DB` | `federico_cms` (optional; default) |
| `JWT_SECRET` | Long random string (32+ chars) |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | Strong password |
| `ADMIN_EMAIL` | e.g. `dott.federicomaffezzoni@gmail.com` |
| `PUBLIC_SITE_URL` | `https://federicomaffezzoni.it` (no trailing slash) |
| `NODE_VERSION` | `20` (optional) |

`PORT` is set by Render — do not override it.

After adding `MONGODB_URI`, click **Manual Deploy** (or wait for auto-redeploy).

## 4. Verify persistence

1. Open `https://YOUR-SERVICE.onrender.com/api/health`  
   You should see `"storage":"mongodb"`.
2. Log in at `https://federicomaffezzoni.it/admin/login`
3. Edit a publication → **Save changes**
4. Wait for Render to sleep (or Manual Deploy), then refresh the public site  
   Content should still match what you saved.

## 5. GitHub Pages → API URL

**GitHub → Settings → Secrets and variables → Actions → Variables → `VITE_API_URL`**  
= your Render URL (no trailing slash), e.g. `https://federico-cms.onrender.com`

Re-run the Pages deploy workflow if you change it.

## Forgot password

Works in two modes:

### A. Without SMTP (default on Render Free)

1. Set on Render:
   - `ADMIN_EMAIL` = `dott.federicomaffezzoni@gmail.com`
   - `PUBLIC_SITE_URL` = `https://federicomaffezzoni.it`
2. Open `/admin/forgot-password`, enter that email, submit.
3. The **reset link appears on the page** (and in Render logs). Open it within 1 hour.

No `RETURN_RESET_LINK` flag is required anymore when SMTP is not set.

### B. With email (optional Gmail)

1. Google Account → Security → App passwords (2FA required)
2. Render env:

| Key | Example |
|-----|---------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your Gmail address |
| `SMTP_PASS` | the 16-character app password |
| `SMTP_FROM` | same as `SMTP_USER` (optional) |

3. Redeploy. Forgot-password will email the link instead of showing it on the page.

### Reset admin without email (emergency)

1. Set `ADMIN_PASSWORD` = new password and `RESET_ADMIN` = `true`
2. Manual Deploy → log in
3. Set `RESET_ADMIN` = `false` and redeploy again

## Local development

Copy `server/.env.example` → `server/.env`, paste `MONGODB_URI`, then:

```bash
npm install
npm run dev:all
```

Without `MONGODB_URI`, the API still runs on the local filesystem (fine for quick tests only).

## Collections created automatically

| Collection | Purpose |
|------------|---------|
| `site_content` | Full CMS document (pages, publications, etc.) |
| `admin_auth` | Admin username / password hash |
| `uploads.files` / `uploads.chunks` | GridFS for admin file uploads |

On first start with an empty database, the API:

1. Migrates `server/data/content.json` if present, **or**
2. Seeds from `server/bootstrap-content.json` (snapshot of your current live CMS), **or**
3. Uses built-in site defaults

After that, every admin **Save** writes to MongoDB and survives sleep/redeploy.
