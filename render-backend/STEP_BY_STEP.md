# 📝 Step-by-Step: Run Backend Locally with ngrok

## Step 1: Install ngrok

1. Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter)
2. Run this command:
   ```bash
   brew install ngrok
   ```
3. If you don't have Homebrew, download ngrok from: https://ngrok.com/download
   - Download the Mac version
   - Unzip it
   - Move it to your Applications folder

---

## Step 2: Start Your Backend Server

### Open Terminal Window #1

1. Open **Terminal** (or use the one you already have open)
2. Type this command and press Enter:
   ```bash
   cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums/render-backend"
   ```

3. Install the Python packages (only need to do this once):
   ```bash
   pip3 install -r requirements.txt
   ```
   Wait for it to finish installing (might take a minute)

4. Start your server:
   ```bash
   python3 server.py
   ```

5. You should see:
   ```
   🚀 Starting Album Cover 3D Color Mapper server...
   📂 Open http://localhost:5000 in your browser
   🔧 Admin price editor: http://localhost:5000/admin/prices
   * Running on http://127.0.0.1:5000
   ```

6. **Leave this Terminal window open!** Don't close it. Your server is now running.

---

## Step 3: Expose It with ngrok

### Open Terminal Window #2

1. Open a **NEW Terminal window**:
   - Press `Cmd + T` in Terminal (opens a new tab)
   - OR click "Shell" → "New Window" in Terminal menu
   - OR just open Terminal again

2. In this **NEW** Terminal window, run:
   ```bash
   ngrok http 5000
   ```

3. You'll see something like this:
   ```
   Session Status                online
   Account                       (Plan: Free)
   Forwarding                    https://abc123.ngrok-free.app -> http://localhost:5000
   ```

4. **Copy the ngrok URL** (the `https://abc123.ngrok-free.app` part - yours will be different)

5. **Leave this Terminal window open too!** ngrok needs to keep running.

---

## Step 4: Update Your Frontend

Now you need to tell your Netlify sites where to find your backend.

1. Open these files in a text editor:
   - `netlify/desktop.html`
   - `netlify/mobile/index.html`
   - `netlify-admin/index.html`

2. In each file, find this line (around line 906, 1073, or 1079):
   ```javascript
   const BACKEND_URL = '';
   ```

3. Change it to (use YOUR ngrok URL):
   ```javascript
   const BACKEND_URL = 'https://abc123.ngrok-free.app';
   ```

4. Save all three files

5. Re-upload them to Netlify (or if you're testing locally, just refresh)

---

## Summary: What You Should Have Open

You should have **2 Terminal windows** open:

- **Terminal Window #1:** Running `python3 server.py` (your backend server)
- **Terminal Window #2:** Running `ngrok http 5000` (exposing it to internet)

**Both need to stay open!** If you close either one, your backend won't work.

---

## Testing

1. Open your browser
2. Go to your ngrok URL: `https://abc123.ngrok-free.app`
3. You should see your backend running!

---

## Need Help?

If you get stuck on any step, tell me which step and what error you see!




