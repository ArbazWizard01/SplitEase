import { useEffect, useState, useContext } from "react";
import { getGroups } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.groups || res);
    } catch (err) {
      console.error(err.message);
    }
  };

  const calculateUserBalance = (group) => {
    let balance = 0;
    const balances = group.balances || {};
    if (balances[user.id]) {
      for (const [otherUserId, amount] of Object.entries(balances[user.id])) {
        balance += amount;
      }
    }
    return balance;
  };

  const groupsWithBalance = groups.map((group) => {
    const balance = calculateUserBalance(group);
    return { ...group, balance };
  });

  const total = groupsWithBalance.reduce(
    (acc, group) => acc + group.balance,
    0
  );
  const youOwe = groupsWithBalance
    .filter((g) => g.balance < 0)
    .reduce((acc, g) => acc + g.balance, 0);
  const youAreOwed = groupsWithBalance
    .filter((g) => g.balance > 0)
    .reduce((acc, g) => acc + g.balance, 0);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="welcome-card">
          <div>
            <h2>Hello {user.name}, Welcome back!</h2>
            <p>
              Keep track of shared expenses and settle your corresponding
              balances in a convenient and personalized way.
            </p>
            <Link className="view-groups-btn">
              View Groups
            </Link>
          </div>
          <img
            className="welcome-img"
            src="https://splitapp-rnjo.onrender.com/static/illustrations/dashboard-card.png"
            alt="illustration"
          />
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <div className="summary-card">
            <h4>Total</h4>
            <p>₹ {total.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h4>You Owe</h4>
            <p>₹ {Math.abs(youOwe).toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h4>You Are Owed</h4>
            <p>₹ {youAreOwed.toFixed(2)}</p>
          </div>
        </div>

        <h1 className="group-heading">Your Groups</h1>

        {/* Groups Section */}
        <div className="group-list">
          {groupsWithBalance.length > 0 ? (
            groupsWithBalance.map((group) => (
              <Link to={`/groups/${group._id}`} key={group._id} className="group-card">
                <div className="group-card-header">
                  <h3 >{group.name}</h3>
                  {/* <p>{group.description || "No description"}</p> */}
                </div>
                <div className="group-card-balance">
                  <span
                    className={`balance-tag ${
                      group.balance === 0
                        ? "settled"
                        : group.balance > 0
                        ? "owed"
                        : "owe"
                    }`}
                  >
                    {group.balance === 0
                      ? "Settled"
                      : group.balance > 0
                      ? `You are owed: ₹ ${group.balance.toFixed(2)}`
                      : `You owe: ₹ ${Math.abs(group.balance).toFixed(2)}`}
                  </span>
                </div>
                <Link
                  to={`/groups/${group._id}/add-expense`}
                  className="add-expense-btn"
                >
                  ➕ Add Expense
                </Link>
              </Link>
            ))
          ) : (
            <div className="no-groups">
              <p>
                Seems to be new here! Create your first group and add expenses
              </p>
              <Link to="/create-group">Create Group</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
