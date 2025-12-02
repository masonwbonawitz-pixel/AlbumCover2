/**
 * Express web server with POST /export endpoint
 * Accepts STL and image files, returns 3MF
 */
import express from "express";
import multer from "multer";
import { exportModel } from "./exporter/exportModel.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// POST /export
// Form fields: stl (file), image (file)
app.post("/export", upload.fields([{ name: "stl", maxCount: 1 }, { name: "image", maxCount: 1 }]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files.stl || !files.image) {
      return res.status(400).json({ error: "Missing required files: stl and image" });
    }

    const stlFile = files.stl[0];
    const imageFile = files.image[0];

    // Convert buffers
    const stlBuffer = stlFile.buffer.buffer.slice(
      stlFile.buffer.byteOffset,
      stlFile.buffer.byteOffset + stlFile.buffer.byteLength
    );
    const imageBuffer = imageFile.buffer;

    // Export to 3MF
    const threeMFBuffer = await exportModel(stlBuffer, imageBuffer);

    // Send response
    res.setHeader("Content-Type", "application/vnd.ms-package.3dmanufacturing-3dmodel+xml");
    res.setHeader("Content-Disposition", 'attachment; filename="model.3mf"');
    res.send(Buffer.from(threeMFBuffer));
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Export failed" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`3MF exporter server running on port ${PORT}`);
  console.log(`POST /export with multipart/form-data: stl (file), image (file)`);
});
