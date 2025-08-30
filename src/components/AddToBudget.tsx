import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "@mantine/core";
import axios from "axios";
import HistoryContext from "../store/HistoryContext";
import CategoriesContext from "../store/CategoriesContext";

const AddToBudget = () => {
  const { addCategory } = useContext(CategoriesContext);
  const { addHistoryElement } = useContext(HistoryContext);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleAddToBudget = async () => {
    if (!label || !value || value <= 0 || Number.isNaN(value)) {
      alert(
        "Invalid Entries. Make sure the label is not empty and the amount is greater than zero."
      );
      return;
    }

    try {
      // API call to add the budget
      const response = await axios.post("http://localhost:5000/add-budget", {
        label,
        value,
      });

      if (response.status === 200) {
        alert("Budget added successfully!");

        // Update categories and history contexts
        addCategory({
          label: "Budget",
          id: crypto.randomUUID(),
          amount: value,
        });

        addHistoryElement({
          label,
          amount: value,
          id: crypto.randomUUID(),
          type: "Budget",
          dateCreated: new Date().toISOString(),
          category: "Budget",
        });

        // Navigate to home page after adding budget
        navigate("/");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      alert("Failed to add budget. Please check the backend.");
    }
  };

  return (
    <div>
      <TextInput
        value={label}
        onChange={(e) => setLabel(e.currentTarget.value)}
        mt={20}
        size="md"
        w="40%"
        placeholder="Ex: Christmas bonus"
        label="Label"
        withAsterisk
      />
      <TextInput
        value={value || ""}
        onChange={(e) => setValue(parseFloat(e.currentTarget.value))}
        mt={20}
        size="md"
        w="40%"
        placeholder="Ex: 3000"
        label="Amount"
        withAsterisk
        type="number"
      />
      <Button mt={20} onClick={handleAddToBudget}>
        Add To Budget
      </Button>
    </div>
  );
};

export default AddToBudget;
