import fs from 'fs/promises';
import crypto from 'crypto';
import fetch from 'node-fetch';

// Size of each chunk in bytes (1MB)
const CHUNK_SIZE = 1024 * 1024;

export class FileService {
    constructor(nodes) {
        this.nodes = nodes;
    }

    async splitAndDistribute(file) {
        const fileBuffer = await fs.readFile(file.path);
        const fileId = crypto.randomUUID();
        const chunks = [];
        
        // Split file into chunks
        for (let i = 0; i < fileBuffer.length; i += CHUNK_SIZE) {
            const chunk = fileBuffer.slice(i, i + CHUNK_SIZE);
            chunks.push(chunk);
        }

        const chunkMeta = [];
        
        // Distribute chunks across nodes using round-robin
        for (let i = 0; i < chunks.length; i++) {
            const nodeIndex = i % this.nodes.length;
            const node = this.nodes[nodeIndex];
            
            try {
                const response = await fetch(`${node.url}/chunk`, {
                    method: 'POST',
                    body: chunks[i],
                    headers: {
                        'x-chunk-id': i.toString(),
                        'x-file-id': fileId,
                        'Content-Type': 'application/octet-stream'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to store chunk ${i} on node ${node.id}`);
                }

                const result = await response.json();
                chunkMeta.push({
                    nodeId: node.id,
                    chunkIndex: i,
                    chunkPath: result.path
                });
            } catch (error) {
                console.error(`Error storing chunk ${i}:`, error);
                // In a production system, we would implement retry logic
                // and possibly reassign to a different node
                throw error;
            }
        }

        // Clean up the temporary file
        await fs.unlink(file.path);

        return {
            fileId,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            chunks: chunkMeta
        };
    }

    async reconstructFile(fileMetadata) {
        const chunks = new Array(fileMetadata.chunks.length);
        
        // Fetch all chunks in parallel
        await Promise.all(fileMetadata.chunks.map(async (chunk) => {
            const node = this.nodes.find(n => n.id === chunk.nodeId);
            if (!node) throw new Error(`Node ${chunk.nodeId} not found`);

            const response = await fetch(
                `${node.url}/chunk/${fileMetadata.fileId}/${chunk.chunkIndex}`
            );

            if (!response.ok) {
                throw new Error(`Failed to retrieve chunk ${chunk.chunkIndex}`);
            }

            const buffer = await response.arrayBuffer();
            chunks[chunk.chunkIndex] = Buffer.from(buffer);
        }));

        // Combine all chunks
        return Buffer.concat(chunks);
    }

    async checkNodesHealth() {
        const healthStatus = await Promise.all(
            this.nodes.map(async (node) => {
                try {
                    const response = await fetch(`${node.url}/health`);
                    const health = await response.json();
                    return { ...node, status: 'active', health };
                } catch (error) {
                    return { ...node, status: 'inactive', error: error.message };
                }
            })
        );

        return healthStatus;
    }
} 