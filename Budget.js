import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

export default function Budget() {
    const { budget, setBudget, transactions } = useContext(FinanceContext);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    return (
        <div className="container">
            <div className="card">
                <h1>Budget Goal</h1>

                <label>Monthly Budget Limit:</label>
                <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                />

                <h3>Total Spent: ₹ {totalExpense}</h3>
                <h3 style={{ color: budget - totalExpense < 0 ? "red" : "green" }}>
                    Remaining: ₹ {budget - totalExpense}
                </h3>
            </div>
        </div>
    );
}