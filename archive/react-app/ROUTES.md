# Application Routes

## Available URLs

The React app has the following routes:

### Main Routes

- **`http://localhost:3000/`** - Auto-detects device and shows mobile or desktop
- **`http://localhost:3000/desktop`** - Forces desktop layout (two-panel view)
- **`http://localhost:3000/mobile`** - Forces mobile layout (stacked view)
- **`http://localhost:3000/admin`** - Admin panel for content/price management

## Desktop View (`/desktop`)

- Left panel: Large image viewer with canvas
- Right panel: All controls (upload, grid, adjustments, pricing, etc.)
- Fixed 450px right panel width
- Full-height layout

## Mobile View (`/mobile`)

- Top section: Image viewer/canvas
- Bottom section: Scrollable controls
- Single column layout
- Touch-optimized

## Admin Panel (`/admin`)

- Content editing
- Price management
- Image uploads
- Order management (to be expanded)

## How to Access

1. Start the app: `npm start`
2. Open browser to:
   - Desktop: `http://localhost:3000/desktop`
   - Mobile: `http://localhost:3000/mobile`
   - Admin: `http://localhost:3000/admin`

