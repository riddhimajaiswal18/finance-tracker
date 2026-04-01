import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import "../App.css";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function Analytics() {
    const { transactions } = useContext(FinanceContext);
    const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);
    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);
    const comparisonData = [
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense },
    ];

    const expenseTransactions = transactions.filter((t) => t.type === "expense");
    const categories = [...new Set(expenseTransactions.map((t) => t.category))];
    const categoryData = categories.map((category) => {
        const amount = expenseTransactions
            .filter((t) => t.category === category)
            .reduce((acc, t) => acc + Number(t.amount), 0);
        return { name: category, value: amount };
    });

    const netBalance = totalIncome - totalExpense;
    const topCategory = categoryData.length > 0
        ? categoryData.reduce((prev, current) => (prev.value > current.value ? prev : current))
        : { name: "N/A", value: 0 };

    const trendMap = transactions.reduce((acc, t) => {
        const month = t.date.substring(0, 7);
        if (!acc[month]) {
            acc[month] = { name: month, income: 0, expense: 0 };
        }
        if (t.type === "income") acc[month].income += Number(t.amount);
        if (t.type === "expense") acc[month].expense += Number(t.amount);
        return acc;
    }, {});

    const trendData = Object.keys(trendMap).sort().map(key => {
        const [year, month] = key.split("-");
        const dateObj = new Date(year, month - 1);
        return {
            name: dateObj.toLocaleString('default', { month: 'short' }),
            income: trendMap[key].income,
            expense: trendMap[key].expense
        };
    });

    const format = (num) => Number(num).toLocaleString("en-IN");

    return (
        <div className="container">
            <h1>Spending Analytics</h1>

            {/* Key Metrics Cards */}
            <div className="dashboard-grid" style={{ marginBottom: "2rem" }}>
                <div className="card stat-card" style={{ background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)" }}>
                    <h3>Total Income</h3>
                    <span className="amount">₹ {format(totalIncome)}</span>
                </div>
                <div className="card stat-card" style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}>
                    <h3>Total Expenses</h3>
                    <span className="amount">₹ {format(totalExpense)}</span>
                </div>
                <div className="card stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                    <h3>Net Balance</h3>
                    <span className="amount">₹ {format(netBalance)}</span>
                </div>
                <div className="card stat-card" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                    <h3>Top Category</h3>
                    <span className="amount" style={{ fontSize: "1.5rem" }}>
                        {topCategory.name} (₹ {format(topCategory.value)})
                    </span>
                </div>
            </div>

            <div className="charts-container">
                <div className="card chart-card">
                    <h3>Expense Distribution</h3>
                    <PieChart width={300} height={300}>
                        <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} fill="#8884d8" label>
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '10px' }} itemStyle={{ color: 'var(--text-main)' }} />
                    </PieChart>
                </div>

                <div className="card chart-card">
                    <h3>Income vs Expense</h3>
                    <BarChart width={300} height={300} data={comparisonData}>
                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                        <YAxis stroke="var(--text-secondary)" />
                        <Tooltip cursor={{ fill: 'var(--bg-main)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '10px' }} itemStyle={{ color: 'var(--text-main)' }} />
                        <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </div>

                <div className="card chart-card" style={{ flex: "1 1 100%", marginTop: "1rem" }}>
                    <h3>Monthly Spending Trend</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '10px' }} itemStyle={{ color: 'var(--text-main)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
