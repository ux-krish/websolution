import React, { useState, useEffect } from "react";
import { FaUpload, FaTimes, FaDownload, FaSync } from "react-icons/fa";
import jszip from "jszip";
import { saveAs } from "file-saver";
import gsap from "gsap";
import FeaturePageShell from "../components/FeaturePageShell";

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
    <div className="fixed loading-overlay inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-6 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-[1.5rem] bg-white p-6 text-center shadow-2xl">
        <button
          onClick={onClose}
          className="feature-icon-button absolute right-3 top-3"
          aria-label="Close popup"
        >
          <FaTimes className="w-4 h-4" />
        </button>
        <p className="mt-8 pb-3 text-lg font-black text-slate-800">
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
    <FeaturePageShell
      eyebrow="Resize lab"
      title="Image Resizer"
      description="Resize images by exact dimensions or percentage, preserve aspect ratio, and export one file or a full ZIP."
      icon={FaSync}
      accent="from-amber-300 to-orange-500"
      stats={[
        { value: "2", label: "Modes" },
        { value: "200%", label: "Scale" },
        { value: "ZIP", label: "Export" },
      ]}
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 mx-auto">
          <label
            htmlFor="file-upload"
            className="feature-box feature-dropzone mx-auto max-w-md"
          >
            <span className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-lg">
              <FaUpload className="text-3xl" />
            </span>
            <span className="text-sm font-black uppercase text-slate-500">Upload images</span>
            <span className="mt-2 text-base font-bold text-slate-800">Choose one or many files</span>
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
          className="anim-button feature-soft-action mx-auto mb-8 mt-4"
        >
          <FaSync className="mr-2" />
          Reset Images
        </button>
        <div className="mb-6 flex w-full rounded-full bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("dimensions")}
            className={`anim-button feature-segment ${
              activeTab === "dimensions"
                ? "feature-segment-active"
                : "bg-transparent"
            }`}
          >
            By Dimensions
          </button>
          <button
            onClick={() => setActiveTab("percentage")}
            className={`anim-button feature-segment ${
              activeTab === "percentage"
                ? "feature-segment-active"
                : "bg-transparent"
            }`}
          >
            By Percentage
          </button>
        </div>

        {activeTab === "dimensions" && (
          <div className="feature-card flex flex-wrap items-center justify-between gap-y-4">
            <label className="flex-1 w-full">
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
                className="feature-input rounded-r-none"
                disabled={maintainAspectRatio && height !== ""}
              />
            </label>

            <label className="flex-1 w-full">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
                className="feature-input rounded-l-none"
                disabled={maintainAspectRatio && width !== ""}
              />
            </label>

            <label className="my-3 flex w-full items-center justify-center text-center text-sm font-black uppercase text-slate-600">
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={() => {
                  setMaintainAspectRatio(!maintainAspectRatio);
                  setWidth(""); 
                  setHeight("");
                }}
                className="mr-2 size-5 accent-orange-500"
              />
              Maintain Aspect Ratio
            </label>
          </div>
        )}

        {activeTab === "percentage" && (
          <div className="feature-card mt-6 space-y-4 py-5">
            <label className="block text-sm font-black uppercase text-slate-600">
              Resize by Percentage
            </label>
            <div className="relative max-w-80 mx-auto">
              <input
                type="range"
                min="1"
                max="200"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-orange-400 via-lime-300 to-cyan-500 transition-shadow duration-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-cyan-100"
              />
            </div>
            <p
              className="mt-4 inline-flex w-full max-w-24 justify-center rounded-full p-2 text-center text-lg font-black text-white transition-transform transform"
              style={{
                backgroundColor: `hsl(${(percentage / 100) * 120}, 70%, 55%)`,
              }}
            >
              {percentage}%
            </p>
          </div>
        )}

        {images.length > 0 && (
          <button
            onClick={handleResize}
            className="feature-action elem mt-6"
          >
            Resize Images
          </button>
        )}

        <div className="mt-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="feature-card mb-4 flex items-center justify-between gap-4 text-slate-800"
            >
              <img
                src={image.url}
                alt={image.name}
                className="h-20 w-20 rounded-2xl object-cover shadow-md"
              />
              <div className="flex-1 text-end text-slate-600">
                <p className="break-all font-black text-slate-900">{image.name}</p>
                <p className="font-semibold">
                  Original:{" "}
                  <span className="font-black text-cyan-700">
                    {image.originalWidth} x {image.originalHeight}
                  </span>
                </p>
                {image.resizedWidth && (
                  <p className="font-semibold">
                    Resized:{" "}
                    <span className="font-black text-emerald-600">
                      {image.resizedWidth} x {image.resizedHeight}
                    </span>
                  </p>
                )}
              </div>
              {image.resizedBlob && (
                <button
                  onClick={() => handleDownload(image)}
                  className="feature-icon-button"
                  aria-label={`Download ${image.name}`}
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
            className="feature-action elem mx-auto mt-10"
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
    </FeaturePageShell>
  );
};

export default ImageResizer;
