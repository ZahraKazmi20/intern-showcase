# Running Intern Showcase Locally

## Prerequisites (do this first)

### 1. Install Node.js
- Go to https://nodejs.org/
- Download LTS version (v18 or v20)
- Install it
- Verify: `node --version` and `npm --version`

### 2. Install MongoDB
- Go to https://www.mongodb.com/try/download/community
- Download for your OS (Mac, Windows, Linux)
- Install it
- Start MongoDB:
  - **Mac (Homebrew):** `brew services start mongodb-community`
  - **Windows:** MongoDB should auto-start (or find it in Services)
  - **Linux:** `sudo systemctl start mongodb`

### 3. Verify MongoDB is running
```bash
mongosh  # Should connect to local MongoDB
exit     # Type this to exit
```

### 4. Clone the project or download files
```bash
# Option A: Clone from GitHub (if you pushed it)
git clone <your-repo-url>
cd intern-showcase

# Option B: Download files manually from /home/claude/intern-showcase/
```

---

## Local Setup (First Time)

### Step 1: Set up the Backend

```bash
cd server
cp .env.example .env
npm install
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/intern-showcase
JWT_SECRET=test_secret_key_for_local_dev
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=dummy_for_local
CLOUDINARY_API_KEY=dummy_for_local
CLOUDINARY_API_SECRET=dummy_for_local
PORT=5000
```

Start the backend:
```bash
npm run dev
```

You should see:
```
MongoDB connected: localhost
Server running on port 5000
```

✅ **Backend is running.** Leave this terminal open.

### Step 2: Set up the Frontend (new terminal)

```bash
cd client
cp .env.example .env.local
npm install
```

Edit `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

You should see:
```
  VITE v5.3.1  ready in XX ms

  ➜  Local:   http://localhost:5173/
```

✅ **Frontend is running.** Leave this terminal open.

### Step 3: Open in Browser

1. Open http://localhost:5173 in your browser
2. Click "Sign up"
3. Create a test account:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
4. Click "Create account"
5. You're logged in! 🎉

---

## Test the Full Flow

### Add a project:
1. Click "Dashboard" (top navbar)
2. Click "+ Add project"
3. Fill in:
   - Title: "My awesome app"
   - Description: "This is a test project"
   - Tags: "React, Node.js" (comma-separated)
   - Project link: (leave blank or paste a GitHub URL)
   - Image: (optional — skip for now)
4. Click "Add project"
5. Your project appears on the dashboard

### View your public portfolio:
1. In the navbar, click "My Portfolio"
2. You're at `/portfolio/test-user` (or whatever your slug is)
3. This URL is public — anyone can view it without logging in!

### Share a project link:
1. On your dashboard, find the project card
2. Click "Copy share link"
3. Paste it in a new browser tab (or incognito window)
4. Anyone can view it — no login needed!

### Edit a project:
1. On dashboard, click "Edit" on a project card
2. Change the title/description
3. Click "Update project"

### Delete a project:
1. On dashboard, click "Delete" on a project card
2. Confirm deletion
3. It's gone

---

## Stopping and Restarting

### To stop:
- Press `Ctrl+C` in both terminals

### To restart later:
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

---

## Troubleshooting Local Setup

### Error: "Cannot connect to MongoDB"

**Fix:**
1. Make sure MongoDB is running
2. **Mac:** `brew services list` — should show `mongodb-community` as running
3. **Windows:** Check Services app for MongoDB
4. Try `mongosh` — if it connects, MongoDB is running
5. Check `MONGO_URI` in `.env` — should be `mongodb://localhost:27017/intern-showcase`

### Error: "Port 5000 is already in use"

**Fix:**
- Another app is using port 5000
- Option A: Kill the other process
- Option B: Change `PORT` in `.env` to 5001, restart backend

### Error: "Port 5173 is already in use"

**Fix:**
- Option A: Kill the other process
- Option B: Vite will suggest a different port (5174, 5175, etc.)

### Frontend is blank / shows errors

**Fix:**
1. Open browser DevTools (F12)
2. Check Console tab for red errors
3. Check if backend is running on port 5000
4. Check `.env.local` has correct `VITE_API_URL`
5. Restart frontend: `npm run dev`

### Can't create account (get error)

**Fix:**
1. Check if backend is running
2. Open DevTools → Network tab → see what error the API returns
3. Check `.env` in server folder is correct
4. Restart backend: `npm run dev`

### Image upload fails

**For local dev, use dummy Cloudinary values in `.env`:**
```
CLOUDINARY_CLOUD_NAME=dummy
CLOUDINARY_API_KEY=dummy
CLOUDINARY_API_SECRET=dummy
```

Images will fail to upload but the form will still work. Real image upload works after you add real Cloudinary keys.

---

## Development Tips

### To see what MongoDB is storing:
```bash
mongosh
use intern-showcase
db.users.find()  # See all users
db.projects.find()  # See all projects
exit
```

### To clear all data and start fresh:
```bash
mongosh
use intern-showcase
db.dropDatabase()
exit
```

### To check the API directly:
```bash
# In terminal (not while running server)
curl http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### To see server logs:
- Check the terminal where you ran `npm run dev`
- Look for `POST /api/auth/login` type messages

---

## Next Steps

Once it's working locally:

1. **Customize it:**
   - Edit colors in `client/tailwind.config.js`
   - Edit copy/text in components (React files)
   - Add your own logo

2. **Test edge cases:**
   - What if password is too short?
   - What if email already exists?
   - What if you delete a project while adding another?
   - What if you spam-click "Add project"?

3. **Read the docs:**
   - `WELCOME.md` — Project overview
   - `README.md` — Deployment guide
   - `QUICKSTART.md` — Architecture deep dive

4. **Deploy:**
   - Follow steps in `README.md`
   - Create GitHub repo
   - Deploy backend to Render
   - Deploy frontend to Vercel
   - Go live! 🚀

---

## Still Stuck?

Check these in order:
1. **Local setup errors?** → See "Troubleshooting" section above
2. **Code not working?** → Check browser DevTools Console (F12)
3. **Need more info?** → Read `QUICKSTART.md` or `README.md`
4. **Architecture questions?** → Check file structure in `QUICKSTART.md`

Good luck! You've got this. 💪
