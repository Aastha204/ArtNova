// server/routes/userRoutes.js
const express = require('express');
const UserModel = require('../Models/User'); // Adjust path as necessary
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

    res.json({
      name: user.name,
      email: user.email,
      phoneNo: user.phoneNo,
      age: user.age,
      gender: user.gender,
      dob: user.dob,
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update user details
router.put('/userProfile', async (req, res) => {
  const { email, phone, age, address, gender, dob } = req.body;

  try {
    // Find and update user by email
    const user = await UserModel.findOneAndUpdate(
      { email },
      { phoneNo: phone, age, address, gender, dob },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
