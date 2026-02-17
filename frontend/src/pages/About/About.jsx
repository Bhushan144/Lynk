import { Users, Briefcase, Globe, Heart, ArrowRight, Sparkles, Target, TrendingUp, Award, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Clean with subtle animation */}
            <div className="relative bg-black text-white py-32 px-4 overflow-hidden">
                {/* Subtle animated background */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-2 animate-fade-in">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>Connecting Students & Alumni</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up">
                        Your College Network,
                        <br />
                        <span className="text-gray-400">Simplified</span>
                    </h1>
                    
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Connect with alumni for mentorship, career guidance, and opportunities.
                        Simple, free, and built for students like you.
                    </p>
                </div>

                <style>{`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fade-in-up {
                        from { 
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.6s ease-out;
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.6s ease-out;
                        animation-fill-mode: both;
                    }
                `}</style>
            </div>

            {/* Stats Bar - With hover effects */}
            <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="transition-transform hover:scale-110 duration-300">
                            <div className="text-3xl font-bold text-black mb-1">5,000+</div>
                            <div className="text-sm text-gray-500">Active Members</div>
                        </div>
                        <div className="transition-transform hover:scale-110 duration-300">
                            <div className="text-3xl font-bold text-black mb-1">200+</div>
                            <div className="text-sm text-gray-500">Companies</div>
                        </div>
                        <div className="transition-transform hover:scale-110 duration-300">
                            <div className="text-3xl font-bold text-black mb-1">50+</div>
                            <div className="text-sm text-gray-500">Countries</div>
                        </div>
                        <div className="transition-transform hover:scale-110 duration-300">
                            <div className="text-3xl font-bold text-black mb-1">100%</div>
                            <div className="text-sm text-gray-500">Free Forever</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section - With animations */}
            <div className="max-w-5xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                            <Target className="h-4 w-4" />
                            Our Mission
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-900">
                            Unlock Your Alumni Network
                        </h2>
                        
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                Your college's greatest resource is its alumni network. Yet most students 
                                never tap into this goldmine of experience and connections.
                            </p>
                            <p>
                                We're changing that by building a simple bridge between students seeking 
                                guidance and alumni eager to give back.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black text-white p-6 rounded-xl hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                            <Users className="h-8 w-8 mb-3 opacity-90" />
                            <div className="text-2xl font-bold mb-1">5,000+</div>
                            <div className="text-sm text-gray-300">Active Members</div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl mt-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg">
                            <Globe className="h-8 w-8 text-black mb-3" />
                            <div className="text-2xl font-bold mb-1">Global</div>
                            <div className="text-sm text-gray-600">Network</div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl hover:scale-105 transition-transform duration-300 hover:shadow-lg">
                            <Briefcase className="h-8 w-8 text-black mb-3" />
                            <div className="text-2xl font-bold mb-1">200+</div>
                            <div className="text-sm text-gray-600">Companies</div>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl mt-6 hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                            <Heart className="h-8 w-8 mb-3 opacity-90" />
                            <div className="text-2xl font-bold mb-1">100%</div>
                            <div className="text-sm text-gray-300">Free</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section - With hover effects */}
            <div className="bg-gray-50 py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Built For Everyone
                        </h2>
                        <p className="text-gray-600">
                            Whether you're a student, alumni, or institution
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* For Students */}
                        <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
                            <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">For Students</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                                    <span>Connect with alumni at dream companies</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                                    <span>Get referrals and interview tips</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                                    <span>Resume reviews from experts</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                                    <span>Career guidance and mentorship</span>
                                </li>
                            </ul>
                        </div>

                        {/* For Alumni */}
                        <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
                            <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">For Alumni</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                                    <span>Stay connected with your alma mater</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                                    <span>Find talented recruits</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                                    <span>Mentor future leaders</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                                    <span>Build your network</span>
                                </li>
                            </ul>
                        </div>

                        {/* For Colleges */}
                        <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
                            <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Rocket className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">For Colleges</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-purple-600 font-bold mt-0.5">✓</span>
                                    <span>Build institutional legacy</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-purple-600 font-bold mt-0.5">✓</span>
                                    <span>Track alumni success stories</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-purple-600 font-bold mt-0.5">✓</span>
                                    <span>Foster culture of giving back</span>
                                </li>
                                <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                    <span className="text-purple-600 font-bold mt-0.5">✓</span>
                                    <span>Improve student placements</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials - With hover lift */}
            <div className="max-w-5xl mx-auto px-4 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        What People Say
                    </h2>
                    <p className="text-gray-600">Real stories from our community</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="text-yellow-400 text-xl mb-3">★★★★★</div>
                        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                            "Got my dream job at Google thanks to an alum referral. Game-changer!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                                RS
                            </div>
                            <div>
                                <div className="font-semibold text-sm">Rahul Sharma</div>
                                <div className="text-xs text-gray-500">Student</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="text-yellow-400 text-xl mb-3">★★★★★</div>
                        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                            "Mentoring students gives me joy. Love seeing them succeed!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                                PK
                            </div>
                            <div>
                                <div className="font-semibold text-sm">Priya Kapoor</div>
                                <div className="text-xs text-gray-500">Alumni, Microsoft</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="text-yellow-400 text-xl mb-3">★★★★★</div>
                        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                            "Finally brings our alumni community together. Phenomenal!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                                AM
                            </div>
                            <div>
                                <div className="font-semibold text-sm">Dr. Amit Mehta</div>
                                <div className="text-xs text-gray-500">College Dean</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section - Animated button */}
            <div className="relative bg-black text-white py-20 px-4 overflow-hidden">
                {/* Subtle animated background */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Ready to Connect?
                    </h2>
                    <p className="text-xl text-gray-300">
                        Join thousands of students and alumni already growing together.
                    </p>
                    <div className="pt-4">
                        <Link 
                            to="/" 
                            className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                        >
                            Get Started Free
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <p className="text-sm text-gray-400 pt-2">
                        Free forever • No credit card • Join in 2 minutes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;