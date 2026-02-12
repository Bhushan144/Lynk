import { Users, Briefcase, Globe, Rocket, Heart, ArrowRight, Sparkles, Target, TrendingUp, Award, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Enhanced with animation */}
            <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-24 px-4 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-gray-800/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-gray-800/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <div className="relative max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <span>Connecting Generations of Excellence</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                        Bridging the Gap Between{" "}
                        <span className="bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
                            Past & Future
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        The exclusive platform connecting ambitious students with successful alumni for mentorship, career guidance, and life-changing opportunities.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link 
                            to="/" 
                            className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Get Started Now
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20">
                            Watch Demo
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-black mb-2">5,000+</div>
                            <div className="text-sm text-gray-600 font-medium">Active Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-black mb-2">200+</div>
                            <div className="text-sm text-gray-600 font-medium">Partner Companies</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-black mb-2">50+</div>
                            <div className="text-sm text-gray-600 font-medium">Countries</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-black mb-2">100%</div>
                            <div className="text-sm text-gray-600 font-medium">Free Forever</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section - Redesigned */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm font-semibold mb-2">
                            <Target className="h-4 w-4" />
                            Our Mission
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Democratizing Access to Career Success
                        </h2>
                        
                        <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                            <p>
                                We believe that the greatest resource a college has is its alumni network. 
                                Yet, most students never tap into this goldmine of experience, wisdom, and connections.
                            </p>
                            <p>
                                AlumniConnect changes that. We're building a seamless bridge between current students 
                                hungry for guidance and successful alumni eager to give back.
                            </p>
                            <p className="font-medium text-gray-900">
                                Whether you're a student looking for your first internship, or an alum looking to 
                                mentor the next generation—this is your community.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Link 
                                to="/" 
                                className="inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all"
                            >
                                Join the movement
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white transform hover:scale-105 transition-transform">
                                    <Users className="h-10 w-10 mb-4 opacity-90" />
                                    <h3 className="font-bold text-2xl mb-2">5,000+</h3>
                                    <p className="text-gray-300 text-sm">Active Community Members</p>
                                </div>
                                <div className="bg-gray-100 p-8 rounded-2xl transform hover:scale-105 transition-transform">
                                    <Globe className="h-10 w-10 text-black mb-4" />
                                    <h3 className="font-bold text-2xl mb-2">Global</h3>
                                    <p className="text-gray-600 text-sm">Worldwide Alumni Network</p>
                                </div>
                            </div>
                            <div className="space-y-4 mt-8">
                                <div className="bg-gray-100 p-8 rounded-2xl transform hover:scale-105 transition-transform">
                                    <Briefcase className="h-10 w-10 text-black mb-4" />
                                    <h3 className="font-bold text-2xl mb-2">200+</h3>
                                    <p className="text-gray-600 text-sm">Partner Companies</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-2xl text-white transform hover:scale-105 transition-transform">
                                    <Heart className="h-10 w-10 mb-4 opacity-90" />
                                    <h3 className="font-bold text-2xl mb-2">100%</h3>
                                    <p className="text-gray-300 text-sm">Free to Join & Use</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Join Section - Enhanced */}
            <div className="bg-gradient-to-b from-white to-gray-50 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm font-semibold mb-4">
                            <Sparkles className="h-4 w-4" />
                            Built For You
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Join AlumniConnect?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Different benefits for everyone in our community
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* For Students */}
                        <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-black">
                            <div className="h-14 w-14 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Students</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                    </div>
                                    <span>Direct access to alumni at dream companies</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                    </div>
                                    <span>Get referrals and insider interview tips</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                    </div>
                                    <span>Resume reviews from industry experts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                    </div>
                                    <span>Career guidance from those who've been there</span>
                                </li>
                            </ul>
                        </div>

                        {/* For Alumni */}
                        <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-black">
                            <div className="h-14 w-14 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Award className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Alumni</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                    <span>Stay connected with your alma mater</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                    <span>Find talented recruits for your company</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                    <span>Mentor the next generation of leaders</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                    <span>Build your personal brand and network</span>
                                </li>
                            </ul>
                        </div>

                        {/* For Colleges */}
                        <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-black">
                            <div className="h-14 w-14 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Rocket className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Colleges</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                    </div>
                                    <span>Build a strong institutional legacy</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                    </div>
                                    <span>Track and celebrate alumni success stories</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                    </div>
                                    <span>Foster a culture of giving back</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                    </div>
                                    <span>Improve student placement outcomes</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section - NEW */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm font-semibold mb-4">
                        <MessageCircle className="h-4 w-4" />
                        Success Stories
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        What Our Community Says
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-5 w-5 text-yellow-400">★</div>
                            ))}
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            "Got my dream job at Google thanks to a referral from an alum I met here. This platform is a game-changer!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                RS
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Rahul Sharma</div>
                                <div className="text-sm text-gray-500">Student, 2024</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-5 w-5 text-yellow-400">★</div>
                            ))}
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            "Mentoring students gives me so much joy. It's amazing to see them grow and succeed in their careers."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                PK
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Priya Kapoor</div>
                                <div className="text-sm text-gray-500">Alumni, Microsoft</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-5 w-5 text-yellow-400">★</div>
                            ))}
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            "Finally, a platform that brings our alumni community together. The engagement has been phenomenal!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                AM
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Dr. Amit Mehta</div>
                                <div className="text-sm text-gray-500">College Dean</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section - Enhanced */}
            <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-24 px-4 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                        Ready to Expand Your Network?
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Join thousands of students and alumni already connecting, learning, and growing together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link 
                            to="/" 
                            className="group inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Get Started Now
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <p className="text-sm text-gray-400 pt-4">
                        100% Free • No Credit Card Required • Join in 2 Minutes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;