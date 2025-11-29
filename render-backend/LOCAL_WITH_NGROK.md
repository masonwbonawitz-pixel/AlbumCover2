# 🚀 Run Backend Locally with ngrok (100% Free, No Credit Card!)

This is the **easiest** solution - run your backend on your computer and expose it to the internet with ngrok (free, no credit card needed).

## Step 1: Install ngrok (2 minutes)

**On macOS:**
```bash
brew install ngrok
```

**Or download from:** https://ngrok.com/download

## Step 2: Start Your Backend Locally

1. Open Terminal
2. Navigate to your backend folder:
   ```bash
   cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums/render-backend"
   ```

3. Install dependencies (if you haven't already):
   ```bash
   pip3 install -r requirements.txt
   ```

4. Start your Flask server:
   ```bash
   python3 server.py
   ```

   Your server will start on `http://localhost:5000`

## Step 3: Expose with ngrok (30 seconds)

1. Open a **NEW** Terminal window (keep the server running in the first one)
2. Run:
   ```bash
   ngrok http 5000
   ```

3. You'll see something like:
   ```
   Forwarding  https://abc123.ngrok-free.app -> http://localhost:5000
   ```

4. **Copy that ngrok URL** (the `https://abc123.ngrok-free.app` part)

## Step 4: Update Your Frontend

Update `BACKEND_URL` in your Netlify sites to your ngrok URL:
- `netlify/desktop.html`
- `netlify/mobile/index.html`
- `netlify-admin/index.html`

Change:
```javascript
const BACKEND_URL = '';
```

To:
```javascript
const BACKEND_URL = 'https://abc123.ngrok-free.app';
```

(Use your actual ngrok URL)

## Step 5: Keep It Running

- Keep both Terminal windows open:
  - Terminal 1: Your Flask server running
  - Terminal 2: ngrok running

**That's it!** Your backend is now accessible from the internet!

---

## ⚠️ Important Notes

1. **ngrok free tier:** The URL changes every time you restart ngrok. You'll need to update your frontend URLs when it changes.

2. **Keep your computer on:** The backend only works when your computer is on and both programs are running.

3. **For production:** This is great for testing. For a real production site, you'd want a permanent hosting solution, but this works perfectly for now!

---

## Making It Permanent (Optional)

If you want a permanent URL, ngrok has a free plan with a fixed URL, but you need to sign up (still free, might need email).

Or you can use this setup for now and worry about permanent hosting later!

---

## ✅ This Will Work!

No credit cards, no build errors, no headaches. Just run it locally and expose it with ngrok!




