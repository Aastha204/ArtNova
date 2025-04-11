const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST route to handle image upload
router.post("/upload-profile", upload.single("profile"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });
  
      const { name, email } = req.body;
      const imageUrl = `http://localhost:3001/uploads/${file.filename}`;
  
      // Save to MongoDB
      const profile = await UserProfile.findOneAndUpdate(
        { email }, // find user by email
        { name, email, profilePic: imageUrl },
        { upsert: true, new: true }
      );
  
      res.status(200).json({ imageUrl, message: "Profile updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

module.exports = router;
