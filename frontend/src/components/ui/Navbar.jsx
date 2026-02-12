import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Home, Briefcase, MessageSquare, User, LogOut, Menu, X, Bell, Lock, LayoutDashboard, Settings, CreditCard, Info } from "lucide-react";
import { logout } from "../../features/authSlice";
import Logo from "../../assets/lynk-logo_afterLogin.svg";

const Navbar = ({ isLocked = false }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isAdmin = user?.role === "ADMIN"; // Check if user is admin

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo Section */}
                    <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-3 group">
                        <div className="relativ">
                            <img src={Logo} alt="Lynk" className="mt-2 h-18 w-auto transition-transform group-hover:scale-110 rounded-sm" />
                            

                        </div>
                    </Link>

                    {/* Desktop Navigation - Conditional based on role */}
                    <div className="hidden md:flex items-center space-x-1">
                        {isAdmin ? (
                            // ADMIN VIEW - Only Dashboard
                            <Link 
                                to="/admin" 
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                    isActive("/admin") 
                                        ? "text-black bg-gray-100" 
                                        : "text-gray-600 hover:text-black hover:bg-gray-50"
                                }`}
                            >
                                <LayoutDashboard className="h-5 w-5" />
                                <span className="font-medium">Dashboard</span>
                                {isActive("/admin") && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-black rounded-t-full"></div>
                                )}
                            </Link>
                        ) : (
                            // STUDENT/ALUMNI VIEW - Feed, Jobs, Messages, About
                            <>
                                {/* Feed Link */}
                                {isLocked ? (
                                    <div className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                                        <div className="relative">
                                            <Home className="h-5 w-5" />
                                            <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                <Lock className="h-2.5 w-2.5 text-gray-500" />
                                            </div>
                                        </div>
                                        <span className="font-medium">Feed</span>
                                    </div>
                                ) : (
                                    <Link 
                                        to="/" 
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                            isActive("/") 
                                                ? "text-black bg-gray-100" 
                                                : "text-gray-600 hover:text-black hover:bg-gray-50"
                                        }`}
                                    >
                                        <Home className="h-5 w-5" />
                                        <span className="font-medium">Feed</span>
                                        {isActive("/") && (
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-black rounded-t-full"></div>
                                        )}
                                    </Link>
                                )}
                                
                                {/* Jobs Link */}
                                {isLocked ? (
                                    <div className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                                        <div className="relative">
                                            <Briefcase className="h-5 w-5" />
                                            <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                <Lock className="h-2.5 w-2.5 text-gray-500" />
                                            </div>
                                        </div>
                                        <span className="font-medium">Jobs</span>
                                    </div>
                                ) : (
                                    <Link 
                                        to="/jobs" 
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                            isActive("/jobs") 
                                                ? "text-black bg-gray-100" 
                                                : "text-gray-600 hover:text-black hover:bg-gray-50"
                                        }`}
                                    >
                                        <Briefcase className="h-5 w-5" />
                                        <span className="font-medium">Jobs</span>
                                        {isActive("/jobs") && (
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-black rounded-t-full"></div>
                                        )}
                                    </Link>
                                )}

                                {/* Messages Link */}
                                {isLocked ? (
                                    <div className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                                        <div className="relative">
                                            <MessageSquare className="h-5 w-5" />
                                            <div className="absolute top-1 right-1 bg-gray-200 rounded-full p-0.5">
                                                <Lock className="h-2.5 w-2.5 text-gray-500" />
                                            </div>
                                        </div>
                                        <span className="font-medium">Messages</span>
                                    </div>
                                ) : (
                                    <Link 
                                        to="/chat" 
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                            isActive("/chat") 
                                                ? "text-black bg-gray-100" 
                                                : "text-gray-600 hover:text-black hover:bg-gray-50"
                                        }`}
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                        <span className="font-medium">Messages</span>
                                        {isActive("/chat") && (
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-black rounded-t-full"></div>
                                        )}
                                    </Link>
                                )}

                                {/* About Link - NEW */}
                                <Link 
                                    to="/about" 
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                        isActive("/about") 
                                            ? "text-black bg-gray-100" 
                                            : "text-gray-600 hover:text-black hover:bg-gray-50"
                                    }`}
                                >
                                    <Info className="h-5 w-5" />
                                    <span className="font-medium">About</span>
                                    {isActive("/about") && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-black rounded-t-full"></div>
                                    )}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* User Section */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Notification Bell - Only show for non-admin and not locked */}
                        {/* {!isAdmin && !isLocked && (
                            <button 
                                className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200"
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full"></span>
                            </button>
                        )} */}

                        {/* Profile Dropdown */}
                        <div className="relative group pl-3 border-gray-200">
                            
                            {/* The Trigger (Avatar with user info) */}
                            <button className="flex items-center gap-3 focus:outline-none">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                                </div>
                                
                                {/* User Avatar */}
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-black text-white font-bold text-sm">
                                                {user?.fullName?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Online indicator - hide for admin */}
                                    {!isAdmin && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-900 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                            </button>

                            {/* The Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                
                                {/* Header (Small User Info) */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    {/* Profile Link - Only show for non-admin */}
                                    {!isAdmin && (
                                        isLocked ? (
                                            <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 cursor-not-allowed opacity-60">
                                                <div className="relative">
                                                    <User className="h-4 w-4" />
                                                    <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                        <Lock className="h-2 w-2 text-gray-500" />
                                                    </div>
                                                </div>
                                                Your Profile
                                            </div>
                                        ) : (
                                            <Link 
                                                to="/profile" 
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                                Your Profile
                                            </Link>
                                        )
                                    )}
                                    
                                    {/* Settings Link - Now Active */}
                                    <Link 
                                        to="/settings" 
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                    
                                    {/* Future Placeholder */}
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-not-allowed opacity-50">
                                        <CreditCard className="h-4 w-4" />
                                        Subscription (Soon)
                                    </button>
                                </div>

                                {/* Logout Section */}
                                <div className="border-t border-gray-100 py-2">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        {!isAdmin && !isLocked && (
                            <button 
                                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full"></span>
                            </button>
                        )}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-4 pt-4 pb-6 space-y-1">
                        {/* User Info Mobile */}
                        <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-gray-100 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-semibold">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                                <p className="text-xs text-gray-600 capitalize">{user?.role?.toLowerCase()}</p>
                            </div>
                        </div>

                        {isAdmin ? (
                            // ADMIN VIEW - Mobile Dashboard Link
                            <Link 
                                to="/admin" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                    isActive("/admin") 
                                        ? "text-black bg-gray-100" 
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <LayoutDashboard className="h-5 w-5" />
                                Dashboard
                            </Link>
                        ) : (
                            // STUDENT/ALUMNI VIEW - Mobile Links
                            <>
                                {/* Feed Link - Mobile */}
                                {isLocked ? (
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                                        <div className="relative">
                                            <Home className="h-5 w-5" />
                                            <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                <Lock className="h-2.5 w-2.5 text-gray-500" />
                                            </div>
                                        </div>
                                        <span className="text-base font-medium">Feed</span>
                                    </div>
                                ) : (
                                    <Link 
                                        to="/" 
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                            isActive("/") 
                                                ? "text-black bg-gray-100" 
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Home className="h-5 w-5" />
                                        Feed
                                    </Link>
                                )}

                                {/* Jobs Link - Mobile */}
                                {isLocked ? (
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                                        <div className="relative">
                                            <Briefcase className="h-5 w-5" />
                                            <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                <Lock className="h-2.5 w-2.5 text-gray-500" />
                                            </div>
                                        </div>
                                        <span className="text-base font-medium">Jobs</span>
                                    </div>
                                ) : (
                                    <Link 
                                        to="/jobs" 
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                            isActive("/jobs") 
                                                ? "text-black bg-gray-100" 
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Briefcase className="h-5 w-5" />
                                        Jobs
                                    </Link>
                                )}

                                {/* Messages Link - Mobile */}
                                {isLocked ? (
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                                        <div className="relative">
                                            <MessageSquare className="h-5 w-5" />
                                            <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                <Lock className="h-2.5 w-2.5 text-gray-500" />
                                            </div>
                                        </div>
                                        <span className="text-base font-medium">Messages</span>
                                    </div>
                                ) : (
                                    <Link 
                                        to="/chat" 
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                            isActive("/chat") 
                                                ? "text-black bg-gray-100" 
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                        Messages
                                    </Link>
                                )}

                                {/* About Link - Mobile - NEW */}
                                <Link 
                                    to="/about" 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                        isActive("/about") 
                                            ? "text-black bg-gray-100" 
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Info className="h-5 w-5" />
                                    About
                                </Link>

                                {/* Profile Link - Mobile */}
                                {isLocked ? (
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                                        <div className="relative">
                                            <User className="h-5 w-5" />
                                            <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                <Lock className="h-2.5 w-2.5 text-gray-500" />
                                            </div>
                                        </div>
                                        <span className="text-base font-medium">Profile</span>
                                    </div>
                                ) : (
                                    <Link 
                                        to="/profile" 
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                            isActive("/profile") 
                                                ? "text-black bg-gray-100" 
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="h-5 w-5" />
                                        Profile
                                    </Link>
                                )}

                                {/* Settings Link - Mobile - Now Active */}
                                <Link 
                                    to="/settings" 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                        isActive("/settings") 
                                            ? "text-black bg-gray-100" 
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Settings className="h-5 w-5" />
                                    Settings
                                </Link>
                                
                                {/* Subscription placeholder - Mobile */}
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-all text-left cursor-not-allowed opacity-50">
                                    <CreditCard className="h-5 w-5" />
                                    Subscription (Soon)
                                </button>
                            </>
                        )}

                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;