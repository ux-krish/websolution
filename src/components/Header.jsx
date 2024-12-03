import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="py-2 md:py-4 bg-neutral-50 shadow-inner shadow-neutral-200 rounded-lg md:rounded-xl m-3 md:mx-4 md:mt-4 md:mb-1">
      <Link to="/" className="container mx-auto flex flex-col justify-center items-center px-4">
        <h1 className="text-xl md:text-2xl font-bold text-center text-slate-800">KD App Store</h1>
        <small className="block text-slate-500 text-[12px] md:text-sm">One Stop Solutions</small>
      </Link>
    </header>
  );
};

export default Header;
