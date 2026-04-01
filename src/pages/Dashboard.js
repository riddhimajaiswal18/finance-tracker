import { useContext } from "react";
import { Link } from "react-router-dom";
import { FinanceContext } from "../context/FinanceContext";
import "../App.css";
import CurrencyConverter from "./CurrencyConverter";

export default function Dashboard() {
    const { transactions } = useContext(FinanceContext);

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const format = (num) => num.toLocaleString("en-IN");

    const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

    return (
        <div className="container">
            <h1>Overview</h1>

            <div className="dashboard-grid">
                <div className="card stat-card bg-income">
                    <h3>Total Income</h3>
                    <span className="amount">₹ {format(income)}</span>
                </div>
                <div className="card stat-card bg-expense">
                    <h3>Total Expense</h3>
                    <span className="amount">₹ {format(expense)}</span>
                </div>
                <div className="card stat-card bg-balance">
                    <h3>Net Balance</h3>
                    <span className="amount">₹ {format(income - expense)}</span>
                </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Recent Transactions</h3>
                        <Link to="/transactions" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
                    </div>
                    <div className="transaction-list">
                        {recentTransactions.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent activity.</p>
                        ) : (
                            recentTransactions.map(t => (
                                <div key={t.id} className={`transaction-item ${t.type}`} style={{ padding: '0.75rem 0' }}>
                                    <div className="t-info">
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.category}</div>
                                    </div>
                                    <div className={`t-amount ${t.type}`} style={{ fontSize: '0.95rem' }}>
                                        {t.type === 'income' ? '+' : '-'} ₹{Number(t.amount).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <CurrencyConverter />
            </div>
        </div>
    );
}