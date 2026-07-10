# Intern Showcase — Deployment & Setup Guide

A platform where interns showcase their projects with a professional, shareable portfolio.

## Table of Contents

1. [How it works](#how-it-works)
2. [Local setup](#local-setup)
3. [Deployment overview](#deployment-overview)
4. [Step-by-step production deployment](#step-by-step-production-deployment)
5. [Making it searchable on Google](#making-it-searchable-on-google)

---

## How it works

```
Frontend (React on Vercel)
         ↓
API (Express on Render.com)
         ↓
Database (MongoDB Atlas) + Image Storage (Cloudinary)
```

**User flows:**
- New intern signs up → creates account with password → gets unique username slug
- Intern adds projects with title, description, tags, image, live link
- Each intern gets a public portfolio: `yourdomain.com/portfolio/jane-doe`
- Each project gets a shareable link: `yourdomain.com/project/my-awesome-app`
- Anyone can browse portfolios without logging in; interns log in to edit

---

## Local setup

### Prerequisites
- Node.js (v18+): https://nodejs.org/
- MongoDB (installed locally): https://www.mongodb.com/try/download/community
- Git: https://git-scm.com/

### Step 1: Start MongoDB locally
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux/Windows: follow MongoDB installation guide for your OS
# Or just make sure mongod is running in the background
```

### Step 2: Backend setup

```bash
cd server
npm install

# Create a .env file (copy from .env.example)
# Edit it: set MONGO_URI, JWT_SECRET, and dummy values for Cloudinary
# For now, use local MongoDB:
# MONGO_URI=mongodb://localhost:27017/intern-showcase
# JWT_SECRET=anylongstringfornow
# CLOUDINARY_* values can be placeholder strings for local dev

npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Frontend setup

In a new terminal:

```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: Test it locally

1. Open http://localhost:5173
2. Sign up with a test account
3. Add a test project (you can skip the image for now)
4. View your portfolio at `/portfolio/your-username`
5. Share a project link with anyone — it's public!

---

## Deployment overview

| Component | Where | Why | Cost |
|---|---|---|---|
| Frontend (React) | Vercel | Automatic deploys, fast CDN, free HTTPS | Free |
| Backend (Node) | Render.com | Free tier supports Node apps, easy setup | Free |
| Database | MongoDB Atlas | Cloud MongoDB, free tier is generous (512 MB) | Free |
| Images | Cloudinary | Free cloud storage + CDN for images | Free |

**Custom domain:** Yes, you can add your own domain (like `intern-showcase.com`). We'll set that up last.

---

## Step-by-step production deployment

### Part A: Cloudinary (Image Storage)

1. Go to https://cloudinary.com/users/register/free
2. Sign up (free account)
3. After login, go to your **Dashboard** (top-left menu)
4. Copy these three values:
   - **Cloud name** (you'll see it prominently)
   - **API Key** (in the API Environment Variable section)
   - **API Secret** (in the API Environment Variable section)
5. Save these — you'll need them in the next step.

### Part B: MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free account)
3. Create a new project (any name, e.g. "intern-showcase")
4. Create a cluster:
   - Choose "Free" tier
   - Provider: AWS (or your preference)
   - Region: closest to you
   - Click "Create"
   - Wait ~10 minutes for it to set up
5. Once ready, click "Connect"
6. Click "Connect your application"
7. Copy the connection string that looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/databaseName?retryWrites=true&w=majority
   ```
8. **Replace `<password>` with your actual password** (you set this during cluster creation)
9. **Replace `databaseName` with `intern-showcase`**
10. Save this connection string — you'll need it in the backend.

### Part C: Render.com (Backend hosting)

1. Go to https://render.com
2. Sign up with GitHub (easier for auto-deploys)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo (or paste GitHub URL for this project)
5. Select the `server` directory as root (Render will ask)
6. Configuration:
   - **Name:** `intern-showcase-api`
   - **Environment:** `Node`
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
7. **Environment variables** (click "Add Environment Variable" for each):
   - `MONGO_URI`: Paste your MongoDB connection string from Part B
   - `JWT_SECRET`: Generate a random string (https://www.uuidgenerator.net/)
   - `CLOUDINARY_CLOUD_NAME`: Your cloud name from Part A
   - `CLOUDINARY_API_KEY`: Your API key from Part A
   - `CLOUDINARY_API_SECRET`: Your API secret from Part A
   - `CLIENT_URL`: Keep as `http://localhost:5173` for now (we'll update after frontend deploys)
   - `PORT`: `5000`
8. Click "Create Web Service"
9. Wait for the deploy to finish (~5 mins)
10. Copy the URL it gives you (looks like `https://intern-showcase-api.render.com`)
11. Go back to environment variables, update `CLIENT_URL` to your Vercel URL (we'll do this after Vercel deploy)

**Note:** Render's free tier goes to sleep after 15 mins of inactivity. When you redeploy the frontend, requests might take 30 seconds the first time. This is fine for a school/portfolio project.

### Part D: Vercel (Frontend hosting)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repo
5. Select the `client` folder as root
6. **Environment variables:**
   - `VITE_API_URL`: Paste the Render URL from Part C (e.g. `https://intern-showcase-api.render.com/api`)
7. Click "Deploy"
8. Wait for deploy to finish (~2 mins)
9. You'll get a URL like `https://intern-showcase.vercel.app`
10. Copy this URL
11. Go back to Render, update `CLIENT_URL` to this Vercel URL
12. Redeploy the backend on Render (click "Manual Deploy")

**Congratulations!** Your app is now live at `https://intern-showcase.vercel.app`

---

## Custom domain (optional)

If you want `intern-showcase.com` instead of the long Vercel URL:

1. Buy a domain from any registrar (Namecheap, GoDaddy, etc.)
2. In Vercel, go to your project → Settings → Domains
3. Add your domain and follow Vercel's DNS instructions
4. Propagation takes 24-48 hours
5. After that, your site is at `https://intern-showcase.com`

---

## Making it searchable on Google

### 1. Add SEO meta tags (already done in `index.html`)

Check that these are filled in:
- `<title>` — catchy, includes keywords
- `<meta name="description">` — 150 character summary
- `<meta property="og:title">` — for social media sharing

### 2. Submit to Google Search Console

1. Go to https://search.google.com/search-console
2. Add your domain (choose "URL prefix" and paste your Vercel URL)
3. Verify ownership (Vercel will help with DNS verification)
4. Submit sitemap: Go to **Sitemaps** → add `/sitemap.xml`
   - Note: We haven't created one yet. For now, skip this. Google will crawl without it.
5. Click "Request indexing" for your homepage URL

### 3. Wait and monitor

- Google usually crawls new sites within 24-48 hours
- Check **Coverage** tab in Search Console to see indexed pages
- After 2 weeks, check **Performance** to see search impressions
- Search rankings take months — this is normal!

### 4. Simple SEO tips for ranking faster

- **Get backlinks:** Share your site on LinkedIn, Twitter, dev.to, HackerNews
- **Fresh content:** Each time an intern adds a project, that's new indexable content
- **Write good descriptions:** Use keywords interns actually search for ("React", "API", "full-stack")
- **Mobile friendly:** Vercel automatically optimizes for mobile ✓
- **Fast loading:** Vercel's CDN is fast ✓
- **HTTPS:** Vercel provides free HTTPS ✓

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGO_URI` is correct (looks like `mongodb+srv://...`)
- Make sure password in connection string is URL-encoded
- MongoDB Atlas: Check IP whitelist includes `0.0.0.0/0` (or your Render IP)

### "Image upload fails"
- Check Cloudinary credentials are correct in `.env`
- Try uploading in browser console: `fetch('http://localhost:5000/api/projects', { method: 'POST', ... })`

### "Frontend can't reach backend"
- Check `VITE_API_URL` is correct and matches Render URL
- Frontend browser console: Open DevTools → Network tab → see what URL requests go to
- If you see `http://localhost:5000`, the env var wasn't picked up — redeploy frontend

### Site isn't showing in Google results
- Wait 2-4 weeks — Google is slow with new sites
- Submit to Search Console
- Get some backlinks (share on Twitter/LinkedIn)
- Check site has unique, high-quality content

---

## What you've built

✅ Full-stack web app with user auth
✅ Database with cloud storage
✅ Shareable portfolio links (no login needed)
✅ Deployed and live on the internet
✅ Production-ready code (error handling, CORS, security)
✅ SEO-optimized (meta tags, fast, mobile-friendly)

This is the exact tech stack used by real startups. You've learned:
- React (frontend framework)
- Express + Node (backend)
- MongoDB (database)
- Cloudinary (image CDN)
- Authentication (JWT tokens)
- REST APIs
- Deployment & DevOps

**Next steps if you want to keep going:**
- Add profile editing (bio, avatar)
- Add project comments
- Add view counts on projects
- Email verification on signup
- Dark mode
- Search/filtering by tags
- Add a blog for writing about projects

---

## Project structure

```
intern-showcase/
├── server/
│   ├── config/          # Database & Cloudinary config
│   ├── models/          # MongoDB schemas (User, Project)
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, file upload
│   ├── routes/          # API endpoints
│   ├── server.js        # Express app entry
│   ├── .env.example     # Environment template
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/         # Axios client
    │   ├── context/     # Auth context (login state)
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Full page components
    │   ├── App.jsx      # Router
    │   └── main.jsx     # Entry point
    ├── index.html       # SEO meta tags live here
    ├── .env.example     # Frontend env template
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Questions?

- **Backend won't start:** Check MongoDB connection string
- **Frontend won't build:** Run `npm install` again
- **Deploy fails:** Check environment variables in Render/Vercel settings
- **Images don't upload:** Verify Cloudinary credentials

---

## Next time: Make it even better

Once this is live and working, consider:
- Add a sitemap generator
- Add structured data (JSON-LD) for Google rich results
- Set up automated backups
- Monitor with Sentry (error tracking)
- Add analytics with Plausible or Fathom

---

**Good luck! You're building something real. 🚀**
