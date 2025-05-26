import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { getGroups } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import "../styles/group.css";
import { Button, Modal, Checkbox, Input, Form, notification, Tabs } from "antd";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IconButton } from "@mui/material";
import Summery from "../components/Summery";
import ExpenseList from "../components/ExpenseList";
import MemberList from "../components/MemberList";
import ExpenseDetail from "../components/ExpenseDetail";
import GroupStatistics from "../components/GroupStatistics";

const Group = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [memberMap, setMemberMap] = useState({});
  const [balanceList, setBalanceList] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [splitWith, setSplitWith] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [allUsersMap, setAllUsersMap] = useState({});
  const [removedMemberMap, setRemovedMemberMap] = useState({});

  useEffect(() => {
    getGroups();
    fetchGroupDetails();
    fetchGroupExpenses();
  }, [id]);

  const handleAddMember = async () => {
    try {
      const res = await API.post(`/group/addmember?groupId=${id}`, {
        email: newMemberEmail,
      });
      notification.success({
        message: " Member Added Successfully",
        description: res.data.message,
      });
      setIsAddMemberModalOpen(false);
      setNewMemberEmail("");
      fetchGroupDetails();
    } catch (error) {
      notification.error({
        message: "❌ Failed to add member",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleRemoveMember = async (memberId, email) => {
    if (!email) {
      notification.error({
        message: "❌ Cannot remove member — Email not found",
      });
      return;
    }

    // Store the removed member's name
    setRemovedMemberMap((prev) => ({
      ...prev,
      [memberId]: memberMap[memberId] || memberId,
    }));

    try {
      const res = await API.post(`/group/removemember?groupId=${id}`, {
        email,
      });
      notification.success({
        message: "✅ Member removed successfully",
        description: res.data.message,
      });
      await fetchGroupDetails();
      await fetchGroupExpenses();
    } catch (error) {
      notification.error({
        message: "❌ Failed to remove member",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };
  const getUserName = (userId) => {
    return memberMap[userId] || removedMemberMap[userId] || userId;
  };

  const fetchGroupDetails = async () => {
    try {
      const res = await API.get(`/group/${id}`);
      if (res?.data) {
        setGroup(res.data);
        setMemberMap(res.data.memberDetails || {});
        const formatted = formatBalances(
          res.data.balances,
          res.data.memberDetails
        );
        setBalanceList(formatted);

        const userMap = {};
        res.data.members.forEach((id) => {
          userMap[id] = res.data.memberDetails?.[id] || id;
        });

        res.data.balances &&
          Object.entries(res.data.balances).forEach(([from, toObj]) => {
            if (!userMap[from]) userMap[from] = from;
            Object.keys(toObj).forEach((to) => {
              if (!userMap[to]) userMap[to] = to;
            });
          });

        setAllUsersMap(userMap);
      }
    } catch (error) {
      console.log("❌ Failed to fetch group details:", error);
    }
  };

  const formatBalances = (balances, memberDetails) => {
    const result = [];
    for (const from in balances) {
      for (const to in balances[from]) {
        const amount = balances[from][to];
        if (amount > 0) {
          result.push({
            from: memberDetails?.[from] || from,
            to: memberDetails?.[to] || to,
            amount: amount.toFixed(2),
          });
        }
      }
    }
    return result;
  };

  const handleAddOrUpdateExpense = async () => {
    try {
      const payload = {
        amount: Number(amount),
        description,
        splitBetween: splitWith,
      };

      if (editExpense) {
        await API.put(`/expense/update/${editExpense._id}`, payload);
        notification.success({ message: " Expense updated successfully" });
      } else {
        await API.post(`/expense/${id}`, payload);
        notification.success({ message: " Expense added successfully" });
      }

      setIsModalOpen(false);
      setAmount(0);
      setDescription("");
      setSplitWith([]);
      setEditExpense(null);
      fetchGroupDetails();
      fetchGroupExpenses();
    } catch (err) {
      notification.error({
        message: "Failed to add or update expense",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const fetchGroupExpenses = async () => {
    try {
      const res = await API.get(`/expense/${id}`);
      if (res?.data) {
        setExpenses(res.data);
      }
    } catch (error) {
      notification.error("❌ Failed to fetch expenses:", error.message);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await API.delete(`/expense/delete/${expenseId}`);
      notification.success({ message: " Expense deleted successfully" });
      fetchGroupDetails();
      fetchGroupExpenses();
    } catch (err) {
      notification.error({ message: " Failed to delete expense" });
    }
  };

  const openEditModal = (expense) => {
    setEditExpense(expense);
    setAmount(expense.amount);
    setDescription(expense.description);
    setSplitWith(expense.splitBetween);
    setIsModalOpen(true);
  };

  const openDetailModal = (expense) => {
    setSelectedExpense(expense);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedExpense(null);
    setIsDetailModalOpen(false);
  };

  const handleLeaveGroup = async () => {
    try {
      const res = await API.post(`/group/leave?groupId=${id}`);
      notification.success({
        message: "Left the Group Successfully",
        description: res.data.message,
      });
      navigate("/dashboard");
    } catch (err) {
      notification.error({
        message: "Failed to leave Group",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="group-page">
      <Sidebar />
      {group ? (
        <div className="group-details">
          <div className="group-info">
            <h1>{group.name}</h1>
            <Button danger onClick={handleLeaveGroup}>
              Leave
            </Button>
          </div>

          <Summery balanceList={balanceList} getUserName={getUserName} />

          <Tabs
            activeKey={activeTabKey}
            onChange={(key) => setActiveTabKey(key)}
            tabBarExtraContent={
              <>
                {activeTabKey === "1"  ? (
                  <Button
                    className="expense-btn"
                    type="primary"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSplitWith((prev) => (user?.id ? [user.id] : []));
                    }}
                  >
                    Add Expense
                  </Button> 
                ) : (
                  <Button
                    className="expense-btn"
                    type="primary"
                    onClick={() => setIsAddMemberModalOpen(true)}
                  >
                    Add Member
                  </Button>
                )}

                <Modal
                  title={editExpense ? "Edit Expense" : "Add Expense"}
                  open={isModalOpen}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setEditExpense(null);
                  }}
                  onOk={handleAddOrUpdateExpense}
                  okText="Submit"
                >
                  <Form layout="vertical">
                    <Form.Item label="Amount">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </Form.Item>
                    <Form.Item label="Description">
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </Form.Item>
                    <Form.Item label="Split With">
                      <Checkbox.Group value={splitWith} onChange={setSplitWith}>
                        {group.members.map((memberId) => (
                          <Checkbox key={memberId} value={memberId}>
                            {memberMap[memberId] || memberId}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  </Form>
                </Modal>

                <Modal
                  title="Add Member"
                  open={isAddMemberModalOpen}
                  onCancel={() => setIsAddMemberModalOpen(false)}
                  onOk={handleAddMember}
                  okText="Submit"
                >
                  <Form layout="vertical">
                    <Form.Item label="Email">
                      <Input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="Enter user email"
                        required
                      />
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            }
            items={[
              {
                key: "1",
                label: "Expenses",
                children: (
                  <ExpenseList
                    memberMap={memberMap}
                    getUserName={getUserName}
                    expenses={expenses}
                    IconButton={IconButton}
                    openEditModal={openEditModal}
                    AiOutlineEdit={AiOutlineEdit}
                    handleDeleteExpense={handleDeleteExpense}
                    AiOutlineDelete={AiOutlineDelete}
                    handleRefresh={() => {
                      fetchGroupDetails();
                      fetchGroupExpenses();
                    }}
                    groupId={id}
                    openDetailModal={openDetailModal}
                  />
                ),
              },
              {
                key: "2",
                label: "Statistics",
                children: (
                  <GroupStatistics expenses={expenses} memberMap={memberMap} />
                ),
              },
              {
                key: "3",
                label: "Members",
                children: (
                  <MemberList
                    user={user}
                    group={group}
                    memberMap={memberMap}
                    onRemoveMember={handleRemoveMember}
                  />
                ),
              },
            ]}
          />

          {selectedExpense && (
            <ExpenseDetail
              open={isDetailModalOpen}
              onClose={closeDetailModal}
              expense={selectedExpense}
              groupId={id}
              getUserName={getUserName}
              memberMap={memberMap}
              refreshData={() => {
                fetchGroupDetails();
                fetchGroupExpenses();
              }}
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Group;
