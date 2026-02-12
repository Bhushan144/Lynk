import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Users, Briefcase, Lock, CheckCircle } from "lucide-react";
import ParticlesBackground from "../../components/ui/ParticlesBackground";
import Logo from "../../assets/lynk-logo.svg";

const Landing = () => {
    return (
        <div className="relative min-h-screen text-white overflow-x-hidden">
            
            {/* 1. Background (Particles + Overlay) - Subtle like original */}
            <div className="fixed inset-0 z-0">
                <ParticlesBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90 backdrop-blur-[1px]" />
            </div>

            {/* 2. Navbar (Logo + Auth Buttons) */}
            <nav className="relative z-50 px-6 lg:px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img src={Logo} alt="Lynk Logo" className="h-20 w-auto object-contain" />
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-6">
                    <Link 
                        to="/login" 
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Log in
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
                    >
                        Join Now
                    </Link>
                </div>
            </nav>

            {/* 3. Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 md:pt-12 pb-10 md:pb-20 flex flex-col items-center text-center">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-10">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">Verified Alumni Network</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                    Connect. Mentor. <br /> 
                    <p className="md:mb-2">Grow Together.</p>
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
                    The exclusive community for students and alumni. 
                    Unlock career opportunities, find mentorship, and build a network that lasts a lifetime.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                    <Link 
                        to="/register" 
                        className="px-10 py-4 bg-white text-black text-base font-bold rounded-full hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        Get Started
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    <Link 
                        to="/login" 
                        className="px-10 py-4 bg-transparent border border-white/20 text-white text-base font-semibold rounded-full hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
                    >
                        Sign In
                    </Link>
                </div>
            </main>

            {/* 4. Features Grid (Glassmorphism) */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {/* Feature 1 */}
                    <div className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                        <div className="h-14 w-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8">
                            <Users className="h-7 w-7 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Exclusive Network</h3>
                        <p className="text-gray-400 leading-relaxed text-base">
                            Connect directly with verified seniors and alumni working in top companies. No spam, just real connections.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                        <div className="h-14 w-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-8">
                            <Briefcase className="h-7 w-7 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Job Referrals</h3>
                        <p className="text-gray-400 leading-relaxed text-base">
                            Access internal job postings and referral opportunities shared exclusively by alumni for their juniors.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                        <div className="h-14 w-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-8">
                            <Lock className="h-7 w-7 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Verified & Secure</h3>
                        <p className="text-gray-400 leading-relaxed text-base">
                            Every member is verified via College ID. A safe space where you know exactly who you are talking to.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. How Verification Works */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20 border-t border-white/10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How it works</h2>
                    <p className="text-gray-400 text-lg">Join the network in 3 simple steps</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-20 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-black border border-white/20 flex items-center justify-center text-2xl font-bold text-white mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            1
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Create Account</h3>
                        <p className="text-base text-gray-400 max-w-xs leading-relaxed">
                            Sign up using your email and choose your role (Student/Alumni).
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-black border border-white/20 flex items-center justify-center text-2xl font-bold text-white mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            2
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Upload ID</h3>
                        <p className="text-base text-gray-400 max-w-xs leading-relaxed">
                            Upload your College ID card. Our admins verify every single profile manually.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            <CheckCircle className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Get Verified</h3>
                        <p className="text-base text-gray-400 max-w-xs leading-relaxed">
                            Once approved, unlock full access to the feed, jobs, and chat system.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-12 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Lynk Network. Built for VIIT.</p>
            </footer>

        </div>
    );
};

export default Landing;