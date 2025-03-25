import React from "react";
import "./SubscribePage.css";

const SubscribePage = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9.99/month",
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
      price: "$19.99/month",
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
      price: "$29.99/month",
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
      <h2 className="subscribe-title">Choose Your Subscription</h2>
      <p className="subscribe-subtitle">
        Unlock exclusive features and enhance your experience with our tailored plans!
      </p>
      <div className="subscribe-cards-container">
        {plans.map((plan, index) => (
          <div className="subscribe-card" key={index}>
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
