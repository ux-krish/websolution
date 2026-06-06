import React from "react";

const Footer = ({className}) => {
  return (
    <footer className={`${className || ""} border-t border-white/80 bg-white/70 px-4 py-5 backdrop-blur-2xl`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-slate-600 sm:flex-row sm:text-left">
        <p className="text-xs font-black uppercase text-slate-500">
          &copy; {new Date().getFullYear()} Web Solution. Powered by KD.
        </p>
        <div className="flex items-center gap-2 text-xs font-black uppercase">
          <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_18px_rgba(132,204,22,0.9)]" />
          Ready for production tasks
        </div>
      </div>
    </footer>
  );
};

export default Footer;
