import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const compressImages = async (req, res, next) => {
    // If no files were uploaded, skip
    if (!req.files) return next();

    const uploadDir = 'uploads/';

    try {
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileKeys = Object.keys(req.files);

        for (const key of fileKeys) {
            const files = req.files[key];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Generate new filename
                const timestamp = Date.now();
                const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_');
                const filename = `${file.fieldname}-${timestamp}-${originalName}.webp`;
                const filePath = path.join(uploadDir, filename);

                // Compress and save to disk
                await sharp(file.buffer)
                    .resize({ width: 1920, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(filePath);

                // Update req.files object to mimic what multer.diskStorage would produce
                // This ensures the controllers can continue using 'path' and 'filename'
                req.files[key][i].path = filePath;
                req.files[key][i].filename = filename;
                req.files[key][i].destination = uploadDir;
                req.files[key][i].mimetype = 'image/webp';

                // Remove buffer to free up memory
                delete req.files[key][i].buffer;
            }
        }
        next();
    } catch (error) {
        console.error("Image Compression Error:", error);
        return res.status(500).json({
            status: false,
            message: "Image processing failed",
            error: error.message
        });
    }
};
