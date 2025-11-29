# How to View Backups and Previous Versions

## Option 1: macOS Time Machine (If Enabled)

1. **In Finder:**
   - Navigate to: `/Users/masonbonawitz/Desktop/Cursor Code for Rize albums/mobile/`
   - Right-click on `index.html`
   - Select **"Browse All Versions..."**
   - Use the timeline on the right to navigate to yesterday or earlier
   - Click on a version to preview it
   - Click **"Restore"** to replace the current file with that version

2. **Via Terminal:**
   ```bash
   # List available snapshots
   tmutil listlocalsnapshots /
   
   # Browse versions (opens Time Machine)
   open -a "Time Machine"
   ```

## Option 2: Git History (Just Created)

I've initialized a Git repository. From now on, you can:

```bash
# View commit history
git log

# See what changed
git diff HEAD~1 mobile/index.html

# Restore to previous commit
git checkout HEAD~1 -- mobile/index.html
```

**Note:** This only works for future changes - there's no history before now.

## Option 3: Check What's Actually Being Served

1. Open: `http://localhost:5000/check_version.html`
2. This will show you exactly what code is being served by the server
3. Compare it to what should be there

## Option 4: Manual File Comparison

The current file should have:
- `setupCropCanvasListeners` function (around line 2716)
- `size-panel-img` with `width: 400px` (around line 873)
- `size-panel-canvas` with `width: 400px` (around line 874)
- No duplicate `crop-canvas.addEventListener('mousedown')` calls

## Current File Info

- **Location:** `mobile/index.html`
- **Size:** ~208KB
- **Last Modified:** November 15, 2025 at 10:46 AM
- **Git Status:** Just initialized (no previous history)

## If You Need to Revert

If Time Machine doesn't have backups, you can:

1. **Check the backup folder:** `Cuser Rize maps backup code/` (if it exists)
2. **Check Cursor's local history:** Cursor may have local file history
3. **Manual restore:** Tell me what specific behavior you want, and I can recreate it

## Next Steps

1. Try Time Machine first (easiest)
2. Run the version checker: `http://localhost:5000/check_version.html`
3. If neither works, describe what behavior you want and I'll recreate it






