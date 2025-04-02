import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { handleError, handleSuccess } from "./utils"; 

const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  console.log("loginInfo -> ", loginInfo);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("email and password are required");
    }
    setLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, name, userId, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("userType", "user");
        localStorage.setItem("loggedInUserName", name);
        localStorage.setItem("loggedInUserEmail", loginInfo.email);
        localStorage.setItem("loggedInUserId", userId);

        setTimeout(() => {
          navigate("/");
          setLoading(false); // Stop loading
        }, 1000);
      } else {
        handleError(error?.details?.[0]?.message || message);
        setLoading(false); // Stop loading
      }
    } catch (err) {
      handleError(err.message);
      setLoading(false); // Stop loading
    }
  
    try {
      const url = "http://localhost:3001/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo)

      });
      console.log("Login Info being sent:", loginInfo);

      const result = await response.json();
      const { success, message, jwtToken, name, userId, error } = result;
      if (success) {
        handleSuccess(message);

        localStorage.setItem("token", jwtToken);
        localStorage.setItem("userType", "user");
        localStorage.setItem("loggedInUserName", name);
        localStorage.setItem("loggedInUserEmail", email);
        localStorage.setItem("loggedInUserId", userId);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
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
          <form onSubmit={handleLogin}
           disabled={loading}
          >
         
            <div className="title">
              <h3>Login Here</h3>
            </div>
            <div className="inputGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                id="email"
                value={loginInfo.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="password">Password</label>
              <div className="passwordWrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  id="password"
                  value={loginInfo.password}
                  onChange={handleChange}
                />
                <span className="eyeIcon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="submitForm" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Log In"}
            </button>
            
            <hr className="divider" />
            <p className="signupText">
              No account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
