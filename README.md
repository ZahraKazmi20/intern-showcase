# Intern Showcase — Deployment & Setup Guide

A platform where interns showcase their projects with a professional, shareable portfolio.

## Table of Contents
- How it works
- Local setup
- Deployment overview
- Step-by-step production deployment
- Making it searchable on Google

## How it works
## How it works

```
Frontend (React on Vercel)
         ↓
API (Express on Render.com)
         ↓
Database (MongoDB Atlas) + Image Storage (Cloudinary)
```


```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

6. **Add Environment Variables** (click the Variables tab):
   - `MONGO_URI`: Paste your MongoDB connection string from Part B
   - `JWT_SECRET`: Generate a random string (https://www.uuidgenerator.net/)
   - `CLOUDINARY_CLOUD_NAME`: Your cloud name from Part A
   - `CLOUDINARY_API_KEY`: Your API key from Part A
   - `CLOUDINARY_API_SECRET`: Your API secret from Part A
   - `CLIENT_URL`: Set to `https://intern-showcase-wine.vercel.app` (update with your Vercel URL)
   - `PORT`: 8080 (Railway's default, or any available port)

7. **Deploy:**
   - Click "Deploy" and wait for it to finish (~2-3 minutes)
   - Railway will auto-deploy whenever you push to GitHub
   - Copy the public URL it gives you (looks like `https://intern-showcase-production.up.railway.app`)

8. **Note:** Every push to GitHub automatically triggers a new deployment on Railway. No manual steps needed!

### Part D: Vercel (Frontend hosting)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repo
5. **Configuration:**
   - Select the **`client`** folder as root
   - **Environment variables:**
     - `VITE_API_URL`: Paste the Railway URL from Part C (e.g., `https://intern-showcase-production.up.railway.app/api`)
6. Click **"Deploy"**
7. Wait for deploy to finish (~2 mins)
8. You'll get a URL like `https://intern-showcase-wine.vercel.app`
9. Copy this URL

### Linking Backend & Frontend

1. Go back to Railway
2. Update `CLIENT_URL` environment variable to your Vercel URL
3. Railway will auto-redeploy with the new variable
4. Your app is now **fully connected and live!** 🎉

**Congratulations!** Your app is now live at `https://intern-showcase-wine.vercel.app`

## Custom domain (optional)

If you want `intern-showcase.com` instead of the long Vercel URL:

1. Buy a domain from any registrar (Namecheap, GoDaddy, etc.)
2. In Vercel, go to your project → **Settings** → **Domains**
3. Add your domain and follow Vercel's DNS instructions
4. Propagation takes 24-48 hours
5. After that, your site is at `https://intern-showcase.com`

## Making it searchable on Google

### 1. Add SEO meta tags (already done in index.html)
Check that these are filled in:

```html
<title> — catchy, includes keywords
<meta name="description"> — 150 character summary
<meta property="og:title"> — for social media sharing
```

### 2. Submit to Google Search Console

1. Go to https://search.google.com/search-console
2. Add your domain (choose "URL prefix" and paste your Vercel URL)
3. Verify ownership (Vercel will help with DNS verification)
4. Submit sitemap: Go to Sitemaps → add `/sitemap.xml`
   - Note: We haven't created one yet. For now, skip this. Google will crawl without it.
5. Click "Request indexing" for your homepage URL

### 3. Wait and monitor

- Google usually crawls new sites within 24-48 hours
- Check Coverage tab in Search Console to see indexed pages
- After 2 weeks, check Performance to see search impressions
- Search rankings take months — this is normal!

### 4. Simple SEO tips for ranking faster

- **Get backlinks:** Share your site on LinkedIn, Twitter, dev.to, HackerNews
- **Fresh content:** Each time an intern adds a project, that's new indexable content
- **Write good descriptions:** Use keywords interns actually search for ("React", "API", "full-stack")
- **Mobile friendly:** Vercel automatically optimizes for mobile ✓
- **Fast loading:** Vercel's CDN is fast ✓
- **HTTPS:** Vercel provides free HTTPS ✓

## Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGO_URI` is correct (looks like `mongodb+srv://...`)
- Make sure password in connection string is URL-encoded
- MongoDB Atlas: Check IP whitelist includes `0.0.0.0/0` (or your Railway IP)

### "Image upload fails"
- Check Cloudinary credentials are correct in Railway Variables
- Try uploading in browser console: 
```javascript
  fetch('https://your-railway-url.app/api/projects', { method: 'POST', ... })
```

### "Frontend can't reach backend"
- Check `VITE_API_URL` is correct and matches Railway URL
- Frontend browser console: Open DevTools → Network tab → see what URL requests go to
- If you see `http://localhost:5000`, the env var wasn't picked up — redeploy frontend on Vercel

### "Backend won't deploy on Railway"
- Check that `Procfile` exists in `/server` folder with content: `web: npm start`
- Verify **Root Directory** is set to `server` in Railway settings
- Check all environment variables are present (especially `JWT_SECRET` and `MONGO_URI`)
- View Railway logs for detailed error messages

### "Site isn't showing in Google results"
- Wait 2-4 weeks — Google is slow with new sites
- Submit to Search Console
- Get some backlinks (share on Twitter/LinkedIn)
- Check site has unique, high-quality content

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

## Next steps if you want to keep going

- Add profile editing (bio, avatar)
- Add project comments
- Add view counts on projects
- Email verification on signup
- Dark mode
- Search/filtering by tags
- Add a blog for writing about projects

## Project structure
