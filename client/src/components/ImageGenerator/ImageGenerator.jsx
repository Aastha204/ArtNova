import React, { useRef, useState, useCallback, useEffect } from 'react';
import { FaExpand, FaDownload, FaShareAlt, FaUserCircle , FaEnvelope} from 'react-icons/fa';
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Preloader from './Preloader'; // Import Preloader
import './ImageGenerator.css';
import default_image from '../Assets/1.png';

const ImageGenerator = () => {
    const [image_url, setImage_url] = useState("/");
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    let inputRef = useRef(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem('loggedInUserEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }

        // Simulate preloader time
        setTimeout(() => setLoading(false), 4000);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUserEmail');
        setUserEmail(null);
        window.location.reload();
    };

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

    if (loading) {
        return <Preloader />;
    }

    return (
        <div className='ai-image-generator'>
            <Particles className="particles-bg" init={particlesInit} options={particlesOptions} />
            
            <button className="subscribe-btn">
                <Link to="/subscribe" style={{ textDecoration: "none", color: "inherit" }}>Subscribe</Link>
            </button>

            <div className="auth-buttons">
                {userEmail ? (
                    <>
                    <Link to="/UserProfile">
                <FaUserCircle className="user-icon" size={24} title={userEmail} />
            </Link>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <button className="login-btn">
                        <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>Log in</Link>
                    </button>
                )}
            </div>

            <div className="header">Art<span>Nova</span></div>

            <div className="img-loading">
                <div className="image-container">
                    <img src={image_url === "/" ? default_image : image_url} alt="Generated" className="generated-image" />
                    
                    <div className="image-overlay">
                        <div className="image-buttons">
                            <button className="image-btn"><FaExpand /></button>
                            <button className="image-btn"><FaDownload /></button>
                            <button className="image-btn"><FaShareAlt /></button>
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
             {/* Need Help Section */}
             <div className="help-section">
                <p>Need help? <Link to="/contact" className="contact-link">Contact us</Link> <FaEnvelope className="contact-icon" /></p>
            </div>
        </div>
    );
};

export default ImageGenerator;
