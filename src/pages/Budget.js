import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import "../App.css";

export default function Budget() {
  const { budget, setBudget, transactions } = useContext(FinanceContext);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const remaining = budget - totalExpense;
  const percentage = Math.min((totalExpense / budget) * 100, 100);
  const progressColor = percentage > 90 ? "#ef4444" : percentage > 70 ? "#f59e0b" : "#10b981";

  return (
    <div className="container">
      <h1>Monthly Budget</h1>

      <div className="card" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <label style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>Set Your Monthly Goal</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          style={{ fontSize: "2rem", textAlign: "center", fontWeight: "bold", color: "var(--primary)", border: "none", background: "transparent", borderBottom: "2px solid var(--border)", borderRadius: 0 }}
        />

        <div className="budget-progress-container">
          <div
            className="budget-progress-bar"
            style={{ width: `${percentage}%`, backgroundColor: progressColor }}
          ></div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Spent</div>
            <div style={{ fontWeight: "bold", fontSize: "1.5rem", color: "var(--danger)" }}>₹ {totalExpense.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Remaining</div>
            <div style={{ fontWeight: "bold", fontSize: "1.5rem", color: remaining < 0 ? "var(--danger)" : "var(--success)" }}>₹ {remaining.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}