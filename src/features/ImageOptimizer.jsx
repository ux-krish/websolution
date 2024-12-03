import React, { useState } from "react";
import ImageCompression from "browser-image-compression";
import JSZip from "jszip";
import { LuHardDriveDownload } from "react-icons/lu";
import { FaUpload } from "react-icons/fa";

const ImageOptimizer = () => {
  const [images, setImages] = useState([]);
  const [compressionProgress, setCompressionProgress] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [originalSizes, setOriginalSizes] = useState([]);
  const [compressedSizes, setCompressedSizes] = useState([]);
  const [maxSizeMB, setMaxSizeMB] = useState(1.2);
  const [autoOptimize, setAutoOptimize] = useState(true);

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
        quality: 0.5, // Fixed quality level
        maxSizeMB: maxSizeMB,
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
  
      // Determine maxSizeMB based on file size
      if (file.size > 2 * 1024 * 1024) {
        maxSizeMB = 0.8; // Max 800 KB
      } else if (file.size > 1.5 * 1024 * 1024) {
        maxSizeMB = 0.6; // Max 600 KB
      } else if (file.size > 1 * 1024 * 1024) {
        maxSizeMB = 0.3; // Max 300 KB
      } else if (file.size > 800 * 1024) {
        maxSizeMB = 0.1; // Max 100 KB
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
    <div className="max-w-xl mx-auto mt-8">
      <div className="flex flex-col items-center justify-center">
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200">
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
                <li key={index} className="flex items-center space-x-2 border-b pb-4">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div className="flex-1 flex flex-col gap-2">
                    <p>{image.name}</p>
                    <p>Original Size: {formatFileSize(originalSizes[index])}</p>
                    {compressedSizes[index] !== null && (
                      <p>Compressed Size: {formatFileSize(compressedSizes[index])}</p>
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
                      className="mt-2 bg-green-500 text-white p-2 w-10 h-10 flex justify-center items-center rounded-md hover:bg-blue-600"
                    >
                      <LuHardDriveDownload className="w-full h-auto" />
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
          className="mt-6 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 w-full flex justify-center items-center gap-3"
        >
          <LuHardDriveDownload className="w-4 h-auto" /> Download All Compressed Images
        </button>
      )}
    </div>
  );
};

export default ImageOptimizer;
