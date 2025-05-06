import { useState } from "react";
import "./Contact.css";
import { FaHome } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react";


const ContactForm = () => {
  const [flipCard, setFlipCard] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const phoneRegex = /^\d{10}$/;
    const validateName = (name) => /^[a-zA-Z]+(?:[.'-]?[a-zA-Z]+)(?: [a-zA-Z]+(?:[.'-]?[a-zA-Z]+))*$/.test(name);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/.test(password);
const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com|live\.com|icloud\.com)$/.test(email);

    if(!validateName(formData.name)) {
      toast.error("Please enter a valid name.");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return false;
    }
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (formData.subject.trim().split(/\s+/).length <= 2) {
      toast.error("Subject should be more than 2 words.");
      return false;
    }
    if (formData.message.trim().split(/\s+/).length <= 5) {
      toast.error("Message should be more than 10 words.");
      return false;
    }
    return true;
  };
  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setFlipCard(true);
      try {
        const response = await fetch('http://localhost:3001/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          toast.success("Message sent successfully!");
          setFlipCard(true);
        } else {
          toast.error("Failed to send message. Please try again.");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    }
  };
  

  return (
    <>
       <div className="contact-bg">
      <ToastContainer position="top-right" autoClose={3000} />
  
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
          to assist you with full support. Till then, please co-operate :)
        </p>
        <div className="social-icons mt-6">
  <a
    href="https://linkedin.com/in/yourprofile"
    target="_blank"
    rel="noopener noreferrer"
    className="icon-link"
  >
    <Linkedin size={28} />
  </a>
  <a
    href="https://instagram.com/yourusername"
    target="_blank"
    rel="noopener noreferrer"
    className="icon-link"
  >
    <Instagram size={28} />
  </a>
  <a
    href="mailto:chhabraashita4@gmail.com"
    className="icon-link"
  >
    <Mail size={28} />
  </a>
  <a
    href="https://maps.app.goo.gl/a6cVmBWqf51GL6VT8"
    target="_blank"
    rel="noopener noreferrer"
    className="icon-link"
  >
    <MapPin size={28} />
  </a>
</div>
      </div>
     
      {/* Right Side - Contact Form */}
      <div className="contact-wrapper">
        <div className={`envelope ${flipCard ? "active" : ""}`}>
          <div className="back paper"></div>
          <div className="content">
            <div className="form-wrapper">
              <form onSubmit={handleSubmit}>
                <div className="top-wrapper">
                  <div className="input">
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="input">
                    <label>Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="input">
                    <label>Email</label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="bottom-wrapper">
                  <div className="input">
                    <label>Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
                  </div>
                  <div className="input">
                    <label>Message</label>
                    <textarea rows="5" name="message" value={formData.message} onChange={handleChange}></textarea>
                  </div>
                  <div className="submit">
                    <button type="submit" className="submit-card">
                      Send Mail
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="front paper"></div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default ContactForm;
