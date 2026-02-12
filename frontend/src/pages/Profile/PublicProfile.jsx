import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    User, Mail, Briefcase, GraduationCap, Globe, ArrowLeft, Loader2, 
    Phone, Eye, FileText, Download, 
    UserPlus, Check, MessageCircle, X
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";

// Social Media Icon Components
const LinkedInIcon = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className={className}>
        <rect width="72" height="72" fill="#117EB8" rx="4"></rect>
        <path fill="#FFF" d="M13.139 27.848h9.623V58.81h-9.623V27.848zm4.813-15.391c3.077 0 5.577 2.5 5.577 5.577 0 3.08-2.5 5.581-5.577 5.581a5.58 5.58 0 1 1 0-11.158zm10.846 15.39h9.23v4.231h.128c1.285-2.434 4.424-5 9.105-5 9.744 0 11.544 6.413 11.544 14.75V58.81h-9.617V43.753c0-3.59-.066-8.209-5-8.209-5.007 0-5.776 3.911-5.776 7.95V58.81h-9.615V27.848z"></path>
    </svg>
);

const GitHubIcon = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" className={className}>
        <path d="M1664 896q0 251-146.5 451.5T1139 1625q-27 5-39.5-7t-12.5-30v-211q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105T1386 856q0-121-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27T578 459.5 492 446q-44 113-7 204-79 85-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-40 36-49 103-21 10-45 15t-57 5-65.5-21.5T484 1274q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 89t.5 54q0 18-13 30t-40 7q-232-77-378.5-277.5T128 896q0-209 103-385.5T510.5 231 896 128t385.5 103T1561 510.5 1664 896z"></path>
    </svg>
);

const LeetCodeIcon = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path fill="#B3B1B0" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"></path>
        <path fill="#E7A41F" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"></path>
        <path fill="#070706" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"></path>
    </svg>
);

