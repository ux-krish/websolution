import React, { useEffect, useState } from "react";
import Pica from "pica";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { FaUpload } from "react-icons/fa";
import { TbCopy, TbCopyCheck } from "react-icons/tb";
import { LuHardDriveDownload } from "react-icons/lu";
import { IoCloseCircleSharp } from "react-icons/io5";
import gsap from "gsap";
import FeaturePageShell from "../components/FeaturePageShell";

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
        className={`fixed inset-0 z-50 flex flex-col items-center justify-start overflow-hidden bg-slate-950/50 p-5 backdrop-blur-md transition-opacity duration-1000 ${
          isFadingOut ? "animate-fadeOut" : "animate-fadeIn"
        }`}
      >
        <div
          onClick={handleContentClick}
          className="absolute bottom-8 left-0 right-0 top-8 mx-auto w-10/12 max-w-xs overflow-hidden rounded-[1.5rem] border border-white bg-white p-6 shadow-2xl sm:bottom-16 sm:top-16 sm:max-w-2xl"
        >
          <IoCloseCircleSharp
            className="absolute right-3 top-3 z-20 h-auto w-7 cursor-pointer text-rose-500"
            onClick={handleClose}
          />
          <h3 className="absolute left-0 right-0 top-0 z-10 w-full bg-white px-5 py-4 text-lg font-black text-rose-500">Upload Errors</h3>
          <div
            className={`relative mt-10 flex max-h-full flex-col items-start overflow-y-auto pb-3 pt-5 transition-transform duration-1000 ${
              isFadingOut ? "scale-0" : "scale-100"
            }`}
          >
            {message.map(({ name, width, requiredWidth, previewUrl }, index) => (
              <div key={index} className="mb-4 flex items-start">
                <img
                  src={previewUrl}
                  alt={name}
                  className="mr-4 h-auto w-16 rounded-2xl shadow-md sm:w-40"
                />
                <div>
                  <p className="pr-3 text-[12px] font-semibold leading-4 text-slate-700 sm:text-lg">
                    The image{" "}
                    <span className="font-black text-slate-900 underline">
                      {name}
                    </span>{" "}
                    has a width of{" "}
                    <span className="text-[12px] font-black text-rose-500 sm:text-lg">
                      {width}px
                    </span>
                    , which is smaller than the selected resolution (
                    <span className="text-[12px] font-black text-cyan-600 sm:text-lg">
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
    <FeaturePageShell
      eyebrow="Responsive image kit"
      title="Image Srcset Generator"
      description="Generate multiple image widths, copy clean markup, and export all resized assets as a ZIP."
      icon={FaUpload}
      accent="from-cyan-400 to-blue-500"
      stats={[
        { value: "8", label: "Widths" },
        { value: "ZIP", label: "Export" },
        { value: "HTML", label: "Copy" },
      ]}
    >
    <div className="mx-auto max-w-5xl">
      {popup.visible && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ visible: false, fading: false, message: "" })}
        />
      )}

      <div className="mb-8 text-center">
        <h2 className="feature-box mb-4 text-sm font-black uppercase text-slate-500">Select Maximum Size</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[3840, 2560, 1920, 1600, 1280].map((size) => (
            <button
              key={size}
              onClick={() => handleOptionClick(size)}
              className={`anim-button feature-soft-action ${
                maxSize === size
                  ? "border-slate-950 bg-slate-950 text-white"
                  : ""
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
              className="feature-dropzone max-w-md"
            >
              <span className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg">
                <FaUpload className="text-3xl" />
              </span>
              <span className="text-sm font-black uppercase text-slate-500">Upload images</span>
              <span className="mt-2 text-center text-base font-bold text-slate-800">Generate responsive sources</span>
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
          <p className="mt-2 font-bold text-slate-600">
            Uploading images... {uploadedCount}/{images.length}
          </p>
        </div>
      )}

      {Object.keys(srcsetImages).length > 0 && !uploading && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-950">Generated Srcset Images</h2>
            <div className="space-y-6">
              {Object.entries(srcsetImages).map(([uniqueKey, images]) => (
                <div key={uniqueKey} className="feature-card mb-4 pb-4">
                  <h3 className="border-b border-slate-100 pb-3 pt-1 text-md font-black text-slate-900">Set {uniqueKey}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map(({ url, width, height, blob, extension }) => (
                    <div key={width} className="flex flex-col items-center max-w-[150px] mx-auto">
                      <button
                        className="feature-soft-action mb-3 mt-2 w-full max-w-[150px] px-2 md:px-4"
                        onClick={() => downloadImage(blob, uniqueKey, width, extension)}
                      >
                        <LuHardDriveDownload className="w-4 h-auto" /> {width}px
                      </button>
                      <img
                        src={url}
                        alt={`Resized to ${width}px`}
                        className="h-30 w-full max-w-[150px] rounded-2xl object-cover shadow-md"
                      />
                      <p className="mt-2 min-h-16 break-all text-center text-[12px] font-semibold text-slate-500 md:text-sm">
                        path/{uniqueKey}-{width}.{extension} ({width}x{height})
                      </p>
                    </div>
                  ))}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="mb-2 text-md font-black text-slate-900">Setup Code</h4>
                    <div
                      className={`feature-code ${
                        copyStatus[uniqueKey] === "Copied!" ? "bg-green-900 text-white" : "bg-black text-white"
                      }`}
                    >
                      <div className="overflow-auto">
                        <pre>{generateSetupCode(uniqueKey)}</pre>
                        <button
                          onClick={() => copyToClipboard(uniqueKey)}
                          className={`absolute right-3 top-3 rounded-full p-2 text-xs font-semibold transition-all duration-200 ${
                            copyStatus[uniqueKey] === "Copied!"
                              ? "bg-green-500 text-white scale-105"
                              : "bg-white/10 text-white hover:bg-green-700"
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
              className="feature-action w-full"
            >
              <LuHardDriveDownload className="w-4 h-auto" /> Download All Images as ZIP
            </button>
          </div>
        </div>
      )}
    </div>
    </FeaturePageShell>
  );
};

export default ImageSrcsetGenerator;
