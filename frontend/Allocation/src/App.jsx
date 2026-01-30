// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import StudentDashboard from "./pages/Student/StudentDashboard";
import MentorDashboard from "./pages/Mentor/MentorDashboard";
import HeadDashboard from "./pages/Head/HeadDashboard";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Root path redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Auth Pages */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboards */}
        <Route
          path="/student/StudentDashboard"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentor/MentorDashboard"
          element={
            <PrivateRoute allowedRoles={["mentor"]}>
              <MentorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/head/HeadDashboard"
          element={
            <PrivateRoute allowedRoles={["head"]}>
              <HeadDashboard />
            </PrivateRoute>
          }
        />

        {/* Unauthorized + Fallback */}
        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;








