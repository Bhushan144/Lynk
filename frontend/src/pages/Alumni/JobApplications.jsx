import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, FileText, Brain,
    Loader2, Users, Trophy, TrendingUp,
    MessageCircle, Check, ChevronDown
} from 'lucide-react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

// ── Application Pipeline Config ──
const PIPELINE = {
    APPLIED:      { label: 'Applied',      style: 'bg-gray-100 text-gray-700 border-gray-200',       dot: 'bg-gray-400'   },
    SHORTLISTED:  { label: 'Shortlisted',  style: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500'   },
    INTERVIEWING: { label: 'Interviewing', style: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
    HIRED:        { label: 'Hired',        style: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-500'  },
    REJECTED:     { label: 'Rejected',     style: 'bg-red-100 text-red-600 border-red-200',          dot: 'bg-red-500'    },
};

// Natural pipeline order for the dropdown
const PIPELINE_ORDER = ['APPLIED', 'SHORTLISTED', 'INTERVIEWING', 'HIRED', 'REJECTED'];

// Per-applicant message button states
const MSG_STATE = {
    IDLE: 'idle', LOADING: 'loading', SENT: 'sent', CONNECTED: 'connected'
};

// ── Pipeline Status Dropdown ──
const PipelineDropdown = ({ applicationId, currentStatus, onStatusChange }) => {
    const [open,    setOpen]    = useState(false);
    const [loading, setLoading] = useState(false);
    const config = PIPELINE[currentStatus] || PIPELINE.APPLIED;

    const handleChange = async (newStatus) => {
        if (newStatus === currentStatus) { setOpen(false); return; }
        try {
            setLoading(true);
            setOpen(false);
            await api.patch(`/jobs/applications/${applicationId}/status`, { status: newStatus });
            onStatusChange(applicationId, newStatus);
            toast.success(`Marked as ${PIPELINE[newStatus].label}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(prev => !prev)}
                disabled={loading}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-colors ${config.style} disabled:opacity-60`}
            >
                {loading
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                }
                {config.label}
                <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                        {PIPELINE_ORDER.map((status) => {
                            const c = PIPELINE[status];
                            return (
                                <button
                                    key={status}
                                    onClick={() => handleChange(status)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-left hover:bg-gray-50 transition-colors ${
                                        currentStatus === status ? 'opacity-50 cursor-default bg-gray-50' : ''
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                                    {c.label}
                                    {currentStatus === status && (
                                        <span className="ml-auto text-gray-400 text-[10px]">current</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

// ── Main Component ──
const JobApplications = () => {
    const { jobId } = useParams();
    const navigate  = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [msgStates,    setMsgStates]    = useState({});

    useEffect(() => { fetchApplications(); }, [jobId]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(`/jobs/applications/${jobId}`);
            if (data.success) setApplications(data.data);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to load applicants';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Update application status in local state — no refetch
    const handleStatusChange = (applicationId, newStatus) => {
        setApplications(prev =>
            prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
        );
    };

    // ── Message button logic ──
    const setMsgState = (id, state) =>
        setMsgStates(prev => ({ ...prev, [id]: state }));

    const handleMessage = async (applicantId) => {
        const current = msgStates[applicantId];
        if (current === MSG_STATE.CONNECTED) { navigate('/chat'); return; }
        if (current === MSG_STATE.SENT) return;

        try {
            setMsgState(applicantId, MSG_STATE.LOADING);
            await api.post('/chat/request', {
                receiverId: applicantId,
                requestMessage: "Hi! I reviewed your application and would like to connect."
            });
            setMsgState(applicantId, MSG_STATE.SENT);
            toast.success("Connection request sent!");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed";
            if (msg.toLowerCase().includes("already connected")) {
                setMsgState(applicantId, MSG_STATE.CONNECTED);
                toast.success("You're already connected!");
            } else if (msg.toLowerCase().includes("pending")) {
                setMsgState(applicantId, MSG_STATE.SENT);
                toast("Request already pending.", { icon: "ℹ️" });
            } else {
                setMsgState(applicantId, MSG_STATE.IDLE);
                toast.error(msg);
            }
        }
    };

    const renderMsgButton = (applicantId) => {
        const state = msgStates[applicantId] || MSG_STATE.IDLE;
        if (state === MSG_STATE.LOADING) return (
            <button disabled className="text-xs bg-gray-100 text-gray-400 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-not-allowed">
                <Loader2 className="h-3 w-3 animate-spin" /> Sending...
            </button>
        );
        if (state === MSG_STATE.SENT) return (
            <button disabled className="text-xs bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-default">
                <Check className="h-3 w-3" /> Sent
            </button>
        );
        if (state === MSG_STATE.CONNECTED) return (
            <button onClick={() => navigate('/chat')} className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 hover:bg-gray-800 transition-colors">
                <MessageCircle className="h-3 w-3" /> Open Chat
            </button>
        );
        return (
            <button onClick={() => handleMessage(applicantId)} className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 hover:bg-gray-800 transition-colors">
                <MessageCircle className="h-3 w-3" /> Message
            </button>
        );
    };

    // ── Score helpers ──
    const getScoreStyle = (score) => {
        if (score >= 80) return { ring: 'border-green-400', bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500', label: 'Strong Match',  labelStyle: 'bg-green-100 text-green-700'  };
        if (score >= 50) return { ring: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500', label: 'Partial Match', labelStyle: 'bg-yellow-100 text-yellow-700' };
        return               { ring: 'border-red-300', bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-400', label: 'Low Match', labelStyle: 'bg-red-100 text-red-600' };
    };

    const getRankStyle = (index) => {
        if (index === 0) return 'bg-yellow-500 text-white';
        if (index === 1) return 'bg-gray-400 text-white';
        if (index === 2) return 'bg-amber-600 text-white';
        return 'bg-gray-900 text-white';
    };

    // Pipeline summary counts for the header
    const pipelineSummary = PIPELINE_ORDER.reduce((acc, status) => {
        acc[status] = applications.filter(a => a.status === status).length;
        return acc;
    }, {});

    const avgScore     = applications.length ? Math.round(applications.reduce((s, a) => s + (a.matchScore || 0), 0) / applications.length) : 0;
    const strongMatches = applications.filter(a => a.matchScore >= 80).length;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Sticky Header ── */}
            <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-2 transition-colors font-medium">
                                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Applicant Rankings</h1>
                            <p className="text-xs text-gray-400 mt-0.5">Sorted by AI match score — highest fit first</p>
                        </div>
                        {!loading && (
                            <div className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm text-center">
                                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                                <p className="text-xs text-gray-400 font-medium">Applicant{applications.length !== 1 ? 's' : ''}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500">Loading applicants...</p>
                    </div>

                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <p className="text-gray-500 text-sm">{error}</p>
                        <button onClick={fetchApplications} className="mt-4 text-sm font-semibold text-black underline underline-offset-2">Try again</button>
                    </div>

                ) : applications.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No applicants yet</h3>
                        <p className="text-sm text-gray-400 mt-1">Share your job post to attract candidates.</p>
                    </div>

                ) : (
                    <div className="space-y-6">

                        {/* ── Stats Row ── */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                                <div className="h-9 w-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Users className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{applications.length}</p>
                                    <p className="text-xs text-gray-400">Total</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                                <div className="h-9 w-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{avgScore}%</p>
                                    <p className="text-xs text-gray-400">Avg Score</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                                <div className="h-9 w-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Trophy className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{strongMatches}</p>
                                    <p className="text-xs text-gray-400">Strong Matches</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Pipeline Summary Bar ── */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Pipeline Overview</p>
                            <div className="flex flex-wrap gap-2">
                                {PIPELINE_ORDER.map(status => {
                                    const count  = pipelineSummary[status] || 0;
                                    const config = PIPELINE[status];
                                    return (
                                        <div key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${config.style}`}>
                                            <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                                            {config.label}
                                            <span className="font-bold ml-0.5">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Applicant Cards ── */}
                        {applications.map((app, index) => {
                            const scoreStyle  = getScoreStyle(app.matchScore || 0);
                            const applicantId = app.applicant?._id;
                            const pipeConfig  = PIPELINE[app.status] || PIPELINE.APPLIED;

                            return (
                                <div key={app._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">

                                    {/* ── Card Top Bar: Rank + Pipeline Status ── */}
                                    <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-100 bg-gray-50/60">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRankStyle(index)}`}>
                                                #{index + 1} Ranked
                                            </span>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scoreStyle.labelStyle}`}>
                                                {scoreStyle.label}
                                            </span>
                                        </div>

                                        {/* Pipeline dropdown on the right */}
                                        <PipelineDropdown
                                            applicationId={app._id}
                                            currentStatus={app.status}
                                            onStatusChange={handleStatusChange}
                                        />
                                    </div>

                                    <div className="p-6 flex flex-col md:flex-row gap-6">

                                        {/* ── Left: Candidate Info ── */}
                                        <div className="flex items-start gap-4 md:w-64 flex-shrink-0">
                                            <div className="h-14 w-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {app.applicant?.avatar ? (
                                                    <img src={app.applicant.avatar} alt={app.applicant?.fullName} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-xl font-bold text-gray-400">
                                                        {app.applicant?.fullName?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 leading-tight">
                                                    {app.applicant?.fullName || 'Unknown'}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-0.5 mb-3">
                                                    {app.applicant?.email || 'Student'}
                                                </p>

                                                {/* Action buttons */}
                                                <div className="flex flex-wrap gap-2">
                                                    {applicantId && (
                                                        <Link
                                                            to={`/profile/${applicantId}`}
                                                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                                        >
                                                            View Profile
                                                        </Link>
                                                    )}
                                                    {app.resume && (
                                                        <a
                                                            href={app.resume}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1"
                                                        >
                                                            <FileText className="h-3 w-3" /> Resume
                                                        </a>
                                                    )}
                                                    {applicantId && renderMsgButton(applicantId)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Middle: AI Analysis ── */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Brain className="h-3.5 w-3.5 text-gray-400" />
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Analysis</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                                "{app.aiAnalysis || 'Analysis pending...'}"
                                            </p>
                                            <p className="text-xs text-gray-400 mt-3">
                                                Applied {new Date(app.createdAt).toLocaleDateString('en-US', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </p>

                                            {/* Pipeline status pill — visible confirmation below analysis */}
                                            <div className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full border text-xs font-semibold ${pipeConfig.style}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${pipeConfig.dot}`} />
                                                {pipeConfig.label}
                                            </div>
                                        </div>

                                        {/* ── Right: Score Circle ── */}
                                        <div className="flex-shrink-0 flex flex-col items-center justify-center md:pl-6 md:border-l border-gray-100 md:w-28">
                                            <div className={`h-20 w-20 rounded-full border-4 flex items-center justify-center ${scoreStyle.ring} ${scoreStyle.bg}`}>
                                                <span className={`text-xl font-bold ${scoreStyle.text}`}>
                                                    {app.matchScore || 0}
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">Match %</span>
                                            <div className="w-full mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${scoreStyle.bar}`} style={{ width: `${app.matchScore || 0}%` }} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;