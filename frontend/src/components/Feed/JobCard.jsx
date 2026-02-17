import { useState } from 'react';
import { MapPin, Users, Eye, ArrowRight, DollarSign, Wifi, CheckCircle, PauseCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobDetailsModal from './JobDetailsModal';

const JobCard = ({ job, user, isApplied = false, appliedResult = null, onApplySuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ownerId = typeof job.postedBy === 'object' ? job.postedBy._id : job.postedBy;
    const isOwner = user?._id === ownerId;

    const getJobTypeBadge = (type) => {
        const styles = {
            'Internship': 'bg-blue-50 text-blue-700 border-blue-100',
            'Full-time':  'bg-green-50 text-green-700 border-green-100',
            'Part-time':  'bg-yellow-50 text-yellow-700 border-yellow-100',
            'Contract':   'bg-orange-50 text-orange-700 border-orange-100',
            'Freelance':  'bg-purple-50 text-purple-700 border-purple-100',
        };
        return styles[type] || 'bg-gray-100 text-gray-600 border-gray-200';
    };

    const getWorkModeBadge = (mode) => {
        const styles = {
            'Remote':  'bg-emerald-50 text-emerald-700',
            'Hybrid':  'bg-sky-50 text-sky-700',
            'On-site': 'bg-gray-100 text-gray-600',
        };
        return styles[mode] || 'bg-gray-100 text-gray-600';
    };

    // Paused jobs get a subtle yellow tint on the card border
    const getCardStyle = () => {
        if (job.status === 'PAUSED') return 'border-yellow-200 bg-yellow-50/20';
        return 'border-gray-200 bg-white';
    };

    // What to render in the card footer (right side) based on status + role
    const renderFooterAction = () => {
        // Alumni sees "View Applicants" on their own jobs
        if (isOwner) {
            return (
                <Link
                    to={`/applications/${job._id}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-black hover:text-gray-600 transition-colors"
                >
                    <Eye className="h-3.5 w-3.5" /> View Applicants
                </Link>
            );
        }

        // Student already applied → show "View Result"
        if (isApplied) {
            return (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                    <CheckCircle className="h-3.5 w-3.5" /> View Result
                </button>
            );
        }

        // PAUSED — visible but can't apply
        if (job.status === 'PAUSED') {
            return (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-600 cursor-default">
                    <PauseCircle className="h-3.5 w-3.5" /> On Hold
                </span>
            );
        }

        // Default OPEN — can view details and apply
        return (
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-black hover:text-gray-600 transition-colors group/btn"
            >
                View Details
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
        );
    };

    return (
        <>
            <div className={`rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group ${getCardStyle()}`}>

                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-black transition-colors">
                                {job.title}
                            </h3>
                            <p className="text-sm font-semibold text-gray-600 mt-0.5">{job.company}</p>
                        </div>

                        {/* Right column: job type badge + applied/paused badge stacked */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getJobTypeBadge(job.jobType)}`}>
                                {job.jobType}
                            </span>
                            {isApplied && !isOwner && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
                                    <CheckCircle className="h-3 w-3" /> Applied
                                </span>
                            )}
                            {job.status === 'PAUSED' && !isApplied && (
                                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-200">
                                    <PauseCircle className="h-3 w-3" /> Paused
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {job.location}
                        </span>
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${getWorkModeBadge(job.workMode)}`}>
                            <Wifi className="h-3 w-3" /> {job.workMode}
                        </span>
                        {job.salaryRange && job.salaryRange !== "Not disclosed" && (
                            <span className="flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5" /> {job.salaryRange}
                            </span>
                        )}
                    </div>
                </div>

                {/* Description + Skills */}
                <div className="px-6 py-4 flex-1">
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {job.description}
                    </p>
                    {job.requiredSkills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {job.requiredSkills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 font-medium">
                                    {skill}
                                </span>
                            ))}
                            {job.requiredSkills.length > 3 && (
                                <span className="px-2 py-0.5 text-xs text-gray-400">
                                    +{job.requiredSkills.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-b-2xl">
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {job.applicantCount || 0} applicant{job.applicantCount !== 1 ? 's' : ''}
                    </span>
                    {renderFooterAction()}
                </div>
            </div>

            {isModalOpen && (
                <JobDetailsModal
                    job={job}
                    user={user}
                    initialApplied={isApplied}
                    initialResult={appliedResult}
                    onClose={() => setIsModalOpen(false)}
                    onApplySuccess={onApplySuccess}
                />
            )}
        </>
    );
};

export default JobCard;