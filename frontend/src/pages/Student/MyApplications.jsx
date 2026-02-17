import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase, Loader2, Brain, MapPin,
    DollarSign, Wifi, ArrowRight, FileText
} from 'lucide-react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

// ── Pipeline config — same as JobApplications ──
const PIPELINE = {
    APPLIED:      { label: 'Applied',      style: 'bg-gray-100 text-gray-700 border-gray-200',       dot: 'bg-gray-400',   hint: 'Your application is under review.'                        },
    SHORTLISTED:  { label: 'Shortlisted',  style: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500',   hint: 'You have been shortlisted! Expect to hear soon.'          },
    INTERVIEWING: { label: 'Interviewing', style: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500', hint: 'You are in the interview process. Good luck!'             },
    HIRED:        { label: 'Hired 🎉',     style: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-500',  hint: 'Congratulations! You have been hired.'                    },
    REJECTED:     { label: 'Rejected',     style: 'bg-red-100 text-red-600 border-red-200',          dot: 'bg-red-400',    hint: 'This application was not selected. Keep applying!'        },
};

const PIPELINE_ORDER = ['APPLIED', 'SHORTLISTED', 'INTERVIEWING', 'HIRED', 'REJECTED'];

// Score style
const getScoreStyle = (score) => {
    if (score >= 80) return { bar: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50 border-green-200', label: 'Strong Match' };
    if (score >= 50) return { bar: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', label: 'Partial Match' };
    return               { bar: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50 border-red-100',      label: 'Low Match'     };
};

// Job status badge (OPEN/PAUSED/CLOSED)
const getJobStatusStyle = (status) => {
    if (status === 'OPEN')   return 'bg-green-100 text-green-700';
    if (status === 'PAUSED') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-600';
};

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/jobs/my-applications');
                if (data.success) setApplications(data.data);
            } catch (err) {
                toast.error('Could not load your applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    // Filter by pipeline status
    const filtered = activeFilter === 'ALL'
        ? applications
        : applications.filter(a => a.status === activeFilter);

    // Summary counts for filter tabs
    const counts = PIPELINE_ORDER.reduce((acc, s) => {
        acc[s] = applications.filter(a => a.status === s).length;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Sticky Header ── */}
            <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                            <p className="text-gray-500 text-sm mt-0.5">
                                {loading ? 'Loading...' : `${applications.length} application${applications.length !== 1 ? 's' : ''} total`}
                            </p>
                        </div>
                        <Link
                            to="/jobs"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                        >
                            Browse Jobs <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* ── Filter Tabs ── */}
                    {!loading && applications.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                            <button
                                onClick={() => setActiveFilter('ALL')}
                                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                                    activeFilter === 'ALL'
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                All ({applications.length})
                            </button>
                            {PIPELINE_ORDER.map(status => {
                                const count  = counts[status] || 0;
                                if (count === 0) return null;
                                const config = PIPELINE[status];
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setActiveFilter(status)}
                                        className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                                            activeFilter === status
                                                ? 'bg-black text-white border-black'
                                                : `${config.style} hover:opacity-80`
                                        }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${activeFilter === status ? 'bg-white' : config.dot}`} />
                                        {config.label} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Loading ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 text-black animate-spin mb-4" />
                        <p className="text-gray-500 text-sm">Loading your applications...</p>
                    </div>

                ) : applications.length === 0 ? (
                    // ── Empty State ──
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No applications yet</h3>
                        <p className="text-gray-400 text-sm mt-1 mb-6">Start exploring opportunities and apply to jobs.</p>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Browse Jobs <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                ) : filtered.length === 0 ? (
                    // ── No results for filter ──
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                        <p className="text-gray-400 text-sm">No applications with this status.</p>
                        <button onClick={() => setActiveFilter('ALL')} className="mt-3 text-sm font-semibold text-black underline underline-offset-2">
                            Show all
                        </button>
                    </div>

                ) : (
                    <div className="space-y-4">
                        {filtered.map((app) => {
                            const pipeline   = PIPELINE[app.status] || PIPELINE.APPLIED;
                            const scoreStyle = getScoreStyle(app.matchScore || 0);
                            const job        = app.job;

                            return (
                                <div key={app._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">

                                    {/* ── Status Bar ── */}
                                    <div className={`px-6 py-2.5 border-b flex items-center justify-between ${
                                        app.status === 'HIRED'    ? 'bg-green-50 border-green-100' :
                                        app.status === 'REJECTED' ? 'bg-red-50 border-red-100'     :
                                        'bg-gray-50/60 border-gray-100'
                                    }`}>
                                        {/* Pipeline status pill */}
                                        <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${pipeline.style}`}>
                                            <span className={`h-2 w-2 rounded-full ${pipeline.dot}`} />
                                            {pipeline.label}
                                        </div>

                                        {/* Applied date */}
                                        <span className="text-xs text-gray-400">
                                            Applied {new Date(app.createdAt).toLocaleDateString('en-US', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="p-6 flex flex-col md:flex-row gap-6">

                                        {/* ── Left: Job Info ── */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                                        {job?.title || 'Job Deleted'}
                                                    </h3>
                                                    <p className="text-sm font-semibold text-gray-600 mt-0.5">
                                                        {job?.company}
                                                        {app.recruiter?.fullName && (
                                                            <span className="text-gray-400 font-normal ml-2">
                                                                · Posted by {app.recruiter.fullName}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Job status (OPEN/CLOSED) */}
                                                {job?.status && (
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${getJobStatusStyle(job.status)}`}>
                                                        {job.status}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Job meta */}
                                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                                                {job?.location && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                                                    </span>
                                                )}
                                                {job?.workMode && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Wifi className="h-3.5 w-3.5" /> {job.workMode}
                                                    </span>
                                                )}
                                                {job?.salaryRange && job.salaryRange !== 'Not disclosed' && (
                                                    <span className="flex items-center gap-1.5">
                                                        <DollarSign className="h-3.5 w-3.5" /> {job.salaryRange}
                                                    </span>
                                                )}
                                                {job?.jobType && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Briefcase className="h-3.5 w-3.5" /> {job.jobType}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Status hint message */}
                                            <p className={`text-xs font-medium px-3 py-2 rounded-lg inline-block ${
                                                app.status === 'HIRED'    ? 'bg-green-50 text-green-700' :
                                                app.status === 'REJECTED' ? 'bg-red-50 text-red-600'     :
                                                app.status === 'SHORTLISTED' ? 'bg-blue-50 text-blue-700' :
                                                app.status === 'INTERVIEWING' ? 'bg-purple-50 text-purple-700' :
                                                'bg-gray-50 text-gray-500'
                                            }`}>
                                                {pipeline.hint}
                                            </p>
                                        </div>

                                        {/* ── Right: AI Score Only ── */}
                                        <div className="flex-shrink-0 flex flex-col items-center justify-start md:pl-6 md:border-l border-gray-100">
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <Brain className="h-3.5 w-3.5 text-gray-400" />
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Score</p>
                                            </div>

                                            {/* Score circle */}
                                            <div className={`h-20 w-20 rounded-full border-4 flex items-center justify-center mb-3 ${
                                                app.matchScore >= 80 ? 'border-green-400 bg-green-50' :
                                                app.matchScore >= 50 ? 'border-yellow-400 bg-yellow-50' :
                                                'border-red-300 bg-red-50'
                                            }`}>
                                                <span className={`text-2xl font-bold ${scoreStyle.text}`}>
                                                    {app.matchScore || 0}
                                                </span>
                                            </div>

                                            {/* Score bar */}
                                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                                                <div
                                                    className={`h-full rounded-full ${scoreStyle.bar}`}
                                                    style={{ width: `${app.matchScore || 0}%` }}
                                                />
                                            </div>

                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scoreStyle.bg} ${scoreStyle.text} border`}>
                                                {scoreStyle.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── AI Analysis Section (Full Width Below) ── */}
                                    {app.aiAnalysis && (
                                        <div className="px-6 pb-6 pt-0">
                                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                                            <Brain className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">AI Analysis</h4>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {app.aiAnalysis}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Resume Link (Footer) ── */}
                                    {app.resume && (
                                        <div className="px-6 pb-6">
                                            <a
                                                href={app.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-2 w-full text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-all font-medium py-3 rounded-xl border border-gray-200"
                                            >
                                                <FileText className="h-4 w-4" /> View Submitted Resume
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;