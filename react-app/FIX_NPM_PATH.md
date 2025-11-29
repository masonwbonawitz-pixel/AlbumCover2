# Fix npm PATH Issue

## The Problem
Node.js and npm are installed, but your terminal can't find them because `/opt/homebrew/bin` is not in your PATH.

## Quick Fix (Run in Terminal)

Copy and paste this into your terminal:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

Then verify it works:
```bash
node --version
npm --version
```

## Alternative: Manual PATH Addition

If the above doesn't work, manually add to your `~/.zshrc`:

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

Then run:
```bash
source ~/.zshrc
```

## After Fixing PATH

1. Navigate to the React app:
   ```bash
   cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums/react-app"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5000" > .env
   ```

4. Start the app:
   ```bash
   npm start
   ```

