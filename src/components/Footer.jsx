import React from "react";

const Footer = () => {
  return (
    <footer className="py-4 bg-neutral-50 shadow-inner shadow-neutral-100 rounded-l-xl rounded-r-xl m-4">
      <div className="container mx-auto text-center text-slate-600">
        <p className="text-sm">&copy; {new Date().getFullYear()} KD App Store. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
