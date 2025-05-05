const express = require('express');
const UserModel = require('../Models/User'); // Adjust the path as needed
const upload=require('../Middlewares/upload')
const router = express.Router();

// Route to fetch user details by email
router.get('/userProfile', async (req, res) => {
  const { email } = req.query;
  console.log("Received email:", email);

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User DOB:", user.dob);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNo: user.phoneNo,
      dob: user.dob,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update user details
router.put('/updateUser', async (req, res) => {
  const { email, name, phoneNo, dob } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      { email },
      { name, phoneNo, dob },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User details updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload/update image
router.put('/upload-image/:id', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { profileImage: imagePath },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete image
router.delete('/delete-image/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const fs = require('fs');

    if (user.profileImage) {
      fs.unlinkSync(user.profileImage); // remove file from uploads folder
    }

    user.profileImage = null;
    await user.save();
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
