import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import ImageSrcsetGenerator from "./features/ImageSrcsetGenerator";
import ImageOptimizer from "./features/ImageOptimizer";
import ImagesResizer from "./features/ImagesResizer";
import PdfMaker from "./features/Pdfmaker";
import gsap from "gsap";
import Loader from "./components/loader/Loader";
import NotFound from "./components/NotFound";
import BackgroundRemover from "./features/BackgroundRemover";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading animation
    gsap.to(".loading-overlay", {
      opacity: 0,
      duration: 2,
      delay: 1,
      ease: "power1.out",
      onComplete: () => setIsLoading(false),
    });

  
    
  }, []);

  return (
    <Router basename="/websolution">
      <div className="app-shell flex min-h-screen flex-col overflow-hidden bg-[#f7fbff] text-slate-950 antialiased">
        {isLoading && (
          <Loader />
        )}
        {!isLoading && (
          <>
            <Header />
            <main className="relative isolate flex-1 overflow-y-auto overflow-x-hidden">
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/image-srcset-generator" element={<ImageSrcsetGenerator />} />
                <Route path="/image-optimizer" element={<ImageOptimizer />} />
                <Route path="/image-resizer" element={<ImagesResizer />} />
                <Route path="/pdf-maker" element={<PdfMaker />} />
                <Route path="/background-remover" element={<BackgroundRemover />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer  />
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
