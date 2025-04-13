import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { FileService } from './services/fileService.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://admin:Artillery2401@cluster0.wml6qum.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// File Schema
const FileSchema = new mongoose.Schema({
    fileId: String,
    originalName: String,
    mimeType: String,
    size: Number,
    chunks: [{
        nodeId: Number,
        chunkIndex: Number,
        chunkPath: String
    }],
    createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', FileSchema);

// Node status tracking
const nodes = [
    { id: 1, url: 'http://localhost:3001', status: 'active' , Name:"Node 1", Storage:"Storage1"},
    { id: 2, url: 'http://localhost:3002', status: 'active' , Name:"Node 2" , Storage:"Storage2"},
    { id: 3, url: 'http://localhost:3003', status: 'active' , Name:"Node 3" , Storage:"Storage3"}
];

const fileService = new FileService(nodes);

// Routes
app.get("/", (req, res) => {
    res.send("Distributed Storage System API");
});

// Upload file endpoint
app.post("/upload", upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Split and distribute file
        const fileMetadata = await fileService.splitAndDistribute(req.file);
        
        // Save metadata to MongoDB
        const file = new File(fileMetadata);
        await file.save();

        res.json(file);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

// Download file
app.get("/files/:fileId/download", async (req, res) => {
    try {
        const file = await File.findOne({ fileId: req.params.fileId });
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        const fileBuffer = await fileService.reconstructFile(file);
        
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.send(fileBuffer);
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ error: "Download failed" });
    }
});

// Get all files
app.get("/files", async (req, res) => {
    try {
        const files = await File.find({});
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch files" });
    }
});

// Get node status
app.get("/nodes/status", async (req, res) => {
    try {
        const status = await fileService.checkNodesHealth();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: "Failed to check nodes status" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Main server running on port ${PORT}`);
});