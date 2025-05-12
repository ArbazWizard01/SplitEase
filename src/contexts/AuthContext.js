import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";  

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
        localStorage.removeItem("user");
      }
    }
  }, []);
  

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    navigate("/dashboard");
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    login(res.data.user, res.data.token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
