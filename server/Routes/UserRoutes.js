const express = require('express');
const UserModel = require('../Models/User'); // Adjust the path as needed
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

module.exports = router;
