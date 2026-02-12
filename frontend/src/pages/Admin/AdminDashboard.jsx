import { useEffect, useState } from "react";
import { Check, X, ExternalLink, ShieldAlert, FileText, User } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import Navbar from "../../components/ui/Navbar";

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch Pending Requests
    const fetchPendingUsers = async () => {
        try {
            const response = await api.get("/admin/pending");
            if (response.data.success) {
                setPendingUsers(response.data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch pending requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    // 2. Handle Verification Action (Approve/Reject)
    const handleVerdict = async (userId, status) => {
        try {
            const response = await api.post("/admin/verify", {
                userId,
                status // "VERIFIED" or "REJECTED"
            });

            if (response.data.success) {
                toast.success(`User ${status.toLowerCase()} successfully`);
                // Remove this user from the local state list immediately
                setPendingUsers((prev) => prev.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.log(error);
            toast.error("Action failed");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldAlert className="h-8 w-8 text-black" />
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                        {pendingUsers.length} Pending
                    </span>
                </div>

                {/* Empty State */}
                {pendingUsers.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">All Caught Up!</h2>
                        <p className="text-gray-500 mt-2">There are no pending verification requests.</p>
                    </div>
                ) : (
                    /* Requests Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingUsers.map((user) => (
                            <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                
                                {/* Header */}
                                <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                            {user.fullName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 line-clamp-1">{user.fullName}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                                    {user.role}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ID Proof Section */}
                                <div className="p-6 flex-1 flex flex-col items-center justify-center bg-gray-50/50">
                                    {user.verificationProof ? (
                                        <div className="relative group w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                                            <img 
                                                src={user.verificationProof} 
                                                alt="ID Proof" 
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Hover Overlay to Open Full Image */}
                                            <a 
                                                href={user.verificationProof} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium gap-2"
                                            >
                                                <ExternalLink className="h-5 w-5" />
                                                View Full Size
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                                            <FileText className="h-8 w-8 mb-2 opacity-50" />
                                            <span className="text-sm">No Document</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => handleVerdict(user._id, "REJECTED")}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                        Reject
                                    </button>
                                    <button 
                                        onClick={() => handleVerdict(user._id, "VERIFIED")}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-semibold text-sm transition-colors shadow-sm"
                                    >
                                        <Check className="h-4 w-4" />
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;