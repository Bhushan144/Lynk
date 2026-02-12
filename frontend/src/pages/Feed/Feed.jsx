import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react"; 
import toast from "react-hot-toast";
import api from "../../utils/axios";
import UserCard from "../../components/Feed/UserCard";

const Feed = () => {
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch Profiles
    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true);
            try {
                const endpoint = debouncedSearch 
                    ? `/profile/feed?search=${debouncedSearch}` 
                    : "/profile/feed";
                
                const { data } = await api.get(endpoint);
                // console.log("FRONTEND FEED DATA:", data);
                
                if (data.success) {
                    setProfiles(data.data.profiles);
                }
            } catch (error) {
                console.log(error);
                if (error.response?.status !== 404) {
                    toast.error("Could not load feed");
                } else {
                    setProfiles([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfiles();
    }, [debouncedSearch]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* REMOVED <Navbar /> HERE */}

            {/* Hero / Search Section */}
            <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Alumni Directory</h1>
                            <p className="text-gray-500 text-sm mt-1">Connect with seniors and peers from your college.</p>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, company, or skill..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 text-black animate-spin mb-4" />
                        <p className="text-gray-500">Loading directory...</p>
                    </div>
                ) : profiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {profiles.map((profile) => (
                            <UserCard key={profile._id} profile={profile} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;