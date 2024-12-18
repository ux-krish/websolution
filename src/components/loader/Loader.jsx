import React, { useEffect } from 'react';
import { gsap } from 'gsap'; // Import GSAP
import BackgroundAnimation from '../BackgroundAnimation';

const Loader = () => {
  useEffect(() => {
    
    gsap.fromTo(
      ".loading-overlay",
      { opacity: 0 }, 
      {
        opacity: 1, 
        duration: 1, 
        ease: "power4.out", 
      }
    );

    // gsap.fromTo(
    //     ".zoomeff",
    //     { opacity: 0, scale: 0.8 }, 
    //     {
    //       opacity: 1,
    //       scale: 2, 
    //       stagger: 0.5, 
    //       duration: 2, 
    //       ease: "power1.out", 
    //     }
    //   );

    gsap.fromTo(
      ".animate-spin-gradient",
      { rotation: 0 }, 
      {
        rotation: 360, 
        repeat: -1, 
        duration: 2, 
        ease: "linear", 
      }
    );

    gsap.fromTo(
      ".text-container",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1, 
        scale: 1, 
        duration: 1, 
        ease: "power4.out", 
        delay: 0.5, 
      }
    );
  }, []);

  return (
    <div className="loading-overlay absolute top-0 left-0 w-full h-full overflow-hidden text-white flex items-center justify-center z-50">
      <BackgroundAnimation className="opacity-60" />
      <div className="max-w-[250px] mx-auto rounded-full relative overflow-hidden zoomeff">
        <div className="animate-spin-gradient bg-gradient-to-bl from-[#ff67fa] via-[#9df4ff] to-[#ffe77a] rounded-full max-w-[200px] h-[50px] absolute left-0 right-0 top-0 bottom-0 m-auto -z-10"></div>
        <div className="bg-white rounded-full flex items-center justify-center py-2 pr-6 pl-2 space-x-2 m-1 ">
          <div className="relative w-9 h-9 p-1 ">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8bcdff] via-[#9df4ff] to-[#ff67fa] rounded-full animate-spin-gradient"></div>
            <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center border border-white">
              <div className="text-black px-1 text-[14px] font-black tracking-wider">
                WS
              </div>
            </div>
          </div>
          <div className="text-container text-sm leading-[13px] md:leading-4 tracking-wider font-extrabold text-black antialiased">
            Web<br />Solution
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
