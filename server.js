import express from 'express';
import path from 'path';
import cors from 'cors';
import http from 'http';
import { fileURLToPath } from 'url'
import { upload } from './utils/fileUploder.js';
import cloudinary from './utils/fileUploadCloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, "public")));

app.use('/uploads', upload.single("upload"), async (req, res) => {

    // Upload
    try {
        const urls = [];
        const { path: pathName } = req.file;

        const data = await cloudinary.uploader.upload(pathName, { public_id: "Images" });
        urls.push(data.secure_url);

        res.status(200).json({ status: "success", url: urls, data });

    } catch (error) {
        console.log(error.message)
    }
})

const server = http.createServer(app);

const PORT = import.meta.env?.VITE_SERVER_PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})
