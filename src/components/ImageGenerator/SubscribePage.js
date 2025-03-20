import React from "react";
import "./SubscribePage.css";

const SubscribePage = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9.99/month",
      features: ["Access to limited content", "Standard Support", "1 Device"],
    },
    {
      name: "Standard",
      price: "$19.99/month",
      features: ["Access to most content", "Priority Support", "3 Devices"],
    },
    {
      name: "Premium",
      price: "$29.99/month",
      features: ["Unlimited Access", "24/7 Support", "5 Devices"],
    },
  ];

  return (
    <div className="subscribe-page">
      <h2 className="title">Choose Your Subscription</h2>
      <div className="cards-container">
        {plans.map((plan, index) => (
          <div className="card" key={index}>
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscribePage;
