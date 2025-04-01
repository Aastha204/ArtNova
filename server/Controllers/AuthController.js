const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
const UserModel = require("../Models/User");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


let pendingUsers = {}; // Temporary storage for user details

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exists. Please login.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    pendingUsers[email] = { name, email, password: hashedPassword };

    // Use dynamic import for fetch
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

    const sendOtpResponse = await fetch("http://localhost:3001/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, isLogin: false }),
    });

    const otpResult = await sendOtpResponse.json();

    if (!otpResult.success) {
      delete pendingUsers[email];
      return res.status(500).json({
        message: otpResult.message || "Failed to send OTP. Please try again.",
        success: false,
      });
    }

    res.status(201).json({
      message: "Signup initiated. Please verify the OTP sent to your email.",
      success: true,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};



const login = async(req,res)=>{
    try{
     const {email,password}=req.body;
     const user = await UserModel.findOne({email})
     const errorMsg="Auth failed email or password is wrong"
     if(!user){
         return res.status(403).json({message:errorMsg,success:false})
     }
    const isPassEqual = await bcrypt.compare(password,user.password)
    if(!isPassEqual){
        return res.status(403).json({message:errorMsg,success:false})
    }
    const jwtToken = jwt.sign(
        {email:user.email,_id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:'24h'}
    )
     res.status(200).json({message:"Login successflly",
        success:true,
        jwtToken,
        email,
        name:user.name,
        userId: user._id,
    })
    }catch(err){
        console.log(err)
     res.status(500).json({message:"Internal server error",success:false})
    }
 }
 let otps = {}; // Ensure otps object exists globally

 const sendOtp = async (req, res) => {
  const { email, name, isLogin } = req.body; // Extract from request body
  console.log('Request body:', req.body); // Debug incoming data
  try {
    if (isLogin) {
      // Check if the provided email and name exist in the database
      const user = await UserModel.findOne({ email,name });
      const useremail = await UserModel.findOne({ email });
      const username = await UserModel.findOne({ name });

      if (!useremail) {
        console.log("User not found in database for login.");
        return res.json({ success: false, message: "Email not found. Please check your credentials." });
      }
      if (!username) {
        console.log("User not found in database for login.");
        return res.json({ success: false, message: "Name not found. Please check your credentials." });
      }

      console.log("User exists for login:", user);
    }

    console.log("if not login part working");

    // Handle OTP sending logic (for registration verification, etc.)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP with expiry logic
    otps[email] = { otp, expires: Date.now() + 600000 };

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ArtNova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - OTP',
      html: `
        <h1>Welcome to ArtNova, ${name}!</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to:", email);

    return res.json({ success: true, message: "OTP sent successfully." }); // Ensure to return JSON response
  } catch (error) {
    console.error("Error in sendOtp function:", error);
    return res.json({ success: false, message: "Error sending OTP." }); // Return a proper error message
  }
};





const verifyOtp = async (req, res) => {
  const { otp, email, isLogin } = req.body;

  const storedOtp = otps[email];

  // Check if OTP exists and is valid
  if (!storedOtp || storedOtp.expires < Date.now()) {
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
  }

  // OTP verified successfully; delete it
  delete otps[email];

  if (isLogin) {
    try {
      // Retrieve user from the database
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found. Please signup first." });
      }

      // Generate JWT token
      const jwtToken = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully for login.',
        jwtToken,
        email,
        name: user.name,
        userId: user._id,
      });
    } catch (error) {
      console.error('Error during login via OTP:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  const userData = pendingUsers[email];
  if (!userData) {
    return res.status(400).json({ success: false, message: "No pending user data found. Please signup again." });
  }

  try {
    // Save the user to the database
    const newUser = new UserModel(userData);
    await newUser.save();

    // Remove from temporary storage
    delete pendingUsers[email];

    // Send the confirmation email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ArtNova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Signup Successful!',
      html: `
        <h1>Welcome to ArtNova,!</h1>
        <p>Your account has been successfully created.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending confirmation email:', error);
        return res.status(500).json({ message: 'OTP verified, but failed to send confirmation email.', success: false });
      } else {
        console.log('Confirmation email sent:', info.response);
        return res.status(200).json({ success: true, message: 'OTP verified and confirmation email sent successfully.' });
      }
    });
  } catch (error) {
    console.error('Error saving user to database:', error);
    return res.status(500).json({ success: false, message: 'Error saving user to database.' });
  }
};



const resendOtp = async (req, res) => {
  try {
    console.log('Resend OTP request received:', req.body);

    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Email and name are required." });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = { otp, expires: Date.now() + 600000 };

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ArtNova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Resend OTP - ArtNova',
      html: `
        <h1>Hello ${name},</h1>
        <p>Your new OTP is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP resent successfully to:", email);

    return res.status(200).json({ success: true, message: "OTP resent successfully." });

  } catch (err) {
    console.error('Error resending OTP:', err);
    return res.status(500).json({ success: false, message: "Failed to resend OTP. Please try again later." });
  }
};


const updatePassword = async(req,res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password matches the one in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={
    signup,
    login,verifyOtp, resendOtp, sendOtp, updatePassword
}