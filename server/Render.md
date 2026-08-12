
# Federico CMS API — Render deployment

## Render settings

| Field | Value |
|-------|--------|
| **Root Directory** | *(leave blank — repo root is the app)* |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free (or Starter if you need persistent disk) |

## Environment variables (Render → Environment)

| Key | Value |
|-----|--------|
| `JWT_SECRET` | Long random string (e.g. 32+ chars) |
| `ADMIN_USERNAME` | `admin` (or your choice) |
| `ADMIN_PASSWORD` | Strong password — **change from default** |
| `NODE_VERSION` | `20` (optional, recommended) |
| `RESET_ADMIN` | Set `true` only to rewrite admin from env (see below), then set back to `false` |

`PORT` is set automatically by Render — do not override it.

## Reset admin password (Render Free — no Shell)

You cannot open `server/data/auth.json` on Free (no Shell). Reset like this:

1. Upload/push the latest `server/store.js` and `server/index.js` (supports `RESET_ADMIN`).
2. Render → Environment → set:
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = your new password
   - `RESET_ADMIN` = `true`
3. **Manual Deploy** / wait for redeploy.
4. Log in at `/admin` with those credentials.
5. Set `RESET_ADMIN` = `false` (or delete it) and redeploy again so the password is not reset on every restart.

## After deploy

Copy the service URL (e.g. `https://federico-cms.onrender.com`) and set it as the GitHub repo variable:

**GitHub → Settings → Secrets and variables → Actions → Variables → `VITE_API_URL`**

Then re-run the GitHub Pages deploy workflow.

## Free tier note

On Render Free, `server/data/` and `server/uploads/` are **ephemeral** — content may reset when the service redeploys or sleeps. For production CMS persistence, use Render **Persistent Disk** or migrate to a database later.
