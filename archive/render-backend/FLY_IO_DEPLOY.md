# 🚀 Deploy to Fly.io (Free Tier, No Credit Card!)

Fly.io has a generous free tier and doesn't require a credit card!

## Quick Setup

### Step 1: Install Fly CLI
```bash
# macOS
brew install flyctl

# Or download from: https://fly.io/docs/getting-started/installing-flyctl/
```

### Step 2: Sign Up
```bash
fly auth signup
```

### Step 3: Create App
```bash
cd render-backend
fly launch
```

Follow the prompts:
- App name: (choose a name)
- Region: (choose closest to you)
- PostgreSQL: No
- Redis: No

### Step 4: Deploy
```bash
fly deploy
```

### Step 5: Get Your URL
```bash
fly open
```

Your app will be at: `https://your-app-name.fly.dev`

---

## Or Use Docker (Already Created!)

I've created a `Dockerfile` that handles everything. Fly.io will use it automatically!

The Dockerfile:
- ✅ Installs system dependencies for Pillow
- ✅ Installs Python packages
- ✅ Starts your server

---

## Update Your Frontend

After deploying, update `BACKEND_URL` in your Netlify sites to:
```
https://your-app-name.fly.dev
```

---

## Free Tier Limits

- 3 shared-cpu-1x VMs
- 3GB persistent volume storage
- 160GB outbound data transfer
- **More than enough for your backend!**

