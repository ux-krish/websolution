import React, { useEffect } from "react";
import { IoIosImages } from "react-icons/io";
import { TbImageInPicture } from "react-icons/tb";
import { MdPictureAsPdf } from "react-icons/md";
import { GiResize } from "react-icons/gi";
import { HiArrowSmRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import gsap from "gsap";
import BackgroundAnimation from "./BackgroundAnimation";
import WebToolsSlider from "./WebToolsSlider";

const MainContent = () => {
  // const projects = [
  //   {
  //     id: 1,
  //     name: "Game Blogs",
  //     url: "https://ux-krish.github.io/gameblog/",
  //     icon: "🎮",
  //   },
  //   {
  //     id: 2,
  //     name: "Project Management",
  //     url: "https://ux-krish.github.io/projectmanagement/",
  //     icon: "💻",
  //   },
  //   {
  //     id: 3,
  //     name: "Weather App",
  //     url: "https://ux-krish.github.io/iweather/",
  //     icon: "☁️",
  //   },
  // ];

  useEffect(() => {
    gsap.fromTo(
      ".solution-box, .project-box",
      { opacity: 0, scale: 0 }, // Start with opacity 0 and scale 0
      {
        opacity: 1,
        scale: 1, // Scale to 100% (original size)
        stagger: 0.3, // Stagger the animation for each element
        duration: 0.6, // Animation duration
        ease: "power4.out", // Smooth easing
      }
    );
    gsap.fromTo(
      ".feature-box",
      { opacity: 0, x: -100 }, // Start with opacity 0 and slide in from the left
      {
        opacity: 1,
        x: 0, // Slide to its original position
        stagger: 2, // Stagger the animation for each element
        duration: 1, // Animation duration
        ease: "power3.out", // Smooth easing
      }
    );

  }, []);

  return (
        <div className="feature-box">
          <WebToolsSlider/>
          <h2 className="text-xl font-bold my-4 max-w-3xl mx-auto px-3 text-neutral-800">
            Solutions
          </h2>
          <div className="grid gap-5 max-w-3xl mx-auto grid-cols-2 px-3 mb-8 sm:mb-12">
            <Link
              to="/image-srcset-generator"
              className="solution-box relative overflow-hidden border-2 group border-dashed border-neutral-600 bg-white bg-no-repeat bg-cover bg-center backdrop-blur-lg rounded-lg p-4 text-center sm:p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-neutral-600 md:min-h-64 min-h-24"
            >
              <BackgroundAnimation className="invisible opacity-0  group-hover:visible group-hover:opacity-70 transition-all transform-gpu" />
              <div className="flex items-center flex-col justify-center h-full gap-3 mb-5">
                <IoIosImages className="w-16 sm:w-24 h-auto group-hover:text-neutral-600 transform-gpu transition-all ease-in-out text-blue-200" />
                <h3 className="text-[16px] sm:text-xl font-semibold sm:font-bold tracking-wide leading-5 sm:min-h-auto min-h-10">
                  Image Srcset Generator
                </h3>
                <HiArrowSmRight className="sm:w-10 sm:h-10 w-8 h-8 p-1 sm:p-2 rounded-full border-2 group-hover:bg-neutral-600 scale-90 group-hover:scale-125 group-hover:text-white transition-all border-dashed border-neutral-600 text-neutral-600 mt-0 sm:mt-5" />
              </div>
            </Link>
            <Link
              to="/image-optimizer"
              className="solution-box relative overflow-hidden border-2 group border-dashed border-neutral-600 bg-white backdrop-blur-lg rounded-lg p-4 text-center sm:p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-neutral-600 sm:min-h-64 min-h-24"
            >
              <BackgroundAnimation className="invisible opacity-0  group-hover:visible group-hover:opacity-70 transition-all transform-gpu" />
              <div className="flex items-center flex-col justify-center h-full gap-3 mb-5">
                <TbImageInPicture className="w-16 sm:w-24 h-auto group-hover:text-neutral-600 transform-gpu transition-all ease-in-out text-orange-200" />
                <h3 className="text-[16px] sm:text-xl font-semibold sm:font-bold tracking-wide leading-5 sm:min-h-auto min-h-10">
                  Image Optimizer
                </h3>
                <HiArrowSmRight className="sm:w-10 sm:h-10 w-8 h-8 p-1 sm:p-2 rounded-full border-2 group-hover:bg-neutral-600 scale-90 group-hover:scale-125 group-hover:text-white transition-all border-dashed border-neutral-600 text-neutral-600 mt-0 sm:mt-5" />
              </div>
            </Link>
            <Link
              to="/image-resizer"
              className="solution-box relative overflow-hidden border-2 group border-dashed border-neutral-600 bg-white backdrop-blur-lg rounded-lg p-4 text-center sm:p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-neutral-600 sm:min-h-64 min-h-24"
            ><BackgroundAnimation className="invisible opacity-0  group-hover:visible group-hover:opacity-70 transition-all transform-gpu" />
              <div className="flex items-center flex-col justify-center h-full gap-3 mb-5">
                <GiResize className="w-16 sm:w-24 h-auto group-hover:text-neutral-600 transform-gpu transition-all ease-in-out text-green-200" />
                <h3 className="text-[16px] sm:text-xl font-semibold sm:font-bold tracking-wide leading-5 sm:min-h-auto min-h-10">Image Resizer</h3>
                <HiArrowSmRight className="sm:w-10 sm:h-10 w-8 h-8 p-1 sm:p-2 rounded-full border-2 group-hover:bg-neutral-600 scale-90 group-hover:scale-125 group-hover:text-white transition-all border-dashed border-neutral-600 text-neutral-600 mt-0 sm:mt-5" />
              </div>
            </Link>
            <Link
              to="/pdf-maker"
              className="solution-box relative overflow-hidden border-2 group border-dashed border-neutral-600 bg-white backdrop-blur-lg rounded-lg p-4 text-center sm:p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200 text-neutral-600 sm:min-h-64 min-h-24"
            ><BackgroundAnimation className="invisible opacity-0  group-hover:visible group-hover:opacity-70 transition-all transform-gpu" />
              <div className="flex items-center flex-col justify-center h-full gap-3 mb-5">
                <MdPictureAsPdf className="w-16 sm:w-24 h-auto group-hover:text-neutral-600 transform-gpu transition-all ease-in-out text-rose-300" />
                <h3 className="text-[16px] sm:text-xl font-semibold sm:font-bold tracking-wide leading-5 sm:min-h-auto min-h-10">PDF Maker</h3>
                <HiArrowSmRight className="sm:w-10 sm:h-10 w-8 h-8 p-1 sm:p-2 rounded-full border-2 group-hover:bg-neutral-600 scale-90 group-hover:scale-125 group-hover:text-white transition-all border-dashed border-neutral-600 text-neutral-600 mt-0 sm:mt-5" />
              </div>
            </Link>
            
            
          </div>
          {/* <div className="mt-0">
            <section className="py-12 px-3">
              <div className="max-w-3xl mx-auto md:px-3">
              <h2 className="text-xl font-bold my-4 max-w-3xl mx-auto text-neutral-800">
                My Other Projects
              </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={project.url}
                      className="project-box overflow-hidden block p-6 bg-white border-2 group border-dashed border-neutral-600 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BackgroundAnimation className="invisible opacity-0  group-hover:visible group-hover:opacity-70 transition-all transform-gpu" />
                      <div className="flex items-center justify-center text-5xl mb-4">
                        {project.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 text-center">
                        {project.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div> */}
        </div>
  );
};

export default MainContent;
