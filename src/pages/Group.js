import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import "../styles/group.css";
import { Button, Modal, Checkbox, Input, Form, message, Tabs } from "antd";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IconButton } from "@mui/material";
import Summery from "../components/Summery";
import ExpenseList from "../components/ExpenseList";
import MemberList from "../components/MemberList";

const Group = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [memberMap, setMemberMap] = useState({});
  const [balanceList, setBalanceList] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [splitWith, setSplitWith] = useState([]);
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupExpenses();
  }, [id]);

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
        message.success("✅ Expense updated successfully");
      } else {
        await API.post(`/expense/${id}`, payload);
        message.success("✅ Expense added successfully");
      }

      setIsModalOpen(false);
      setAmount(0);
      setDescription("");
      setSplitWith([]);
      setEditExpense(null);
      fetchGroupDetails();
      fetchGroupExpenses();
    } catch (err) {
      message.error(
        "❌ " + (err.response?.data?.message || "Failed to add/update expense")
      );
    }
  };

  
  const fetchGroupExpenses = async () => {
    try {
      const res = await API.get(`/expense/${id}`);
      if (res?.data) {
        setExpenses(res.data);
      }
    } catch (error) {
      console.log("❌ Failed to fetch expenses:", error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await API.delete(`/expense/delete/${expenseId}`);
      message.success("✅ Expense deleted successfully");
      fetchGroupDetails();
      fetchGroupExpenses();
    } catch (err) {
      message.error("❌ Failed to delete expense");
    }
  };

  const openEditModal = (expense) => {
    setEditExpense(expense);
    setAmount(expense.amount);
    setDescription(expense.description);
    setSplitWith(expense.splitBetween);
    setIsModalOpen(true);
  };

  return (
    <div className="group-page">
      <Sidebar />
      {group ? (
        <div className="group-details">
          <h1>{group.name}</h1>

          <Summery balanceList={balanceList} />

          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={
              <>
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
              </>
            }
            items={[
              {
                key: "1",
                label: "Expenses",
                children: (
                  <ExpenseList
                    memberMap={memberMap}
                    expenses={expenses}
                    IconButton={IconButton}
                    openEditModal={openEditModal}
                    AiOutlineEdit={AiOutlineEdit}
                    handleDeleteExpense={handleDeleteExpense}
                    AiOutlineDelete={AiOutlineDelete}
                  />
                ),
              },
              {
                key: "2",
                label: "Members",
                children: (
                  <MemberList group={group} memberMap={memberMap} />
                ),
              },
            ]}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Group;
