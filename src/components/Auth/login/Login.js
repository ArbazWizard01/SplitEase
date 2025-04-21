import { useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import API from "../../../services/api";
import "./login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      // assuming your backend returns { token: "xxx", user: { id, name, email } }
      login(res.data.user, res.data.token); // correct
      setTimeout(() => {
        setLoading(false);
        console.log("loging", { email, password });
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Hi, Welcome Back</h1>
          <img
            src="https://splitapp-rnjo.onrender.com/static/illustrations/illustration_login.png"
            alt="Welcome"
          />
        </div>
        <div className="auth-right">
          <div className="auth-form-box">
            <h2>Sign in to SplitEase!</h2>
            <p>Enter your details below.</p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? (
                  <div className="spinner-with-text">
                    <div className="spinner"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="small-text">
              Don't have an account? <Link to="/register">Get started</Link>
            </p>

            <footer>
              © Arbaz Ansari <br />
              <a href="https://github.com/ArbazWizard01">[GitHub]</a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
