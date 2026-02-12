import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Upload, X, ZoomIn, Loader2 } from "lucide-react";
import getCroppedImg from "../../utils/cropImage"; // Import the helper we just made
import api from "../../utils/axios";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice"; // We need this to update the Redux state instantly
import toast from "react-hot-toast";

const AvatarUploadModal = ({ isOpen, onClose, user }) => {
    const dispatch = useDispatch();
    
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Handle File Selection
    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => setImageSrc(reader.result));
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // 2. Save & Upload
    const handleSave = async () => {
        try {
            setIsLoading(true);
            
            // A. Get the cropped image as a Blob
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            
            // B. Create Form Data for Multer
            const formData = new FormData();
            formData.append("avatar", croppedImageBlob, "profile.jpg");

            // C. Send to Backend
            const { data } = await api.patch("/auth/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
                // D. Update Redux State instantly so the UI updates
                dispatch(login({ ...user, avatar: data.data.avatar }));
                toast.success("Profile photo updated!");
                onClose();
                setImageSrc(null); // Reset
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to update photo");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Update Profile Picture</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {!imageSrc ? (
                        // STATE 1: Select File
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={onFileChange} 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <Upload className="h-6 w-6 text-black" />
                            </div>
                            <p className="font-medium text-gray-900">Click to upload image</p>
                            <p className="text-sm text-gray-500 mt-1">JPG, PNG usually work best</p>
                        </div>
                    ) : (
                        // STATE 2: Crop UI
                        <div className="space-y-6">
                            <div className="relative h-64 w-full bg-gray-900 rounded-xl overflow-hidden">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1} // Square aspect ratio
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>

                            {/* Zoom Slider */}
                            <div className="flex items-center gap-4">
                                <ZoomIn className="h-4 w-4 text-gray-500" />
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setImageSrc(null)}
                                    className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex-1 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Photo"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvatarUploadModal;