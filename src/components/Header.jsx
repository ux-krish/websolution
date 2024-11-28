import React from "react";

const Header = () => {
  return (
    <header className="py-4 bg-neutral-50 shadow-inner shadow-neutral-100  rounded-l-xl rounded-r-xl m-4">
      <div className="container mx-auto flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold text-center text-slate-800">KD App Store</h1>
        <small className="block text-slate-500 text-sm">One Stop Solutions</small>
      </div>
    </header>
  );
};

export default Header;
