import "./App.css";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import Activities from "./components/Activities";
import Leaderboard from "./components/Leaderboard";
import Teams from "./components/Teams";
import Users from "./components/Users";
import Workouts from "./components/Workouts";

function App() {
  return (
    <div className="container py-4">
      <div className="card shadow-sm app-shell">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h1 className="display-6 mb-0">OctoFit Tracker</h1>
            <a
              className="btn btn-outline-primary"
              href="https://react.dev/"
              target="_blank"
              rel="noreferrer"
            >
              React Docs
            </a>
          </div>

          <nav className="nav nav-pills mb-4 gap-2 flex-wrap">
            <NavLink className="nav-link" to="/users">
              Users
            </NavLink>
            <NavLink className="nav-link" to="/teams">
              Teams
            </NavLink>
            <NavLink className="nav-link" to="/activities">
              Activities
            </NavLink>
            <NavLink className="nav-link" to="/workouts">
              Workouts
            </NavLink>
            <NavLink className="nav-link" to="/leaderboard">
              Leaderboard
            </NavLink>
          </nav>

          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
