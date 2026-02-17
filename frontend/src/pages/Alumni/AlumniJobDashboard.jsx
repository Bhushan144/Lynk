import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    PlusCircle, Briefcase, Loader2, Search,
    Eye, ChevronDown, Archive
} from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import JobCard from '../../components/Feed/JobCard';

const STATUS_CONFIG = {
    OPEN:   { label: 'Open',   style: 'bg-green-100 text-green-700 border-green-200',   dot: 'bg-green-500'  },
    PAUSED: { label: 'Paused', style: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    CLOSED: { label: 'Closed', style: 'bg-red-100 text-red-600 border-red-200',          dot: 'bg-red-500'    },
};

// ── Inline Status Dropdown ──
const StatusDropdown = ({ job, onStatusChange }) => {
    const [open, setOpen]       = useState(false);
    const [loading, setLoading] = useState(false);
    const current = STATUS_CONFIG[job.status] || STATUS_CONFIG.OPEN;

    const handleChange = async (newStatus) => {
        if (newStatus === job.status) { setOpen(false); return; }
        try {
            setLoading(true);
            setOpen(false);
            await api.patch(`/jobs/${job._id}/status`, { status: newStatus });
            onStatusChange(job._id, newStatus);
            toast.success(`Job marked as ${STATUS_CONFIG[newStatus].label}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(prev => !prev)}
                disabled={loading}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${current.style} disabled:opacity-60`}
            >
                {loading
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <span className={`h-2 w-2 rounded-full ${current.dot}`} />
                }
                {current.label}
                <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                            <button
                                key={status}
                                onClick={() => handleChange(status)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-left hover:bg-gray-50 transition-colors ${
                                    job.status === status ? 'opacity-50 cursor-default' : ''
                                }`}
                            >
                                <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                                {config.label}
                                {job.status === status && (
                                    <span className="ml-auto text-gray-400 text-[10px]">current</span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// ── My Job Row (wraps JobCard with status bar) ──
const MyJobRow = ({ job, user, onStatusChange }) => (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${
        job.status === 'CLOSED' ? 'border-red-100 opacity-75' : 'border-gray-200'
    }`}>
        {/* Status control bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-3">
                <StatusDropdown job={job} onStatusChange={onStatusChange} />
                {job.status === 'CLOSED' && (
                    <span className="text-xs text-red-500 font-medium">
                        Hidden from student feed — position closed
                    </span>
                )}
                {job.status === 'PAUSED' && (
                    <span className="text-xs text-yellow-600 font-medium">
                        Visible to students but not accepting applications
                    </span>
                )}
            </div>
            <Link
                to={`/applications/${job._id}`}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors"
            >
                <Eye className="h-3.5 w-3.5" />
                {job.applicantCount || 0} applicant{job.applicantCount !== 1 ? 's' : ''}
            </Link>
        </div>

        {/* Job card */}
        <div className="p-1">
            <JobCard job={job} user={user} />
        </div>
    </div>
);

// ── Main Dashboard ──
const AlumniJobDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    const [myJobs,         setMyJobs]         = useState([]);
    const [allJobs,        setAllJobs]        = useState([]);
    const [loadingMyJobs,  setLoadingMyJobs]  = useState(true);
    const [loadingAllJobs, setLoadingAllJobs] = useState(true);
    const [showArchived,   setShowArchived]   = useState(false);

    const fetchMyJobs = async () => {
        try {
            setLoadingMyJobs(true);
            const { data } = await api.get('/jobs/my-jobs');
            if (data.success) setMyJobs(data.data);
        } catch (err) {
            toast.error('Could not load your posted jobs');
        } finally {
            setLoadingMyJobs(false);
        }
    };

    const fetchAllJobs = async () => {
        try {
            setLoadingAllJobs(true);
            const { data } = await api.get('/jobs/all');
            if (data.success) setAllJobs(data.data.jobs);
        } catch (err) {
            console.error('Failed to fetch all jobs:', err);
        } finally {
            setLoadingAllJobs(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
        fetchAllJobs();
    }, []);

    // Instant local state update after status change — no refetch
    const handleStatusChange = (jobId, newStatus) => {
        setMyJobs(prev =>
            prev.map(job => job._id === jobId ? { ...job, status: newStatus } : job)
        );
    };

    // Split into active (OPEN + PAUSED) and archived (CLOSED)
    const activeJobs   = myJobs.filter(j => j.status !== 'CLOSED');
    const archivedJobs = myJobs.filter(j => j.status === 'CLOSED');

    // Stats
    const totalApplicants = myJobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);
    const openCount   = myJobs.filter(j => j.status === 'OPEN').length;
    const pausedCount = myJobs.filter(j => j.status === 'PAUSED').length;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Sticky Header ── */}
            <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Jobs Dashboard</h1>
                            <p className="text-gray-500 text-sm mt-0.5">Manage your postings and explore the job board.</p>
                        </div>
                        <Link
                            to="/post-job"
                            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                        >
                            <PlusCircle className="h-4 w-4" /> Post New Job
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

                {/* ── Stats Row ── */}
                {!loadingMyJobs && myJobs.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Posted</p>
                            <p className="text-3xl font-bold text-gray-900">{myJobs.length}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-green-500 inline-block" /> Open
                            </p>
                            <p className="text-3xl font-bold text-gray-900">{openCount}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" /> Paused
                            </p>
                            <p className="text-3xl font-bold text-gray-900">{pausedCount}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Applicants</p>
                            <p className="text-3xl font-bold text-gray-900">{totalApplicants}</p>
                        </div>
                    </div>
                )}

                {/* ── Section 1: Active Jobs (OPEN + PAUSED) ── */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <Briefcase className="h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-bold text-gray-900">My Posted Jobs</h2>
                        {!loadingMyJobs && (
                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {activeJobs.length}
                            </span>
                        )}
                    </div>

                    {loadingMyJobs ? (
                        <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-gray-200">
                            <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
                        </div>
                    ) : activeJobs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Briefcase className="h-7 w-7 text-gray-300" />
                            </div>
                            <h3 className="font-semibold text-gray-900">No active jobs</h3>
                            <p className="text-sm text-gray-400 mt-1 mb-4">Post a new opportunity for students.</p>
                            <Link
                                to="/post-job"
                                className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                            >
                                <PlusCircle className="h-4 w-4" /> Post Your First Job
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeJobs.map(job => (
                                <MyJobRow
                                    key={job._id}
                                    job={job}
                                    user={user}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Section 2: Archived / Closed Jobs ── */}
                {!loadingMyJobs && archivedJobs.length > 0 && (
                    <div>
                        {/* Collapsible header */}
                        <button
                            onClick={() => setShowArchived(prev => !prev)}
                            className="flex items-center gap-2 mb-5 group w-full text-left"
                        >
                            <Archive className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
                                Archived / Closed
                            </h2>
                            <span className="text-xs font-semibold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                                {archivedJobs.length}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-gray-400 ml-auto transition-transform ${showArchived ? 'rotate-180' : ''}`} />
                        </button>

                        {showArchived && (
                            <div className="space-y-4">
                                {archivedJobs.map(job => (
                                    <MyJobRow
                                        key={job._id}
                                        job={job}
                                        user={user}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Divider ── */}
                <div className="border-t border-gray-200" />

                {/* ── Section 3: Explore Other Listings ── */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <Search className="h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-bold text-gray-900">Explore Other Listings</h2>
                        {!loadingAllJobs && (
                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {allJobs.length}
                            </span>
                        )}
                    </div>

                    {loadingAllJobs ? (
                        <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-gray-200">
                            <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
                        </div>
                    ) : allJobs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-400">No other job listings at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allJobs.map(job => (
                                <JobCard key={job._id} job={job} user={user} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AlumniJobDashboard;