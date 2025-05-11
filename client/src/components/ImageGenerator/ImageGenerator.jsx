import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  FaExpand,
  FaDownload,
  FaShareAlt,
  FaUserCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Preloader from "./Preloader"; // Import Preloader
import "./ImageGenerator.css";
import default_image from "../Assets/1.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "./utils";
import axios from "axios";
import { Info } from "lucide-react"; // Importing the Info icon

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false); // NEW STATE
  const [activeSubscription, setActiveSubscription] = useState(null);
  let inputRef = useRef(null);

  const [error, setError] = useState(null); // State to hold error messages

//   const imageGenerator = async () => {
//       const userEmail = localStorage.getItem("loggedInUserEmail");
//       if (!userEmail) {
//           // Use Toastify for the notification
//           return handleError("Login required to generate images.");
//       }
//       const prompt = inputRef.current.value.trim();
//       console.log("Prompt: ", prompt); // Log the prompt for debugging
//       if (prompt === "") {
//           alert("Please provide a valid prompt.");
//           return;
//       }
//       setGenerating(true);
//       try {
//           const response = await fetch("http://localhost:3001/api/generate-image", {
//               method: "POST",
//               headers: {
//                   "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ prompt }),
//           });

//           const data = await response.json();

//           if (!response.ok) {
//               alert(`Error: ${data.error || data.message}`);
//               console.error("Error details:", data);
//               return;
//           }

//           if (data?.data?.[0]?.url) {
//               setImage_url(data.data[0].url);
//               // inputRef.current.value = "";
//           } else {
//               alert("Image not found in response.");
//           }
//       } catch (error) {
//           console.error("Error generating image:", error);
//           alert("An error occurred while generating the image.");
//       }
//       finally {
//           setGenerating(false);
//       }
//   };
//   const imageGenerator = async () => {
//     try {
//         const userEmail = localStorage.getItem("loggedInUserEmail"); // Or get from context/localStorage
    
//         // Call backend to decrement limit
//         const res = await axios.post('http://localhost:3001/api/decrement-limit', {
//           userEmail
//         });
    
//         console.log(res.data.message, "Remaining limit:", res.data.limit);
//         setActiveSubscription(prev => ({
//             ...prev,
//             limit: res.data.limit
//           }));
    
//         // Proceed with image generation
//         // your image generation logic here
    
//       } catch (err) {
//         console.error("Error during image generation:", err);
//         // alert(err.response?.data?.message || "Failed to generate image");
//         return handleError(err.response?.data?.message || "Failed to generate image");
//       }
//     //   return handleError("Generate clicked");
//   };

