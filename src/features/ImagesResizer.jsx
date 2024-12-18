import React, { useState, useEffect } from "react";
import { FaUpload, FaTimes, FaDownload, FaSync } from "react-icons/fa";
import jszip from "jszip";
import { saveAs } from "file-saver";
import gsap from "gsap";

const ImageResizer = () => {
  const [images, setImages] = useState([]);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percentage, setPercentage] = useState(100);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [activeTab, setActiveTab] = useState("dimensions");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".loading-overlay",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      }
    );

    gsap.fromTo(
      ".anim-button",
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1, // Scale to 100% (original size)
        stagger: 0.2, // Stagger the animation for each element
        duration: 0.3, // Animation duration
        ease: "power4.out", // Smooth easing
      }
    );
    gsap.fromTo(
      ".feature-box",
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0, 
        stagger: 2, 
        duration: 1, 
        ease: "power3.out", 
      }
    );
    
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      return new Promise((resolve) => {
        img.onload = () => {
          resolve({
            file,
            url,
            name: file.name,
            originalWidth: img.width,
            originalHeight: img.height,
            resizedWidth: null,
            resizedHeight: null,
            resizedBlob: null,
          });
        };
      });
    });

    Promise.all(newImages).then((loadedImages) =>
      setImages((prev) => [...prev, ...loadedImages])
    );
  };

  const handleResize = () => {
    if (activeTab === "dimensions" && !width && !height) {
      setShowPopup(true);
      return;
    }
  
    const updatedImages = images.map((image) => {
      let newWidth;
      let newHeight;
  
      if (activeTab === "dimensions") {
        newWidth = parseInt(width, 10) || image.originalWidth;
        newHeight = parseInt(height, 10) || image.originalHeight;
  
        if (maintainAspectRatio) {
          const aspectRatio = image.originalWidth / image.originalHeight;
          if (width && !height) {
            newHeight = Math.round(newWidth / aspectRatio);
          } else if (height && !width) {
            newWidth = Math.round(newHeight * aspectRatio);
          }
        }
      } else if (activeTab === "percentage") {
        newWidth = Math.round((image.originalWidth * percentage) / 100);
        newHeight = Math.round((image.originalHeight * percentage) / 100);
      }
  
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
  
      // Ensure high-quality image resizing and preserve transparency
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
  
      // Clear canvas to ensure transparency
      ctx.clearRect(0, 0, newWidth, newHeight);
  
      const img = new Image();
      img.src = image.url;
  
      return new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          canvas.toBlob(
            (blob) => {
              resolve({
                ...image,
                resizedWidth: newWidth,
                resizedHeight: newHeight,
                resizedBlob: blob,
              });
            },
            "image/png", // Use PNG to retain transparency
            1.0 // PNG quality is lossless, so this value doesn't affect it
          );
        };
      });
    });
  
    Promise.all(updatedImages).then((resizedImages) => setImages(resizedImages));
  };
  

  const handleDownload = (image) => {
    const blobUrl = URL.createObjectURL(image.resizedBlob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = image.name;
    a.click();
  };

  const handleDownloadAll = () => {
    const zip = new jszip();
    const folder = zip.folder("resized-images");

    images.forEach((image) => {
      if (image.resizedBlob) {
        folder.file(image.name, image.resizedBlob);
      }
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "resized-images.zip");
    });
  };

  const Popup = ({ message, onClose }) => (
    <div className="fixed loading-overlay inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-6">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-black rounded-full bg-black hover:bg-rose-300 p-1 "
        >
          <FaTimes className="w-4 h-4" />
        </button>
        <p className="text-gray-800 text-lg font-semibold mt-5 pb-3">
          {message}
        </p>
      </div>
    </div>
  );

  const handleReset = () => {
    setImages([]);
    setWidth("");
    setHeight("");
    setPercentage(100);
    setMaintainAspectRatio(true);
    setActiveTab("dimensions");
  };

  return (
    <>
      <div className="mx-auto max-w-xl p-4 sm:p-6 text-center">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Image Resizer
        </h1>

        <div className="mb-10 mx-auto ">
          <label
            htmlFor="file-upload"
            className="feature-box mx-auto shadow-lg hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:bg-white"
          >
            <FaUpload className="text-3xl text-gray-600 mb-2" />
            <span className="text-neutral-600">Click to upload images</span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <button
          onClick={handleReset}
          className="anim-button flex mb-10 items-center justify-center mx-auto mt-4 px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
        >
          <FaSync className="mr-2" />
          Reset Images
        </button>
        <div className="flex mb-6 flex-1 w-full">
          <button
            onClick={() => setActiveTab("dimensions")}
            className={`anim-button flex-1 h-14 px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl rounded-r-none border-r-0 hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200 ${
              activeTab === "dimensions"
                ? "bg-black text-white border-black"
                : "bg-neutral-200 text-neutral-800"
            }`}
          >
            By Dimensions
          </button>
          <button
            onClick={() => setActiveTab("percentage")}
            className={`anim-button flex-1 h-14 px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl rounded-l-none hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200 ${
              activeTab === "percentage"
                ? "bg-black text-white border-black"
                : "bg-neutral-200 text-neutral-800"
            }`}
          >
            By Percentage
          </button>
        </div>

        {activeTab === "dimensions" && (
          <div className="flex flex-wrap items-center justify-between">
            <label className="flex-1 w-full">
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
                className="flex-1 h-14 w-full px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-r-none border-r-0 rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
                disabled={maintainAspectRatio && height !== ""}
              />
            </label>

            <label className="flex-1 w-full">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
                className="flex-1 h-14 w-full px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-l-none rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
                disabled={maintainAspectRatio && width !== ""}
              />
            </label>

            <label className="flex items-center w-full text-center justify-center my-6">
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={() => {
                  setMaintainAspectRatio(!maintainAspectRatio);
                  setWidth(""); 
                  setHeight("");
                }}
                className="mr-2"
              />
              Maintain Aspect Ratio
            </label>
          </div>
        )}

        {activeTab === "percentage" && (
          <div className="space-y-4 mt-10 py-4 rounded-xl border-dashed border-2 border-neutral-600">
            <label className="block font-semibold text-neutral-700 text-lg">
              Resize by Percentage
            </label>
            <div className="relative max-w-80 mx-auto">
              <input
                type="range"
                min="1"
                max="200"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full h-2 bg-gradient-to-r from-red-400 via-green-300 to-indigo-500 rounded-lg appearance-none cursor-pointer transition-shadow duration-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-white"
              />
            </div>
            <p
              className="text-center text-lg font-bold border-8 border-dashed border-neutral-50 text-white mt-4 bg-neutral-50 rounded-full p-1 w-full max-w-24 justify-center inline-flex transition-transform transform"
              style={{
                backgroundColor: `hsl(${(percentage / 100) * 120}, 70%, 65%)`, // Dynamic color transition from green to red
              }}
            >
              {percentage}%
            </p>
          </div>
        )}

        {images.length > 0 && (
          <button
            onClick={handleResize}
            className="elem mt-6 px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
          >
            Resize Images
          </button>
        )}

        <div className="mt-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-gradient-to-tr from-green-300/15 via-blue-500/15 to-rose-500/15 flex items-center justify-between space-x-4 mb-4 rounded-xl border-2 border-dashed border-neutral-500 text-neutral-800 px-4 py-4"
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-20 h-20 object-cover rounded-xl border-2 border-dashed border-neutral-500 text-neutral-800"
              />
              <div className="text-end text-neutral-600 flex-1">
                <p className="font-bold">{image.name}</p>
                <p className="font-semibold">
                  Original:{" "}
                  <span className="text-indigo-600">
                    {image.originalWidth} x {image.originalHeight}
                  </span>
                </p>
                {image.resizedWidth && (
                  <p className="font-semibold">
                    Resized:{" "}
                    <span className="text-green-600">
                      {image.resizedWidth} x {image.resizedHeight}
                    </span>
                  </p>
                )}
              </div>
              {image.resizedBlob && (
                <button
                  onClick={() => handleDownload(image)}
                  className="px-4 py-4 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-500 hover:text-indigo-800 hover:bg-indigo-500/30 shadow-md hover:shadow-xl transition-shadow duration-200"
                >
                  <FaDownload className="" />
                </button>
              )}
            </div>
          ))}
        </div>

        {images.some((image) => image.resizedBlob) && (
          <button
            onClick={handleDownloadAll}
            className="flex items-center justify-center mx-auto elem mt-10 px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
          >
            <FaDownload className="mr-2" />
            Download All as ZIP
          </button>
        )}
      </div>

      {showPopup && (
        <Popup
          message="Please provide dimensions or adjust the percentage."
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default ImageResizer;
