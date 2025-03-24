import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signup.css";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <>
      <canvas id="snowCanvas"></canvas>
      <div className="inFormBackground">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="inSignupForm">
          <form onSubmit={handleSubmit}>
            <div className="title">
              <h3>Sign Up</h3>
            </div>
            <div className="SignupinputGroup">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="SignupinputGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="SignupinputGroup">
              <label htmlFor="password">Password</label>
              <div className="passwordWrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="eyeIcon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="submitForm">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
  
};

export default SignupForm;
