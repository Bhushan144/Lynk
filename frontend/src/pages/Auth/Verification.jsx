import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Upload, Clock, AlertCircle, CheckCircle, Lock, FileText, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { login } from "../../features/authSlice";
import Navbar from "../../components/ui/Navbar";

const Verification = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please select a file");

        setIsLoading(true);
        const formData = new FormData();
        formData.append("verificationImage", file);

        try {
            const response = await api.patch("/users/update-verification", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success("Document uploaded successfully!");

                // --- CRITICAL FIX ---
                // We use the response DIRECTLY from the upload.
                // We DO NOT call /profile/me here, because it might return incomplete data.
                console.log("UPDATING REDUX WITH:", response.data.data);
                dispatch(login(response.data.data));

                // Reset form
                setFile(null);
                setPreview(null);
            }
        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || "Upload failed";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Show form if user is NOT verified
    const showUploadForm = user?.verificationStatus !== "VERIFIED";

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isLocked={true} />

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Verification Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                            <div className="mb-8 border-b border-gray-100 pb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Required</h1>
                                <p className="text-gray-500">
                                    To maintain a secure network, we require all students and alumni to verify their identity.
                                </p>
                            </div>

                            {/* REJECTED ALERT */}
                            {user?.verificationStatus === "REJECTED" && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 items-start">
                                    <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-red-900">Application Rejected</h3>
                                        <p className="text-sm text-red-700 mt-1">
                                            The document was unclear or invalid. Please upload a clear photo of your College ID.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* UPLOAD FORM */}
                            {showUploadForm ? (
                                <form onSubmit={handleUpload} className="space-y-6">
                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />

                                        {preview ? (
                                            <div className="relative inline-block z-10">
                                                <img src={preview} alt="Preview" className="h-48 rounded-lg shadow-md object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); setFile(null); setPreview(null); }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 z-30 pointer-events-auto"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                                                    <Upload className="h-6 w-6 text-gray-500" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900">Upload College ID</h3>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Click to browse or drag and drop your file here.
                                                </p>
                                                <p className="text-xs text-gray-400 mt-4">JPG, PNG up to 5MB</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !file}
                                        className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition-all ${isLoading || !file
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-black hover:bg-gray-800 shadow-lg transform active:scale-95'
                                            }`}
                                    >
                                        {isLoading ? "Uploading..." : "Submit for Verification"}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">You are Verified!</h3>
                                    <p className="text-gray-500 mt-2">Redirecting to feed...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Status Visuals */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Application Status</h3>
                            <div className="space-y-6 relative">
                                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                {/* Step 1: Account Created */}
                                <div className="flex gap-4 relative">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 z-10">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Account Created</p>
                                        <p className="text-xs text-gray-500">Done</p>
                                    </div>
                                </div>

                                {/* Step 2: Document Uploaded (This UI changes based on user.verificationProof) */}
                                <div className="flex gap-4 relative">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 ${user?.verificationProof ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                        <FileText className={`h-4 w-4 ${user?.verificationProof ? 'text-green-600' : 'text-gray-400'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Document Uploaded</p>
                                        <p className="text-xs text-gray-500">{user?.verificationProof ? "Received" : "Pending"}</p>
                                    </div>
                                </div>

                                {/* Step 3: Admin Approval */}
                                <div className="flex gap-4 relative">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 z-10">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Admin Approval</p>
                                        <p className="text-xs text-gray-500">
                                            {user?.verificationProof ? "Under Review" : "Waiting for upload"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Locked Features Visual */}
                        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 bg-white/10 rounded-bl-2xl">
                                <Lock className="h-5 w-5 text-white/70" />
                            </div>
                            <h3 className="font-bold mb-2">Unlocked after verification</h3>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                                    Access to Alumni Feed
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                                    Message Seniors/Juniors
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                                    Apply for Job Referrals
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verification;