import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const FeaturePageShell = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent = "from-cyan-400 to-blue-500",
  stats = [],
  children,
}) => {
  const rootRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".feature-reveal, .feature-panel", { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        ".feature-reveal",
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".feature-panel",
        { autoAlpha: 0, y: 22, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      gsap.to(".feature-orbit", {
        y: -9,
        rotate: 2,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden px-3 py-5 sm:px-5 sm:py-8">
      <div className="ambient-grid absolute inset-0 -z-20" />
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-5 pb-7 lg:grid-cols-[1fr_360px] lg:items-stretch">
          <div className="feature-reveal rounded-[1.75rem] border border-white bg-white/78 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase text-slate-600 shadow-sm">
              {Icon && <Icon className="h-4 w-4 text-cyan-600" />}
              {eyebrow}
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">
              {description}
            </p>
          </div>

          <div className="feature-reveal relative overflow-hidden rounded-[1.75rem] border border-white bg-slate-950 p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className={`feature-orbit grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${accent} shadow-2xl`}>
              {Icon && <Icon className="h-9 w-9" />}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <p className="text-2xl font-black">{item.value}</p>
                  <p className="mt-1 text-[11px] font-black uppercase text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className={`absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-gradient-to-br ${accent} opacity-30 blur-3xl`} />
          </div>
        </div>

        <div className="feature-panel rounded-[1.75rem] border border-white bg-white/80 p-4 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-6">
          {children}
        </div>
      </section>
    </div>
  );
};

export default FeaturePageShell;
