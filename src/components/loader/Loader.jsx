import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap'; // Import GSAP
import BackgroundAnimation from '../BackgroundAnimation';

const Loader = () => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".loading-overlay",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        }
      );

      // Spinning gradient halo around the brand mark
      gsap.fromTo(
        ".brand-halo",
        { rotation: 0 },
        {
          rotation: 360,
          repeat: -1,
          duration: 3,
          ease: "linear",
        }
      );

      // Brand mark entrance
      gsap.fromTo(
        ".brand-mark",
        { opacity: 0, scale: 0.7, rotate: -8 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          delay: 0.1,
        }
      );

      // "WS" letters pop
      gsap.fromTo(
        ".brand-letters span",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.6,
          ease: "back.out(2)",
          delay: 0.4,
        }
      );

      // Wordmark text reveal
      gsap.fromTo(
        ".text-container",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out",
          delay: 0.55,
        }
      );

      // Subtle float on the whole brand block
      gsap.to(".brand-block", {
        y: -8,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.8,
      });
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      className="loading-overlay absolute top-0 left-0 w-full h-full overflow-hidden text-white flex items-center justify-center z-50"
    >
      <BackgroundAnimation className="opacity-60" />

      <div className="brand-block relative flex flex-col items-center gap-5">
        {/* Brand mark — matches Header logo (dark rounded-2xl with gradient halo) */}
        <div className="relative">
          {/* Spinning gradient halo */}
          <div className="brand-halo absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyan-400 via-fuchsia-400 to-amber-300 opacity-90 blur-[2px]"></div>

          <div className="brand-mark relative grid h-20 w-20 sm:h-24 sm:w-24 place-items-center overflow-hidden rounded-2xl bg-slate-950 text-2xl sm:text-3xl font-black text-white shadow-xl shadow-cyan-500/30 ring-1 ring-white/20">
            <span className="brand-letters relative z-10 flex">
              <span>W</span>
              <span>S</span>
            </span>

            {/* Subtle inner shimmer */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="text-container text-center">
          <p className="text-base sm:text-lg font-black tracking-tight text-slate-900 antialiased">
            Web Solution
          </p>
          <p className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Creative utility studio
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
