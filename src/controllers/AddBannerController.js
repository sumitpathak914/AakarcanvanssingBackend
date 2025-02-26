// Express server setup
const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your other middleware and routes...

const Banner = require('../model/HomeBannerModel');
const multer = require('multer');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // 10MB limit
}).single('image');

// Add a new banner
exports.addBanner = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { text } = req.body;

        if (!text || !req.file) {
            return res.status(400).json({ error: 'Please provide both text and image.' });
        }

        // Only store the filename in the database
        const imageName = req.file.filename; // This gives the filename like '1729703470561-239085280.png'

        // Check for existing banner
        Banner.findOne()
            .then(existingBanner => {
                if (existingBanner) {
                    // Delete old image
                    fs.unlinkSync(path.join(__dirname, '../uploads', path.basename(existingBanner.image))); // Use the correct path
                    return Banner.deleteOne({ _id: existingBanner._id });
                }
                return Promise.resolve();
            })
            .then(() => {
                // Create new banner and save only the filename
                const newBanner = new Banner({
                    text,
                    image: imageName, // Save only the image filename
                    isActive: false
                });

                return newBanner.save();
            })
            .then(() => res.status(201).json({ message: 'Banner created successfully!' }))
            .catch(err => res.status(500).json({ error: 'Failed to create banner', details: err }));
    });
};

// Delete a banner
exports.deleteBanner = (req, res) => {
    const { id } = req.params; // Get the banner ID from the request parameters

    // Find the banner by ID and delete it
    Banner.findByIdAndDelete(id)
        .then(deletedBanner => {
            if (!deletedBanner) {
                return res.status(404).json({ error: 'Banner not found' });
            }

            // Construct the full path to the image file
            const imagePath = path.join(__dirname, '../uploads', deletedBanner.image);

            // Check if the file exists before trying to delete it
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the image file from disk
            } else {
                console.warn(`Image file not found: ${imagePath}`);
            }

            res.json({ message: 'Banner deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: 'Failed to delete banner', details: err }));
};



// Get all banners
exports.getAllBanners = (req, res) => {
    Banner.find()
        .then(banners => {
            const bannersWithImageUrl = banners.map(banner => ({
                ...banner.toObject(),
                // Correctly format the image URL using the stored filename
                image: `https://admin.aakarcanvassing.com/uploads/${banner.image}`, // banner.image contains the filename
            }));
            res.json(bannersWithImageUrl);
        })
        .catch(err => res.status(500).json({ error: 'Failed to fetch banners' }));
};
