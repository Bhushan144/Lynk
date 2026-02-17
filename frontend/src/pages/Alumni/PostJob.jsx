import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Loader2, Briefcase, MapPin, DollarSign, Wifi, Brain } from 'lucide-react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State — matches your backend job.model.js fields exactly
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        jobType: 'Full-time',
        workMode: 'On-site',
        salaryRange: '',
    });

    // Skills managed as an array (sent as requiredSkills to backend)
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState([]);

    // Handle all standard text/select inputs
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Add skill on Enter key
    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = skillInput.trim();
            if (trimmed && !skills.includes(trimmed)) {
                setSkills(prev => [...prev, trimmed]);
            }
            setSkillInput('');
        }
    };

    // Also add skill on comma
    const handleSkillInput = (e) => {
        const value = e.target.value;
        if (value.endsWith(',')) {
            const trimmed = value.slice(0, -1).trim();
            if (trimmed && !skills.includes(trimmed)) {
                setSkills(prev => [...prev, trimmed]);
            }
            setSkillInput('');
        } else {
            setSkillInput(value);
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(prev => prev.filter(s => s !== skillToRemove));
    };

    // Submit — uses your api utility, hits /api/v1/jobs/post
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (skills.length === 0) {
            toast.error("Please add at least one required skill.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                requiredSkills: skills,
            };

            await api.post('/jobs/post', payload);

            toast.success("Job posted successfully!");
            navigate('/jobs');

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/jobs')}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </button>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Card Header */}
                    <div className="p-8 border-b border-gray-200 bg-gray-50/60">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-9 w-9 bg-black rounded-xl flex items-center justify-center">
                                <Briefcase className="h-4 w-4 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Post a New Opportunity</h1>
                        </div>
                        <p className="text-sm text-gray-500 ml-12">
                            Share your opening with talented students from your college. AI will automatically rank applicants by resume fit.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-7">

                        {/* ── Row 1: Title & Company ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Job Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g. Software Engineer Intern"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Company Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    placeholder="e.g. Google, Startup Inc."
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm transition-colors"
                                />
                            </div>
                        </div>

                        {/* ── Row 2: Job Type, Work Mode, Location ── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Job Type
                                </label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-black focus:outline-none text-sm transition-colors"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Work Mode
                                </label>
                                <select
                                    name="workMode"
                                    value={formData.workMode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-black focus:outline-none text-sm transition-colors"
                                >
                                    <option value="On-site">On-site</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Location <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="e.g. Pune, India"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm transition-colors"
                                />
                            </div>
                        </div>

                        {/* ── Salary Range (Optional) ── */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Salary / Stipend{' '}
                                <span className="text-gray-400 font-normal normal-case">(optional)</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="salaryRange"
                                    placeholder="e.g. 10LPA – 15LPA  or  ₹15,000/month stipend"
                                    value={formData.salaryRange}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm transition-colors"
                                />
                            </div>
                        </div>

                        {/* ── Description ── */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Job Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                name="description"
                                required
                                rows="6"
                                placeholder="Describe the role, responsibilities, requirements, and perks..."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm transition-colors resize-none leading-relaxed"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                A detailed description improves AI matching accuracy for applicants.
                            </p>
                        </div>

                        {/* ── Required Skills Tag Input ── */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Required Skills <span className="text-red-400">*</span>{' '}
                                <span className="text-gray-400 font-normal normal-case">
                                    (Press Enter or comma to add)
                                </span>
                            </label>

                            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-gray-200 focus-within:border-black bg-white transition-colors min-h-[50px]">
                                {skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-gray-400 hover:text-gray-700 transition-colors"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder={
                                        skills.length === 0
                                            ? "e.g. React, Node.js, MongoDB..."
                                            : "Add more..."
                                    }
                                    value={skillInput}
                                    onChange={handleSkillInput}
                                    onKeyDown={handleSkillKeyDown}
                                    className="flex-1 outline-none min-w-[160px] bg-transparent text-sm placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* ── AI Notice Banner ── */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <Brain className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                <span className="font-semibold text-gray-700">AI-powered ranking is automatic.</span>{' '}
                                When students apply, Gemini AI scans their resume against your job description
                                and required skills, then ranks candidates by match score — so you always see
                                the best fits first.
                            </p>
                        </div>

                        {/* ── Submit ── */}
                        <div className="pt-2 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Post Job
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;