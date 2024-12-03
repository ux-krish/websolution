import React, { useState } from "react";
import Pica from "pica";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { FaUpload } from "react-icons/fa";

const ImageSrcsetGenerator = () => {
  const [images, setImages] = useState([]);
  const [srcsetImages, setSrcsetImages] = useState({});
  const [imageNames, setImageNames] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const names = files.map((file) =>
      file.name.split(".")[0].replace(/\s+/g, "-") // Replace spaces with hyphens
    );
  
    setImages(files);
    setImageNames(names);
    setUploadedCount(0); // Reset the counter
    setUploading(true); // Start the loader
  
    let uploadProgress = 0; // Local counter to avoid race conditions
    const totalFiles = files.length;
  
    files.forEach((file, index) => {
      const sanitizedFileName = file.name.split(".")[0].replace(/\s+/g, "-");
      generateSrcset(file, sanitizedFileName, () => {
        // Callback after each image is processed
        uploadProgress += 1;
        setUploadedCount(uploadProgress);
  
        if (uploadProgress === totalFiles) {
          setUploading(false); // Stop the loader when all images are done
        }
      });
    });
  };

  const generateSrcset = async (file, baseName, onUploadComplete) => {
    const resolutions = [3840, 2560, 1920, 1600, 1280, 1024, 640, 320];
    const srcsetData = [];
  
    const img = new Image();
    img.src = URL.createObjectURL(file);
  
    img.onload = async () => {
      const pica = new Pica();
      for (const width of resolutions) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = (img.height / img.width) * width;
  
        await pica.resize(img, canvas);
  
        const blob = await pica.toBlob(canvas, "image/jpeg", 0.9);
        const url = URL.createObjectURL(blob);
  
        srcsetData.push({
          url,
          width,
          height: canvas.height,
          blob,
        });
      }
  
      setSrcsetImages((prevState) => ({
        ...prevState,
        [baseName]: srcsetData,
      }));
  
      onUploadComplete(); // Notify that this file has been processed
    };
  };

  const downloadImage = (blob, name) => {
    const sanitizedFileName = name.replace(/\s+/g, "-"); // Ensure consistent naming
    saveAs(blob, sanitizedFileName);
  };
  const downloadAll = async () => {
    const zip = new JSZip();
  
    for (const [name, images] of Object.entries(srcsetImages)) {
      images.forEach(({ blob, width }) => {
        const sanitizedFileName = `${name}-${width}.jpg`.replace(/\s+/g, "-");
        zip.file(sanitizedFileName, blob);
      });
    }
  
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "srcset-images.zip");
  };

  const generateSetupCode = (baseName) => {
    const srcsetString = srcsetImages[baseName]
      ?.map(({ width }) => `path/${baseName}-${width}.jpg ${width}w`)
      .join(", ");

    const { width, height } = srcsetImages[baseName]?.[0] || {};
    return `<img 
      src="path/${baseName}-${width}.jpg" 
      srcset="${srcsetString}" 
      sizes="(max-width: 640px) 100vw, 
             (max-width: 1024px) 50vw, 
             (max-width: 1280px) 33vw, 
             (max-width: 1600px) 25vw, 
             (max-width: 1920px) 20vw, 
             10vw"
      width="${width}" 
      height="${height}" 
      alt="Responsive Image" 
      loading="lazy" 
      decoding="async"
    />`;
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">HD Image Srcset Generator</h1>

      <div className="mb-6">
        <div className="flex flex-col items-center justify-center">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200"
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

      {uploading && (
  <div className="mb-6 text-center">
    <div className="loader"></div>
    <p className="mt-2 text-gray-600">
      Uploading images... {uploadedCount}/{images.length}
    </p>
  </div>
)}

      {Object.keys(srcsetImages).length > 0 && !uploading && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Generated Srcset Images:</h2>
            <div className="space-y-6">
              {Object.entries(srcsetImages).map(([baseName, images]) => (
                <div key={baseName} className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-bold border-b pb-2 pt-2">Set {baseName}:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map(({ url, width, height, blob }) => (
                      <div key={width} className="flex flex-col items-center">
                        <button
                          className="mt-2 mb-3 text-sm text-white rounded-full px-3 py-1 bg-indigo-500 hover:underline"
                          onClick={() =>
                            downloadImage(blob, `${baseName}-${width}.jpg`)
                          }
                        >
                          Download {width}px
                        </button>
                        <img
                          src={url}
                          alt={`Resized to ${width}px`}
                          className="max-w-[150px] h-auto rounded border"
                        />
                        <p className="mt-2 text-sm text-gray-600 text-center min-h-16">
                          path/{baseName}-{width}.jpg ({width}x{height})
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">Setup Code:</h4>
                    <pre className="bg-gray-200 p-4 rounded text-sm overflow-auto">
                      {generateSetupCode(baseName)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={downloadAll}
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Download All Images as ZIP
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSrcsetGenerator;
