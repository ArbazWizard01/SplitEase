import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Group from "./pages/Group";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const RootRedirect = () => {
  const { user } = useContext(AuthContext);
  return <Navigate to={user ? "/dashboard" : "/login"} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups/:id"
            element={
              <PrivateRoute>
                <Group />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
