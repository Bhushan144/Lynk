import { useState, useEffect } from 'react';
import { Search, Loader2, Briefcase, X, PauseCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import JobCard from '../../components/Feed/JobCard';

const StudentJobs = () => {
    const { user } = useSelector((state) => state.auth);

    const [jobs,           setJobs]           = useState([]);
    const [loading,        setLoading]        = useState(true);
    const [appliedMap,     setAppliedMap]     = useState({});
    const [search,         setSearch]         = useState('');
    const [debouncedSearch,setDebouncedSearch]= useState('');
    const [typeFilter,     setTypeFilter]     = useState('ALL');
    const [modeFilter,     setModeFilter]     = useState('ALL');
    const [totalJobs,      setTotalJobs]      = useState(0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch which jobs student has already applied to
    useEffect(() => {
        const fetchMyApplications = async () => {
            try {
                const { data } = await api.get('/jobs/my-applications');
                if (data.success) {
                    const map = {};
                    data.data.forEach(app => {
                        const jobId = app.job?._id?.toString() || app.job?.toString();
                        if (jobId) map[jobId] = {
                            matchScore: app.matchScore,
                            aiAnalysis: app.aiAnalysis
                        };
                    });
                    setAppliedMap(map);
                }
            } catch (err) {
                console.error('Could not fetch applications:', err);
            }
        };
        fetchMyApplications();
    }, []);

    useEffect(() => { fetchJobs(); }, [debouncedSearch, typeFilter, modeFilter]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (debouncedSearch)      params.append('query', debouncedSearch);
            if (typeFilter !== 'ALL') params.append('type', typeFilter);
            if (modeFilter !== 'ALL') params.append('mode', modeFilter);

            const { data } = await api.get(`/jobs/all?${params.toString()}`);
            if (data.success) {
                setJobs(data.data.jobs);
                setTotalJobs(data.data.pagination?.total || 0);
            }
        } catch (error) {
            if (error.response?.status !== 404) toast.error('Could not load jobs');
            setJobs([]);
            setTotalJobs(0);
        } finally {
            setLoading(false);
        }
    };

    // Called after a successful apply — updates card badge instantly
    const handleApplySuccess = (jobId, aiResult) => {
        setAppliedMap(prev => ({ ...prev, [jobId]: aiResult }));
    };

    const clearFilters = () => {
        setSearch('');
        setTypeFilter('ALL');
        setModeFilter('ALL');
    };

    const hasActiveFilters = search || typeFilter !== 'ALL' || modeFilter !== 'ALL';

    // Count paused jobs in current results so we can show a notice
    const pausedCount = jobs.filter(j => j.status === 'PAUSED').length;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Sticky Header ── */}
            <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Find Opportunities</h1>
                            <p className="text-gray-500 text-sm mt-0.5">
                                {loading ? 'Loading...' : `${totalJobs} position${totalJobs !== 1 ? 's' : ''} available`}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title or company..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-black text-gray-700"
                            >
                                <option value="ALL">All Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                            <select
                                value={modeFilter}
                                onChange={(e) => setModeFilter(e.target.value)}
                                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-black text-gray-700"
                            >
                                <option value="ALL">All Modes</option>
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 hover:text-black border border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
                                >
                                    <X className="h-4 w-4" /> Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 text-black animate-spin mb-4" />
                        <p className="text-gray-500 text-sm">Loading opportunities...</p>
                    </div>

                ) : jobs.length > 0 ? (
                    <>
                        {/* Paused notice banner — only shown if paused jobs exist in results */}
                        {pausedCount > 0 && (
                            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
                                <PauseCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                <p className="text-sm text-yellow-700">
                                    <span className="font-semibold">{pausedCount} job{pausedCount !== 1 ? 's are' : ' is'} currently on hold</span>
                                    {' '}— visible but not accepting new applications right now.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    user={user}
                                    isApplied={!!appliedMap[job._id]}
                                    appliedResult={appliedMap[job._id] || null}
                                    onApplySuccess={handleApplySuccess}
                                />
                            ))}
                        </div>
                    </>

                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
                        <p className="text-gray-400 text-sm mt-1 mb-4">
                            {hasActiveFilters ? 'Try adjusting your search or filters.' : 'No open positions right now. Check back later!'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm font-semibold text-black underline underline-offset-2 hover:text-gray-600 transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentJobs;