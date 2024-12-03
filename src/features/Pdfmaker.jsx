import React, { useState } from "react";
import { FaUpload, FaTrashAlt, FaArrowUp, FaArrowDown, FaFilePdf, FaRedo } from "react-icons/fa";
import { jsPDF } from "jspdf";

const PdfMaker = () => {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState("portrait");

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      rotation: 0, // Initial rotation set to 0 degrees
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleReorder = (index, direction) => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      setImages(newImages);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleRotate = (index) => {
    const newImages = [...images];
    newImages[index].rotation = (newImages[index].rotation + 90) % 360; // Rotate by 90 degrees
    setImages(newImages);
  };

  const handleGeneratePdf = () => {
    const pdf = new jsPDF({ orientation });

    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.preview;

      img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Create a canvas to rotate the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size based on image's current rotation
        if (image.rotation === 90 || image.rotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Rotate the image on the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((image.rotation * Math.PI) / 180); // Convert degrees to radians
        ctx.drawImage(
          img,
          -img.width / 2,
          -img.height / 2,
          img.width,
          img.height
        );
        ctx.restore();

        // Now we have a rotated image on the canvas, and we can get it as data URL
        const rotatedImageUrl = canvas.toDataURL("image/jpeg");

        // Calculate the scaling factor to fit the image inside the page, maintaining aspect ratio
        const imgWidth = img.width;
        const imgHeight = img.height;

        let scaledWidth = imgWidth;
        let scaledHeight = imgHeight;

        // Scale the image to fit within the page
        if (image.rotation === 90 || image.rotation === 270) {
          // If the image is rotated 90 or 270 degrees, swap width and height for scaling
          scaledWidth = imgHeight;
          scaledHeight = imgWidth;
        }

        const scale = Math.min(pageWidth / scaledWidth, pageHeight / scaledHeight);

        const finalWidth = scaledWidth * scale;
        const finalHeight = scaledHeight * scale;

        // Center the image on the page
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        // Add the rotated image to the PDF with correct scaling
        pdf.addImage(rotatedImageUrl, "JPEG", x, y, finalWidth, finalHeight, undefined, "FAST");

        // Add a new page if there are more images
        if (index < images.length - 1) {
          pdf.addPage();
        }

        // Save the PDF when the last image is processed
        if (index === images.length - 1) {
          pdf.save("document.pdf");
        }
      };
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">PDF Maker</h1>

      <div className="mb-6">
        <div className="flex flex-col items-center justify-center">
          <label
            htmlFor="file-upload"
            className="shadow-lg hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-white"
          >
            <FaUpload className="text-3xl text-gray-600 mb-2" />
            <span className="text-gray-600">Click to upload multiple images</span>
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
      </div>

      {images.length > 0 && (
        <div className="mb-6 flex justify-center flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Reorder Images</h2>
          <ul className="space-y-4">
            {images.map((image, index) => (
              <li key={index} className="flex items-center space-x-4">
                <img
                  src={image.preview}
                  alt="Uploaded preview"
                  className="w-24 h-24 object-cover border rounded"
                  style={{ transform: `rotate(${image.rotation}deg)` }} // Rotate image in UI
                />
                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handleReorder(index, "up")}
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handleReorder(index, "down")}
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    className="p-2 bg-red-200 rounded hover:bg-red-300"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="p-2 bg-yellow-200 rounded hover:bg-yellow-300"
                    onClick={() => handleRotate(index)} // Rotate button
                  >
                    <FaRedo />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6 flex justify-center flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Choose Orientation</h2>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="orientation"
              value="portrait"
              checked={orientation === "portrait"}
              onChange={() => setOrientation("portrait")}
            />
            <span>Portrait</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="orientation"
              value="landscape"
              checked={orientation === "landscape"}
              onChange={() => setOrientation("landscape")}
            />
            <span>Landscape</span>
          </label>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
          onClick={handleGeneratePdf}
          disabled={images.length === 0}
        >
          <FaFilePdf className="inline mr-1 relative -top-[1px]" /> Generate PDF
        </button>
      </div>
    </div>
  );
};

export default PdfMaker;
