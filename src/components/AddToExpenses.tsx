import { Button, Divider, MultiSelect, Text, TextInput } from "@mantine/core";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AvailableCategoriesContext from "../store/AvailableCategoriesContext";
import CategoriesContext from "../store/CategoriesContext";
import HistoryContext from "../store/HistoryContext";
import DeleteCatToolTip from "./DeleteCatToolTip";
import axios from "axios";

type AvailableCategories = {
  label: string;
  value: string;
  isused: string;
};

const AddToExpenses = () => {
  const { addHistoryElement } = useContext(HistoryContext);
  const { availableCategories, setAvailableCategories } = useContext(
    AvailableCategoriesContext
  );
  const { addCategory } = useContext(CategoriesContext);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState<number | null>(null);
  const [category, setCategory] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleAddExpense = async () => {
    if (!label || !value || value <= 0 || isNaN(value)) {
      alert("Invalid Entries. Label must not be empty and amount must be greater than zero.");
      return;
    }

    const selectedCategory = category[0] || "Uncategorized";

    try {
      // API call to save expense
      await axios.post("http://localhost:5000/add-expense", {
        label,
        value,
        category: selectedCategory,
      });

      alert("Expense saved successfully!");

      // Add category and history
      addCategory({ label: selectedCategory, amount: value, id: crypto.randomUUID() });

      setAvailableCategories((prev) =>
        prev.map((c) =>
          c.label === selectedCategory ? { ...c, isused: "true" } : c
        )
      );

      addHistoryElement({
        label,
        amount: value,
        id: crypto.randomUUID(),
        type: "Expense",
        dateCreated: new Date().toISOString(),
        category: selectedCategory,
      });

      navigate("/");
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Please try again later.");
    }
  };

  const handleRemoveCategory = () => {
    if (category.length === 0) {
      alert("No category has been selected!");
      return;
    }

    const selectedCategory = category[0];
    if (selectedCategory === "Uncategorized") {
      alert("Uncategorized cannot be removed!");
      return;
    }

    let removed = false;
    setAvailableCategories((prev) => {
      const updatedCategories = prev.filter((c) => {
        if (c.label === selectedCategory && c.isused === "false") {
          removed = true;
          return false;
        }
        return true;
      });

      return updatedCategories;
    });

    if (!removed) {
      alert("Category cannot be removed since it is being used.");
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
        placeholder="Ex: Car payments"
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
      <Divider mt={30} mb={20} />
      <Text size="xl" weight={700}>
        Add a Category to Your Expense
      </Text>
      <MultiSelect
        w="40%"
        mt={10}
        data={availableCategories}
        label="Select a Category"
        placeholder="Select a category or create a new one"
        searchable
        creatable
        value={category}
        onChange={setCategory}
        maxSelectedValues={1}
        getCreateLabel={(query) => `+ Create ${query[0].toUpperCase() + query.substring(1)}`}
        onCreate={(query) => {
          const capQuery = query[0].toUpperCase() + query.substring(1);
          const newCategory = {
            value: capQuery,
            label: capQuery,
            isused: "false",
          };

          setAvailableCategories((current) => [newCategory, ...current]);
          return newCategory;
        }}
      />
      <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
        <Button mr={30} onClick={handleAddExpense}>
          Add Expense
        </Button>
        <Button color="red" onClick={handleRemoveCategory}>
          Remove Category
        </Button>
        <DeleteCatToolTip />
      </div>
    </div>
  );
};

export default AddToExpenses;