// Connection Request Modal Component
const ConnectionRequestModal = ({ isOpen, onClose, onSubmit, profileName }) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(message);
        setLoading(false);
        setMessage("");
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div 
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Send Connection Request</h3>
                            <p className="text-sm text-gray-500 mt-1">To {profileName}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Add a personal message (optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hi! I'd like to connect with you..."
                                rows="4"
                                maxLength="200"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black resize-none"
                            />
                            <p className="text-xs text-gray-400 mt-1 text-right">
                                {message.length}/200 characters
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" />
                                        Send Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- STATE ---
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConnectModal, setShowConnectModal] = useState(false);

    // Connection States
    const [requestSent, setRequestSent] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/profile/public/${id}`);
                if (data.success) {
                    setProfile(data.data);
                }
            } catch (err) {
                console.log(err);
                setError("Profile not found or private.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    // --- HANDLER: Connect to User ---
    const handleConnectSubmit = async (message) => {
        if (!profile?.owner?._id) return;
        
        try {
            const { data } = await api.post("/chat/request", {
                receiverId: profile.owner._id,
                requestMessage: message || `Hi ${profile.owner.fullName}! I'd like to connect with you.`
            });

            if (data.success) {
                toast.success("Connection request sent! 🎉", {
                    duration: 3000,
                    style: {
                        background: '#10B981',
                        color: '#fff',
                    }
                });
                setRequestSent(true);
                setShowConnectModal(false);
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to connect";
            
            if (msg.toLowerCase().includes("already connected")) {
                setIsConnected(true);
                setShowConnectModal(false);
                toast.success("You are already connected!");
            } else if (msg.toLowerCase().includes("pending")) {
                setRequestSent(true);
                setShowConnectModal(false);
                toast.success("Request is already pending.");
            } else {
                toast.error(msg);
            }
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-black mx-auto mb-4" />
                <p className="text-gray-500">Loading profile...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
                <p className="text-gray-500 mb-6">This profile may be private or doesn't exist</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Directory
                </Link>
            </div>
        </div>
    );

    // Helpers
    const getExternalLink = (url) => {
        if (!url) return "#";
        return url.startsWith("http") ? url : `https://${url}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // View Resume
    const handleViewResume = async () => {
        if (!profile?.resume) return;
        const toastId = toast.loading("Opening resume...");
        try {
            const response = await fetch(profile.resume);
            if (!response.ok) throw new Error("Fetch failed");
            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: "application/pdf" });
            const objectUrl = URL.createObjectURL(blob);
            window.open(objectUrl, "_blank");
        } catch (error) {
            console.error("Resume view error:", error);
            toast.error("Failed to open resume");
        } finally {
            toast.dismiss(toastId);
        }
    };

    // Download Resume
    const handleDownloadResume = async () => {
        if (!profile?.resume) return;
        const toastId = toast.loading("Downloading...");
        try {
            const response = await fetch(profile.resume);
            if (!response.ok) throw new Error("Fetch failed");
            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: "application/pdf" });
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = objectUrl;
            const fileName = profile?.owner?.fullName
                ? `${profile.owner.fullName.replace(/\s+/g, '_')}_Resume.pdf`
                : "resume.pdf";
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
            toast.success("Resume downloaded!");
        } catch (error) {
            console.error("Resume download error:", error);
            toast.error("Download failed");
        } finally {
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                    Back to Directory
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
                    {/* Banner */}
                    <div
                        className="h-40 md:h-48 overflow-hidden relative"
                        style={profile?.banner ? {
                            backgroundImage: `url(${profile.banner})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        } : {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                    >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>

                    <div className="px-6 md:px-6 pb-6 relative">
                        <div className="flex flex-col md:flex-row gap-6 items-start mt-4 md:mt-2">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-white p-2 shadow-xl relative">
                                    <div className="h-full w-full rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center overflow-hidden">
                                        {profile?.owner?.avatar ? (
                                            <img 
                                                src={profile.owner.avatar} 
                                                alt="Profile" 
                                                className="h-full w-full object-cover cursor-pointer"
                                                onClick={() => window.open(profile.owner.avatar, '_blank')}
                                            />
                                        ) : (
                                            <span className="text-4xl md:text-5xl font-bold text-white">
                                                {profile?.owner?.fullName?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Info - Takes remaining space */}
                            <div className="flex-1 pt-2 md:pt-6 min-w-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    {profile?.owner?.fullName}
                                </h1>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 capitalize font-semibold">
                                        <User className="h-3.5 w-3.5" />
                                        {profile?.owner?.role?.toLowerCase()}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                        <Mail className="h-3.5 w-3.5" />
                                        {profile?.owner?.email}
                                    </span>
                                    {profile?.isMobileVisible && profile?.mobileNumber && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                            <Phone className="h-3.5 w-3.5" />
                                            {profile.mobileNumber}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 🔥 FIX #1: Action Buttons - Properly Aligned */}
                            <div className="pt-4 md:pt-9 flex flex-wrap items-center gap-3">
                                {/* Resume Buttons Row */}
                                {profile?.resume && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleViewResume}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all border border-gray-200 whitespace-nowrap"
                                        >
                                            <FileText className="h-4 w-4" />
                                            <span>View Resume</span>
                                        </button>
                                        <button
                                            onClick={handleDownloadResume}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all border border-gray-200 whitespace-nowrap"
                                        >
                                            <Download className="h-4 w-4" />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                )}
                                
                                {/* Connect/Message Button - Full Width */}
                                {isConnected ? (
                                    <button 
                                        onClick={() => navigate("/chat")}
                                        className="w-full bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-gray-800 hover:to-gray-900 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Message
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setShowConnectModal(true)}
                                        disabled={requestSent}
                                        className={`w-full px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
                                            requestSent 
                                            ? "bg-green-100 text-green-700 border-2 border-green-200 cursor-default"
                                            : "bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 hover:shadow-xl"
                                        }`}
                                    >
                                        {requestSent ? (
                                            <>
                                                <Check className="h-4 w-4" /> 
                                                Request Sent
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4" /> 
                                                Connect
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Social Links */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Globe className="h-5 w-5" /> Social Links
                            </h3>
                            <div className="space-y-3">
                                {profile?.socialLinks?.linkedin && (
                                    <a
                                        href={getExternalLink(profile.socialLinks.linkedin)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 text-sm transition-colors group"
                                    >
                                        <LinkedInIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">LinkedIn</span>
                                    </a>
                                )}
                                {profile?.socialLinks?.github && (
                                    <a
                                        href={getExternalLink(profile.socialLinks.github)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 text-gray-700 hover:text-gray-900 text-sm transition-colors group"
                                    >
                                        <GitHubIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">GitHub</span>
                                    </a>
                                )}
                                {profile?.socialLinks?.leetcode && (
                                    <a
                                        href={getExternalLink(profile.socialLinks.leetcode)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 text-gray-700 hover:text-orange-500 text-sm transition-colors group"
                                    >
                                        <LeetCodeIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">LeetCode</span>
                                    </a>
                                )}
                                {!profile?.socialLinks?.linkedin && !profile?.socialLinks?.github && !profile?.socialLinks?.leetcode && (
                                    <p className="text-sm text-gray-400 italic">No social links added</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5" /> Professional Info
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">About</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {profile?.bio || "No bio added."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Role</h4>
                                        <p className="font-medium text-gray-900">{profile?.currentRole || "-"}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Company</h4>
                                        <p className="font-medium text-gray-900">{profile?.currentCompany || "-"}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">College</h4>
                                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                        {profile?.collegeName || "-"}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile?.skills?.length > 0 ? (
                                            profile.skills.map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No skills added</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience Section */}
                        {profile?.experience && profile.experience.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" /> Experience
                                </h3>

                                <div className="space-y-6">
                                    {profile.experience.map((exp, index) => (
                                        <div key={index} className="relative pl-4 border-l-2 border-gray-200 hover:border-black transition-colors">
                                            <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-black border-2 border-white shadow-sm"></div>
                                            <h4 className="font-bold text-gray-900 text-base">{exp.role}</h4>
                                            <p className="text-gray-700 font-medium text-sm">{exp.company}</p>
                                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                <span>{formatDate(exp.startDate)}</span>
                                                <span className="h-px w-3 bg-gray-300"></span>
                                                <span className={exp.current ? "text-green-600 font-semibold" : ""}>
                                                    {exp.current ? "Present" : formatDate(exp.endDate)}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Connection Request Modal */}
            <ConnectionRequestModal
                isOpen={showConnectModal}
                onClose={() => setShowConnectModal(false)}
                onSubmit={handleConnectSubmit}
                profileName={profile?.owner?.fullName}
            />
        </div>
    );
};

export default PublicProfile;