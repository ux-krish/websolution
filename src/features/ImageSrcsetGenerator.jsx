import React, { useEffect, useState } from "react";
import Pica from "pica";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { FaUpload } from "react-icons/fa";
import { TbCopy, TbCopyCheck } from "react-icons/tb";
import { LuHardDriveDownload } from "react-icons/lu";
import { IoCloseCircleSharp } from "react-icons/io5";
import gsap from "gsap";

const ImageSrcsetGenerator = () => {
  const [images, setImages] = useState([]);
  const [srcsetImages, setSrcsetImages] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [maxSize, setMaxSize] = useState(null);
  const [copyStatus, setCopyStatus] = useState({});
  const [popup, setPopup] = useState({ visible: false, fading: false, message: "" });
  const [failedImages] = useState([]); 
  const [uploadErrors, setUploadErrors] = useState([]);
      

  useEffect(() => {
    gsap.fromTo(
      ".anim-button",
      { opacity: 0, scale: 0 }, // Start with opacity 0 and scale 0
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
      { opacity: 0, x: -100 }, // Start with opacity 0 and slide in from the left
      {
        opacity: 1,
        x: 0, // Slide to its original position
        stagger: 2, // Stagger the animation for each element
        duration: 1, // Animation duration
        ease: "power3.out", // Smooth easing
      }
    );
  }, []);

  const handleOptionClick = (size) => {
    if (size !== maxSize) {
      setMaxSize(size);
      resetAll(); // Reset UI when selecting a new option
    }
  };

  const handleImageUpload = (e) => {
    if (!maxSize) {
      alert("Please select a maximum size option first.");
      return;
    }
  
    resetAll(); // Clear previous state before starting a new upload
  
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      const originalExtension = file.name.split(".").pop();
      const sanitizedFileName = file.name.split(".")[0].replace(/\s+/g, "-"); // Remove spaces and sanitize
  
      return {
        file,
        uniqueKey: sanitizedFileName, // Use sanitized file name as unique identifier
        originalExtension,
      };
    });
  
    setImages(newImages);
    setUploadedCount(0);
    setUploading(true);
  
    let uploadProgress = 0;
    const totalFiles = newImages.length;
  
    newImages.forEach(({ file, uniqueKey, originalExtension }) => {
      generateSrcset(file, uniqueKey, originalExtension, () => {
        uploadProgress += 1;
        setUploadedCount(uploadProgress);
  
        if (uploadProgress === totalFiles) {
          setUploading(false);
  
          // Show popup with errors if there are any
          if (failedImages.length > 0) {
            const errorMessage = (
              <div className="text-left">
                <h3 className="text-lg font-bold text-red-400">Upload Errors:</h3>
                {failedImages.map(({ name, width, requiredWidth }, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm font-normal text-gray-900">
                      The image{" "}
                      <span className="font-semibold text-gray-900 underline">{name}</span>{" "}
                      has a width of{" "}
                      <span className="font-bold text-red-400 text-[12px]">
                        {width}px
                      </span>
                      , which is smaller than the selected resolution (
                      <span className="font-bold text-indigo-400 text-[12px]">
                        {requiredWidth}px
                      </span>
                      ).
                    </p>
                  </div>
                ))}
              </div>
            );
  
            setPopup({ visible: true, message: errorMessage });
          }
        }
      });
    });
  
    // Reset the file input to allow re-uploading the same file
    e.target.value = "";
  };
  

  useEffect(() => {
    if (!uploading && uploadErrors.length > 0) {
      setPopup({
        visible: true,
        message: uploadErrors,
      });
  
      // Clear errors after displaying them in the popup
      setUploadErrors([]);
    }
  }, [uploading, uploadErrors]);

  const resetAll = () => {
    setImages([]);
    setSrcsetImages({});
    setUploadedCount(0);
    setUploading(false);
  };

  const generateSrcset = async (file, uniqueKey, originalExtension, onUploadComplete) => {
    const resolutions = [3840, 2560, 1920, 1600, 1280, 1024, 640, 320].filter(
      (size) => size <= maxSize
    );
  
    const srcsetData = [];
    const img = new Image();
    img.src = URL.createObjectURL(file);
  
    img.onload = async () => {
      if (img.width < maxSize) {
        setUploadErrors((prevErrors) => [
          ...prevErrors,
          {
            name: file.name,
            width: img.width,
            requiredWidth: maxSize,
            previewUrl: img.src, // Include the image URL
          },
        ]);
        onUploadComplete(); // Proceed with the next image
        return;
      }
  
      const pica = new Pica();
      for (const width of resolutions) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = (img.height / img.width) * width;
  
        await pica.resize(img, canvas);
  
        const blob = await pica.toBlob(canvas, `image/${originalExtension}`, 0.9);
        const url = URL.createObjectURL(blob);
  
        srcsetData.push({
          url,
          width,
          height: canvas.height,
          blob,
          extension: originalExtension,
        });
      }
  
      setSrcsetImages((prevState) => ({
        ...prevState,
        [uniqueKey]: srcsetData,
      }));
  
      onUploadComplete();
    };
  };
  
  
  

  
  
  
  const Popup = ({ message, onClose }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
  
    const handleClose = () => {
      setIsFadingOut(true);
      setTimeout(() => {
        onClose();
        setIsFadingOut(false);
      }, 500);
    };
  
    const handleContentClick = (e) => {
      e.stopPropagation(); // Prevent closing when clicking inside the popup content
    };
  
    return (
      <div
        onClick={handleClose}
        className={`fixed  rounded-lg overflow-hidden p-5 top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex flex-col justify-start items-center bg-opacity-50 bg-neutral-400 z-50 transition-opacity duration-1000 ${
          isFadingOut ? "animate-fadeOut" : "animate-fadeIn"
        }`}
      >
        <div
          onClick={handleContentClick}
          className="absolute mx-auto left-0 right-0 top-8 bottom-8 sm:bottom-16 sm:top-16 bg-white border-2 border-dashed border-neutral-400 shadow-xl rounded-lg p-6 max-w-xs sm:max-w-2xl w-10/12 overflow-hidden"
        >
          <IoCloseCircleSharp
            className="absolute top-2 z-20 right-2 w-6 h-auto text-red-400 cursor-pointer"
            onClick={handleClose}
          />
          <h3 className="text-lg font-bold text-red-400 absolute top-2 left-0 px-4 pb-2 w-full bg-white z-10 right-0">Upload Errors:</h3>
          <div
            className={`max-h-full mt-4 pt-5 pb-3 overflow-y-auto flex flex-col items-start relative transition-transform duration-1000 ${
              isFadingOut ? "scale-0" : "scale-100"
            }`}
          >
            {message.map(({ name, width, requiredWidth, previewUrl }, index) => (
              <div key={index} className="flex items-start mb-4">
                <img
                  src={previewUrl}
                  alt={name}
                  className="w-16 sm:w-40 h-auto mr-4 rounded border"
                />
                <div>
                  <p className="text-[12px] sm:text-lg font-normal text-gray-900 pr-3 leading-4">
                    The image{" "}
                    <span className="font-semibold text-gray-900 underline">
                      {name}
                    </span>{" "}
                    has a width of{" "}
                    <span className="font-bold text-red-400 text-[12px] sm:text-lg">
                      {width}px
                    </span>
                    , which is smaller than the selected resolution (
                    <span className="font-bold text-indigo-400 text-[12px] sm:text-lg">
                      {requiredWidth}px
                    </span>
                    ).
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  
  
  

  const generateSizesAttribute = () => {
    const breakpoints = [
      { maxWidth: 640, size: "100vw" },
      { maxWidth: 1024, size: "50vw" },
      { maxWidth: 1280, size: "33vw" },
      { maxWidth: 1600, size: "25vw" },
      { maxWidth: 1920, size: "20vw" },
    ];
    return breakpoints
      .filter(({ maxWidth }) => maxWidth <= maxSize)
      .map(({ maxWidth, size }) => `(max-width: ${maxWidth}px) ${size}`)
      .concat("10vw")
      .join(", ");
  };

  const generateSetupCode = (uniqueKey) => {
    const srcsetString = srcsetImages[uniqueKey]
      ?.map(({ width, extension }) =>
        `path/${uniqueKey}-${width}.${extension} ${width}w`
      )
      .join(", ");
  
    const { width, height, extension } = srcsetImages[uniqueKey]?.[0] || {};
    const sizes = generateSizesAttribute();
  
    return `<img 
      src="path/${uniqueKey}-${width}.${extension}" 
      srcset="${srcsetString}" 
      sizes="${sizes}"
      width="${width}" 
      height="${height}" 
      alt="Responsive Image" 
      loading="lazy" 
      decoding="async"
    />`;
  };
  
  

  const copyToClipboard = (uniqueKey) => {
    const text = generateSetupCode(uniqueKey);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyStatus((prev) => ({ ...prev, [uniqueKey]: "Copied!" }));
        setTimeout(() => {
          setCopyStatus((prev) => ({ ...prev, [uniqueKey]: "" }));
        }, 5000); // Reset after 5 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const downloadImage = (blob, uniqueKey, width, extension) => {
    // Construct the filename using uniqueKey and width without using large timestamp or number
    const sanitizedFileName = uniqueKey.replace(/\s+/g, "-");
    saveAs(blob, `${sanitizedFileName}-${width}.${extension}`);
  };
  
  const downloadAll = async () => {
    const zip = new JSZip();

    for (const [uniqueKey, images] of Object.entries(srcsetImages)) {
      images.forEach(({ blob, width, extension }) => {
        const sanitizedFileName = `${uniqueKey}-${width}.${extension}`.replace(
          /\s+/g,
          "-"
        );
        zip.file(sanitizedFileName, blob);
      });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "srcset-images.zip");
  };



  return (
    <div className="mx-auto max-w-4xl md:p-6 p-1 py-5 ">
      {popup.visible && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ visible: false, fading: false, message: "" })}
        />
      )}
      <h1 className="text-2xl font-bold mb-8 text-center ">Image Srcset Generator</h1>

      <div className="mb-10 mt-8 text-center">
        <h2 className="text-lg font-semibold mb-4 feature-box">Select Maximum Size:</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[3840, 2560, 1920, 1600, 1280].map((size) => (
            <button
              key={size}
              onClick={() => handleOptionClick(size)}
              className={` anim-button px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black  shadow-md hover:shadow-xl transition-shadow duration-200 ${
                maxSize === size
                  ? "bg-black text-white border-black"
                  : "bg-sky-100 hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20"
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {maxSize && (
        <div className="mb-6 feature-box">
          <div className="flex flex-col items-center justify-center ">
            <label
              htmlFor="file-upload"
              className="shadow-lg hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center justify-center p-6 w-full max-w-sm bg-gradient-to-r from-[#d8eeff] 0% via-[#feedff] 50% to-[#fff8de] 100% border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-white "
            >
              <FaUpload className="text-3xl text-gray-600 mb-2" />
              <span className="text-gray-600 text-center">Click to upload multiple images</span>
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
      )}

      {uploading && (
        <div className="mb-6 text-center">
          <div className="loader"></div>
          <p className="mt-2 text-gray-600">
            Uploading images... {uploadedCount}/{images.length}
          </p>
        </div>
      )}

      {Object.keys(srcsetImages).length > 0 && !uploading && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Generated Srcset Images:</h2>
            <div className="space-y-6">
              {Object.entries(srcsetImages).map(([uniqueKey, images]) => (
                <div key={uniqueKey} className="border-b pb-4 mb-4">
                  <h3 className="text-md font-semibold border-b pb-2 pt-2 -tracking-wide">Set {uniqueKey}:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map(({ url, width, height, blob, extension }) => (
                    <div key={width} className="flex flex-col items-center max-w-[150px] mx-auto">
                      <button
                        className="flex justify-center w-full max-w-[150px] gap-2 mt-2 mb-3 text-sm px-2 py-2 md:px-4 md:py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl bg-sky-100 active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
                        onClick={() => downloadImage(blob, uniqueKey, width, extension)}
                      >
                        <LuHardDriveDownload className="w-4 h-auto" /> {width}px
                      </button>
                      <img
                        src={url}
                        alt={`Resized to ${width}px`}
                        className="max-w-[150px] w-full h-30 object-cover rounded-xl shadow-md border-2 border-neutral-500 border-dashed"
                      />
                      <p className="mt-2 text-[12px] md:text-sm text-gray-600 text-center min-h-16 break-all">
                        path/{uniqueKey}-{width}.{extension} ({width}x{height})
                      </p>
                    </div>
                  ))}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">Setup Code:</h4>
                    <div
                      className={`relative p-4 rounded text-sm ${
                        copyStatus[uniqueKey] === "Copied!" ? "bg-green-900 text-white" : "bg-black text-white"
                      }`}
                    >
                      <div className="overflow-auto">
                        <pre>{generateSetupCode(uniqueKey)}</pre>
                        <button
                          onClick={() => copyToClipboard(uniqueKey)}
                          className={`absolute top-2 right-2 px-2 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                            copyStatus[uniqueKey] === "Copied!"
                              ? "bg-green-500 text-white scale-105"
                              : "bg-black text-white hover:bg-green-700"
                          }`}
                        >
                          {copyStatus[uniqueKey] === "Copied!" ? <TbCopyCheck className="w-4 h-auto" /> : <TbCopy className="w-4 h-auto" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end items-center">
            <button
              onClick={downloadAll}
              className="w-full flex gap-2 items-center justify-center px-2 md:px-4 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl bg-lime-100 active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
            >
              <LuHardDriveDownload className="w-4 h-auto" /> Download All Images as ZIP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSrcsetGenerator;
