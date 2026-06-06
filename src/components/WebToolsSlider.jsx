import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const WebToolsSlider = () => {
  const sliderRef = useRef(null);
  const slidesRef = useRef([]);

  const sliderData = [
    {
      title: "Responsive images",
      description: "Generate clean srcsets for sharper, faster pages.",
      accent: "from-cyan-400 to-blue-500",
    },
    {
      title: "Smaller assets",
      description: "Compress images while keeping the visual punch.",
      accent: "from-lime-300 to-emerald-500",
    },
    {
      title: "Perfect dimensions",
      description: "Resize batches into production-ready formats.",
      accent: "from-amber-300 to-orange-500",
    },
    {
      title: "Instant PDFs",
      description: "Turn selected files into crisp downloadable PDFs.",
      accent: "from-rose-300 to-fuchsia-500",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = slidesRef.current.filter(Boolean);
      gsap.set(slides, { autoAlpha: 0, y: 18, scale: 0.96 });
      gsap.set(slides[0], { autoAlpha: 1, y: 0, scale: 1 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, delay: 0.6 });

      slides.forEach((slide, index) => {
        const next = slides[(index + 1) % slides.length];
        tl.to(slide, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        })
          .to(slide.querySelector(".slider-progress"), {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 3.2,
            ease: "none",
          })
          .to(slide, {
            autoAlpha: 0,
            y: -18,
            scale: 1.02,
            duration: 0.45,
            ease: "power3.in",
          })
          .set(slide.querySelector(".slider-progress"), { scaleX: 0 })
          .set(next, { y: 18, scale: 0.96 });
      });
    }, sliderRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sliderRef}
      className="relative min-h-[180px] w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:min-h-[220px] sm:p-7"
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.12),rgba(190,242,100,0.16),rgba(251,113,133,0.12))]" />
      <div className="absolute left-5 top-5 flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
      </div>
      <div className="relative h-[150px] sm:h-[186px]">
        {sliderData.map((slide, index) => (
          <div
            key={index}
            ref={(el) => (slidesRef.current[index] = el)}
            className="absolute inset-0 flex h-full flex-col justify-end opacity-0"
          >
            <div className={`mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br ${slide.accent} shadow-lg`} />
            <h3 className="text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
              {slide.title}
            </h3>
            <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-slate-600 sm:text-base">
              {slide.description}
            </p>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
              <div className={`slider-progress h-full origin-left scale-x-0 rounded-full bg-gradient-to-r ${slide.accent}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebToolsSlider;
