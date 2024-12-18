import React, { useState } from "react";
import { FaUpload, FaDownload } from "react-icons/fa";

const BackgroundRemover = () => {
  const [processedImages, setProcessedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle image upload and background removal
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);

    try {
      const processed = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);

          // Use Pixlr API for background removal
          const response = await fetch("https://api.pixlr.com/v2/remove_bg", {
            method: "POST",
            headers: {
              "Authorization": "Bearer YOUR_PIXLR_API_KEY", // Replace with your Pixlr API key
            },
            body: formData,
          });

          const data = await response.json();
          if (data?.url) {
            return data.url; // Extract the image URL
          } else {
            throw new Error("Background removal failed");
          }
        })
      );

      setProcessedImages(processed); // Set processed images to the state
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Handle image download
  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
  };

  return (
    <div className="mx-auto max-w-4xl md:p-6 p-1 py-5">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Image Background Remover
      </h1>

      <div className="mb-10 mx-auto">
        <label
          htmlFor="file-upload"
          className="feature-box mx-auto shadow-lg hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:bg-white"
        >
          <FaUpload className="text-3xl text-gray-600 mb-2" />
          <span className="text-neutral-600">
            {loading ? "Processing..." : "Click to upload images"}
          </span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Display processed images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedImages.length > 0 ? (
          processedImages.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={image}
                alt={`Processed ${index + 1}`}
                className="w-full max-w-sm rounded-lg mb-2"
              />
              <button
                onClick={() =>
                  handleDownload(image, `processed-image-${index + 1}.png`)
                }
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
              >
                <FaDownload className="mr-2" />
                Download
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No images to display yet.</p>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemover;
