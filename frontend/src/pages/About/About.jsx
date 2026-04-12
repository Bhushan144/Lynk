import { Users, Briefcase, MessageCircle, Heart, ArrowRight, Sparkles, Target, TrendingUp, Award, Rocket, Shield, Zap, BookOpen, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-black text-white py-32 px-4 overflow-hidden">
                {/* Animated background orbs */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-2 animate-fade-in">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>The Campus Network That Matters</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in-up">
                        Bridge The Gap
                        <br />
                        <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">Between Campus & Career</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                        Lynk connects students with alumni who've walked the same halls, 
                        faced the same challenges, and are ready to help the next generation succeed.
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

            {/* Value Pillars - Replacing fake stats */}
            <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-14">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="group transition-transform hover:scale-105 duration-300">
                            <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                                <Handshake className="h-6 w-6 text-white" />
                            </div>
                            <div className="font-bold text-gray-900 mb-1">Real Connections</div>
                            <div className="text-xs text-gray-500">Not just followers</div>
                        </div>
                        <div className="group transition-transform hover:scale-105 duration-300">
                            <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div className="font-bold text-gray-900 mb-1">Verified Profiles</div>
                            <div className="text-xs text-gray-500">College-authenticated</div>
                        </div>
                        <div className="group transition-transform hover:scale-105 duration-300">
                            <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <div className="font-bold text-gray-900 mb-1">Instant Chat</div>
                            <div className="text-xs text-gray-500">Real-time messaging</div>
                        </div>
                        <div className="group transition-transform hover:scale-105 duration-300">
                            <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <div className="font-bold text-gray-900 mb-1">Always Free</div>
                            <div className="text-xs text-gray-500">No hidden costs</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-5xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                            <Target className="h-4 w-4" />
                            Our Mission
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                            Your Alumni Network Is Your 
                            <span className="text-gray-400"> Greatest Untapped Resource</span>
                        </h2>
                        
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                Every college has successful alumni who want to help — but students 
                                rarely know how to reach them. Cold LinkedIn messages go unanswered, 
                                career fairs feel transactional, and genuine mentorship is hard to find.
                            </p>
                            <p>
                                Lynk changes that. We create a trusted space where the shared bond of 
                                your college opens doors that would otherwise stay closed. No awkward 
                                outreach — just authentic connections between people who share a campus story.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black text-white p-6 rounded-2xl hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                            <MessageCircle className="h-8 w-8 mb-4 opacity-90" />
                            <div className="text-lg font-bold mb-1">Direct Access</div>
                            <div className="text-sm text-gray-300">Message alumni directly — no middleman</div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl mt-8 hover:scale-105 transition-transform duration-300 hover:shadow-lg">
                            <BookOpen className="h-8 w-8 text-black mb-4" />
                            <div className="text-lg font-bold mb-1">Shared Context</div>
                            <div className="text-sm text-gray-600">Same college, same struggles, real advice</div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl hover:scale-105 transition-transform duration-300 hover:shadow-lg">
                            <Briefcase className="h-8 w-8 text-black mb-4" />
                            <div className="text-lg font-bold mb-1">Career Growth</div>
                            <div className="text-sm text-gray-600">Referrals, tips, and opportunities</div>
                        </div>
                        <div className="bg-black text-white p-6 rounded-2xl mt-8 hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                            <Users className="h-8 w-8 mb-4 opacity-90" />
                            <div className="text-lg font-bold mb-1">Community</div>
                            <div className="text-sm text-gray-300">A growing network that gives back</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-50 py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            How Lynk Works
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Three simple steps to unlock mentorship, guidance, and career opportunities
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="h-16 w-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                <span className="text-white text-2xl font-bold">①</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900">Create Your Profile</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Sign up with your college email. Your profile is verified so alumni know you're legit.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="h-16 w-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                <span className="text-white text-2xl font-bold">②</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900">Find & Connect</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Browse alumni from your college. Send a connection request with a personal note.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="h-16 w-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                <span className="text-white text-2xl font-bold">③</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900">Chat & Grow</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Once connected, chat in real-time. Get advice, referrals, and mentorship that matters.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-5xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Built For Everyone
                    </h2>
                    <p className="text-gray-600">
                        Whether you're starting your career or looking to give back
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* For Students */}
                    <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
                        <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900">For Students</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-green-600 font-bold mt-0.5">✓</span>
                                <span>Connect with alumni at your dream companies</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-green-600 font-bold mt-0.5">✓</span>
                                <span>Get referrals and interview preparation tips</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-green-600 font-bold mt-0.5">✓</span>
                                <span>Resume and portfolio reviews from professionals</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-green-600 font-bold mt-0.5">✓</span>
                                <span>Career guidance from people who've been in your place</span>
                            </li>
                        </ul>
                    </div>

                    {/* For Alumni */}
                    <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
                        <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
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
                                <span>Discover talented students for your team</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-blue-600 font-bold mt-0.5">✓</span>
                                <span>Mentor the next generation of professionals</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-blue-600 font-bold mt-0.5">✓</span>
                                <span>Give back to the community that shaped you</span>
                            </li>
                        </ul>
                    </div>

                    {/* For Colleges */}
                    <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
                        <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <Rocket className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900">For Colleges</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-purple-600 font-bold mt-0.5">✓</span>
                                <span>Strengthen alumni-student relationships</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-purple-600 font-bold mt-0.5">✓</span>
                                <span>Build an active, engaged alumni network</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-purple-600 font-bold mt-0.5">✓</span>
                                <span>Foster a culture of mentorship and giving back</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform hover:translate-x-1 duration-200">
                                <span className="text-purple-600 font-bold mt-0.5">✓</span>
                                <span>Improve student career outcomes organically</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Why Lynk - Differentiator */}
            <div className="bg-gray-50 py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Why Lynk Over LinkedIn?
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            LinkedIn is great for professionals. Lynk is purpose-built for the student-alumni relationship.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-red-500 text-lg">✕</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Cold outreach on LinkedIn</h4>
                                    <p className="text-sm text-gray-500">Messages get lost, connection requests ignored, no shared context</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-black shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-600 text-lg">✓</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Warm intros on Lynk</h4>
                                    <p className="text-sm text-gray-500">Same college bond = instant trust, higher response rates, real conversations</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-red-500 text-lg">✕</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Generic career platforms</h4>
                                    <p className="text-sm text-gray-500">One-size-fits-all advice from strangers with no context about your college</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-black shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-600 text-lg">✓</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Tailored to your campus</h4>
                                    <p className="text-sm text-gray-500">Alumni who know your college, professors, and placement process</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative bg-black text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Your Next Opportunity
                        <br />
                        <span className="text-gray-400">Is One Connection Away</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-lg mx-auto">
                        Join a growing community of students and alumni who believe in the power of giving back.
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
                        Free forever • No credit card needed • Takes two minutes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;