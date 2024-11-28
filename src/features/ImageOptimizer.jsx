import React, { useState } from "react";
import ImageCompression from "browser-image-compression";
import JSZip from "jszip";
import { LuHardDriveDownload } from "react-icons/lu";
import { FaUpload } from 'react-icons/fa';

const ImageOptimizer = () => {
  const [images, setImages] = useState([]);
  const [compressionProgress, setCompressionProgress] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [compressionLevel, setCompressionLevel] = useState(50); // Default compression level (50%)

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setCompressionProgress(new Array(files.length).fill(0));
    setImages(files);
    setCompressedImages(new Array(files.length).fill(null)); // Reset compressed images

    await compressImages(files);
  };

  const compressImages = async (files) => {
    const updatedProgress = [...compressionProgress];
    const updatedCompressedImages = [...compressedImages];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Map the compression level (0-100) to the quality value (0.1 - 1)
      const quality = 1 - compressionLevel / 100; // Invert for correct scaling

      const options = {
        useWebWorker: true, // Enable web worker for optimization
        quality: quality, // Apply quality based on compression level
        maxSizeMB: 1.2, // Control max file size
      };

      try {
        const compressedFile = await ImageCompression(file, options);
        updatedProgress[i] = 100;
        updatedCompressedImages[i] = compressedFile; // Store compressed file
        setCompressionProgress([...updatedProgress]);
        setCompressedImages([...updatedCompressedImages]);
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    }
  };

  // Function to get the file extension
  const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  };

  // Function to download all compressed images as a zip file
  const downloadAllCompressedImages = async () => {
    const zip = new JSZip();
    
    // Add each compressed image to the zip
    for (let i = 0; i < compressedImages.length; i++) {
      const image = compressedImages[i];
      const fileName = `${images[i].name.split('.')[0]}_compressed.${getFileExtension(images[i].name)}`;
      
      if (image) {
        zip.file(fileName, image);
      }
    }
    
    // Generate the zip file
    zip.generateAsync({ type: "blob" }).then((content) => {
      // Trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "compressed_images.zip";
      link.click();
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      

        <div className="flex flex-col items-center justify-center">
            {/* Custom file input container */}
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200">
              <FaUpload className="text-3xl text-gray-600 mb-2" /> {/* Upload icon */}
              <span className="text-gray-600">Click to upload an image</span>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"  // Hide the default file input
              />
            </label>
        </div>
      
      {/* Compression Level Slider */}
      <div className="mt-6">
        <label htmlFor="compressionLevel" className="block text-lg font-semibold">
          Compression Level: {compressionLevel}%
        </label>
        <input
          type="range"
          id="compressionLevel"
          min="0"
          max="100"
          value={compressionLevel}
          onChange={(e) => setCompressionLevel(Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>
     

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
                  <div className="flex-1 flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <p>{image.name}</p>
                      <div className="bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${compressionProgress[index]}%` }}
                        ></div>
                      </div>
                    </div>
                    {/* Display download button for each compressed image */}
                    {compressionProgress[index] === 100 && compressedImages[index] && (
                      <a
                        href={URL.createObjectURL(compressedImages[index])}
                        download={`${image.name.split('.')[0]}_compressed.${getFileExtension(image.name)}`}
                        className="mt-2 bg-green-500 text-white p-2 w-10 h-10 flex justify-center items-center rounded-md hover:bg-blue-600"
                      >
                       <LuHardDriveDownload className="w-full h-auto" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Group download button */}
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
