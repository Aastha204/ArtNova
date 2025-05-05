// export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImageGenerator from "./components/ImageGenerator/ImageGenerator";
import SubscribePage from "./components/ImageGenerator/SubscribePage"; // Ensure the correct path
import LoginForm from "./components/ImageGenerator/login";
import SignupForm from "./components/ImageGenerator/signup";
import OTP from './components/ImageGenerator/OTP';
import UserProfile from "./components/ImageGenerator/UserProfile";
import Contact from "./components/ImageGenerator/Contact";
import About from "./components/ImageGenerator/About";

function App() {
  return (
    <Router>
      <Routes>
     
        {/* Show ImageGenerator on the Home Route ("/") */}
        <Route path="/" element={<ImageGenerator />} />

        {/* Show SubscribePage only when the user navigates to "/subscribe" */}
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/verification" element={<OTP/>}/>
        <Route path="/UserProfile" element={<UserProfile/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;

