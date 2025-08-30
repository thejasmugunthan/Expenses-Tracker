// src/components/AddExpenseForm.js
import React, { useState } from "react";
import { addExpense } from "../api/expenseApi";

const AddExpenseForm = () => {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create the expense data object. Convert amount to a number.
    const expenseData = {
      label,
      amount: parseFloat(amount),
      category,
    };

    // Call the API service to add the expense
    await addExpense(expenseData);

    // Optionally, reset the form fields after submission
    setLabel("");
    setAmount("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpenseForm;
