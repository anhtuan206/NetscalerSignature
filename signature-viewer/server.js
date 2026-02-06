
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Publish endpoint
app.post('/api/publish', (req, res) => {
    try {
        const xmlContent = req.body.content;

        if (!xmlContent) {
            return res.status(400).json({ error: 'No content provided' });
        }

        const fileId = uuidv4();
        const fileName = `${fileId}.xml`;
        const filePath = path.join(UPLOADS_DIR, fileName);

        // Save file
        fs.writeFileSync(filePath, xmlContent);

        // Schedule deletion after 15 minutes (900000 ms)
        setTimeout(() => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Expired file deleted: ${fileName}`);
            }
        }, 15 * 60 * 1000);

        // Return download URL
        // Assuming client is accessing via proxy or directly
        const downloadUrl = `/api/download/${fileName}`;

        res.json({
            success: true,
            downloadUrl,
            expiresIn: '15 minutes'
        });

    } catch (error) {
        console.error('Error publishing file:', error);
        res.status(500).json({ error: 'Failed to publish file' });
    }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, fileName);

    if (fs.existsSync(filePath)) {
        res.download(filePath, 'signature.xml');
    } else {
        res.status(404).json({ error: 'File not found or expired' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
