
// import './App.css';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import ImageGenerator from './components/ImageGenerator/ImageGenerator';
// import SubscribePage from "./components/ImageGenerator/SubscribePage";

// function App() {
//   return (
//     <Router>
//     <div>
//       <ImageGenerator/>
//     </div>
//     <Routes>
//       <Route path="/subscribe" element={<SubscribePage/>}/>
//     </Routes>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImageGenerator from "./components/ImageGenerator/ImageGenerator";
import SubscribePage from "./components/ImageGenerator/SubscribePage"; // Ensure the correct path

function App() {
  return (
    <Router>
      <Routes>
        {/* Show ImageGenerator on the Home Route ("/") */}
        <Route path="/" element={<ImageGenerator />} />

        {/* Show SubscribePage only when the user navigates to "/subscribe" */}
        <Route path="/subscribe" element={<SubscribePage />} />
      </Routes>
    </Router>
  );
}

export default App;

