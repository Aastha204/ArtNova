import React, { useRef, useState, useCallback } from 'react';
import { FaExpand, FaDownload, FaShareAlt } from 'react-icons/fa';
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import './ImageGenerator.css';
import default_image from '../Assets/1.png';

const ImageGenerator = () => {
    const [image_url, setImage_url] = useState("/");
    let inputRef = useRef(null);

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
            move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false }
        }
    };

    // Open image in a new tab (Expand)
    const handleExpand = () => {
        const imgSrc = image_url === "/" ? default_image : image_url;
        window.open(imgSrc, '_blank');
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

    return (
        <div className='ai-image-generator'>
            <Particles className="particles-bg" init={particlesInit} options={particlesOptions} />
            
            {/* Subscription Button (Top Left) */}
            <button className="subscribe-btn">
                <Link to="/subscribe" style={{ textDecoration: "none", color: "inherit" }}>Subscribe</Link>
            </button>

            {/* Login & Signup Buttons (Top Right) */}
            <div className="auth-buttons">
                <button className="login-btn">Log in</button>
            </div>

            <div className="header">Art<span>Nova</span></div>

            <div className="img-loading">
                <div className="image-container">
                    <img src={image_url === "/" ? default_image : image_url} alt="Generated" className="generated-image" />
                    
                    {/* Pink Overlay with Buttons */}
                    <div className="image-overlay">
                        <div className="image-buttons">
                            <button className="image-btn" onClick={handleExpand}><FaExpand /></button>
                            <button className="image-btn" onClick={handleDownload}><FaDownload /></button>
                            <button className="image-btn" onClick={handleShare}><FaShareAlt /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    ref={inputRef}
                    className='search-input'
                    placeholder='Describe what you want to see'
                />
                <div className="generate-btn">Generate</div>
            </div>
        </div>
    );
};

export default ImageGenerator;
