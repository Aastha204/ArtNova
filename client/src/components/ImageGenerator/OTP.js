import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "./utils";

const OTPForm = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (e) => setOtp(e.target.value);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("loggedInUserEmail");
    const name = localStorage.getItem("loggedInUserName");
    const isLogin = false;

    if (!otp) {
      handleError("OTP is required.");
      return;
    }
    if (!email) {
      handleError("Something went wrong! Start again");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email, isLogin }),
      });
      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError("An error occurred during OTP verification.");
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) {
      handleError("Please wait before resending OTP.");
      return;
    }

    const email = localStorage.getItem("loggedInUserEmail");
    const name = localStorage.getItem("loggedInUserName"); // Fetch name from localStorage

    if (!email || !name) {
      handleError("Email or Name not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }), // Send both email and name
      });
      console.log("Resending OTP for:", { email, name });

      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        setTimer(60);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError("Failed to resend OTP. Please try again later.");
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
      <div className="inFormBackground">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="inLoginForm">
          <form onSubmit={handleVerifyOtp}>
            <div className="title">
              <h3>Verify OTP</h3>
            </div>
            <div className="SignupinputGroup">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="number"
                name="otp"
                placeholder="Enter OTP"
                id="otp"
                value={otp}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
              />
            </div>
            <button type="submit" className="submitForm">
              Verify
            </button>
            <hr className="divider" />

            <div
              onClick={handleResendOtp}
              className={`w-full font-bold mt-6 ${
                timer > 0
                  ? "cursor-not-allowed bg-transparent text-[hsl(337,87%,78%)]"
                  : "hover:underline bg-[hsl(335, 69.00%, 11.40%)] text-[hsl(337,87%,78%)]"
              } py-3 text-center cursor-pointer select-none`}
            >
              Resend OTP {timer > 0 && `(Wait ${timer}s)`}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OTPForm;
