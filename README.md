# 🧱 Album Cover 3D Color Mapper

A web-based tool that merges a 3D STL file with a 4-tone PNG image to create a colored 3MF file suitable for Bambu Labs printers.

## Features

- ✨ Modern, responsive HTML/CSS/JS interface
- 🎨 Maps 75×75 pixel PNG images to 75×75 STL cube grids
- 🖨️ Generates 3MF files ready for Bambu Studio
- 🎯 Supports 4-tone grayscale images (black, dark gray, light gray, white)
- 🚀 Runs entirely locally - no external servers needed

## Installation

### 1. Install Python dependencies

```bash
pip install -r requirements.txt
```

**Note:** If `lib3mf` doesn't install on your system, try installing `py3mf` instead:

```bash
pip uninstall lib3mf
pip install py3mf
```

## Usage

### Option 1: Web Interface (Recommended)

1. **Start the server:**
   ```bash
   python server.py
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:5000`

3. **Upload your files:**
   - Upload your STL file (75×75 cube grid)
   - Upload your PNG image (75×75 pixels, 4 grayscale tones)

4. **Generate:**
   - Click "Generate 3MF"
   - Your `output.3mf` file will download automatically

### Option 2: Streamlit Interface (Alternative)

If you prefer the Streamlit interface:

```bash
pip install streamlit
streamlit run app.py
```

## File Requirements

### STL File
- Should be a voxelized 75×75 grid of cubes
- Each cube represents one pixel location

### PNG Image
- Exactly 75×75 pixels (will be resized if different)
- Should contain only these 4 grayscale values:
  - **Black:** RGB(0, 0, 0)
  - **Dark Gray:** RGB(85, 85, 85)
  - **Light Gray:** RGB(170, 170, 170)
  - **White:** RGB(255, 255, 255)

## How It Works

1. **Upload:** You provide an STL grid and a PNG image
2. **Mapping:** Each pixel in the PNG maps to a cube in the STL via XY centroid
3. **Coloring:** The cube's top and sides get the pixel's color
4. **Export:** A 3MF file is created with per-triangle color data
5. **Print:** Open in Bambu Studio with your 4-color AMS setup

## Color Alignment

- PNG pixel (0, 0) → Bottom-left of STL grid
- PNG pixel (74, 74) → Top-right of STL grid

## Troubleshooting

### "3MF binding not found" error
Install either `lib3mf` or `py3mf`:
```bash
pip install lib3mf
# OR
pip install py3mf
```

### Port already in use
Change the port in `server.py`:
```python
app.run(debug=True, port=5001)  # Change 5000 to another port
```

### STL file not loading
Ensure your STL is a valid binary or ASCII STL file.

## Tech Stack

- **Backend:** Flask (Python)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **3D Processing:** trimesh, numpy-stl
- **3MF Export:** lib3mf / py3mf
- **Image Processing:** Pillow (PIL)

## Files

- `server.py` - Flask backend API
- `index.html` - Modern web interface
- `app.py` - Alternative Streamlit interface
- `requirements.txt` - Python dependencies
- `README.md` - This file

## License

Free to use for personal and commercial projects.

---

**Made for Bambu Labs printers with AMS color support** 🖨️

