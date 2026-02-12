import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Upload, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/axios";

// Helper: Generate the cropped image Blob
const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => { image.onload = resolve; });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg", 1); // Quality 1.0 (High)
    });
};

const BannerUploadModal = ({ isOpen, onClose, onSuccess }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // 1. Handle File Selection
    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.addEventListener("load", () => {
                // Log to confirm image data is generated
                console.log("Image loaded into reader"); 
                setImageSrc(reader.result);
            });
            
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            
            // Create a File from the Blob
            const file = new File([croppedBlob], "banner.jpg", { type: "image/jpeg" });
            
            const formData = new FormData();
            formData.append("banner", file); // Must match backend 'upload.single("banner")'

            // Use 'api' directly (interceptors handle headers)
            const response = await api.patch("/profile/banner", formData);

            if (response.data.success) {
                toast.success("Cover photo updated!");
                onSuccess(); // Refresh profile
                handleClose();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload banner");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setImageSrc(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900">Update Cover Photo</h3>
                    <button 
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content Area - THE FIX IS HERE */}
                <div className="flex-1 bg-gray-100 relative min-h-[400px]">
                    {!imageSrc ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <label className="cursor-pointer bg-white px-6 py-3 rounded-xl shadow-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700">
                                <Upload className="h-5 w-5" />
                                Select Image
                                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                            </label>
                            <p className="text-gray-500 text-sm mt-3">Recommended size: 1500x500px</p>
                        </div>
                    ) : (
                        // FIX: Use 'absolute inset-0' to force the cropper to fill the container
                        <div className="absolute inset-0 w-full h-full z-10">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={3 / 1} // Banner Aspect Ratio
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                objectFit="horizontal-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                {imageSrc && (
                    <div className="p-4 border-t border-gray-100 bg-white space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zoom</span>
                            <input 
                                type="range" 
                                min={1} max={3} step={0.1} 
                                value={zoom} 
                                onChange={(e) => setZoom(e.target.value)}
                                className="w-full accent-black h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setImageSrc(null)}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Change Image
                            </button>
                            <button 
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="px-6 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-lg shadow-gray-200"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Save Banner
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerUploadModal;