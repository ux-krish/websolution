import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { HiArrowSmRight } from "react-icons/hi";
import gsap from "gsap";

const Header = ({className}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-item",
        { autoAlpha: 0, y: -16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header
      ref={headerRef}
      className={`${className || ""} sticky top-0 z-40 border-b border-white/80 bg-white/75 px-3 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:px-5`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {location.pathname !== "/" && (
            <button
              onClick={handleBackClick}
              className="nav-item grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 hover:shadow-md"
              aria-label="Go back"
            >
              <IoArrowBack className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="nav-item flex min-w-0 items-center gap-3">
            <div className="brand-mark relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-cyan-500/20">
              <span className="relative z-10">WS</span>
            </div>
            <div className="min-w-0">
              <p className="text-base font-black leading-4 text-slate-950 sm:text-lg">
                Web Solution
              </p>
              <p className="mt-1 hidden text-xs font-semibold uppercase text-slate-500 sm:block">
                Creative utility studio
              </p>
            </div>
          </Link>
        </div>

        <nav className="nav-item flex items-center gap-2">
          <Link
            to="/"
            className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-lime-300 hover:text-slate-950 hover:shadow-md sm:inline-flex"
          >
            Tools
          </Link>
          <Link
            to="/#solutions"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-cyan-950"
          >
            Explore
            <HiArrowSmRight className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
