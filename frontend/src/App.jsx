import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { login, logout } from "./features/authSlice";
import api from "./utils/axios";

// Pages — Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Verification from "./pages/Auth/Verification";

// Pages — Public
import Landing from "./pages/Landing/Landing";
import About from "./pages/About/About";

// Pages — Layout wrapper
import Layout from "./components/Layout/Layout";

// Pages — Verified Users
import Feed from "./pages/Feed/Feed";
import Profile from "./pages/Profile/Profile";
import PublicProfile from "./pages/Profile/PublicProfile";
import Settings from "./pages/Settings/Settings";
import Chat from "./pages/Chat/Chat";

// Pages — Jobs
import JobsPage from "./pages/Student/JobsPage";
import JobApplications from "./pages/Alumni/JobApplications";
import PostJob from "./pages/Alumni/PostJob";
import MyApplications from './pages/Student/MyApplications';

// Pages — Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";

// ─────────────────────────────────────────────
// ROUTE GUARDS — defined OUTSIDE App() so React
// doesn't remount children on every render
// ─────────────────────────────────────────────

// 1. Must be logged in + verified
const VerifiedRoute = ({ auth, children }) => {
    if (!auth.status) return <Navigate to="/login" replace />;
    if (auth.user?.verificationStatus !== "VERIFIED") return <Navigate to="/verification" replace />;
    return children;
};

// 2. Must be logged in but NOT yet verified (Verification page gate)
const UnverifiedRoute = ({ auth, children }) => {
    if (!auth.status) return <Navigate to="/login" replace />;
    if (auth.user?.verificationStatus === "VERIFIED") return <Navigate to="/" replace />;
    return children;
};

// 3. Must be ADMIN
const AdminRoute = ({ auth, children }) => {
    if (!auth.status) return <Navigate to="/login" replace />;
    if (auth.user?.role?.toUpperCase() !== "ADMIN") return <Navigate to="/" replace />;
    return children;
};

// 4. Must be verified AND alumni — protects alumni-only pages from students
const AlumniRoute = ({ auth, children }) => {
    if (!auth.status) return <Navigate to="/login" replace />;
    if (auth.user?.verificationStatus !== "VERIFIED") return <Navigate to="/verification" replace />;
    if (auth.user?.role?.toUpperCase() !== "ALUMNI") return <Navigate to="/jobs" replace />;
    return children;
};

// ─────────────────────────────────────────────

function App() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    // Restore session on page load/refresh
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data } = await api.get("/profile/me");

                if (data.success) {
                    // /profile/me returns the Profile doc with owner populated
                    // so user data lives inside data.data.owner
                    const userData = data.data.owner ? data.data.owner : data.data;
                    dispatch(login(userData));
                }
            } catch (error) {
                // 401 = no valid session — expected on first visit
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [dispatch]);

    // Black screen while session check runs — prevents flash of wrong page
    if (loading) return <div className="bg-black h-screen" />;

    return (
        <Routes>

            {/* ── ROOT: Smart traffic controller ── */}
            <Route
                path="/"
                element={
                    auth.status ? (
                        auth.user?.role?.toUpperCase() === "ADMIN" ? (
                            <Navigate to="/admin" replace />
                        ) : auth.user?.verificationStatus === "VERIFIED" ? (
                            <Layout><Feed /></Layout>
                        ) : (
                            <Navigate to="/verification" replace />
                        )
                    ) : (
                        <Landing />
                    )
                }
            />

            {/* ── PUBLIC ROUTES ── */}
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/login" element={!auth.status ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!auth.status ? <Register /> : <Navigate to="/" replace />} />

            {/* ── VERIFICATION GATE ── */}
            <Route
                path="/verification"
                element={
                    <UnverifiedRoute auth={auth}>
                        <Verification />
                    </UnverifiedRoute>
                }
            />

            {/* ── VERIFIED USER ROUTES ── */}

            {/* Feed (home) */}
            <Route
                path="/feed"
                element={
                    <VerifiedRoute auth={auth}>
                        <Layout><Feed /></Layout>
                    </VerifiedRoute>
                }
            />

            {/* Jobs Hub — shows StudentJobs or AlumniDashboard based on role */}
            <Route
                path="/jobs"
                element={
                    <VerifiedRoute auth={auth}>
                        <Layout><JobsPage /></Layout>
                    </VerifiedRoute>
                }
            />

            {/* Chat */}
            <Route
                path="/chat"
                element={
                    <VerifiedRoute auth={auth}>
                        <Layout><Chat /></Layout>
                    </VerifiedRoute>
                }
            />

            {/* Own Profile */}
            <Route
                path="/profile"
                element={
                    <VerifiedRoute auth={auth}>
                        <Layout><Profile /></Layout>
                    </VerifiedRoute>
                }
            />

            {/* Public Profile (view others) */}
            <Route
                path="/profile/:id"
                element={
                    <VerifiedRoute auth={auth}>
                        <Layout><PublicProfile /></Layout>
                    </VerifiedRoute>
                }
            />

            {/* Settings */}
            <Route
                path="/settings"
                element={
                    <VerifiedRoute auth={auth}>
                        <Layout><Settings /></Layout>
                    </VerifiedRoute>
                }
            />

            {/* ── ALUMNI-ONLY ROUTES ── */}

            {/* Post a Job */}
            <Route
                path="/post-job"
                element={
                    <AlumniRoute auth={auth}>
                        <Layout><PostJob /></Layout>
                    </AlumniRoute>
                }
            />

            {/* View Applicants for a specific job */}
            <Route
                path="/applications/:jobId"
                element={
                    <AlumniRoute auth={auth}>
                        <Layout><JobApplications /></Layout>
                    </AlumniRoute>
                }
            />

            {/* ── ADMIN ROUTE ── */}
            <Route
                path="/admin"
                element={
                    <AdminRoute auth={auth}>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />

            <Route path="/my-applications" element={
                <VerifiedRoute auth={auth}>
                    <Layout><MyApplications /></Layout>
                </VerifiedRoute>
            } />

            {/* ── 404 CATCH-ALL ── */}
            <Route
                path="*"
                element={
                    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                        <h1 className="text-6xl font-bold text-gray-900">404</h1>
                        <p className="text-gray-500 mt-2 mb-6">This page doesn't exist.</p>
                        <a
                            href="/"
                            className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Go Home
                        </a>
                    </div>
                }
            />

        </Routes>
    );
}

export default App;