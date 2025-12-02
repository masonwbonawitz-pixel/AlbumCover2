export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => {
    const s = Math.max(0, Math.min(255, Math.round(v)));
    return s.toString(16).padStart(2, "0").toUpperCase();
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

