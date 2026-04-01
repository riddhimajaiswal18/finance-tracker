import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FinanceProvider, FinanceContext } from "./context/FinanceContext";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import Budget from "./pages/Budget";
import Analytics from "./pages/Analytics";

function Navbar() {
  const { setEditTransaction } = useContext(FinanceContext);
  return (
    <nav className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/transactions/new" onClick={() => setEditTransaction(null)}>New</Link>
      <Link to="/budget">Budget</Link>
      <Link to="/analytics">Analytics</Link>
    </nav>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <FinanceProvider>
      <Router>
        <Navbar />
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme" style={{ position: 'fixed', top: '1rem', right: '1rem' }}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/new" element={<AddTransaction />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App;