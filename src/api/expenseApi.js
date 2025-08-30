// src/api/expenseApi.js
import axios from "axios";

/**
 * Sends expense data to the back-end to save in the database.
 * @param {Object} expenseData - The expense details (label, amount, category).
 */
export const addExpense = async (expenseData) => {
  try {
    // Your Express back-end runs on port 5000
    const response = await axios.post(
      "http://localhost:5000/api/expenses/add-expense",
      expenseData
    );
    console.log(response.data.message); // Expected: "Expense added successfully!"
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};
const handleAddToBudget = async () => {
  if (label === "" || value <= 0 || Number.isNaN(value)) {
    alert("Invalid input. Ensure fields are correctly filled.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/add-budget", {
      label,
      value,
    });
    alert("Budget added successfully!");
    // Optionally, handle state updates or navigation here
  } catch (error) {
    console.error("Error saving budget:", error);
    alert("Failed to add budget. Please try again.");
  }
};

