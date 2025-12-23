import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const compressImages = async (req, res, next) => {
    // If no files were uploaded, skip
    if (!req.files) return next();

    const uploadDir = 'uploads/';

    try {
        const fileKeys = Object.keys(req.files);
        const processingPromises = [];

        for (const key of fileKeys) {
            const files = req.files[key];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const originalPath = file.path;

                // If for some reason it's still in memory, handle it (safety fallback)
                if (!originalPath && file.buffer) {
                    const tempName = `temp-${Date.now()}-${file.originalname}`;
                    const tempPath = path.join(uploadDir, tempName);
                    fs.writeFileSync(tempPath, file.buffer);
                    file.path = tempPath;
                }

                if (!file.path) continue;

                // Create a processing task for each image
                const task = (async (index, fieldKey) => {
                    const currentFile = req.files[fieldKey][index];
                    const sourcePath = currentFile.path;

                    const timestamp = Date.now();
                    const originalName = path.parse(currentFile.originalname).name.replace(/[^a-zA-Z0-9]/g, '_');
                    const filename = `${currentFile.fieldname}-${timestamp}-${originalName}-${index}.webp`;
                    const outputPath = path.join(uploadDir, filename);

                    // Compress and save as webp
                    await sharp(sourcePath)
                        .resize({ width: 1920, withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toFile(outputPath);

                    // Delete the original file uploaded by multer
                    if (fs.existsSync(sourcePath)) {
                        fs.unlinkSync(sourcePath);
                    }

                    // Update req.files object with webp details
                    req.files[fieldKey][index].path = outputPath.replace(/\\/g, "/");
                    req.files[fieldKey][index].filename = filename;
                    req.files[fieldKey][index].mimetype = 'image/webp';

                    // Cleanup buffer if exists
                    if (req.files[fieldKey][index].buffer) {
                        delete req.files[fieldKey][index].buffer;
                    }
                })(i, key);

                processingPromises.push(task);
            }
        }

        // Process all images in parallel
        await Promise.all(processingPromises);

        next();
    } catch (error) {
        console.error("Parallel Image Compression Error:", error);
        return res.status(500).json({
            status: false,
            message: "Image processing failed during batch upload",
            error: error.message
        });
    }
};
