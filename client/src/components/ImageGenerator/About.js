import React from 'react';
import './About.css';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import image1 from '../Assets/sunset.jpeg';
import image2 from '../Assets/forest.jpg';
import image3 from '../Assets/astronaut.jpg';
import image4 from '../Assets/jellyfish.jpg';
import image5 from '../Assets/tokyo.jpg';
import image6 from '../Assets/castle.jpg';
import image7 from '../Assets/warrior.jpeg';
import image8 from '../Assets/bird.jpg';
import image9 from '../Assets/waterfall.jpg';
import image10 from '../Assets/robot.jpg';
import image11 from '../Assets/dragon.jpg';
import image12 from '../Assets/library.png';
import robot from '../Assets/robot.png';
import { useNavigate } from 'react-router-dom';

// import image13 from '../Assets/extra9.jpg';
// import image14 from '../Assets/extra10.jpg';
// import image15 from '../Assets/extra11.jpg';

const galleryItems = [
  { src: image1, prompt: 'A futuristic city skyline at sunset in cyberpunk style' },
  { src: image2, prompt: 'A serene forest path in the style of Studio Ghibli' },
  { src: image3, prompt: 'An astronaut exploring an alien jungle, hyper-realistic' },
  { src: image4, prompt: 'A glowing jellyfish floating in a night ocean, surrealism' },
  { src: image5, prompt: 'A neon-lit street in Tokyo at night, Blade Runner style' },
  { src: image6, prompt: 'A majestic castle in the clouds, fantasy style' },
  { src: image7, prompt: 'A futuristic warrior in a desert landscape, sci-fi' },
  { src: image8, prompt: 'A colorful bird with geometric wings, low poly art' },
//   { src: image9, prompt: 'A galaxy made of musical notes, abstract' },
  { src: image9, prompt: 'A floating island with waterfalls, concept art' },
  { src: image10, prompt: 'A robot painting on canvas, AI and creativity fusion' },
  { src: image12, prompt: 'A dream-like underwater library, imaginative' },
//   { src: image13, prompt: 'A snowy village with warm lights, storybook style' },
  { src: image11, prompt: 'A dragon flying above clouds at sunrise, mythical' },
//   { src: image15, prompt: 'A cosmic dance of stars forming a human silhouette' },
];

const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const AboutUs = () => {
  const rows = chunkArray(galleryItems, 3); // 5 rows of 3 images each
  const [copiedIndex, setCopiedIndex] = React.useState(null);
  const navigate = useNavigate();  

  return (
    
    <div className="about-wrapper">
    
    <div className="back-button" onClick={() => navigate('/')}>
  <FaArrowAltCircleLeft className="back-icon" />
</div>

      <h2 className="glow-heading">
      <div className="header">
                Art<span>Nova</span>
            </div>
      </h2>
      <p className="tagline">Unleashing creativity through AI-powered visuals.</p>
      <div className="intro-section">
        <div className="intro-text">
         
          <p>
          Turn words into stunning visuals with the power of AI. ArtNova lets you generate unique images from your ideas—no  artistic skills needed. Whether you're an artist, writer, or dreamer, bring your creativity to life in just a few clicks.
          Let your creativity flow—ArtNova is more than just a tool; it's a canvas for your mind.
          </p>
        </div>
        <div className="intro-image">
          <img src={robot} alt="Robot Illustration" className="robot-animated" />
        </div>
      </div>
     

      <div className="card-container">
          <div className="info-card">
            <h2>🔸 Who We Are</h2>
            <p>
              ArtNova is a creative AI-powered platform that transforms your words into stunning visuals. We empower creators by bridging imagination and technology.
            </p>
          </div>
          <div className="info-card">
            <h2>🔸 Our Vision</h2>
            <p>
              To make visual creativity accessible to everyone using the magic of artificial intelligence and generative art.
            </p>
          </div>
          <div className="info-card">
            <h2>🔸 What You Can Do</h2>
            <ul>
              <li>🎨 Generate AI art from text prompts</li>
              <li>🌌 Explore styles (realism, anime, surrealism…)</li>
              <li>💾 Save, share, and download your creations</li>
            </ul>
          </div>
        </div>
        <div className="cta-buttons">
        <button onClick={() => navigate('/')}>Try ArtNova Now</button>
        
      </div>

      <h2 className="gallery-main-heading">Can't find a perfect prompt? Dont Worry We Got you! Here is the Artnova Gallery </h2>
      
      <div className="gallery-scroll-box">
      {rows.map((row, rowIndex) => (
  <div key={rowIndex} className="gallery-row">
    {row.map((item, index) => {
      const globalIndex = rowIndex * 3 + index;
      return (
        <div key={globalIndex} className="gallery-image-box">
          <img src={item.src} alt={`Art ${globalIndex}`} />
          <div className="hover-prompt">
            <p>{item.prompt}</p>
            <button
              className="copy-button"
              onClick={() => {
                navigator.clipboard.writeText(item.prompt);
                setCopiedIndex(globalIndex);
                setTimeout(() => setCopiedIndex(null), 1500);
              }}
            >
              {copiedIndex === globalIndex ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      );
    })}
  </div>
))}

      </div>

      <footer className="footer">
  © {new Date().getFullYear()} ArtNova. All rights reserved.
</footer>

    </div>
  );
};

export default AboutUs;
