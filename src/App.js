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
      <div className="flex flex-col max-h-screen min-h-screen bg-gradient-to-br bg-white text-neutral-800 antialiased">
        {isLoading && (
          <Loader />
        )}
        {!isLoading && (
          <>
            <Header />
            <main className={`overflow-y-auto max-h-screen relative isolate flex-1 p-2 md:px-4 md:py-4 bg-neutral-50 shadow-inner shadow-neutral-200 rounded-lg md:rounded-xl m-3 md:m-4 mt-0 mb-0`}>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
              </div>
              

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
