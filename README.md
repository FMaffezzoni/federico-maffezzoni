# Dr. Federico Maffezzoni — personal website + CMS

Bilingual (IT / EN) clinician site with an admin dashboard to manage all public content.

## Quick start

```bash
cd Federico
npm install
npm run dev:all
```

- Public site: http://localhost:5173  
- Admin: http://localhost:5173/admin  
- CMS API: http://localhost:5055  

Default admin login (change after first sign-in):

- Username: `admin`
- Password: `FedericoAdmin2026!`

Copy `server/.env.example` to `server/.env` to customize credentials and `JWT_SECRET`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite frontend only |
| `npm run server` | CMS API (Express, port 5055) |
| `npm run dev:all` | Frontend + API together |
| `npm run build` | Production build |

## Admin capabilities

Signed-in admins can edit:

- Profile (name, role, email, phone, MioDottore URL, photos)
- Home, About, Approach page copy
- Services & fees (add / edit / hide / delete)
- Conditions list
- Media / video links
- Publications (full CRUD, year, optional link, visibility)
- Testimonials (MioDottore screenshot uploads; 4 visible slider above footer)
- Contact locations & payment notes
- Navigation labels, CTAs, footer
- Password change and content reset to defaults

Content is stored in `server/data/content.json` (created on first API start). Uploads go to `server/uploads/`.

## Deploy online

### 1. Render (CMS API — backend)

See **[server/RENDER.md](server/RENDER.md)** for Render settings and env vars.

1. [render.com](https://render.com) → **New → Web Service** → connect repo `federico-maffezzoni`
2. Build: `npm install` · Start: `npm start`
3. Add env vars: `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
4. Copy the live URL (e.g. `https://your-service.onrender.com`)

### 2. GitHub Pages (public site — frontend)

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. **Settings → Secrets and variables → Actions → Variables** → add:
   - Name: `VITE_API_URL`
   - Value: your Render URL (no trailing slash), e.g. `https://your-service.onrender.com`
3. Push to `main` (includes `.github/workflows/deploy.yml`) or run **Actions → Deploy to GitHub Pages → Run workflow**
4. Site: `https://<your-github-username>.github.io/federico-maffezzoni/`
5. Admin: same URL + `/admin`

If you uploaded manually before adding the workflow, upload these new files too:
- `.github/workflows/deploy.yml`
- updated `vite.config.js` and `package.json` (`start` script)

## Photos & CV

- Home: `public/images/federico.webp`
- About: `public/images/Fede.webp`
- CV: `public/CV_Federico_Maffezzoni.pdf` (download button on About)

You can also replace paths from **Admin → Profile & photos**.
