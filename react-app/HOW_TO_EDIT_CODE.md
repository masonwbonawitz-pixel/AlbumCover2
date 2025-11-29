# How to Edit the React Code

## ✅ The Code Files DO Exist!

All the code files are in the `react-app/src/` directory. Here's where everything is:

## 📁 Project Structure

```
react-app/
├── src/
│   ├── components/          # All UI components
│   │   ├── ImageUpload/    # Upload component
│   │   ├── GridSelector/    # Grid size buttons
│   │   ├── ImageCanvas/    # Image display & editing
│   │   ├── AdjustTools/    # Sliders (contrast, brightness, tones)
│   │   ├── PaintTools/     # Color palette
│   │   ├── ThreeViewer/    # 3D viewer
│   │   ├── AddOns/         # Stand & mounting dots
│   │   ├── Pricing/        # Price display
│   │   └── CheckoutButton/ # Checkout button
│   │
│   ├── pages/              # Main pages
│   │   ├── HomePage.tsx    # 🖥️ DESKTOP VIEW - Edit this!
│   │   ├── HomePage.css    # Desktop styles
│   │   ├── MobilePage.tsx  # 📱 MOBILE VIEW - Edit this!
│   │   ├── MobilePage.css  # Mobile styles
│   │   ├── AdminPage.tsx   # ⚙️ ADMIN PANEL - Edit this!
│   │   └── AdminPage.css   # Admin styles
│   │
│   ├── services/
│   │   └── api.ts          # API calls to backend
│   │
│   ├── context/
│   │   └── ImageContext.tsx # Global state management
│   │
│   ├── utils/
│   │   └── imageProcessing.ts # Image processing functions
│   │
│   ├── App.tsx             # Main app with routing
│   └── index.tsx           # Entry point
│
└── public/
    └── index.html          # HTML template
```

## 🖥️ How to Edit Desktop View

**File:** `src/pages/HomePage.tsx` and `src/pages/HomePage.css`

1. Open in your code editor:
   - VS Code: `code react-app/src/pages/HomePage.tsx`
   - Or navigate in Finder: `react-app/src/pages/HomePage.tsx`

2. Edit the layout, components, or styling
3. Save the file
4. The browser will auto-refresh (if `npm start` is running)

## 📱 How to Edit Mobile View

**File:** `src/pages/MobilePage.tsx` and `src/pages/MobilePage.css`

Same process as desktop - edit these files to change the mobile layout.

## ⚙️ How to Edit Admin Panel

**File:** `src/pages/AdminPage.tsx` and `src/pages/AdminPage.css`

Edit this file to:
- Add more admin features
- Change the layout
- Add order management
- Customize the interface

## 🎨 How to Edit Individual Components

Each component has its own folder with:
- `.tsx` file (the component code)
- `.css` file (the styles)

For example:
- `src/components/ImageUpload/ImageUpload.tsx` - Upload component
- `src/components/ImageUpload/ImageUpload.css` - Upload styles

## 🔧 How to Make Changes

### Step 1: Open the File
- Use VS Code, Cursor, or any code editor
- Navigate to the file you want to edit

### Step 2: Make Your Changes
- Edit the code
- Save the file (Cmd+S)

### Step 3: See Changes
- If `npm start` is running, the browser auto-refreshes
- If not, run `npm start` again

## 📝 Common Edits

### Change Colors
Edit the CSS files:
- `HomePage.css` - Desktop colors
- `MobilePage.css` - Mobile colors
- Component CSS files - Component-specific colors

### Change Layout
Edit the `.tsx` files:
- Modify JSX structure
- Add/remove components
- Change component order

### Change Text/Labels
Edit the component files or use the admin panel to change content dynamically.

## 🚀 Quick Start Editing

1. **Open the project in your editor:**
   ```bash
   cd "/Users/masonbonawitz/Desktop/Cursor Code for Rize albums/react-app"
   code .  # Opens in VS Code
   ```

2. **Find the file you want to edit:**
   - Desktop: `src/pages/HomePage.tsx`
   - Mobile: `src/pages/MobilePage.tsx`
   - Admin: `src/pages/AdminPage.tsx`

3. **Make your changes and save**

4. **See the changes in the browser** (auto-refreshes)

## 💡 Tips

- **TypeScript errors?** The editor will show red underlines - hover to see the error
- **Styling not working?** Check the CSS file for that component
- **Component not showing?** Check if it's imported in the page file
- **Changes not appearing?** Make sure `npm start` is running

## 🎯 Files You'll Edit Most

1. **Desktop Layout:** `src/pages/HomePage.tsx` & `HomePage.css`
2. **Mobile Layout:** `src/pages/MobilePage.tsx` & `MobilePage.css`
3. **Admin Panel:** `src/pages/AdminPage.tsx` & `AdminPage.css`
4. **Component Styles:** `src/components/[ComponentName]/[ComponentName].css`

All files are real and editable! Just open them in your code editor.

