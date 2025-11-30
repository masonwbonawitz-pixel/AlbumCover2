# 🚀 Deploy to Fly.io - Simple Steps

Fly.io is **free** and **doesn't require a credit card**!

## Step 1: Install Fly CLI

**On macOS:**
```bash
brew install flyctl
```

**Or download from:**
https://fly.io/docs/getting-started/installing-flyctl/

## Step 2: Sign Up

```bash
fly auth signup
```

This will open a browser to sign up (it's free, no credit card needed).

## Step 3: Deploy

```bash
cd render-backend
fly launch
```

When it asks:
- **App name:** `rize-albums-backend` (or any name you want)
- **Region:** Choose closest to you (e.g., `iad` for US East)
- **PostgreSQL:** No
- **Redis:** No
- **Deploy now:** Yes

## Step 4: Get Your URL

After deployment, Fly.io will show your URL, like:
```
https://rize-albums-backend.fly.dev
```

## Step 5: Update Your Frontend

Update `BACKEND_URL` in your Netlify sites to your Fly.io URL!

---

## That's It!

Fly.io will:
- ✅ Use the Dockerfile automatically
- ✅ Install all dependencies (including Pillow - no errors!)
- ✅ Start your server
- ✅ Give you a URL

**No build commands, no errors, just works!**

---

## If You Need to Redeploy Later

Just run:
```bash
fly deploy
```

---

## Check Your App

```bash
fly open
```

This opens your app in a browser!

