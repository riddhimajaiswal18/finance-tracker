import { useState, useEffect, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';

const API_KEY = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/INR`;

export default function CurrencyConverter() {
    const { transactions = [] } = useContext(FinanceContext);
    const [rates, setRates] = useState(null);
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDemoData = (msg) => {
            setRates({ USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.78, AUD: 0.018, CAD: 0.016 });
            setError(msg);
        };

        if (!API_KEY || (typeof API_KEY === 'string' && API_KEY.includes('YOUR_KEY'))) {
            loadDemoData("Demo Mode (Add API Key for real rates)");
        } else {
            fetch(BASE_URL)
                .then(res => res.json())
                .then(data => {
                    if (data.result === 'success') {
                        setRates(data.conversion_rates);
                        setError('');
                    } else {
                        loadDemoData("Error fetching rates. Showing demo data.");
                    }
                })
                .catch(() => loadDemoData("Network Error. Showing demo data."));
        }
    }, []);

    const balance = transactions.reduce((acc, t) => {
        if (t.type === 'income') return acc + Number(t.amount);
        return acc - Number(t.amount);
    }, 0);

    const convertedBalance = rates ? (balance * rates[targetCurrency]).toFixed(2) : '...';

    return (
        <div className="card">
            <h3>Currency Converter</h3>
            {error && <p style={{ color: 'var(--accent)', fontSize: '0.9rem', background: 'rgba(139, 92, 246, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</p>}
            {!error && !rates && <p>Loading currency data...</p>}
            {rates && (
                <div className="converter-ui">
                    <p>Your total balance of <strong>₹{balance.toLocaleString('en-IN')}</strong> is approximately:</p>
                    <h2>{convertedBalance}
                        <select value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
                            {Object.keys(rates).filter(c => ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].includes(c)).map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </h2>
                </div>
            )}
        </div>
    );
}