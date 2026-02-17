import { useSelector } from 'react-redux';
import StudentJobs from '../Student/StudentJobs';
import AlumniJobDashboard from '../Alumni/AlumniJobDashboard';

const JobsPage = () => {
    const { user } = useSelector((state) => state.auth);

    // Case-insensitive role check — your codebase has inconsistency between
    // "ALUMNI" (used in Feed aggregation pipeline) and "Alumni" (used in job.routes.js isAlumni middleware).
    // This handles both safely until you normalise the role string in your DB/registration flow.
    const isAlumni = user?.role?.toUpperCase() === 'ALUMNI';

    return (
        <div className="min-h-screen bg-gray-50">
            {isAlumni ? (
                <AlumniJobDashboard />
            ) : (
                <StudentJobs />
            )}
        </div>
    );
};

export default JobsPage;