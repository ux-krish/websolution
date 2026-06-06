import React, { useState, useEffect } from "react";
import { FaUpload, FaTrashAlt, FaArrowUp, FaArrowDown, FaFilePdf, FaRedo } from "react-icons/fa";
import { jsPDF } from "jspdf";
import gsap from "gsap";
import FeaturePageShell from "../components/FeaturePageShell";

const PdfMaker = () => {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState("portrait");


  useEffect(() => {
    gsap.fromTo(
      ".box",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.5,
        ease: "power4.out",
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
  }, [images, orientation]);

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
    <FeaturePageShell
      eyebrow="Document builder"
      title="PDF Maker"
      description="Arrange images, rotate pages, choose orientation, and export a clean PDF document."
      icon={FaFilePdf}
      accent="from-rose-300 to-fuchsia-500"
      stats={[
        { value: "90", label: "Rotate" },
        { value: "2", label: "Layouts" },
        { value: "PDF", label: "Output" },
      ]}
    >
    <div className="mx-auto max-w-4xl feature-box">
      <div className="mb-6 box">
        <div className="flex flex-col items-center justify-center">
          <label
            htmlFor="file-upload"
            className="feature-dropzone max-w-md"
          >
            <span className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-rose-300 to-fuchsia-500 text-white shadow-lg">
              <FaUpload className="text-3xl" />
            </span>
            <span className="text-sm font-black uppercase text-slate-500">Upload images</span>
            <span className="mt-2 text-base font-bold text-slate-800">Add pages for your PDF</span>
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
        <>
        <div className="feature-card mb-6 flex flex-col box">
          <h2 className="mb-4 text-xl font-black text-slate-950">Reorder Images</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {images.map((image, index) => (
              <li key={index} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                <img
                  src={image.preview}
                  alt="Uploaded preview"
                  className="h-24 w-24 rounded-2xl object-cover shadow-md"
                  style={{ transform: `rotate(${image.rotation}deg)` }}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    className="feature-icon-button"
                    onClick={() => handleReorder(index, "up")}
                    aria-label="Move image up"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    className="feature-icon-button"
                    onClick={() => handleReorder(index, "down")}
                    aria-label="Move image down"
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    className="feature-icon-button hover:border-rose-300 hover:text-rose-600"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Remove image"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="feature-icon-button hover:border-amber-300 hover:text-amber-600"
                    onClick={() => handleRotate(index)}
                    aria-label="Rotate image"
                  >
                    <FaRedo />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="feature-card mb-6 flex flex-col items-center box">
        <h2 className="mb-4 text-xl font-black text-slate-950">Choose Orientation</h2>
        <div className="flex w-full max-w-md justify-between rounded-full bg-slate-100 p-1">
            <label className="relative flex flex-1 items-center box">
              <input
                type="radio"
                name="orientation"
                value="portrait"
                checked={orientation === "portrait"}
                onChange={() => setOrientation("portrait")}
                className="peer hidden"
              />
              <span className="feature-segment cursor-pointer text-center peer-checked:border-slate-950 peer-checked:bg-slate-950 peer-checked:text-white">
                Portrait
              </span>
            </label>

          <label className="relative flex flex-1 items-center box">
            <input
              type="radio"
              name="orientation"
              value="landscape"
              checked={orientation === "landscape"}
              onChange={() => setOrientation("landscape")}
              className="peer hidden"
            />
            <span className="feature-segment cursor-pointer text-center peer-checked:border-slate-950 peer-checked:bg-slate-950 peer-checked:text-white">Landscape</span>
          </label>
        </div>
      </div>

      <div className="flex justify-center box">
        <button
          className="feature-action"
          onClick={handleGeneratePdf}
          disabled={images.length === 0}
        >
          <FaFilePdf className="inline mr-1 relative -top-[1px]" /> Generate PDF
        </button>
      </div>
      </>
      )}
 
      
    </div>
    </FeaturePageShell>
  );
};

export default PdfMaker;
