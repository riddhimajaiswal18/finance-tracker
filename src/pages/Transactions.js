import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FinanceContext } from "../context/FinanceContext";
import "../App.css";

export default function Transactions() {
    const { transactions, deleteTransaction, setEditTransaction } =
        useContext(FinanceContext);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch =
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            (t.notes || "").toLowerCase().includes(search.toLowerCase());

        const matchesType =
            filterType === "all" ? true : t.type === filterType;

        return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

    const handleEdit = (transaction) => {
        setEditTransaction(transaction);
        navigate("/transactions/new");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
            deleteTransaction(id);
        }
    };

    return (
        <div className="container">
            <h1>Recent Transactions</h1>

            <div className="filter-bar">
                <input
                    placeholder="Search by title or notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 2 }}
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ flex: 1 }}
                >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>

            <div className="transaction-list">
                {filteredTransactions.length === 0 ? (
                    <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>No transactions found.</p>
                ) : (
                    filteredTransactions.map((t) => (
                        <div className={`card transaction-item ${t.type}`} key={t.id}>
                            <div className="t-info">
                                <h3>
                                    {t.title}
                                    {t.recurring && <span className="recurring-badge">RECURRING</span>}
                                </h3>
                                <div className="t-date">
                                    {t.category} • {new Date(t.date).toLocaleDateString('en-IN', {
                                        day: '2-digit', month: 'short', year: 'numeric'
                                    })}
                                </div>
                                {t.notes && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{t.notes}</div>}
                            </div>

                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div className={`t-amount ${t.type}`}>
                                    {t.type === "income" ? "+" : "-"} ₹ {Number(t.amount).toLocaleString("en-IN")}
                                </div>
                                <div className="t-actions">
                                    <button className="btn-action btn-edit" onClick={() => handleEdit(t)}>Edit</button>
                                    <button className="btn-action btn-delete" onClick={() => handleDelete(t.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}