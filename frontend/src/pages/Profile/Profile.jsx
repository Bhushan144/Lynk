import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { User, Mail, Phone, Briefcase, GraduationCap, Globe, Edit2, Save, X, Camera, Eye, Code, FileText, Upload, Download } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import Navbar from "../../components/ui/Navbar";
import AvatarUploadModal from "../../components/ui/AvatarUploadModal";
import BannerUploadModal from "../../components/ui/BannerUploadModal";

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

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isBannerUploadOpen, setIsBannerUploadOpen] = useState(false);
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const [profile, setProfile] = useState(null);
    const resumeInputRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        bio: "",
        skills: "",
        mobileNumber: "",
        isMobileVisible: false,
        isProfilePublic: true,
        collegeName: "",
        currentCompany: "",
        currentRole: "",
        github: "",
        linkedin: "",
        leetcode: "",
        experience: []
    });

    // 1. Fetch My Profile
    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/profile/me");
            if (data.success) {
                const p = data.data;
                setProfile(p);

                // Pre-fill form data
                setFormData({
                    bio: p.bio || "",
                    skills: p.skills?.join(", ") || "",
                    mobileNumber: p.mobileNumber || "",
                    isMobileVisible: p.isMobileVisible,
                    isProfilePublic: p.isProfilePublic,
                    collegeName: p.collegeName || "",
                    currentCompany: p.currentCompany || "",
                    currentRole: p.currentRole || "",
                    github: p.socialLinks?.github || "",
                    linkedin: p.socialLinks?.linkedin || "",
                    leetcode: p.socialLinks?.leetcode || "",
                    experience: p.experience || []
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // 2. Handle Input Change (with validation)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "mobileNumber") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // 3. Save Changes
    const handleSave = async () => {
        try {
            const skillsArray = typeof formData.skills === 'string'
                ? formData.skills.split(",").map(s => s.trim()).filter(s => s !== "")
                : formData.skills;

            const cleanExperience = formData.experience.filter(
                exp => exp.role.trim() !== "" && exp.company.trim() !== ""
            );

            const payload = {
                bio: formData.bio,
                skills: skillsArray,
                mobileNumber: formData.mobileNumber,
                isMobileVisible: formData.isMobileVisible,
                isProfilePublic: formData.isProfilePublic,
                collegeName: formData.collegeName,
                currentCompany: formData.currentCompany,
                currentRole: formData.currentRole,
                experience: cleanExperience,
                socialLinks: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    leetcode: formData.leetcode
                }
            };

            const response = await api.patch("/profile/update", payload);

            if (response.data.success) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                fetchProfile();
            }
        } catch (error) {
            console.log(error);
            toast.error("Update failed");
        }
    };

    // 4. Resume Upload Handler
    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        setIsUploadingResume(true);
        const formDataPayload = new FormData();
        formDataPayload.append("resume", file);

        try {
            // ✅ FIX: No headers object. 
            // The browser + Axios Interceptor handles the boundary automatically.
            const response = await api.patch("/profile/resume", formDataPayload);

            if (response.data.success) {
                toast.success("Resume uploaded successfully!");
                fetchProfile();
            }
        } catch (error) {
            console.error(error);
            toast.error("Resume upload failed");
        } finally {
            setIsUploadingResume(false);
            if (resumeInputRef.current) resumeInputRef.current.value = "";
        }
    };

    // 5. View Resume — Fetch directly from Supabase URL
    const handleViewResume = async () => {
        if (!profile?.resume) return;

        const toastId = toast.loading("Opening resume...");
        try {
            // ✅ FIX: Fetch directly from the stored URL
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

    // 6. Download Resume — Fetch directly from Supabase URL
    const handleDownloadResume = async () => {
        if (!profile?.resume) return;

        const toastId = toast.loading("Downloading...");
        try {
            // ✅ FIX: Fetch directly from the stored URL
            const response = await fetch(profile.resume);

            if (!response.ok) throw new Error("Fetch failed");

            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: "application/pdf" });
            const objectUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = objectUrl;
            // Use the user's name or a default name
            const fileName = profile?.owner?.fullName
                ? `${profile.owner.fullName.replace(/\s+/g, '_')}_Resume.pdf`
                : "resume.pdf";

            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Resume download error:", error);
            toast.error("Download failed");
        } finally {
            toast.dismiss(toastId);
        }
    };

    // 1. Add a new empty experience block (Matches Backend Schema)
    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                {
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    current: false
                }
            ]
        }));
    };

    // 2. Handle changes (Text, Dates, Checkbox)
    // 2. Handle changes (Text, Dates, Checkbox)
    const handleExperienceChange = (index, field, value) => {
        let newExp = [...formData.experience];

        // LOGIC: If checking "I currently work here"
        if (field === "current" && value === true) {
            // 1. Loop through all entries and set 'current' to false for everyone else
            newExp = newExp.map((exp, i) => {
                if (i !== index) {
                    return { ...exp, current: false }; // Uncheck others
                }
                return exp;
            });

            // 2. Clear the End Date for THIS entry since it is current
            newExp[index]["endDate"] = "";
        }

        // Update the specific field
        newExp[index][field] = value;

        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    // 3. Helper to format dates for View Mode
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Remove an experience block
    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
                    {/* Banner - Clickable to upload */}
                    <div
                        onClick={() => setIsBannerUploadOpen(true)}
                        className="h-32 relative rounded-t-2xl cursor-pointer group overflow-hidden"
                        style={profile?.banner ? {
                            backgroundImage: `url(${profile.banner})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        } : {
                            background: 'linear-gradient(to right, rgb(0, 0, 0), rgb(31, 41, 55))'
                        }}
                    >
                        {/* Camera Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-white">
                                <Camera className="h-8 w-8" />
                                <span className="text-sm font-medium">
                                    {profile?.banner ? 'Change Cover Photo' : 'Add Cover Photo'}
                                </span>
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(!isEditing);
                            }}
                            className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2 z-10"
                        >
                            {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                            {isEditing ? "Cancel Editing" : "Edit Profile"}
                        </button>
                    </div>

                    <div className="px-8 pb-8 relative">
                        <div className="flex flex-col md:flex-row gap-6 items-start -mt-12">
                            {/* Avatar - Clickable for Menu */}
                            <div className="relative">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAvatarMenu(!showAvatarMenu);
                                    }}
                                    className="h-24 w-24 rounded-full bg-white p-1 shadow-lg relative cursor-pointer group"
                                >
                                    <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 relative group-hover:border-black transition-colors">
                                        {profile?.owner?.avatar ? (
                                            <img src={profile.owner.avatar} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-bold text-gray-400">
                                                {profile?.owner?.fullName?.charAt(0).toUpperCase()}
                                            </span>
                                        )}

                                        {/* Hover Overlay with Camera Icon */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                            <Camera className="h-6 w-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Mobile Floating Camera Icon */}
                                    <div className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white shadow-sm md:hidden">
                                        <Camera className="h-3 w-3" />
                                    </div>
                                </div>

                                {/* Avatar Menu Dropdown */}
                                {showAvatarMenu && (
                                    <>
                                        {/* Backdrop to close menu */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowAvatarMenu(false)}
                                        ></div>

                                        {/* Menu */}
                                        <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                                            {/* View option - Only if avatar exists */}
                                            {profile?.owner?.avatar && (
                                                <button
                                                    onClick={() => {
                                                        window.open(profile.owner.avatar, '_blank');
                                                        setShowAvatarMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left rounded-t-xl"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View Profile Picture
                                                </button>
                                            )}

                                            {/* Divider if avatar exists */}
                                            {profile?.owner?.avatar && <div className="border-t border-gray-100"></div>}

                                            {/* Upload/Change option - ALWAYS shows */}
                                            <button
                                                onClick={() => {
                                                    setIsUploadOpen(true);
                                                    setShowAvatarMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left rounded-b-xl"
                                            >
                                                <Camera className="h-4 w-4" />
                                                {profile?.owner?.avatar ? 'Change Profile Picture' : 'Upload Profile Picture'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 pt-2 md:pt-14">
                                <h1 className="text-2xl font-bold text-gray-900">{profile?.owner?.fullName}</h1>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md">
                                        <User className="h-3.5 w-3.5" />
                                        {profile?.owner?.role}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" />
                                        {profile?.owner?.email}
                                    </span>
                                    {(profile?.isMobileVisible || isEditing) && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="mobileNumber"
                                                    value={formData.mobileNumber}
                                                    onChange={handleChange}
                                                    placeholder="Add Phone"
                                                    className="border-b border-gray-300 focus:border-black outline-none bg-transparent w-32"
                                                />
                                            ) : (
                                                profile?.mobileNumber || "No number added"
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column: Stats & Privacy */}
                    <div className="space-y-6">

                        {/* Visibility Settings (Only visible when editing) */}
                        {isEditing && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Eye className="h-5 w-5" /> Privacy Settings
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-gray-600">Public Profile</span>
                                        <input
                                            type="checkbox"
                                            name="isProfilePublic"
                                            checked={formData.isProfilePublic}
                                            onChange={handleChange}
                                            className="accent-black h-4 w-4"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-gray-600">Show Mobile Number</span>
                                        <input
                                            type="checkbox"
                                            name="isMobileVisible"
                                            checked={formData.isMobileVisible}
                                            onChange={handleChange}
                                            className="accent-black h-4 w-4"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Globe className="h-5 w-5" /> Social Links
                            </h3>
                            <div className="space-y-3">
                                {isEditing ? (
                                    <>
                                        <input
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            placeholder="LinkedIn URL"
                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                                        />
                                        <input
                                            name="github"
                                            value={formData.github}
                                            onChange={handleChange}
                                            placeholder="GitHub URL"
                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                                        />
                                        <input
                                            name="leetcode"
                                            value={formData.leetcode}
                                            onChange={handleChange}
                                            placeholder="LeetCode URL"
                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                                        />
                                    </>
                                ) : (
                                    <>
                                        {profile?.socialLinks?.linkedin && (
                                            <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 text-sm transition-colors group">
                                                <LinkedInIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                <span className="font-medium">LinkedIn</span>
                                            </a>
                                        )}
                                        {profile?.socialLinks?.github && (
                                            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 text-sm transition-colors group">
                                                <GitHubIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                <span className="font-medium">GitHub</span>
                                            </a>
                                        )}
                                        {profile?.socialLinks?.leetcode && (
                                            <a href={profile.socialLinks.leetcode} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-orange-500 text-sm transition-colors group">
                                                <LeetCodeIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                <span className="font-medium">LeetCode</span>
                                            </a>
                                        )}
                                        {!profile?.socialLinks?.linkedin && !profile?.socialLinks?.github && !profile?.socialLinks?.leetcode && (
                                            <p className="text-sm text-gray-400 italic">No links added</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Resume Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" /> Resume
                            </h3>
                            <div className="space-y-3">
                                {/* View & Download Current Resume */}
                                {profile?.resume && (
                                    <>
                                        <button
                                            onClick={handleViewResume}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Eye className="h-4 w-4 text-blue-600" />
                                            View Resume
                                        </button>
                                        <button
                                            onClick={handleDownloadResume}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Download className="h-4 w-4 text-blue-600" />
                                            Download Resume
                                        </button>
                                    </>
                                )}

                                {/* Upload / Update Resume - hidden input triggered by button */}
                                <input
                                    ref={resumeInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleResumeUpload}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <button
                                    onClick={() => resumeInputRef.current?.click()}
                                    disabled={isUploadingResume}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Upload className="h-4 w-4" />
                                    {isUploadingResume
                                        ? "Uploading..."
                                        : profile?.resume
                                            ? "Update Resume"
                                            : "Upload Resume"}
                                </button>

                                {/* No resume yet message */}
                                {!profile?.resume && (
                                    <p className="text-xs text-gray-400 italic">No resume uploaded yet. Only PDF allowed.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details Form */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Professional Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" /> Professional Info
                                </h3>
                                {isEditing && (
                                    <button
                                        onClick={handleSave}
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2"
                                    >
                                        <Save className="h-4 w-4" /> Save Changes
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Bio */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">About</label>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
                                            placeholder="Tell us about yourself..."
                                        />
                                    ) : (
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {profile?.bio || "No bio added yet."}
                                        </p>
                                    )}
                                </div>

                                {/* Current Role & Company */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Current Role</label>
                                        {isEditing ? (
                                            <input
                                                name="currentRole"
                                                value={formData.currentRole}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                                                placeholder="e.g. Software Engineer"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{profile?.currentRole || "-"}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company</label>
                                        {isEditing ? (
                                            <input
                                                name="currentCompany"
                                                value={formData.currentCompany}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                                                placeholder="e.g. Google"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{profile?.currentCompany || "-"}</p>
                                        )}
                                    </div>
                                </div>

                                {/* College */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">College</label>
                                    {isEditing ? (
                                        <input
                                            name="collegeName"
                                            value={formData.collegeName}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                                            placeholder="e.g. VIIT Pune"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                                            <GraduationCap className="h-4 w-4 text-gray-400" />
                                            {profile?.collegeName || "-"}
                                        </div>
                                    )}
                                </div>

                                {/* Skills */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</label>
                                    {isEditing ? (
                                        <>
                                            <input
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                                                placeholder="React, Node.js, Python (Comma separated)"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
                                        </>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {profile?.skills?.length > 0 ? (
                                                profile.skills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No skills added</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Experience Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" /> Experience
                                </h3>
                                {isEditing && (
                                    <button
                                        onClick={addExperience}
                                        className="text-sm bg-gray-100 px-3 py-1 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        + Add Role
                                    </button>
                                )}
                            </div>

                            <div className="space-y-8">
                                {formData.experience?.map((exp, index) => (
                                    <div key={index} className="relative pl-4 border-l-2 border-gray-200">
                                        {isEditing ? (
                                            // --- EDIT MODE ---
                                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                                                {/* Header: Remove Button */}
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase">Role {index + 1}</h4>
                                                    <button onClick={() => removeExperience(index)} className="text-red-500 hover:bg-red-100 p-1.5 rounded-lg transition-colors">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Role & Company Inputs */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                                                        <input
                                                            placeholder="e.g. SDE Intern"
                                                            value={exp.role || ""} // backend calls it 'role'
                                                            onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-black outline-none bg-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Company</label>
                                                        <input
                                                            placeholder="e.g. Amazon"
                                                            value={exp.company || ""}
                                                            onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-black outline-none bg-white"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Date Logic */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
                                                        <input
                                                            type="date"
                                                            value={exp.startDate ? exp.startDate.split('T')[0] : ""} // Handle Date object or string
                                                            onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-black outline-none bg-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1">End Date</label>
                                                        <input
                                                            type="date"
                                                            disabled={exp.current}
                                                            value={exp.endDate ? exp.endDate.split('T')[0] : ""}
                                                            onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                                                            className={`w-full p-2 border border-gray-200 rounded-lg text-sm outline-none bg-white ${exp.current ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'focus:border-black'}`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Current Checkbox */}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`current-${index}`}
                                                        checked={exp.current || false}
                                                        onChange={(e) => handleExperienceChange(index, "current", e.target.checked)}
                                                        className="accent-black h-4 w-4"
                                                    />
                                                    <label htmlFor={`current-${index}`} className="text-sm text-gray-700 select-none cursor-pointer">
                                                        I currently work here
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            // --- VIEW MODE ---
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{exp.role}</h4>
                                                <p className="text-gray-700 font-medium">{exp.company}</p>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                    <span>{formatDate(exp.startDate)}</span>
                                                    <span className="h-px w-4 bg-gray-300"></span>
                                                    <span className={exp.current ? "text-green-600 font-semibold" : ""}>
                                                        {exp.current ? "Present" : formatDate(exp.endDate)}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {!isEditing && (!formData.experience || formData.experience.length === 0) && (
                                    <p className="text-sm text-gray-400 italic text-center py-4">No experience added yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Avatar Upload Modal */}
            <AvatarUploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                user={user}
            />

            {/* Banner Upload Modal */}
            <BannerUploadModal
                isOpen={isBannerUploadOpen}
                onClose={() => setIsBannerUploadOpen(false)}
                onSuccess={fetchProfile}
            />
        </div>
    );
};

export default Profile;