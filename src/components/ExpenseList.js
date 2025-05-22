import React from "react";

const ExpenseList = ({
  expenses,
  IconButton,
  getUserName,
  openEditModal,
  handleDeleteExpense,
  AiOutlineDelete,
  AiOutlineEdit,
  openDetailModal,
}) => {
  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div
          className="expense-item"
          key={expense._id}
          onClick={() => openDetailModal(expense)}
        >
          <div className="expense-item-header">
            <span>₹{expense.amount}</span>
            <span>Paid by {getUserName(expense.paidBy)}</span>
          </div>
          <div className="expense-item-description">{expense.description}</div>
          <div className="expense-item-split">
            <div>
              Split between:{" "}
              {expense.splitBetween.map((id) => getUserName(id)).join(", ")}
            </div>
            <div
              className="expense-item-actions"
              onClick={(e) => e.stopPropagation()} 
            >
              <IconButton type="text" onClick={() => openEditModal(expense)}>
                <AiOutlineEdit />
              </IconButton>
              <IconButton
                type="text"
                color="error"
                onClick={() => handleDeleteExpense(expense._id)}
              >
                <AiOutlineDelete />
              </IconButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
