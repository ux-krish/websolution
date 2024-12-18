import React, { useState, useEffect } from "react";
import ImageCompression from "browser-image-compression";
import JSZip from "jszip";
import { LuHardDriveDownload } from "react-icons/lu";
import { FaUpload } from "react-icons/fa";
import gsap from "gsap";

const ImageOptimizer = () => {
  const [images, setImages] = useState([]);
  const [compressionProgress, setCompressionProgress] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [originalSizes, setOriginalSizes] = useState([]);
  const [compressedSizes, setCompressedSizes] = useState([]);
  const [maxSizeMB, setMaxSizeMB] = useState(1.2);
  const [autoOptimize, setAutoOptimize] = useState(true);

  useEffect(() => {
    gsap.fromTo(
      ".box",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.5,
        ease: "power4.out",
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setCompressionProgress(new Array(files.length).fill(0));
    setImages(files);
    setOriginalSizes(files.map((file) => file.size));
    setCompressedImages(new Array(files.length).fill(null));
    setCompressedSizes(new Array(files.length).fill(null));

    if (autoOptimize) {
      await autoOptimizeImages(files);
    } else {
      await compressImages(files);
    }
  };

  const compressImages = async (files) => {
    const updatedProgress = [...compressionProgress];
    const updatedCompressedImages = [...compressedImages];
    const updatedCompressedSizes = [...compressedSizes];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const options = {
        useWebWorker: true,
        maxSizeMB: maxSizeMB,
        quality: file.size > 2 * 1024 * 1024 ? 0.7 : 0.8, 
      };
      

      try {
        const compressedFile = await ImageCompression(file, options);
        updatedProgress[i] = 100;
        updatedCompressedImages[i] = compressedFile;
        updatedCompressedSizes[i] = compressedFile.size;
        setCompressionProgress([...updatedProgress]);
        setCompressedImages([...updatedCompressedImages]);
        setCompressedSizes([...updatedCompressedSizes]);
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    }
  };

  const autoOptimizeImages = async (files) => {
    const updatedProgress = [...compressionProgress];
    const updatedCompressedImages = [...compressedImages];
    const updatedCompressedSizes = [...compressedSizes];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let maxSizeMB;
  

      if (file.size > 2 * 1024 * 1024) {
        maxSizeMB = 0.8; 
      } else if (file.size > 1.5 * 1024 * 1024) {
        maxSizeMB = 0.6; 
      } else if (file.size > 1 * 1024 * 1024) {
        maxSizeMB = 0.3; 
      } else if (file.size > 800 * 1024) {
        maxSizeMB = 0.1; 
      } else {
        maxSizeMB = file.size / (1024 * 1024); // No compression for smaller files
      }
  
      const options = {
        useWebWorker: true,
        maxSizeMB: maxSizeMB, // Set max size dynamically
      };
  
      try {
        const compressedFile = await ImageCompression(file, options);
        updatedProgress[i] = 100;
        updatedCompressedImages[i] = compressedFile;
        updatedCompressedSizes[i] = compressedFile.size;
        setCompressionProgress([...updatedProgress]);
        setCompressedImages([...updatedCompressedImages]);
        setCompressedSizes([...updatedCompressedSizes]);
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    }
  };
  

  const getFileExtension = (filename) => {
    const parts = filename.split(".");
    return parts[parts.length - 1];
  };

  const downloadAllCompressedImages = async () => {
    const zip = new JSZip();

    for (let i = 0; i < compressedImages.length; i++) {
      const image = compressedImages[i];
      const fileName = `${images[i].name.split(".")[0]}_compressed.${getFileExtension(images[i].name)}`;

      if (image) {
        zip.file(fileName, image);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "compressed_images.zip";
      link.click();
    });
  };

  const formatFileSize = (size) => {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-xl mx-auto mt-8 feature-box">
      <h1 className="text-2xl font-bold mb-8 text-center ">Image Optimizer</h1>
      <div className="flex flex-col items-center justify-center">
        <label htmlFor="file-upload" className="box shadow-lg hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-white">
          <FaUpload className="text-3xl text-gray-600 mb-2" />
          <span className="text-gray-600">Click to upload single/multiple images</span>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-center">
        <label className="flex items-center gap-2">
          <input
            className="size-4 accent-purple-600 relative top-[2px]"
            type="checkbox"
            checked={autoOptimize}
            onChange={() => setAutoOptimize(!autoOptimize)}
          />
          <span className="text-lg font-semibold select-none">Auto Optimize</span>
        </label>
      </div>

      {!autoOptimize && (
        <div className="mt-6">
          <label htmlFor="maxSizeMB" className="block text-lg font-semibold">
            Max File Size: {maxSizeMB} MB
          </label>
          <input
            type="range"
            id="maxSizeMB"
            min="0.1"
            max="2"
            step="0.1"
            value={maxSizeMB}
            onChange={(e) => setMaxSizeMB(Number(e.target.value))}
            className="w-full mt-2 accent-purple-600"
          />
        </div>
      )}

      <div className="mt-4">
        {images.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Uploaded Images:</h2>
            <ul className="space-y-4 mt-4">
              {images.map((image, index) => (
                <li key={index} className="flex items-center space-x-2 pb-4 bg-gradient-to-r from-white/60 to-pink-500/5 p-4 rounded-xl border-dashed border-2 border-neutral-400">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    className="h-18 w-16 object-cover rounded-lg shadow-md border-2 border-neutral-500 border-dashed"
                  />
                  <div className="flex-1 flex flex-col gap-1">
                    <p className="font-semibold">{image.name}</p>
                    <p className="text-[12px]">Original Size: <span className="font-semibold text-indigo-600">{formatFileSize(originalSizes[index])}</span></p>
                    {compressedSizes[index] !== null && (
                      <p className="text-[12px] mb-2">Compressed Size: <span className="font-semibold text-green-600">{formatFileSize(compressedSizes[index])}</span></p>
                    )}
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${compressionProgress[index]}%` }}
                      ></div>
                    </div>
                  </div>
                  {compressionProgress[index] === 100 && compressedImages[index] && (
                    <a
                      href={URL.createObjectURL(compressedImages[index])}
                      download={`${image.name.split(".")[0]}_compressed.${getFileExtension(image.name)}`}
                      className="group mt-2 w-10 h-10 flex justify-center items-center px-2 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
                    >
                      <LuHardDriveDownload className="w-full h-auto text-neutral-600 group-hover:text-indigo-800" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {compressedImages.length > 0 && compressedImages.every((img) => img !== null) && (
        <button
          onClick={downloadAllCompressedImages}
          className="mt-6 px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl bg-lime-100 active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200 w-full flex justify-center items-center gap-3"
        >
          <LuHardDriveDownload className="w-4 h-auto" /> Download All Compressed Images
        </button>
      )}
    </div>
  );
};

export default ImageOptimizer;
