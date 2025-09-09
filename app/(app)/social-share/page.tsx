// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { CldImage } from "next-cloudinary";

// const socialFormats = {
//   "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
//   "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
//   "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
//   "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
//   "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
// };

// type socialFormat = keyof typeof socialFormats;
// function Socialshare() {
//   const [UploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [selectedFormat, setSelectedFormat] = useState<socialFormat>(
//     "Instagram Square (1:1)"
//   );
//   const [isUploading, setIsUploading] = useState(false);
//   const [isTransforming, setisTransforming] = useState(false);
//   const imageRef = useRef<HTMLImageElement>(null);

//   useEffect(() => {
//     if (UploadedImage) {
//       setisTransforming(true);
//     }
//   }, [selectedFormat, UploadedImage]);

//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     setIsUploading(true);
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await fetch("/api/image-upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to upload image");
//       const data = await response.json();
//       setUploadedImage(data.publicId);
//       setIsUploading(false);
//     } catch (error) {
//       console.log(error);
//       alert("failed to upload image");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!imageRef.current) return;
//     fetch(imageRef.current.src)
//       .then((response) => response.blob())
//       .then((blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = `${selectedFormat
//           .replace(/\s+/g, "_")
//           .toLowerCase()}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(link);
//       });
//   };
//   return (
//     <div className="container mx-auto p-4 max-w-4xl">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Social media Image creator
//       </h1>
//       <div className="card">
//         <div className="card-body">
//           <h2 className="card-title mb-4">Upload an Image</h2>
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Choose an Image file</span>
//             </label>
//             <input
//               type="file"
//               onChange={handleFileUpload}
//               className="file-input file-input-bordered file-input-primary w-full"
//             />
//           </div>
//           {isUploading && (
//             <div className="mt-4">
//               <progress className="progress progress-primary w-full"></progress>
//             </div>
//           )}
//           {UploadedImage && (
//             <div className="mt-6">
//               <h2 className="card-title mb-4"> Select Social media Format</h2>
//               <div className="form-control">
//                 <select
//                   name=""
//                   id=""
//                   className="select select-bordered w-full "
//                   value={selectedFormat}
//                   onChange={(e) => {
//                     setSelectedFormat(e.target.value as socialFormat);
//                   }}
//                 >
//                   {Object.keys(socialFormats).map((format) => (
//                     <option key={format} value={format}>
//                       {format}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mt-6 relative">
//                 {" "}
//                 <h3 className="text-lg font-semibold mb-2">Preview: </h3>
//                 <div className="flex justify-center">
//                   {isTransforming && (
//                     <div className=" absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
//                       {" "}
//                       <span className="loading loading-spinner loading-lg"></span>
//                     </div>
//                   )}
//                   <CldImage
//                     width={socialFormats[selectedFormat].width}
//                     height={socialFormats[selectedFormat].height}
//                     src={UploadedImage}
//                     sizes="100vw"
//                     alt="Transform image "
//                     crop="fill"
//                     aspectRatio={socialFormats[selectedFormat].aspectRatio}
//                     gravity="auto"
//                     ref={imageRef}
//                     onLoad={() => {
//                       setisTransforming(false);
//                     }}
//                   />
//                 </div>
//               </div>
//               <div  className="card-actions justify-end mt-6"> <button className="btn btn-primary " onClick={handleDownload}>Download for {selectedFormat}</button></div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Socialshare;


"use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { Upload, Download, ImageIcon, Layers } from "lucide-react"; 

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

function Socialshare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!uploadedImage) return;

    const format = socialFormats[selectedFormat];
    const cloudinaryUrl = `https://res.cloudinary.com/<your-cloud-name>/image/upload/c_fill,g_auto,w_${format.width},h_${format.height}/${uploadedImage}.png`;

    const link = document.createElement("a");
    link.href = cloudinaryUrl;
    link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-primary flex items-center justify-center gap-2">
        🎨 Social Media Image Creator
      </h1>

      <div className="card shadow-xl border border-base-300 rounded-2xl bg-base-100">
        <div className="card-body space-y-6">
          {/* Upload */}
          <h2 className="card-title text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload an Image
          </h2>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text mb-6">Choose an Image File</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
            <>
              {/* Format Selection */}
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-secondary" />
                  Select Social Media Format
                </h2>
                <select
                  className="select select-bordered select-primary w-full"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-accent" />
                  Preview
                </h3>
                <div className="flex justify-center p-4 border border-dashed border-base-300 rounded-xl bg-base-200">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-70 rounded-xl">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                  )}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="Transform image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    onLoad={() => setIsTransforming(false)}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Download */}
              <div className="card-actions justify-end mt-6">
                <button
                  className="btn btn-primary btn-wide flex items-center gap-2 transition-transform hover:scale-105"
                  onClick={handleDownload}
                >
                  <Download className="w-5 h-5" />
                  Download for {selectedFormat}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Socialshare;
