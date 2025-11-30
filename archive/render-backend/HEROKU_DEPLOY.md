# 🚀 Deploy to Heroku (Free Tier Works!)

Heroku's free tier allows web services (unlike Railway's limited plan).

## Quick Setup

### Step 1: Install Heroku CLI
1. Go to [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
2. Download and install for your OS

### Step 2: Login
```bash
heroku login
```

### Step 3: Create App
```bash
cd render-backend
heroku create your-app-name
```

### Step 4: Deploy
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Step 5: Get Your URL
```bash
heroku open
```

Your app will be at: `https://your-app-name.herokuapp.com`

---

## Or Use Heroku Dashboard (Easier)

1. Go to [dashboard.heroku.com](https://dashboard.heroku.com)
2. Click "New" → "Create new app"
3. Name your app
4. Go to "Deploy" tab
5. Connect GitHub
6. Select your repo
7. Click "Deploy Branch"

**That's it!** Heroku handles everything automatically.

---

## Files Needed

I've created a `Procfile` which tells Heroku how to start your app. That's all you need!

Heroku will:
- ✅ Auto-detect Python
- ✅ Install from `requirements.txt`
- ✅ Handle Pillow perfectly (no build errors!)
- ✅ Start with the Procfile

---

## Update Your Frontend

After deploying, update `BACKEND_URL` in your Netlify sites to:
```
https://your-app-name.herokuapp.com
```

