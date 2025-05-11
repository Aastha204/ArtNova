import React from "react";
import Wave from "react-wavify";
import "./SubscribePage.css";
import { FaHome } from "react-icons/fa";  
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubscribePage = () => {
  const navigate = useNavigate();
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

  const handleSubscribe = async (planType) => {
    const userId = localStorage.getItem("loggedInUserId");
    if (!userId) {
      toast.error(
        <>
          Please log in to subscribe{" "}
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </>
      );
      return;
    }
  
    try {
      console.log("Sending subscription for:", { userId, planType });
      const res = await axios.post("http://localhost:3001/api/subscribe", {
        userId,
        planType,
      });
  
      const { order } = res.data;
      console.log("Razorpay Key ID:",process.env.REACT_APP_KEY_ID,);

  
      const options = {
       key: process.env.REACT_APP_KEY_ID, // or process.env.REACT_APP_KEY_ID
        amount: order.amount,
        currency: "INR",
        name: "ArtNova",
        description: `Subscription: ${planType}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post("http://localhost:3001/api/verify", {
            userId,
            planType,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
  
          // alert(verifyRes.data.message);
          toast.success(verifyRes.data.message);
        },
        theme: { color: "#f429f2" },
      };
  
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Subscription error", err.response?.data || err.message);
      // alert(err.response?.data?.message || "Subscription failed.");
      toast.error(err.response?.data?.message || "Subscription failed.");



    }
  };
  

  return (
    <div className="subscribe-page">
     <ToastContainer />
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
            <button className="plan-subscribe-btn"  onClick={() => handleSubscribe(plan.name, plan.amount)}>Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscribePage;
