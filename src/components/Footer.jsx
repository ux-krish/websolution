import React from "react";

const Footer = ({className}) => {
  return (
    <footer className={`${className} py-2 md:py-4  bg-neutral-50 shadow-inner shadow-neutral-200 rounded-lg md:rounded-xl m-3 md:mx-4 md:mt-1 md:mb-4`}>
      <div className="container mx-auto text-center text-neutral-800">
        <p className="md:text-sm font-semibold text-[12px]">&copy; {new Date().getFullYear()} Web Solution. Powerd by KD</p>
      </div>
    </footer>
  );
};

export default Footer;
