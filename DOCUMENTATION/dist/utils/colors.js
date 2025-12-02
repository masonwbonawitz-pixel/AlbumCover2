export function rgbToHex(r, g, b) {
    const toHex = (v) => {
        const s = Math.max(0, Math.min(255, Math.round(v)));
        return s.toString(16).padStart(2, "0").toUpperCase();
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
export function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16),
    };
}
export function colorDistanceHex(a, b) {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    return Math.sqrt((A.r - B.r) ** 2 + (A.g - B.g) ** 2 + (A.b - B.b) ** 2);
}
