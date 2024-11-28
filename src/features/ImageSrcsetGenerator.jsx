import React, { useState } from "react";
import Pica from "pica";
import { saveAs } from "file-saver";
import { FaUpload } from 'react-icons/fa';

const ImageSrcsetGenerator = () => {
  const [image, setImage] = useState(null);
  const [srcsetImages, setSrcsetImages] = useState([]);
  const [imageName, setImageName] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name.split(".")[0]); // Extract the base name without extension
      generateSrcset(file);
    }
  };

  const generateSrcset = async (file) => {
    const resolutions = [320, 640, 1280, 1920]; // common breakpoints
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

      setSrcsetImages(srcsetData);
    };
  };

  const downloadImage = (blob, name) => {
    saveAs(blob, name);
  };

  const generateSetupCode = () => {
    const srcsetString = srcsetImages
      .map(
        ({ width }) =>
          `path/${imageName}-${width}.jpg ${width}w`
      )
      .join(", ");

    const { width, height } = srcsetImages[0] || {};
    return `<img 
      src="path/${imageName}-${width}.jpg" 
      srcset="${srcsetString}" 
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
      width="${width}" 
      height="${height}" 
      alt="Responsive Image" 
      loading="lazy" 
      decoding="async"
    />`;
  };

  return (
   
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Image Srcset Generator</h1>

        <div className="mb-6">
          <div className="flex flex-col items-center justify-center">
            {/* Custom file input container */}
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200">
              <FaUpload className="text-3xl text-gray-600 mb-2" /> {/* Upload icon */}
              <span className="text-gray-600">Click to upload an image</span>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"  // Hide the default file input
              />
            </label>

            {/* Image preview */}
            {image && (
              <div className="mt-4">
                <img src={URL.createObjectURL(image)} alt="Preview" className="max-w-xs rounded-lg shadow-md" />
              </div>
            )}
          </div>
        </div>

        {srcsetImages.length > 0 && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Generated Srcset Images:</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {srcsetImages.map(({ url, width, height, blob }) => (
                  <div key={width} className="flex flex-col items-center">
                    <button
                      className="mt-2 mb-3 text-sm text-white rounded-full px-3 py-1 bg-indigo-500 hover:underline"
                      onClick={() =>
                        downloadImage(blob, `${imageName}-${width}.jpg`)
                      }
                    >
                      Download {width}px
                    </button>
                    <img
                      src={url}
                      alt={`Resized to ${width}px`}
                      className="max-w-[150px] h-auto rounded border" // Smaller image size
                    />
                    <p className="mt-2 text-sm text-gray-600 text-center min-h-16">
                      path/{imageName}-{width}.jpg ({width}x{height})
                    </p>
                    
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Setup Code:</h2>
              <pre className="bg-gray-200 p-4 rounded text-sm overflow-auto">
                {generateSetupCode()}
              </pre>
            </div>
          </>
        )}
      </div>
    
  );
};

export default ImageSrcsetGenerator;
