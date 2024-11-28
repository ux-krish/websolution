import React from "react";
import SneakPeek from "../section/SneakPeek";
import { IoIosImages  } from "react-icons/io";
import { WiNightSnowThunderstorm } from "react-icons/wi";
import { TbImageInPicture } from "react-icons/tb";
import { SlActionRedo } from "react-icons/sl";
import { Link } from "react-router-dom";

const MainContent = () => {

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 max-w-7xl mx-auto px-3 text-slate-800">Solutions</h2>
      <div className="grid gap-5 max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/image-srcset-generator" className="bg-white backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-slate-800">
            <div className="flex items-center justify-between gap-3 mb-5">
                <IoIosImages  className="w-6 h-auto" />
                <h3 className="text-lg font-semibold leading-4">Image srcset generator</h3>
                <SlActionRedo  className="w-6 h-6" />
            </div>
            <p className="text-sm mt-2">An image srcset generator creates multiple image versions at different resolutions and sizes for responsive web design, allowing browsers to select the best fit based on the user's device.</p>
        </Link>
        <Link to="/image-optimizer" className="bg-white backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-slate-800">
            <div className="flex items-center justify-between gap-3">
                <TbImageInPicture  className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Image Optimizer</h3>
                
                <SlActionRedo  className="w-6 h-6" />
            </div>
            <p className="text-sm mt-2">An image optimizer reduces the file size of images without compromising quality, improving website performance and load times.</p>
        </Link>
        <Link to="/live-weather" className="bg-white backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-slate-800">
            <div className="flex items-center justify-between gap-3">
                <WiNightSnowThunderstorm className="w-8 h-8" />
                <h3 className="text-lg font-semibold">Live Weather</h3>
                <SlActionRedo  className="w-6 h-6" />
            </div>
            <p className="text-sm mt-2">A live weather app provides real-time weather updates, forecasts, and other related information based on the user's location or selected area.</p>
        </Link>
      </div>
      {/* Add new feature here */}
      <div className="mt-0">
        <SneakPeek />
      </div>
    </>
  );
};

export default MainContent;
