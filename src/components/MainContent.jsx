import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosImages } from "react-icons/io";
import { TbImageInPicture } from "react-icons/tb";
import { MdAutoAwesome, MdPictureAsPdf, MdSpeed } from "react-icons/md";
import { GiResize } from "react-icons/gi";
import { HiArrowSmRight } from "react-icons/hi";
import gsap from "gsap";
import WebToolsSlider from "./WebToolsSlider";

const tools = [
  {
    title: "Image Srcset Generator",
    description: "Create responsive image sets for modern devices.",
    to: "/image-srcset-generator",
    icon: IoIosImages,
    accent: "from-cyan-400 to-blue-500",
    badge: "Responsive",
  },
  {
    title: "Image Optimizer",
    description: "Compress heavy images into faster web assets.",
    to: "/image-optimizer",
    icon: TbImageInPicture,
    accent: "from-lime-300 to-emerald-500",
    badge: "Performance",
  },
  {
    title: "Image Resizer",
    description: "Resize files into precise layout dimensions.",
    to: "/image-resizer",
    icon: GiResize,
    accent: "from-amber-300 to-orange-500",
    badge: "Batch ready",
  },
  {
    title: "PDF Maker",
    description: "Convert selected images into clean PDFs.",
    to: "/pdf-maker",
    icon: MdPictureAsPdf,
    accent: "from-rose-300 to-fuchsia-500",
    badge: "Export",
  },
  {
    title: "Background Remover",
    description: "Cut image backgrounds with a focused workflow.",
    to: "/background-remover",
    icon: MdAutoAwesome,
    accent: "from-violet-300 to-cyan-500",
    badge: "AI tool",
  },
];

const stats = [
  { label: "Image tools", value: 4 },
  { label: "Export flows", value: 2 },
  { label: "Fast actions", value: 5 },
];

const MainContent = () => {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const [copied, setCopied] = useState(false);
  const heroImage = `${process.env.PUBLIC_URL}/ai1.jpeg`;

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".hero-reveal, .tool-card, .stat-card", { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-reveal",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.08 }
      )
        .fromTo(
          ".stat-card",
          { autoAlpha: 0, y: 18, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08 },
          "-=0.45"
        )
        .fromTo(
          ".tool-card",
          { autoAlpha: 0, y: 32, rotateX: -8, scale: 0.96 },
          { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 0.7, stagger: 0.08 },
          "-=0.25"
        );

      gsap.to(".hero-image", {
        y: -10,
        rotate: 1.5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".orbit-chip", {
        y: -8,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
        ease: "sine.inOut",
      });

      gsap.utils.toArray(".stat-value").forEach((item) => {
        const target = Number(item.dataset.count || 0);
        gsap.fromTo(
          item,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.3,
            snap: { textContent: 1 },
            ease: "power2.out",
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleCardMove = (event, index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: -y * 8,
      rotateY: x * 8,
      y: -8,
      duration: 0.35,
      ease: "power3.out",
      transformPerspective: 900,
    });

    gsap.to(card.querySelector(".tool-glow"), {
      x: x * 70,
      y: y * 70,
      opacity: 0.85,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  const handleCardLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.45,
      ease: "elastic.out(1, 0.45)",
    });

    gsap.to(card.querySelector(".tool-glow"), {
      x: 0,
      y: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Web Solution", url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div ref={rootRef} className="relative overflow-hidden px-3 py-5 sm:px-5 sm:py-8">
      <div className="ambient-grid absolute inset-0 -z-20" />

      <section className="mx-auto grid min-h-[calc(100vh-170px)] max-w-6xl items-center gap-8 pb-8 pt-2 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-black uppercase text-slate-600 shadow-sm backdrop-blur">
            <MdSpeed className="h-4 w-4 text-cyan-600" />
            Creative web tools
          </div>

          <h1 className="hero-reveal mt-5 max-w-3xl text-5xl font-black leading-[0.95] text-slate-950 sm:text-6xl lg:text-7xl">
            Web Solution
          </h1>

          <p className="hero-reveal mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            A polished workspace for turning image and PDF chores into fast, focused production flows.
          </p>

          <div className="hero-reveal mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#solutions"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-cyan-950"
            >
              Open tools
              <HiArrowSmRight className="h-5 w-5" />
            </a>
            <button
              onClick={handleShare}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
            >
              {copied ? "Link copied" : "Share app"}
            </button>
          </div>

          <div className="hero-reveal mt-8 grid max-w-xl grid-cols-3 gap-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="stat-card rounded-[1.25rem] border border-white bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              >
                <p className="stat-value text-3xl font-black text-slate-950" data-count={item.value}>
                  0
                </p>
                <p className="mt-1 text-xs font-bold uppercase text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-reveal relative">
          <div className="absolute -right-3 top-4 z-20 hidden rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase text-white shadow-xl sm:block orbit-chip">
            Live studio
          </div>
          <div className="absolute -left-2 bottom-16 z-20 hidden rounded-full bg-white px-4 py-2 text-xs font-black uppercase text-slate-700 shadow-xl sm:block orbit-chip">
            Smart previews
          </div>
          <div className="hero-image relative overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
            <img
              src={heroImage}
              alt="AI creative tool illustration"
              className="h-[320px] w-full rounded-[1.5rem] object-cover sm:h-[420px]"
            />
            <div className="absolute inset-x-5 bottom-5">
              <WebToolsSlider />
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="mx-auto max-w-6xl pb-16">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase text-cyan-700">Solutions</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Choose a tool</h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-slate-600">
            Move from upload to output with focused utilities built for everyday web production.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.title}
                ref={(el) => (cardRefs.current[index] = el)}
                to={tool.to}
                onMouseMove={(event) => handleCardMove(event, index)}
                onMouseLeave={() => handleCardLeave(index)}
                className="tool-card group relative min-h-[250px] overflow-hidden rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.1)] outline-none backdrop-blur-xl transition focus-visible:ring-4 focus-visible:ring-cyan-200"
              >
                <div className={`tool-glow pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${tool.accent} opacity-0 blur-2xl`} />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${tool.accent} text-white shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase text-slate-500">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-2xl font-black leading-tight text-slate-950">{tool.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{tool.description}</p>
                    <div className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:scale-110 group-hover:bg-cyan-950">
                      <HiArrowSmRight className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MainContent;
