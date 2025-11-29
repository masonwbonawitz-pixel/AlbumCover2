# 3D Album Cover Mosaic Builder - React Version

This is the React version of the 3D Album Cover Mosaic Builder application, converted from the original HTML/JavaScript implementation.

## Features

- Image upload with HEIC support
- Grid size selection (48×48, 75×75, 96×96)
- Image editing tools (adjustments, painting)
- 3D viewer with Three.js
- Dynamic pricing
- Admin panel for content management
- Responsive design (mobile & desktop)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/       # React components
├── pages/           # Page components
├── context/         # React Context providers
├── services/        # API service layer
├── utils/           # Utility functions
└── App.tsx          # Main app component
```

## Backend

This React app requires the Flask backend server to be running. See the main project documentation for backend setup instructions.

## Documentation

Complete documentation is available in the `DOCUMENTATION/` folder of the main project.

