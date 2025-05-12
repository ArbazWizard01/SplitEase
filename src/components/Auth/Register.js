import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../../styles/register.css";

const Register = () => {
  const { register } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Manage the expense more effectively with SplitApp !</h1>
          <img
            src="https://splitapp-rnjo.onrender.com/static/illustrations/illustration_register.png"
            alt="Welcome"
          />
        </div>
        <div className="auth-right">
          <div className="auth-form-box">
            <h2>Sign up to SplitEase!</h2>
            <p>Enter your details below.</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
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
              <button type="submit">Submit</button>
            </form>

            <p className="small-text">
              Already have an account? <Link to="/login">Get started</Link>
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

export default Register;