const imageGenerator = async () => {
    const userEmail = localStorage.getItem("loggedInUserEmail");
    if (!userEmail) {
      return handleError("Login required to generate images.");
    }
  
    const prompt = inputRef.current.value.trim();
    if (prompt === "") {
      alert("Please provide a valid prompt.");
      return;
    }
  
    setGenerating(true);
  
    try {
      // Step 1: Generate image
      const response = await fetch("http://localhost:3001/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error generating image:", data);
        return alert(`Error: ${data.error || data.message}`);
      }
  
      const imageUrl = data?.data?.[0]?.url;
      if (!imageUrl) {
        alert("Image not found in response.");
        return;
      }
       // Step 2: Apply watermark for "basic" subscription
    if (activeSubscription?.plan === 'basic') {
        imageUrl = await applyWatermark(imageUrl); // A function to apply watermark
      }
  
      setImage_url(imageUrl);
  
      // Step 2: Decrement limit
      const limitResponse = await axios.post('http://localhost:3001/api/decrement-limit', {
        userEmail
      });
  
      console.log(limitResponse.data.message, "Remaining limit:", limitResponse.data.limit);
  
      setActiveSubscription(prev => ({
        ...prev,
        limit: limitResponse.data.limit
      }));
  
    } catch (error) {
      console.error("Error during image generation process:", error);
      alert("An error occurred while generating the image.");
    } finally {
      setGenerating(false);
    }
  };
  
  const applyWatermark = async (imageUrl) => {
    const watermarkText = "ArtNova"; // Watermark text
    const img = new Image();
    img.src = imageUrl;
  
    return new Promise((resolve) => {
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
  
        // Set watermark properties
        ctx.font = "48px Arial"; // You can change the font and size
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // Semi-transparent white
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
  
        // Add the watermark text
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        ctx.fillText(watermarkText, x, y);
  
        // Create the watermarked image
        const watermarkedImageUrl = canvas.toDataURL("image/png");
  
        resolve(watermarkedImageUrl);
      };
    });
  };
  

  useEffect(() => {
    const storedEmail = localStorage.getItem("loggedInUserEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
      // Fetch user subscription data
      axios
  .get("http://localhost:3001/api/active", { params: { userEmail: storedEmail } })
  .then((response) => {
    const subscription = response.data; // this is a single object
    console.log("Active subscription:", subscription);

    if (subscription && new Date(subscription.endDate) > new Date()) {
      setActiveSubscription(subscription);
    } else {
      setActiveSubscription(null);
    }
  })
  .catch((error) => {
    console.error("Error fetching active subscription:", error);
    setActiveSubscription(null);
  });

    }

    // Simulate preloader time
    setTimeout(() => setLoading(false), 4000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUserEmail");
    setUserEmail(null);
    window.location.reload();
  };

  // Open image in a new tab (Expand)
//   const handleExpand = () => {
//     const imgSrc = image_url === "/" ? default_image : image_url;
//     console.log("Image URL:", imgSrc); // Log the image URL for debugging
//     window.open(imgSrc, "_blank");
//   };
const handleExpand = () => {
    const imgSrc = image_url === "/" ? default_image : image_url;
    console.log("Image URL:", imgSrc); // Log the image URL for debugging

    // Open a new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(`
            <html>
                <head>
                    <title>Expanded Image</title>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f0f0f0;
                        }
                        img {
                            max-width: 90%; /* Make the image smaller */
                            max-height: 90%; /* Make the image smaller */
                            object-fit: contain; /* Preserve aspect ratio */
                        }
                    </style>
                </head>
                <body>
                    <img src="${imgSrc}" alt="Expanded" />
                </body>
            </html>
        `);
        newWindow.document.close(); // Close the document to render it properly
    } else {
        alert("Popup blocked! Please allow popups for this site.");
    }
};


  // Download image
  const handleDownload = () => {
    const imgSrc = image_url === "/" ? default_image : image_url;
    const link = document.createElement("a");
    link.href = imgSrc;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share image via Web Share API or Copy to Clipboard
  const handleShare = async () => {
    const imgSrc = image_url === "/" ? default_image : image_url;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this AI-generated image!",
          text: "Generated using ArtNova",
          url: imgSrc,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(imgSrc);
        alert("Image link copied to clipboard!");
      } catch (error) {
        console.error("Error copying link:", error);
      }
    }
  };

  // Initialize particles.js for animated background
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: "#060320" },
    particles: {
      number: { value: 220, density: { enable: true, value_area: 800 } },
      color: { value: "#f429f2" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 5, random: true },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: false,
        straight: false,
      },
    },
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* {generating && (
    <div className="overlay-loader">
        <div className="spinner"></div>
        <p className="loading-text">Generating your image...</p>
    </div>
)} */}
      <div className="ai-image-generator">
        <Particles
          className="particles-bg"
          init={particlesInit}
          options={particlesOptions}
        />

        {/* <button className="subscribe-btn">
                <Link to="/subscribe" style={{ textDecoration: "none", color: "inherit" }}>
                    Subscribe
                </Link>
            </button> */}
        {activeSubscription ? (
          <div className="subscribe-btn">
            <h3>Active Subscription</h3>
            <p>Package: {activeSubscription.planType}</p>
            <p>
              End Date:{" "}
              {new Date(activeSubscription.endDate).toLocaleDateString()}
            </p>
            <p>Limit: {activeSubscription.limit}</p>
            <Link
              to="/subscribe"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Subscribe details
            </Link>
          </div>
        ) : (
          <button className="subscribe-btn">
            <Link
              to="/subscribe"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Subscribe
            </Link>
          </button>
        )}

        <div className="auth-buttons">
          {/* Change based on screen size */}
          <Link
            to="/about"
            style={{ textDecoration: "none", color: "inherit" }}
            className="who-we-are-btn"
          >
            Who We Are?
          </Link>
          <Link
            to="/about"
            style={{ textDecoration: "none", color: "inherit" }}
            className="profile-icon-link"
          >
            <Info className="about-icon" size={24} title="About Us" />
          </Link>
          {/* <Link to="/about" style={{ textDecoration: "none", color: "inherit" }} className="login-btn">Who We Are?</Link> */}
          {userEmail ? (
            <>
              <Link to="/UserProfile">
                <FaUserCircle
                  className="user-icon"
                  size={24}
                  title={userEmail}
                />
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="login-btn">
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Log in
              </Link>
            </button>
          )}
        </div>

        <div className="header">
          Art<span>Nova</span>
        </div>

        <div className="img-loading">
          <div className="image-container">
            {generating && (
              <div className="overlay-loader">
                <div className="spinner"></div>
                <p className="loading-text">Generating your image...</p>
              </div>
            )}

            <img
              src={image_url === "/" ? default_image : image_url}
              alt="Generated"
              className={`generated-image ${image_url !== "/" ? "loaded" : ""}`}
              onLoad={(e) => e.currentTarget.classList.add("loaded")}
            />

            <div className="image-overlay">
              <div className="image-buttons">
                <button className="image-btn" onClick={handleExpand}>
                  <FaExpand />
                </button>
                <button className="image-btn" onClick={handleDownload}>
                  <FaDownload />
                </button>
                {/* <button className="image-btn" onClick={handleShare}>
                  <FaShareAlt />
                </button> */}
              </div>
            </div>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            ref={inputRef}
            className="search-input"
            placeholder="Describe what you want to see"
          />
          <div
            className="generate-btn"
            onClick={() => {
              imageGenerator();
            }}
          >
            Generate
          </div>
        </div>

        {/* Need Help Section */}
        <div className="help-section">
          <p>
            Need help?{" "}
            <Link to="/contact" className="contact-link">
              Contact us
            </Link>{" "}
            <FaQuestionCircle className="help-icon" />
          </p>
        </div>
      </div>
    </>
  );
};

export default ImageGenerator;
