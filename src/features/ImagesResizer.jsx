import React, { useState, useRef } from 'react';
import { FaUpload } from 'react-icons/fa';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageResizer = () => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null); // Track aspect ratio for cropping
  const [cropMode, setCropMode] = useState('free'); // Tracks current mode: 'free' or 'aspect-ratio'
  const [fileFormat, setFileFormat] = useState('image/jpeg'); // Default format
  const cropperRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Only single image
    setImage(file);
    setCroppedImage(null); // Clear cropped image on new upload
    setCropMode('free'); // Reset crop mode to free after uploading new image
  };

  // Handle crop functionality
  const handleCrop = (e) => {
    e.preventDefault(); // Prevent form submission and page reload

    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();

      if (croppedCanvas) {
        // Convert to selected file format
        const croppedImageData = croppedCanvas.toDataURL(fileFormat);
        setCroppedImage(croppedImageData); // Store cropped image data URL
      } else {
        console.error('Failed to get cropped canvas');
      }
    }
  };

  // Function to handle download of cropped image
  const downloadCroppedImage = () => {
    const a = document.createElement('a');
    a.href = croppedImage;
    a.download = `cropped_image.${fileFormat.split('/')[1]}`; // Extract file extension from MIME type
    a.click();
  };

  // Toggle free mode for cropping (no aspect ratio)
  const toggleFreeMode = () => {
    setCropMode('free'); // Set crop mode to free
    setAspectRatio(null); // Clear aspect ratio when switching to free mode
  };

  // Change aspect ratio for cropping
  const handleAspectRatio = (ratio) => {
    setAspectRatio(ratio);
    setCropMode('aspect-ratio'); // Set crop mode to aspect ratio
  };

  // Change file format for download
  const handleFileFormatChange = (e) => {
    setFileFormat(e.target.value);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">HD Image Resizer & Cropper</h1>
      <div className="mb-6">
        <div className="flex flex-col items-center justify-center">
          <label
            htmlFor="file-upload"
            className="shadow-lg hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-white"
          >
            <FaUpload className="text-3xl text-gray-600 mb-2" />
            <span className="text-gray-600">Click to upload an image</span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Aspect Ratio Controls */}
      {image && (
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={toggleFreeMode}
            className={`px-4 py-2 ${cropMode === 'free' ? 'bg-red-500/30' : 'bg-transparent'} px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200`}
          >
            {cropMode === 'free' ? 'Free Mode: ON' : 'Free Mode: OFF'}
          </button>
          <button
            onClick={() => handleAspectRatio(1 / 1)}
            className={`px-4 py-2 ${aspectRatio === 1 / 1 ? 'bg-indigo-500/40' : 'bg-transparent'} px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200`}
          >
            1:1
          </button>
          <button
            onClick={() => handleAspectRatio(16 / 9)}
            className={`px-4 py-2 ${aspectRatio === 16 / 9 ? 'bg-indigo-500/40' : 'bg-transparent'} px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200`}
          >
            16:9
          </button>
          <button
            onClick={() => handleAspectRatio(4 / 3)}
            className={`px-4 py-2 ${aspectRatio === 4 / 3 ? 'bg-indigo-500/40' : 'bg-transparent'} px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200`}
          >
            4:3
          </button>
        </div>
      )}

      <div className="mt-4">
        {image && (
          <div>
            <h3 className="text-xl font-semibold mb-4 mt-10 text-center">Uploaded Image</h3>
            <div className="relative flex justify-center flex-wrap max-w-md mx-auto px-4">
              <Cropper
                src={URL.createObjectURL(image)}
                ref={cropperRef}
                aspectRatio={cropMode === 'free' ? undefined : aspectRatio} // Free mode or set aspect ratio
                guides={false}
                cropBoxResizable={true}
                cropBoxMovable={true}
                zoomable={true} // Allow zooming
              />
              <button
                onClick={handleCrop}
                className="mt-10 mb-14 px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
              >
                Crop Image
              </button>
            </div>
          </div>
        )}
      </div>

      {croppedImage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={downloadCroppedImage}
            className="px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl bg-lime-100 active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
          >
            Download Cropped Image
          </button>
        </div>
      )}

      {/* File Format Selection */}
      {image && (
        <div className="mt-4 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2">Select Image Format</h3>
          <div className="flex justify-center space-x-4">
            <select
              value={fileFormat}
              onChange={handleFileFormatChange}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
              <option value="image/avif">AVIF</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageResizer;
