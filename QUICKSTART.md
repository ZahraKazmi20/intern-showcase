# Quick Start Guide

## What you have

A complete, production-ready intern portfolio platform built with:
- **Frontend:** React + Tailwind CSS (beautiful, responsive design)
- **Backend:** Express.js + MongoDB (REST API + database)
- **Images:** Cloudinary (cloud storage)
- **Auth:** JWT tokens (secure login)
- **Ready to deploy:** Vercel (frontend) + Render.com (backend)

---

## Get it running locally (5 minutes)

### 1. Backend

```bash
cd server
cp .env.example .env  # Create .env from template
npm install
npm run dev
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/intern-showcase
JWT_SECRET=any_long_string_for_now
CLIENT_URL=http://localhost:5173
CLOUDINARY_*=dummy_values_for_now
```

Server runs on **http://localhost:5000**

### 2. Frontend (new terminal)

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### 3. Test it

- Click "Sign up"
- Create an account
- Add a project
- View your portfolio at `/portfolio/your-username`

---

## Design decisions explained

### Why this color scheme?

The palette (linen, ink, forest, rust) is inspired by **library catalog cards** — that's the app's signature visual element. Each project looks like a vintage index card you'd find in an old library, with:
- Punched hole in the corner (subtle CSS shadow)
- Hand-stamped "Catalogued" mark (rotated red label)
- Ticket-style tags (on-theme visual language)

This makes the app **distinctive and memorable** — not another generic template.

### Why these fonts?

- **Display:** Source Serif 4 (professional, printed feel — like a catalog)
- **Body:** Inter (modern, readable, friendly)
- **Code/Labels:** JetBrains Mono (technical, precise — for tags and UI)

Typography itself becomes part of the identity.

### Why Tailwind CSS?

- Fast to prototype (built-in utilities)
- Customizable (our color palette is injected into config)
- Small CSS bundle
- Responsive by default

### Why JWT tokens for auth?

