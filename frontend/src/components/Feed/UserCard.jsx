import { useState } from "react";
import { User, Briefcase, MapPin, ExternalLink, UserPlus, Check, MessageCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";

const UserCard = ({ profile }) => {
    const navigate = useNavigate();
    const [requestSent, setRequestSent] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectLoading, setConnectLoading] = useState(false);

    // --- HANDLER: Connect to User ---
    const handleConnect = async (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        
        if (!profile?.owner) return;
        
        try {
            setConnectLoading(true);
            const { data } = await api.post("/chat/request", {
                receiverId: profile.owner,
                requestMessage: `Hi ${profile.fullName}! I viewed your profile and would like to connect.`
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
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to connect";
            
            // Handle different statuses based on error message
            if (msg.toLowerCase().includes("already connected")) {
                setIsConnected(true);
                toast.success("You are already connected!");
            } else if (msg.toLowerCase().includes("pending")) {
                setRequestSent(true);
                toast.success("Request is already pending.");
            } else {
                toast.error(msg);
            }
        } finally {
            setConnectLoading(false);
        }
    };

    const handleMessage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/chat');
    };

    return (
        <Link 
            to={`/profile/${profile._id}`}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full group hover:border-gray-300"
        >
            {/* Header: Avatar & Name */}
            <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-black to-gray-700 overflow-hidden border-2 border-gray-100 group-hover:border-black transition-colors">
                        {profile.avatar ? (
                            <img 
                                src={profile.avatar} 
                                alt={profile.fullName} 
                                className="h-full w-full object-cover" 
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-white font-bold text-xl">
                                {profile.fullName?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {/* Role Badge Overlay */}
                    <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white uppercase">
                        {profile.role?.toLowerCase() === 'alumni' ? 'Alumni' : 'Student'}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {profile.fullName}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                        @{profile.username || 'user'}
                    </p>
                </div>
            </div>

            {/* Content: Current Role/Company */}
            <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2 text-sm">
                    <Briefcase className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
                    <div className="flex-1 min-w-0">
                        {profile.currentRole && (
                            <p className="font-semibold text-gray-900 line-clamp-1">
                                {profile.currentRole}
                            </p>
                        )}
                        <p className="text-gray-600 line-clamp-1">
                            {profile.currentCompany || profile.collegeName || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Bio Preview */}
                {profile.bio && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {profile.bio}
                    </p>
                )}

                {/* Skills Tags */}
                {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                        {profile.skills.slice(0, 3).map((skill, index) => (
                            <span 
                                key={index} 
                                className="px-2 py-1 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium hover:border-gray-300 transition-colors"
                            >
                                {skill}
                            </span>
                        ))}
                        {profile.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-xs text-gray-400 rounded-lg">
                                +{profile.skills.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer: Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                {/* Primary Action: View Profile */}
                <div className="flex-1">
                    <div className="flex items-center justify-center w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all gap-2 group-hover:border-black group-hover:text-black">
                        View Profile
                        <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                </div>

                {/* Secondary Action: Connect/Message */}
                {isConnected ? (
                    <button
                        onClick={handleMessage}
                        className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                        title="Send Message"
                    >
                        <MessageCircle className="h-5 w-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleConnect}
                        disabled={connectLoading || requestSent}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${
                            requestSent 
                            ? "bg-green-100 text-green-700 border-2 border-green-200 cursor-default"
                            : "bg-black text-white hover:bg-gray-800 hover:shadow-md"
                        }`}
                        title={requestSent ? "Request Sent" : "Send Connection Request"}
                    >
                        {connectLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : requestSent ? (
                            <Check className="h-5 w-5" />
                        ) : (
                            <UserPlus className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>
        </Link>
    );
};

export default UserCard;