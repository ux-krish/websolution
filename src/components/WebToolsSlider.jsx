import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WebToolsSlider = () => {
  const sliderRef = useRef(null);
  const slidesRef = useRef([]);

  const sliderData = [
    {
      title: 'Image Srcset Generator',
      description: 'Automatically generate responsive image srcsets for your images to improve performance across devices.',
    },
    {
      title: 'Image Optimizer',
      description: 'Optimize your images for faster loading times with minimal quality loss.',
    },
    {
      title: 'Image Resizer',
      description: 'Resize images without losing quality, perfectly fitting your design needs.',
    },
    {
      title: 'PDF Maker',
      description: 'Convert your documents into high-quality PDFs with a click of a button.',
    },
  ];

  useEffect(() => {
    const slides = slidesRef.current;
    const visibilityDuration = 4; // Duration (in seconds) each slide stays visible

    // Set up GSAP animation timeline for the slider
    const tl = gsap.timeline({ repeat: -1, delay: 1 }); // Loop infinitely

    slides.forEach((slide, index) => {
      tl.to(
        slide,
        {
          autoAlpha: 1, // Fade in
          duration: 1,
          ease: 'power2.inOut',
        },
        index * (visibilityDuration + 1) // Delay based on slide order
      )
        .to(
          slide,
          {
            autoAlpha: 0, // Fade out
            duration: 1,
            ease: 'power2.inOut',
          },
          index * (visibilityDuration + 1) + visibilityDuration // Fade out after visible duration
        );
    });

    return () => tl.kill(); // Cleanup on component unmount

    
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-20 px-3 overflow-hidden relative">
      <div ref={sliderRef} className="relative">
        {sliderData.map((slide, index) => (
          <div
            key={index}
            ref={(el) => (slidesRef.current[index] = el)}
            className="absolute w-full h-full flex flex-col justify-center items-center text-center opacity-0"
          >
            <h3 className="leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-[#8bcdff] 0% via-[#6cd1df] 50% to-[#ec94e9] 100% text-3xl sm:text-5xl font-bold mb-3">
              {slide.title}
            </h3>
            <p className="text-neutral-600 text-lg font-medium md:px-4 leading-relaxed">
              {slide.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebToolsSlider;
