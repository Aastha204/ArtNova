import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from './utils'
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";

const validateName = (name) => /^[a-zA-Z]+(?:[.'-]?[a-zA-Z]+)(?: [a-zA-Z]+(?:[.'-]?[a-zA-Z]+))*$/.test(name);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/.test(password);
const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com|live\.com|icloud\.com)$/.test(email);

const SignupForm = () => {
  const [signupInfo, setSignupInfo] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) return handleError("Name, email, and password are required.");
    if (!validateName(name)) return handleError("Invalid name format.");
    if (!validatePassword(password)) return handleError("Weak password. Must include uppercase, lowercase, number, and special character.");
    if (!validateEmail(email)) return handleError("Invalid email domain.");
    setLoading(true); // Start loading

    try {
      const url = "http://localhost:3001/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('userType', 'user');
        localStorage.setItem('loggedInUserName',name);
        localStorage.setItem('loggedInUserEmail',email);
        setTimeout(() => {
          navigate('/verification');
          setLoading(false);
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message || "Signup failed.";
        setLoading(false);
        handleError(details);
      } else if (!success) {
        handleError(message);
        setLoading(false)
      }
    } catch (err) {
      handleError("An error occurred during signup. Please try again later.");
    }
    
  };

  useEffect(() => {
    const canvas = document.getElementById("snowCanvas");
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const snowflakes = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
    }));

    function animateSnow() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

      snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
        flake.y += flake.speed;
        if (flake.y > height) {
          flake.y = 0;
          flake.x = Math.random() * width;
        }
      });

      requestAnimationFrame(animateSnow);
    }

    animateSnow();
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <canvas id="snowCanvas"></canvas>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="inFormBackground">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="inSignupForm">
          <form onSubmit={handleSignup}
            disabled={loading}>
          
            <div className="title">
              <h3>Sign Up</h3>
            </div>
            <div className="SignupinputGroup">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" placeholder="Enter Name" id="name" value={signupInfo.name} onChange={handleChange} />
            </div>
            <div className="SignupinputGroup">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" placeholder="Enter Email" id="email" value={signupInfo.email} onChange={handleChange} disabled={loading}/>
            </div>
            <div className="SignupinputGroup">
              <label htmlFor="password">Password</label>
              <div className="passwordWrapper">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter Password" id="password" value={signupInfo.password} onChange={handleChange} />
                <span className="eyeIcon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="submitForm" disabled={loading}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
