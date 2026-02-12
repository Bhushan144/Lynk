import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { login, logout } from "./features/authSlice";
import api from "./utils/axios";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Landing from "./pages/Landing/Landing";
import Feed from './pages/Feed/Feed'
import Verification from "./pages/Auth/Verification";
import Layout from "./components/Layout/Layout";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import Profile from "./pages/Profile/Profile";
import PublicProfile from "./pages/Profile/PublicProfile";
import About from "./pages/About/About";
import Settings from './pages/Settings/Settings'
import Chat from './pages/Chat/Chat'

function App() {
  const dispatch = useDispatch();

  // We select the whole auth state to access .user and .status properties
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get("/profile/me");

        if (data.success) {
          // --- ROBUST DATA HANDLING ---
          // 1. Check if user is nested inside 'owner' (Profile Endpoint structure)
          // 2. If not, check if it's in 'data' directly (User Endpoint structure)
          const userData = data.data.owner ? data.data.owner : data.data;

          console.log("✅ App.jsx: Session Restored:", userData); // Check your console for this!

          dispatch(login(userData));
        }
      } catch (error) {
        console.log("Session expired or failed");
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [dispatch]);

  if (loading) return <div className="bg-black h-screen"></div>;

  // --- GUARDS ---

  // 1. Guard: Only for Verified Users
  const VerifiedRoute = ({ children }) => {
    if (!auth.status) return <Navigate to="/login" />;

    // Check if user exists before checking verificationStatus
    if (auth.user?.verificationStatus !== "VERIFIED") return <Navigate to="/verification" />;

    return children;
  };

  // 2. Guard: Only for Unverified Users (The Gate)
  const UnverifiedRoute = ({ children }) => {
    if (!auth.status) return <Navigate to="/login" />;
    if (auth.user?.verificationStatus === "VERIFIED") return <Navigate to="/" />;
    return children;
  };

  // 3. Guard: Only for Admins
  const AdminRoute = ({ children }) => {
    if (!auth.status) return <Navigate to="/login" />;

    // If user is NOT an admin, kick them back to home
    if (auth.user?.role !== "ADMIN") return <Navigate to="/" />;

    return children;
  };

  return (
    <Routes>
      {/* ROOT PATH: Traffic Controller */}
      <Route
        path="/"
        element={
          auth.status ? (
            // 1. Check if ADMIN first
            auth.user?.role === "ADMIN" ? (
              <Navigate to="/admin" replace />
            ) : (
              // 2. If Student/Alumni, check Verification
              auth.user?.verificationStatus === "VERIFIED" ? (
                <Layout>
                  <Feed />
                </Layout>
              ) : (
                <Navigate to="/verification" />
              )
            )
          ) : (
            // 3. If Not Logged In, show Landing
            <Landing />
          )
        }
      />

      <Route 
        path="/about" 
        element={
          <Layout>
            <About />
          </Layout>
        } 
      />

      {/* AUTH PATHS */}
      <Route path="/login" element={!auth.status ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!auth.status ? <Register /> : <Navigate to="/" />} />

      {/* THE VERIFICATION GATE */}
      <Route
        path="/verification"
        element={
          <UnverifiedRoute>
            <Verification />
          </UnverifiedRoute>
        }
      />

      {/* PROTECTED APP PATHS (Require Verification) */}

      {/* 1. Jobs (Placeholder for now) */}
      <Route
        path="/jobs"
        element={
          <VerifiedRoute>
            <Layout>
              <h1 className="p-10">Jobs Page</h1>
            </Layout>
          </VerifiedRoute>
        }
      />

      {/* 2. Chat (Placeholder for now) */}
      <Route
        path="/chat"
        element={
          <VerifiedRoute>
            <Layout>
              <Chat/>
            </Layout>
          </VerifiedRoute>
        }
      />

      {/* 3. YOUR PROFILE (View & Edit) */}
      <Route
        path="/profile"
        element={
          <VerifiedRoute>
            <Layout>
              <Profile />
            </Layout>
          </VerifiedRoute>
        }
      />

      {/* 4. PUBLIC PROFILE (View Others) */}
      <Route
        path="/profile/:id"
        element={
          <VerifiedRoute>
            <Layout>
              <PublicProfile />
            </Layout>
          </VerifiedRoute>
        }
      />

      {/* 5. SETTINGS PAGE */}
      <Route
        path="/settings"
        element={
          <VerifiedRoute>
            <Layout>
              <Settings />
            </Layout>
          </VerifiedRoute>
        }
      />

      {/* ADMIN ROUTE - NOW SECURED */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;