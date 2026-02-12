import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Briefcase, GraduationCap, ArrowRight, AtSign } from "lucide-react";
import api from "../../utils/axios";
import { login } from "../../features/authSlice";
import ParticlesBackground from "../../components/ui/ParticlesBackground";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        role: "STUDENT"
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role: role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. REGISTER
            const registerResponse = await api.post("/auth/register", formData);

            if (registerResponse.data.success) {
                toast.success("Account Created! Logging you in...");

                // 2. AUTO-LOGIN
                const loginResponse = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password
                });

                if (loginResponse.data.success) {
                    // 3. SAVE TO REDUX & REDIRECT
                    dispatch(login(loginResponse.data.data.user));
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Registration failed";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
            
            {/* Background */}
            <ParticlesBackground />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/30 to-gray-800/40 backdrop-blur-[1px]" />

            {/* Register Container */}
            <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
                    
                    {/* Header */}
                    <div className="mb-5 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Create Account
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Join the Lynk community today
                        </p>
                    </div>

                    {/* Role Selection Toggle */}
                    <div className="flex p-1 mb-5 bg-gray-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => handleRoleChange("STUDENT")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                formData.role === "STUDENT"
                                    ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange("ALUMNI")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                formData.role === "ALUMNI"
                                    ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Alumni
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        
                        {/* Full Name */}
                        <div>
                            <label className="text-xs font-medium text-gray-700 ml-1">Full Name</label>
                            <div className="relative mt-0.5">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    className="block w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white/90"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="text-xs font-medium text-gray-700 ml-1">Username</label>
                            <div className="relative mt-0.5">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <AtSign className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white/90"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative mt-0.5">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white/90"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative mt-0.5">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white/90"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl text-white font-semibold transition-all duration-200 text-sm ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black hover:bg-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            }`}
                        >
                            {isLoading ? "Creating Account..." : "Register"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-5 text-center">
                        <span className="text-gray-500 text-sm">Already have an account? </span>
                        <Link 
                            to="/login" 
                            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-black hover:underline"
                        >
                            Sign in
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;