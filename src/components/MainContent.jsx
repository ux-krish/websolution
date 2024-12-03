import React from "react";
import SneakPeek from "../section/SneakPeek";
import { IoIosImages  } from "react-icons/io";
//import { WiNightSnowThunderstorm } from "react-icons/wi";
import { TbImageInPicture } from "react-icons/tb";
import { SlActionRedo } from "react-icons/sl";
import { Link } from "react-router-dom";

const MainContent = () => {

  const projects = [
    {
      id: 1,
      name: "Game Blogs",
      url: "https://ux-krish.github.io/gameblog/",
      icon: "🎮", // Use your desired icon or image URL here
    },
    {
      id: 2,
      name: "Project Management",
      url: "https://ux-krish.github.io/projectmanagement/",
      icon: "💻",
    },
    {
      id: 3,
      name: "Weather App",
      url: "https://ux-krish.github.io/iweather/",
      icon: "☁️",
    },
  ];
  

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 max-w-7xl mx-auto px-3 text-slate-800">Solutions</h2>
      <div className="grid gap-5 max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
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
        <Link to="/image-resizer" className="bg-white backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-slate-800">
            <div className="flex items-center justify-between gap-3">
                
                <h3 className="text-lg font-semibold">Image Resizer</h3>
                <SlActionRedo  className="w-6 h-6" />
            </div>
            <p className="text-sm mt-2">Image Resizer is a simple app to quickly resize images for various purposes.</p>
        </Link>
        <Link to="/pdf-maker" className="bg-white backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-slate-800">
            <div className="flex items-center justify-between gap-3">
                
                <h3 className="text-lg font-semibold">Pdf Maker</h3>
                <SlActionRedo  className="w-6 h-6" />
            </div>
            <p className="text-sm mt-2">PDF Maker is a simple app to quickly create PDF documents from various file formats.</p>
        </Link>
      </div>
      {/* Add new feature here */}
      <div className="mt-0">
        <section className=" py-12 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">My Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={project.url}
                  className="block p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-center text-5xl mb-4">
                    {project.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    {project.name}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        <SneakPeek />
      </div>
    </>
  );
};

export default MainContent;
