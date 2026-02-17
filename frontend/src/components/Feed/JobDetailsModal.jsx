import { useState } from 'react';
import {
    X, MapPin, Briefcase, Clock, CheckCircle, Loader2,
    DollarSign, Wifi, Users, Brain, User,
    PauseCircle, XCircle
} from 'lucide-react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const JobDetailsModal = ({
    job,
    user,
    onClose,
    initialApplied = false,
    initialResult  = null,
    onApplySuccess
}) => {
    const [hasApplied, setHasApplied] = useState(initialApplied);
    const [aiResult,   setAiResult]   = useState(initialResult);
    const [isApplying, setIsApplying] = useState(false);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleApply = async () => {
        try {
            setIsApplying(true);
            const { data } = await api.post(`/jobs/apply/${job._id}`);
            const { matchScore, aiAnalysis } = data.data;
            const result = { matchScore, aiAnalysis };
            setAiResult(result);
            setHasApplied(true);
            toast.success(`Applied! Your AI Match Score: ${matchScore}/100`);
            if (onApplySuccess) onApplySuccess(job._id, result);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to apply";
            if (msg.toLowerCase().includes("already applied")) setHasApplied(true);
            toast.error(msg);
        } finally {
            setIsApplying(false);
        }
    };

    const getScoreStyle = (score) => {
        if (score >= 80) return { bar: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50 border-green-200' };
        if (score >= 50) return { bar: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' };
        return { bar: 'bg-red-400', text: 'text-red-600', bg: 'bg-red-50 border-red-100' };
    };

    const scoreStyle = aiResult ? getScoreStyle(aiResult.matchScore) : null;

    const isStudent = user?.role?.toUpperCase() === "STUDENT";
    const isPaused  = job.status === 'PAUSED';
    const isClosed  = job.status === 'CLOSED';

    const postedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
    const expiryDate = job.expiresAt
        ? new Date(job.expiresAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    // ── Footer button logic ──
    const renderApplyButton = () => {
        if (!isStudent) return null;

        // Already applied — always green regardless of current status
        if (hasApplied) {
            return (
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 bg-green-600 text-white cursor-default flex-shrink-0"
                >
                    <CheckCircle className="h-4 w-4" /> Applied
                </button>
            );
        }

        // PAUSED — visible but disabled
        if (isPaused) {
            return (
                <button
                    disabled
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 bg-yellow-100 text-yellow-700 border border-yellow-200 cursor-not-allowed flex-shrink-0"
                >
                    <PauseCircle className="h-4 w-4" /> Not Accepting Applications
                </button>
            );
        }

        // CLOSED — hard disabled
        if (isClosed) {
            return (
                <button
                    disabled
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 bg-red-100 text-red-600 border border-red-200 cursor-not-allowed flex-shrink-0"
                >
                    <XCircle className="h-4 w-4" /> Job Closed
                </button>
            );
        }

        // OPEN — normal apply
        return (
            <button
                onClick={handleApply}
                disabled={isApplying}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 bg-black text-white hover:bg-gray-800 disabled:opacity-60 transition-all flex-shrink-0"
            >
                {isApplying ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Scanning Resume...</>
                ) : (
                    'Apply Now'
                )}
            </button>
        );
    };

    // ── Footer hint text ──
    const getFooterHint = () => {
        if (!isStudent) return "Alumni cannot apply to job listings.";
        if (hasApplied)  return "Your application has been submitted.";
        if (isPaused)    return "This job is on hold. The alumni is reviewing current applications.";
        if (isClosed)    return "This position has been filled or is no longer available.";
        return "Your resume will be scanned by AI upon applying.";
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* ── Header ── */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-start bg-gray-50/80">
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h2>

                            {/* Status badge in header */}
                            {hasApplied && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
                                    <CheckCircle className="h-3 w-3" /> Applied
                                </span>
                            )}
                            {isPaused && !hasApplied && (
                                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-200">
                                    <PauseCircle className="h-3 w-3" /> Paused
                                </span>
                            )}
                            {isClosed && !hasApplied && (
                                <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200">
                                    <XCircle className="h-3 w-3" /> Closed
                                </span>
                            )}
                        </div>

                        <p className="text-sm font-semibold text-gray-600 mt-0.5">{job.company}</p>
                        {job.postedBy?.fullName && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                                <User className="h-3.5 w-3.5" />
                                Posted by <span className="font-semibold text-gray-700 ml-1">{job.postedBy.fullName}</span>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* ── Scrollable Body ── */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">

                        {/* PAUSED notice banner */}
                        {isPaused && !hasApplied && (
                            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                                <PauseCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-700 font-medium">
                                    This job is currently on hold. The alumni is reviewing existing applications and is not accepting new ones right now. Check back later.
                                </p>
                            </div>
                        )}

                        {/* CLOSED notice banner */}
                        {isClosed && !hasApplied && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-600 font-medium">
                                    This position has been filled or closed by the alumni. Applications are no longer being accepted.
                                </p>
                            </div>
                        )}

                        {/* Meta Badges */}
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                                <MapPin className="h-3.5 w-3.5" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                                <Briefcase className="h-3.5 w-3.5" /> {job.jobType}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                                <Wifi className="h-3.5 w-3.5" /> {job.workMode}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                                <Clock className="h-3.5 w-3.5" /> Posted {postedDate}
                            </span>
                            {job.salaryRange && job.salaryRange !== "Not disclosed" && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                                    <DollarSign className="h-3.5 w-3.5" /> {job.salaryRange}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                                <Users className="h-3.5 w-3.5" /> {job.applicantCount || 0} applicants
                            </span>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About the Role</h4>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </div>

                        {/* Required Skills */}
                        {job.requiredSkills?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.requiredSkills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {expiryDate && !isClosed && (
                            <p className="text-xs text-gray-400 italic">Applications close on {expiryDate}</p>
                        )}

                        {/* AI Result Card — shows after fresh apply OR if result was passed in */}
                        {hasApplied && aiResult && (
                            <div className={`rounded-xl border p-4 ${scoreStyle.bg}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Brain className={`h-4 w-4 ${scoreStyle.text}`} />
                                    <h4 className={`text-sm font-bold ${scoreStyle.text}`}>Your AI Match Score</h4>
                                </div>
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-500 font-medium">Match Score</span>
                                        <span className={`text-sm font-bold ${scoreStyle.text}`}>{aiResult.matchScore}/100</span>
                                    </div>
                                    <div className="h-2 bg-white rounded-full border border-gray-200">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${scoreStyle.bar}`}
                                            style={{ width: `${aiResult.matchScore}%` }}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed italic">"{aiResult.aiAnalysis}"</p>
                            </div>
                        )}

                        {/* Applied but no AI result (edge case) */}
                        {hasApplied && !aiResult && (
                            <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-green-700 font-medium">
                                    You have already applied for this position.
                                </p>
                            </div>
                        )}

                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="p-5 border-t border-gray-200 bg-gray-50/80 flex items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">{getFooterHint()}</p>
                    {renderApplyButton()}
                </div>

            </div>
        </div>
    );
};

export default JobDetailsModal;