export const resizeImageToGrid = (image: HTMLImageElement, gridSize: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = gridSize;
  canvas.height = gridSize;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Maintain aspect ratio, center crop
  const scale = Math.max(gridSize / image.width, gridSize / image.height);
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;
  const x = (scaledWidth - gridSize) / 2;
  const y = (scaledHeight - gridSize) / 2;
  
  ctx.drawImage(
    image,
    -x / scale,
    -y / scale,
    image.width,
    image.height
  );
  
  return canvas;
};

export const applyAdjustments = (
  imageData: ImageData,
  { contrast, brightness, tones, blackPoint = 0, whitePoint = 255 }: { contrast: number; brightness: number; tones: number; blackPoint?: number; whitePoint?: number }
): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  
  // Process each pixel: grayscale + percentile stretch + contrast/brightness + N-tone posterize
  // This matches the exact algorithm from desktop-COMPLETE.md lines 1782-1818
  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale using luminosity method (perceptual brightness)
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Percentile stretch using black/white points
    gray = (gray - blackPoint) * 255 / Math.max(1, (whitePoint - blackPoint));

    // Apply contrast and brightness
    gray = ((gray / 255 - 0.5) * contrast + 0.5) * 255;
    gray = gray * brightness;
    gray = Math.max(0, Math.min(255, gray));

    // Posterize to N tones based on brightness using base palette [0,85,170,255]
    const base = [0, 85, 170, 255];
    const n = Math.max(2, Math.min(4, Math.floor(tones)));
    const indices: number[] = [];
    for (let k = 0; k < n; k++) {
      const idx = Math.round((k * (base.length - 1)) / (n - 1));
      indices.push(base[idx]);
    }
    // thresholds midpoints
    let finalColor = indices[indices.length - 1];
    for (let t = 0; t < indices.length - 1; t++) {
      const mid = (indices[t] + indices[t + 1]) / 2;
      if (gray < mid) {
        finalColor = indices[t];
        break;
      }
    }

    data[i] = finalColor;
    data[i + 1] = finalColor;
    data[i + 2] = finalColor;
    // data[i + 3] = 255; // Alpha (unchanged)
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};

export const quantizeToPalette = (r: number, g: number, b: number, palette: Array<{ r: number; g: number; b: number }>): { r: number; g: number; b: number } => {
  let minDistance = Infinity;
  let closestColor = palette[0];
  
  for (const color of palette) {
    const distance = Math.sqrt(
      Math.pow(r - color.r, 2) +
      Math.pow(g - color.g, 2) +
      Math.pow(b - color.b, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }
  
  return closestColor;
};

export const canvasToBlob = (canvas: HTMLCanvasElement, type: string = 'image/png'): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob'));
      }
    }, type);
  });
};

