import React from "react";
import Wave from "react-wavify";
import "./SubscribePage.css";
import { FaHome } from "react-icons/fa";  

const SubscribePage = () => {
  const plans = [
    {
      name: "Basic",
      price: "₹149.99/month",
      features: [
        "Generate up to 50 images/month",
        "Watermark on images",
        "Access to limited AI enhancements",
        "Personal use only",
        "Standard Support",
      ],
    },
    {
      name: "Intermediate",
      price: "₹699.99/month",
      features: [
        "Generate up to 200 images/month",
        "No watermark",
        "Advanced AI enhancements",
        "Limited commercial use",
        "Priority Support",
      ],
    },
    {
      name: "Advanced",
      price: "₹1499.99/month",
      features: [
        "Unlimited image generation",
        "No watermark",
        "Full AI enhancement features",
        "Full commercial usage rights",
        "24/7 Support",
      ],
    },
  ];

  return (
    <div className="subscribe-page">
       <div className="home-button1" onClick={() => window.location.href = "/"}>
        <FaHome />
      </div>

      {/* Animated Title */}
      <h2 className="subscribe-title">
        <span className="key">C</span>
        <span className="key">H</span>
        <span className="key">O</span>
        <span className="key">O</span>
        <span className="key">S</span>
        <span className="key">E</span>
        &nbsp;
        <span className="key">Y</span>
        <span className="key">O</span>
        <span className="key">U</span>
        <span className="key">R</span>
        &nbsp;
        <span className="key">S</span>
        <span className="key">U</span>
        <span className="key">B</span>
        <span className="key">S</span>
        <span className="key">C</span>
        <span className="key">R</span>
        <span className="key">I</span>
        <span className="key">P</span>
        <span className="key">T</span>
        <span className="key">I</span>
        <span className="key">O</span>
        <span className="key">N</span>
      </h2>
      <p className="subscribe-subtitle typewriter">
        Unlock exclusive features and enhance your experience with our tailored plans!
      </p>
      
      <div className="subscribe-cards-container">
        {plans.map((plan, index) => (
          <div className="subscribe-card" key={index}>
          <div className="wave-container">
              <Wave
                fill="#f429f2"
                options={{
                  height: 15,
                  amplitude: 20,
                  speed: 0.2,
                  points: 5,
                }}
                // className="card-wave"
              />
            </div>
            <h3>{plan.name}</h3>
            <p className="subscribe-price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className="plan-subscribe-btn">Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscribePage;
