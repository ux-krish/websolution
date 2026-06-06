import React, { useEffect, useState } from "react";
import { FaUpload, FaDownload } from "react-icons/fa";
import { MdAutoAwesome } from "react-icons/md";
import gsap from "gsap";
import FeaturePageShell from "../components/FeaturePageShell";

const BackgroundRemover = () => {
  const [processedImages, setProcessedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bg-tool-item",
        { autoAlpha: 0, y: 24, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    });

    return () => ctx.revert();
  }, [processedImages]);

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
    <FeaturePageShell
      eyebrow="AI cutout desk"
      title="Image Background Remover"
      description="Upload images, process transparent cutouts, and download finished background-free assets."
      icon={MdAutoAwesome}
      accent="from-violet-300 to-cyan-500"
      stats={[
        { value: "AI", label: "Assist" },
        { value: "PNG", label: "Output" },
        { value: "Multi", label: "Upload" },
      ]}
    >
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 mx-auto">
        <label
          htmlFor="file-upload"
          className="feature-box feature-dropzone mx-auto max-w-md"
        >
          <span className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-violet-300 to-cyan-500 text-white shadow-lg">
            <FaUpload className="text-3xl" />
          </span>
          <span className="text-sm font-black uppercase text-slate-500">
            {loading ? "Processing" : "Upload images"}
          </span>
          <span className="mt-2 text-base font-bold text-slate-800">
            {loading ? "Preparing transparent cutouts" : "Select one or multiple files"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedImages.length > 0 ? (
          processedImages.map((image, index) => (
            <div key={index} className="bg-tool-item feature-card flex flex-col items-center">
              <img
                src={image}
                alt={`Processed ${index + 1}`}
                className="mb-4 w-full max-w-sm rounded-2xl bg-slate-100 object-cover shadow-md"
              />
              <button
                onClick={() =>
                  handleDownload(image, `processed-image-${index + 1}.png`)
                }
                className="feature-action w-full"
              >
                <FaDownload className="mr-2" />
                Download
              </button>
            </div>
          ))
        ) : (
          <p className="feature-card col-span-full text-center text-sm font-bold text-slate-500">
            Processed images will appear here.
          </p>
        )}
      </div>
    </div>
    </FeaturePageShell>
  );
};

export default BackgroundRemover;
