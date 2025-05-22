import React, { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { message } from "antd";
import { AuthContext } from "../contexts/AuthContext";
import { getGroups } from "../services/api";
import API from "../services/api";
import "../styles/sidebar.css";
import CreateGroup from "./CreateGroup";

const Sidebar = ({ onGroupCreated }) => {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const location = useLocation();

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.groups || res);
    } catch (err) {
      message.error("Failed to fetch groups.");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await API.get("/api/users");
      const users = res.data?.users || [];

      setAllUsers(users);
    } catch (err) {
      message.error("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="sidebar">
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
        <div className="group-links-header">
          <h3>Groups</h3>
          <CreateGroup
            setModalOpen={setModalOpen}
            onGroupCreated={onGroupCreated}
            allUsers={allUsers}
            loadingUsers={loadingUsers}
            modalOpen={modalOpen}
          />
        </div>
        <div className="side-groups">
          {groups.map((group) => (
            <div key={group._id}>
              <Link
                to={`/groups/${group._id}`}
                className={`group-item ${
                  location.pathname === `/groups/${group._id}` ? "active" : ""
                }`}
              >
                {group.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

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
