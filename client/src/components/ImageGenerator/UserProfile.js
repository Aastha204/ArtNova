import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Edit, Delete, Home, Check } from "@mui/icons-material";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Wavify from "react-wavify"; // Import Wavify

import "./UserProfile.css";

const jokes = [
  "AI will never replace humans... until it learns sarcasm.",
  "I asked ChatGPT for a joke, and now it writes my stand-up routine.",
  "The Turing test is outdated. If AI can order pizza correctly, it's human enough.",
  "AI doesn't sleep... but it does crash unexpectedly.",
  "AI fact: The 'smart' in 'smart assistant' depends on your WiFi speed.",
  "I told my AI assistant a joke… now it won’t stop explaining it to me.",
  "AI can solve complex equations in seconds but still struggles with CAPTCHA.",
  "I asked AI if it dreams… it said only about electric sheep.",
  "Why did the AI break up with its chatbot girlfriend? Too many auto-replies.",
  "AI wrote my essay. Now my professor wants to hire it instead of me!",
  "I told AI to call my mom… now it won’t stop scheduling updates with her.",
  "AI doesn’t make mistakes… just ‘unexpected feature enhancements.’",
  "AI tried stand-up comedy… but all the jokes were pre-programmed.",
  "AI is great at chess… until you unplug it.",
  "I asked AI to make a playlist. Now I’m stuck in an infinite loop of lo-fi beats."
];

const UserProfile = () => {
  const storedData = JSON.parse(localStorage.getItem("userData")) || {
    name: "Hembo Tingor",
    email: "rntng@gmail.com",
    dob: "1995-05-15",
    account: "Created on 01-01-2024",
    profilePic: localStorage.getItem("profilePic") || "https://via.placeholder.com/150",
  };

  const [userData, setUserData] = useState(storedData);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJoke, setCurrentJoke] = useState(jokes[0]);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    const jokeInterval = setInterval(() => {
      setCurrentJoke(jokes[Math.floor(Math.random() * jokes.length)]);
    }, 5000);
    return () => clearInterval(jokeInterval);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Show preview instantly
    const localUrl = URL.createObjectURL(file);
    setUserData((prev) => ({ ...prev, profilePic: localUrl }));
  
    const formData = new FormData();
    formData.append("profile", file);
    formData.append("email", userData.email); // Optional: Pass user email
    formData.append("name", userData.name);   // Optional
  
    try {
      const res = await fetch("http://localhost:3001/api/upload-profile", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (data.imageUrl) {
        setUserData((prev) => ({ ...prev, profilePic: data.imageUrl }));
        localStorage.setItem("profilePic", data.imageUrl);
        toast.success("Profile picture updated!");
      } else {
        toast.error("Upload failed. No image URL received.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed!");
    }
  };
  
  

  const handleDeleteProfilePic = () => {
    setUserData((prev) => ({ ...prev, profilePic: "https://via.placeholder.com/150" }));
    localStorage.setItem("profilePic", "https://via.placeholder.com/150");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    localStorage.setItem("userData", JSON.stringify(userData));
    toast.success("User details updated successfully!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-container">
      <Home className="home-icon" onClick={() => window.location.href = "/"} />
      <h1 className="masked-text">USER PROFILE</h1>

      
      
      <div className="user-profile">
        <div className="profile-side">
          <label htmlFor="upload-image" className="profile-image-container">
            <img src={userData.profilePic} alt="User" className="profile-image" />
            <input type="file" id="upload-image" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </label>
          <div className="profile-buttons">
            <Edit className="edit-icon" onClick={() => document.getElementById("upload-image").click()} />
            <Delete className="delete-icon" onClick={handleDeleteProfilePic} />
          </div>
        </div>

        <div className="profile-info">
          <div className="edit-save-icons">
            {isEditing ? (
              <Check className="save-icon" onClick={handleSaveClick} />
            ) : (
              <Edit className="edit-icon edit-details" onClick={handleEditClick} />
            )}
          </div>

          <form className={`user-details ${isEditing ? "editing-mode" : ""}`}>
  <div className="form-group">
    <label>Name:</label>
    <input type="text" name="name" value={userData.name} onChange={handleChange} disabled={!isEditing} />
  </div>
  <div className="form-group">
    <label>Email:</label>
    <input type="email" name="email" value={userData.email} onChange={handleChange} disabled={!isEditing} />
  </div>
  <div className="form-group">
    <label>DOB:</label>
    <input type="date" name="dob" value={userData.dob} onChange={handleChange} disabled={!isEditing} />
  </div>
  <div className="form-group">
    <label>Account Info:</label>
    <input type="text" value={userData.account} disabled />
  </div>
</form>


          <div className="social-icons">
            <Facebook className="social-icon" />
            <Twitter className="social-icon" />
            <Instagram className="social-icon" />
          </div>
          <Wavify
  fill="rgba(125, 146, 209, 0.17)"
  options={{
   
    height: 70,
    amplitude: 20,
    speed: 0.25,
    points: 3,
  }}
  style={{
    position: "absolute",
    top: 500, // Keeps the wave effect at a specific vertical position
    left: "-50%", // Moves the wave towards the left side
    right: "auto", // Ensures it doesn't shift back to the right
    width: "420%", // Adjust the width to make it fit properly
    zIndex: -1,

  }}
/>
        </div>
      </div>
      {/* Add the Wavify background component */}
      
      <div className="ai-facts">{currentJoke}</div>
      <ToastContainer />
    </div>
    
  );
};

export default UserProfile;
