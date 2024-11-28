import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import ImageSrcsetGenerator from "./features/ImageSrcsetGenerator";
import ImageOptimizer from "./features/ImageOptimizer";
import LiveWeather from "./features/LiveWeather";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br bg-white text-neutral-800">
        <Header />
        <main className="flex-1 px-4 py-4 bg-neutral-50 shadow-inner shadow-neutral-100 rounded-xl m-4 mt-0 mb-0">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/image-srcset-generator" element={<ImageSrcsetGenerator />} />
          <Route path="/image-optimizer" element={<ImageOptimizer />} />
          <Route path="/live-weather" element={<LiveWeather />} />
        </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
