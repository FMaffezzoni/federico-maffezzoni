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

## Photos & CV

- Home: `public/images/federico.png`
- About: `public/images/Fede.png`
- CV: `public/CV_Federico_Maffezzoni.pdf` (download button on About)

You can also replace paths from **Admin → Profile & photos**.
