import React, { useState } from "react";
import { Modal, Button, Input, Form, Checkbox, message } from "antd";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import API from "../services/api";
import "../styles/expenseDetail.css";

const ExpenseDetail = ({
  open,
  onClose,
  expense,
  memberMap,
  refreshData,
  getUserName,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  const handleDelete = async () => {
    try {
      await API.delete(`/expense/delete/${expense._id}`);
      message.success("✅ Expense deleted successfully");
      onClose();
      refreshData();
    } catch (err) {
      message.error("❌ Failed to delete expense");
    }
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      await API.put(`/expense/update/${expense._id}`, values);
      message.success("✅ Expense updated successfully");
      setEditMode(false);
      onClose();
      refreshData();
    } catch (err) {
      message.error("❌ Failed to update expense");
    }
  };

  return (
    <Modal title="Expense Details" open={open} onCancel={onClose} footer={null}>
      {editMode ? (
        <Form form={form} layout="vertical" initialValues={expense}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Split With" name="splitBetween">
            <Checkbox.Group>
              {Object.entries(memberMap).map(([id, name]) => (
                <Checkbox key={id} value={id}>
                  {name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <div className="expense-detail-actions">
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button type="primary" onClick={handleEdit}>
              Save
            </Button>
          </div>
        </Form>
      ) : (
        <div className="expense-detail-content">
          <p>
            <strong>Amount:</strong> ₹{expense.amount}
          </p>
          <p>
            <strong>Description:</strong> {expense.description}
          </p>
          <p>
            <strong>Paid By:</strong> {getUserName(expense.paidBy)}
          </p>
          <p>
            <strong>Split Between:</strong>{" "}
            {expense.splitBetween.map((id) => getUserName(id)).join(", ")}
          </p>

          <div className="expense-detail-actions">
            <Button icon={<AiOutlineEdit />} onClick={() => setEditMode(true)}>
              Edit
            </Button>
            <Button danger icon={<AiOutlineDelete />} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ExpenseDetail;
