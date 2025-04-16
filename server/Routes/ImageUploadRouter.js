const express = require('express');
const multer = require('multer');
const path = require('path');
const profile = require('../Models/User');  // Ensure this path is correct
const fs = require("fs");

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // Fix: absolute path
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg'; // fallback in case it's missing
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
    console.log("Uploaded file original name:", file.originalname);
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

    // Save to MongoDB with a different variable name to avoid conflict
    const updatedProfile = await profile.findOneAndUpdate(
      { email }, // find user by email
      { name, email, profilePic: imageUrl},
      { upsert: true, new: true }
    );

    res.status(200).json({ imageUrl, message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.delete("/delete-profile-pic", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await profile.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Extract filename from the full URL
    const filename = user.profilePic?.split("/uploads/")[1];

    // Delete the image from the uploads folder if it exists
    if (filename) {
      const imagePath = path.join(__dirname, "..", "uploads", filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Deleted file:", imagePath);
      }
    }

    // Update profilePic field to null or empty string
    await profile.findOneAndUpdate(
      { email },
      { $set: { profilePic: "" } }
    );

    res.status(200).json({ message: "Profile picture deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during profile pic deletion" });
  }
});

module.exports = router;
