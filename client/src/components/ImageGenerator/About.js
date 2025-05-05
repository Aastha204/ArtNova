import React from 'react';
import './About.css';
import image1 from '../Assets/sunset.jpeg';
import image2 from '../Assets/forest.jpg';
import image3 from '../Assets/astronaut.jpg';
import image4 from '../Assets/jellyfish.jpg';
const galleryItems = [
    { src: image1, prompt: 'A futuristic city skyline at sunset in cyberpunk style' },
    { src: image2, prompt: 'A serene forest path in the style of Studio Ghibli' },
    { src: image3, prompt: 'An astronaut exploring an alien jungle, hyper-realistic' },
    { src: image4, prompt: 'A glowing jellyfish floating in a night ocean, surrealism' },
];

const AboutUs = () => {
  return (
    <div className="about-wrapper">
      <div className="about-content">
        <h1 className="glow-heading">About <span>ArtNova</span></h1>
        <p className="tagline">Next-gen AI-powered visual creativity</p>

        <div className="info-section">
          <div className="info-block">
            <h2>🔸 Who We Are</h2>
            <p>
              ArtNova is a creative AI-powered platform that transforms your words into stunning visuals. We empower creators by bridging imagination and technology.
            </p>
          </div>
          <div className="info-block">
            <h2>🔸 Our Vision</h2>
            <p>
              To make visual creativity accessible to everyone using the magic of artificial intelligence and generative art.
            </p>
          </div>
          <div className="info-block">
            <h2>🔸 What You Can Do</h2>
            <ul>
              <li>🎨 Generate AI art from text prompts</li>
              <li>🌌 Explore styles (realism, anime, surrealism…)</li>
              <li>💾 Save, share, and download your creations</li>
            </ul>
          </div>
        </div>

        <h2 className="gallery-heading">
          Need help with prompts? Don’t worry — we’ve got your back! Check out these amazing prompt-generated images:
        </h2>

        <div className="gallery">
          {galleryItems.map((item, index) => (
            <div key={index} className="gallery-item">
              <img src={item.src} alt={`Prompt ${index}`} />
              <div className="prompt-overlay">
                <p>{item.prompt}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer">
          Crafted with 💖 by passionate developers and artists who believe there's an artist in everyone.
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;
