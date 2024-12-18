import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const Header = ({className}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1); // Go back to the previous page if history exists
    } else {
      navigate("/"); // Navigate to the base URL if no history
    }
  };

  return (
    <header className={`${className} py-2 md:py-4  bg-neutral-50 shadow-inner shadow-neutral-200 rounded-lg md:rounded-xl m-3 md:mx-4 md:mt-4 md:mb-1 flex justify-between items-center`}>
      {location.pathname !== "/" && (
        <button
          onClick={handleBackClick}
          className="absolute ml-4 text-neutral-600 shadow-md text-sm md:text-base group bg-white rounded-full p-2"
        >
          <IoArrowBack className="w-4 h-auto group-hover:scale-90 transition-all ease-in-out" />
        </button>
      )}
      <Link
        to="/"
        className="w-auto mx-auto flex items-end justify-center py-2 px-4 space-x-2"
      >
        <div className="border border-dashed border-black w-9 h-9">
          <div className="bg-gradient-to-r from-[#addafc] 0% via-[#a7ced3] 50% to-[#efbfed] 100% border-dashed border w-9 h-9 relative -top-[6px] -left-[6px]  text-black px-1 text-[14px] font-black tracking-wider">WS</div>
        </div>
        <div className="text-lg leading-4  tracking-wider font-extrabold">Web<br/>Solution</div>
      </Link>
    </header>
  );
};

export default Header;
