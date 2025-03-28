// export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImageGenerator from "./components/ImageGenerator/ImageGenerator";
import SubscribePage from "./components/ImageGenerator/SubscribePage"; // Ensure the correct path
import LoginForm from "./components/ImageGenerator/login";
import SignupForm from "./components/ImageGenerator/signup";

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
      </Routes>
    </Router>
  );
}

export default App;

