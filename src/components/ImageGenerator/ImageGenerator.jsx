import { Link } from "react-router-dom";
import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/fictionbg.jpg';

const ImageGenerator = () => {
    const [image_url, setImage_url] = useState("/");
    let inputRef = useRef(null);

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            return;
        }
        const response = await fetch(

        );
    };

    return (
        <div className='ai-image-generator'>
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
                <div className="image">
                    <img src={image_url === "/" ? default_image : image_url} alt="" />
                </div>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    ref={inputRef}
                    className='search-input'
                    placeholder='Describe what you want to see'
                />
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>
        </div>
    );
};

export default ImageGenerator;


