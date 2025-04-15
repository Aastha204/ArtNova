import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Edit, Delete, Home, Check } from "@mui/icons-material";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Wavify from "react-wavify";
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
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phoneNo: "",
    dob: "",
    createdAt: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentJoke, setCurrentJoke] = useState(jokes[0]);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "https://via.placeholder.com/150");

  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("loggedInUserEmail");

    if (userEmail) {
      fetch(`http://localhost:3001/api/userProfile?email=${userEmail}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => {
          console.log("Fetched user data:", data); // ✅ For debugging
          setUserDetails({
            ...data,
            dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
            createdAt: data.createdAt,
          });
        })
        .catch((err) => {
          toast.error("Failed to fetch user data");
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJoke(jokes[Math.floor(Math.random() * jokes.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEditClick = () => {
    toast.info("You can now edit your profile");
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/updateUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userDetails.email,
          phoneNo: userDetails.phoneNo,
          dob: userDetails.dob,
          name: userDetails.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      const data = await response.json();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const compressedFile = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 600 });
    const formData = new FormData();
    formData.append("profile", compressedFile);
    formData.append("email", userDetails.email);

    const res = await fetch("http://localhost:3001/api/upload-profile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.imageUrl) {
      setProfilePic(data.imageUrl);
      localStorage.setItem("profilePic", data.imageUrl);
      toast.success("Profile picture updated!");
    } else {
      toast.error("Upload failed");
    }
  };

  const handleDeleteProfilePic = () => {
    setProfilePic("https://via.placeholder.com/150");
    localStorage.setItem("profilePic", "https://via.placeholder.com/150");
  };

  return (
    <div className="page-container">
      <Home className="home-icon" onClick={() => navigate("/")} />
      <h1 className="masked-text">USER PROFILE</h1>

      <div className="user-profile">
        <div className="profile-side">
          <label htmlFor="upload-image" className="profile-image-container">
            <img src={profilePic} alt="User" className="profile-image" />
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
              <input type="text" name="name" value={userDetails.name} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={userDetails.email} onChange={handleChange} disabled/>
            </div>
            <div className="form-group">
              <label>DOB:</label>
              <input type="date" name="dob" value={userDetails.dob} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="form-group">
              <label>Account Created on:</label>
              <input type="text" name="createdAt" value={new Date(userDetails.createdAt).toLocaleDateString()} disabled />
            </div>
          </form>

          <div className="social-icons">
            <Facebook className="social-icon" />
            <Twitter className="social-icon" />
            <Instagram className="social-icon" />
          </div>

          <Wavify
            fill="rgba(125, 146, 209, 0.17)"
            options={{ height: 70, amplitude: 20, speed: 0.25, points: 3 }}
            style={{
              position: "absolute",
              top: 500,
              left: "-50%",
              width: "420%",
              zIndex: -1,
            }}
          />
        </div>
      </div>

      <div className="ai-facts">{currentJoke}</div>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
