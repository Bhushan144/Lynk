import { useState } from "react";
import { Moon, Sun, Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import api from "../../utils/axios";

const Settings = () => {
    // Dark Mode State
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

    // Toggle Dark Mode
    const toggleDarkMode = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        
        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // Handle Password Input Change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear message when user starts typing
        setPasswordMessage({ type: "", text: "" });
    };

    // Validate Password Strength
    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        }
        return null;
    };

    // Handle Password Change Submit
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: "", text: "" });

        // Validation
        if (!passwordData.oldPassword) {
            setPasswordMessage({ type: "error", text: "Please enter your current password" });
            return;
        }

        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordMessage({ type: "error", text: "Please fill in all password fields" });
            return;
        }

        // Validate new password strength
        const validationError = validatePassword(passwordData.newPassword);
        if (validationError) {
            setPasswordMessage({ type: "error", text: validationError });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        if (passwordData.oldPassword === passwordData.newPassword) {
            setPasswordMessage({ type: "error", text: "New password must be different from old password" });
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await api.post("/users/change-password", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.data.success) {
                setPasswordMessage({ 
                    type: "success", 
                    text: "Password changed successfully!" 
                });
                // Clear form
                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to change password. Please try again.";
            setPasswordMessage({ type: "error", text: errorMessage });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account preferences and security</p>
                </div>

                {/* Theme Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {isDarkMode ? (
                                    <Moon className="h-6 w-6 text-gray-900" />
                                ) : (
                                    <Sun className="h-6 w-6 text-gray-900" />
                                )}
                                <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                            </div>
                            <p className="text-gray-600 text-sm ml-9">
                                {isDarkMode 
                                    ? "Dark mode is currently enabled" 
                                    : "Light mode is currently enabled"
                                }
                            </p>
                        </div>

                        {/* Toggle Switch - FIXED */}
                        <button
                            onClick={toggleDarkMode}
                            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none ${
                                isDarkMode ? "bg-gray-900" : "bg-gray-200"
                            }`}
                        >
                            <span
                                className={`flex h-10 w-10 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform ${
                                    isDarkMode ? "translate-x-12" : "translate-x-1"
                                }`}
                            >
                                {isDarkMode ? (
                                    <Moon className="h-5 w-5 text-gray-900" />
                                ) : (
                                    <Sun className="h-5 w-5 text-gray-600" />
                                )}
                            </span>
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl border-2 transition-all ${
                                !isDarkMode 
                                    ? "border-black bg-gray-50" 
                                    : "border-gray-200 bg-white hover:border-gray-300"
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                        <Sun className="h-5 w-5 text-gray-900" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Light Mode</div>
                                        <div className="text-sm text-gray-500">Classic bright theme</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border-2 transition-all ${
                                isDarkMode 
                                    ? "border-black bg-gray-50" 
                                    : "border-gray-200 bg-white hover:border-gray-300"
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                                        <Moon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Dark Mode</div>
                                        <div className="text-sm text-gray-500">Easy on the eyes</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-sm text-blue-900">
                            <strong>Note:</strong> Dark mode is coming soon! This setting will be fully functional in the next update.
                        </p>
                    </div>
                </div>

                {/* Password Change */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="h-6 w-6 text-gray-900" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                            <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-5">
                        {/* Current Password */}
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {/* Password Requirements */}
                            <div className="mt-3 space-y-2">
                                <p className="text-xs font-medium text-gray-600">Password must contain:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className={`flex items-center gap-2 text-xs ${
                                        passwordData.newPassword.length >= 8 ? "text-green-600" : "text-gray-500"
                                    }`}>
                                        <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                            passwordData.newPassword.length >= 8 ? "bg-green-100" : "bg-gray-100"
                                        }`}>
                                            {passwordData.newPassword.length >= 8 && <Check className="h-3 w-3" />}
                                        </div>
                                        At least 8 characters
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${
                                        /[A-Z]/.test(passwordData.newPassword) ? "text-green-600" : "text-gray-500"
                                    }`}>
                                        <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                            /[A-Z]/.test(passwordData.newPassword) ? "bg-green-100" : "bg-gray-100"
                                        }`}>
                                            {/[A-Z]/.test(passwordData.newPassword) && <Check className="h-3 w-3" />}
                                        </div>
                                        One uppercase letter
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${
                                        /[a-z]/.test(passwordData.newPassword) ? "text-green-600" : "text-gray-500"
                                    }`}>
                                        <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                            /[a-z]/.test(passwordData.newPassword) ? "bg-green-100" : "bg-gray-100"
                                        }`}>
                                            {/[a-z]/.test(passwordData.newPassword) && <Check className="h-3 w-3" />}
                                        </div>
                                        One lowercase letter
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${
                                        /[0-9]/.test(passwordData.newPassword) ? "text-green-600" : "text-gray-500"
                                    }`}>
                                        <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                            /[0-9]/.test(passwordData.newPassword) ? "bg-green-100" : "bg-gray-100"
                                        }`}>
                                            {/[0-9]/.test(passwordData.newPassword) && <Check className="h-3 w-3" />}
                                        </div>
                                        One number
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {passwordData.confirmPassword && (
                                <p className={`mt-2 text-xs flex items-center gap-1 ${
                                    passwordData.newPassword === passwordData.confirmPassword
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}>
                                    {passwordData.newPassword === passwordData.confirmPassword ? (
                                        <>
                                            <Check className="h-3 w-3" />
                                            Passwords match
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-3 w-3" />
                                            Passwords do not match
                                        </>
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Message Display */}
                        {passwordMessage.text && (
                            <div
                                className={`p-4 rounded-xl flex items-start gap-3 ${
                                    passwordMessage.type === "success"
                                        ? "bg-green-50 border border-green-200"
                                        : "bg-red-50 border border-red-200"
                                }`}
                            >
                                {passwordMessage.type === "success" ? (
                                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                )}
                                <p
                                    className={`text-sm font-medium ${
                                        passwordMessage.type === "success" ? "text-green-800" : "text-red-800"
                                    }`}
                                >
                                    {passwordMessage.text}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setPasswordData({
                                        oldPassword: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });
                                    setPasswordMessage({ type: "", text: "" });
                                }}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex-1 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {passwordLoading ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Updating Password...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-5 w-5" />
                                        Update Password
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Tips */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Security Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-black mt-0.5">•</span>
                            <span>Use a unique password that you don't use for other accounts</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-black mt-0.5">•</span>
                            <span>Change your password regularly (every 3-6 months)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-black mt-0.5">•</span>
                            <span>Never share your password with anyone</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-black mt-0.5">•</span>
                            <span>Consider using a password manager for better security</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Settings;