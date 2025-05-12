import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserPlus,
  FaInfoCircle,
} from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/sidebar.css";
import { getGroups } from "../services/api";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res || res.groups);
    } catch (err) {}
  };

  const navItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { label: "Groups", icon: <FaUsers />, path: "/groups" },
    { label: "Create Group", icon: <FaUserPlus />, path: "/create-group" },
    { label: "About", icon: <FaInfoCircle />, path: "/about" },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        {/* Logo image placeholder */}
        {/* <img src="/logo.png" alt="SplitEase" /> */}
      </div>

      <Link to={"/dashboard"} className="profile-card">
        <img
          className="profile-pic"
          alt="profile avatar"
          src="https://i1.wp.com/res.cloudinary.com/tuzup/image/upload/v1658929366/SplitApp/user_l7xmft.png?ssl=1"
        />
        <div className="profile-info">
          <span className="name">{user?.name || "Guest"}</span>
          <span className="email">{user?.email || "example@email.com"}</span>
        </div>
      </Link>

      <div className="group-links">
        <h3>Groups</h3>
          {groups.map((group) => (
            <div key={group._id}>
              <Link to={`/groups/${group._id}`} className="group-item">{group.name}</Link>
            </div>
          ))}
      </div>

      {/* <div className="nav-links">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.label}
            style={{ textDecoration: "none" }}
          >
            <div
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </div>
          </Link>
        ))}
      </div> */}

      <div className="footer">
        <p>© ArbazAnsari | Open Source ❤️</p>
        <a
          href="https://github.com/ArbazWizard01"
          target="_blank"
          rel="noopener noreferrer"
        >
          [GitHub]
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
