import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nodeId = process.env.NODE_ID || 1;
const storageDir = path.join(__dirname, `storage_node_${nodeId}`);

async function initializeStorage() {
    try {
        await fs.mkdir(storageDir, { recursive: true });
        console.log(`Storage directory created: ${storageDir}`);
    } catch (error) {
        console.error('Error creating storage directory:', error);
    }
}

initializeStorage();

app.post('/chunk', express.raw({ limit: '10mb', type: '*/*' }), async (req, res) => {
    try {
        const chunkId = req.headers['x-chunk-id'];
        const fileId = req.headers['x-file-id'];
        
        if (!chunkId || !fileId) {
            return res.status(400).json({ error: 'Missing chunk or file ID' });
        }

        const chunkPath = path.join(storageDir, `${fileId}_${chunkId}`);
        await fs.writeFile(chunkPath, req.body);
        
        res.json({
            nodeId,
            chunkId,
            fileId,
            path: chunkPath
        });
    } catch (error) {
        console.error('Error storing chunk:', error);
        res.status(500).json({ error: 'Failed to store chunk' });
    }
});

// Retrieve a chunk
app.get('/chunk/:fileId/:chunkId', async (req, res) => {
    try {
        const { fileId, chunkId } = req.params;
        const chunkPath = path.join(storageDir, `${fileId}_${chunkId}`);
        
        const chunk = await fs.readFile(chunkPath);
        res.send(chunk);
    } catch (error) {
        console.error('Error retrieving chunk:', error);
        res.status(404).json({ error: 'Chunk not found' });
    }
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        nodeId,
        storageDir
    });
});

const PORT = process.env.PORT || (3000 + parseInt(nodeId));
app.listen(PORT, () => {
    console.log(`Storage node ${nodeId} running on port ${PORT}`);
}); 