- Stateless (doesn't require session storage on server)
- Works great with SPAs (Single Page Apps)
- Easy to implement and secure

### Why MongoDB?

- Flexible schema (projects can have different fields)
- Easy to deploy (MongoDB Atlas free tier)
- Great for portfolios (JSON-like documents match our data)

---

## File structure explained

```
server/
├── server.js                 # Main Express app
├── config/
│   ├── db.js                 # MongoDB connection
│   └── cloudinary.js         # Image storage config
├── models/
│   ├── User.js               # User schema with slug (for /portfolio/john-doe)
│   └── Project.js            # Project schema
├── middleware/
│   ├── auth.js               # JWT verification
│   └── upload.js             # Multer + Cloudinary for images
├── controllers/
│   ├── authController.js     # Login, signup, get profile
│   └── projectController.js  # CRUD for projects
├── routes/
│   ├── authRoutes.js         # POST /auth/signup, /auth/login, etc
│   └── projectRoutes.js      # GET/POST/PUT/DELETE /projects
└── .env.example              # Template for secrets

client/
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Router setup
│   ├── index.css             # Global styles + Tailwind
│   ├── api/
│   │   └── axios.js          # HTTP client (adds token to requests)
│   ├── context/
│   │   └── AuthContext.jsx   # Login state management
│   ├── components/
│   │   ├── Navbar.jsx        # Top navigation
│   │   └── ProjectCard.jsx   # Reusable project card (catalog-card style)
│   └── pages/
│       ├── Home.jsx          # Landing page
│       ├── Signup.jsx        # Create account
│       ├── Login.jsx         # Log in
│       ├── Dashboard.jsx     # Your projects (add/edit/delete)
│       ├── Portfolio.jsx     # Public portfolio view
│       └── ProjectDetail.jsx # Single project shareable link
├── index.html                # SEO meta tags (important!)
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## API Endpoints

### Public (no login needed)

```
GET  /api/projects/public/:userSlug       → View a portfolio
GET  /api/projects/share/:projectSlug     → View a single project
```

### Private (require JWT token)

```
POST   /api/auth/signup                   → Create account
POST   /api/auth/login                    → Get JWT token
GET    /api/auth/me                       → Get current user
POST   /api/projects                      → Add project (with image)
GET    /api/projects/mine                 → Your projects
PUT    /api/projects/:id                  → Edit project
DELETE /api/projects/:id                  → Delete project
```

---

## How authentication works

1. User signs up → password hashed with bcrypt → stored in MongoDB
2. User logs in → password verified → JWT token generated
3. Frontend stores token in localStorage
4. Every API request: `Authorization: Bearer <token>`
5. Backend verifies token → processes request
6. Token expires after 30 days

---

## SEO & Google Search

✅ **Already optimized:**
- Semantic HTML
- Meta tags in `index.html` (title, description, og:image)
- Fast performance (Vercel CDN)
- Mobile responsive
- HTTPS (free with Vercel)
- Unique content (each portfolio is different)
- Clean URLs (`/portfolio/jane-doe` instead of `/?id=123`)

📋 **To get ranked:**
1. Deploy on Vercel (instructions in README.md)
2. Submit to Google Search Console
3. Share on LinkedIn/Twitter/Reddit (backlinks help)
4. Wait 2-4 weeks (Google is slow with new sites)
5. Each new project = new indexable content

---

## Next features to add

Easy wins:
- [ ] Profile editing (bio, avatar)
- [ ] Search by tags
- [ ] Dark mode (Tailwind makes this trivial)
- [ ] Project filtering (date, tags)

Medium effort:
- [ ] Comments on projects
- [ ] "Like" or save projects
- [ ] Email verification
- [ ] Forgot password flow

Advanced:
- [ ] Analytics (track portfolio views)
- [ ] Recommendations (based on tags)
- [ ] Multiplayer collab (multiple authors per project)
- [ ] Rich text editor for descriptions

---

## Deployment checklist

Before going live, check:

- [ ] MongoDB Atlas account + connection string ready
- [ ] Cloudinary account + API keys ready
- [ ] Render.com account (free tier is fine)
- [ ] Vercel account
- [ ] GitHub repo created with `server/` and `client/` folders
- [ ] Environment variables set in Render and Vercel
- [ ] Test locally first: sign up, add project, view portfolio
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Update frontend `.env` with real backend URL
- [ ] Submit to Google Search Console
- [ ] (Optional) Buy custom domain

See **README.md** for detailed deployment steps.

---

## Security notes

✅ **What's secure:**
- Passwords hashed (bcryptjs)
- Tokens verified (JWT)
- HTTPS everywhere (free with Vercel)
- CORS configured (only from your frontend)
- No sensitive data in localStorage (just token)

⚠️ **Known limitations (fine for production but could improve):**
- No email verification
- No rate limiting (could add)
- No refresh token rotation (but 30-day expiry is OK)

For a startup portfolio, this is production-ready. If you add millions of users, you'd add rate limiting, monitoring, backups, etc.

---

## Troubleshooting local dev

**"MongoDB connection error"**
- Make sure `mongod` is running
- Check `MONGO_URI=mongodb://localhost:27017/intern-showcase` in `.env`

**"Cannot POST /api/projects"**
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify `CLIENT_URL` in backend `.env` matches frontend URL

**"Blank page on frontend"**
- Check browser console for JavaScript errors
- Make sure `VITE_API_URL` is set in frontend `.env.local`
- Restart `npm run dev`

**"Image upload fails"**
- Add dummy Cloudinary values to `.env` for local dev
- Or skip image upload locally

---

## Cost analysis

✅ All free (unless you want a custom domain):

- MongoDB Atlas: Free tier (512 MB) — plenty for portfolios
- Cloudinary: Free tier (25 GB/month) — easily enough for images
- Render.com: Free tier (0.5 GB RAM, sleeps after 15 mins)
- Vercel: Free (includes HTTPS, CDN, analytics)
- **Total: $0/month** (if domain is $0)

Optional:
- Custom domain: $10-15/year (Namecheap, GoDaddy, etc.)

---

## Final thoughts

You've built a **real, deployable, SEO-optimized web app**. This is no longer a "project" — it's a **product** that you can share with others.

The code is clean, the design is distinctive, and the UX is smooth. You could show this to employers as proof you can:
- Build full-stack apps
- Deploy to production
- Think about UX/design
- Work with cloud services
- Understand databases and auth

**Ship it, share it, and watch interns use it to land jobs.**

Happy coding! 🚀
