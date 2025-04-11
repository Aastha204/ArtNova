import { useState } from "react";
import "./Contact.css";

import { FaHome } from "react-icons/fa";  

const ContactForm = () => {
  const [flipCard, setFlipCard] = useState(false);
 
  return (
    <div className="container">
      <div className="home-button1" onClick={() => window.location.href = "/"}>
            <FaHome />
          </div>
      {/* Left Side - Contact Information */}
      <div className="contact-info">
        <h2>CONTACT US</h2>
        <p>
          We are sorry to hear that you are facing some problem. Our team is
          available to resolve your issues and will reply to you within 24
          hours. Till then, please send us your enquiry, and we will be happy
          to assist you with full support. Till then, please enjoy :)
        </p>
      </div>

      {/* Right Side - Contact Form */}
      <div className="contact-wrapper">
        <div className={`envelope ${flipCard ? "active" : ""}`}>
          <div className="back paper"></div>
          <div className="content">
            <div className="form-wrapper">
              <form>
                <div className="top-wrapper">
                  <div className="input">
                    <label>Name</label>
                    <input type="text" name="name" />
                  </div>
                  <div className="input">
                    <label>Phone</label>
                    <input type="text" name="phone" />
                  </div>
                  <div className="input">
                    <label>Email</label>
                    <input type="text" name="_replyto" />
                  </div>
                </div>
                <div className="bottom-wrapper">
                  <div className="input">
                    <label>Subject</label>
                    <input type="text" name="_subject" />
                  </div>
                  <div className="input">
                    <label>Message</label>
                    <textarea rows="5" name="message"></textarea>
                  </div>
                  <div className="submit">
                    <div
                      className="submit-card"
                      onClick={() => setFlipCard(!flipCard)}
                    >
                      Send Mail
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="front paper"></div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
