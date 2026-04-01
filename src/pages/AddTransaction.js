import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FinanceContext } from "../context/FinanceContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../App.css";

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    amount: yup.number().typeError("Must be number").positive().required(),
    category: yup.string().required(),
    type: yup.string().required(),
    date: yup.date()
        .typeError("Please enter a valid date")
        .max(new Date(new Date().setFullYear(new Date().getFullYear() + 10)), "Date is too far in the future")
        .required("Date is required"),
    recurring: yup.boolean(),
});

export default function AddTransaction() {
    const {
        addTransaction,
        updateTransaction,
        editTransaction,
        setEditTransaction,
    } = useContext(FinanceContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (editTransaction) {
            try {
                const parsedDate = new Date(editTransaction.date + 'T00:00:00');
                const dateValue = !isNaN(parsedDate.getTime())
                    ? parsedDate.toLocaleDateString('en-CA')
                    : new Date().toLocaleDateString('en-CA');

                reset({ ...editTransaction, date: dateValue });
            } catch (e) {
                reset({ ...editTransaction, date: new Date().toLocaleDateString('en-CA') });
            }
        }
    }, [editTransaction, reset]);

    const onSubmit = (data) => {
        const parsedDate = new Date(data.date);
        const dateStr = !isNaN(parsedDate.getTime())
            ? parsedDate.toLocaleDateString('en-CA')
            : new Date().toLocaleDateString('en-CA');

        const formattedData = { ...data, date: dateStr };

        if (editTransaction) {
            updateTransaction({ ...formattedData, id: editTransaction.id });
            setEditTransaction(null);
        } else {
            addTransaction(formattedData);
        }
        reset();
        navigate("/transactions");
    };

    const handleCancel = () => {
        setEditTransaction(null);
        navigate("/transactions");
    };

    return (
        <div className="container">
            <div className="card form-card">
                <h1 style={{ marginTop: 0, fontSize: "1.8rem", textAlign: "center" }}>{editTransaction ? "Edit Transaction" : "New Transaction"}</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Title</label>
                        <input placeholder="e.g. Grocery Shopping" {...register("title")} />
                        <span className="error-msg">{errors.title?.message}</span>
                    </div>

                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input type="number" placeholder="0.00" step="any" {...register("amount")} />
                        <span className="error-msg">{errors.amount?.message}</span>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select {...register("category")}>
                            <option value="">Select Category</option>
                            <option>Food</option>
                            <option>Travel</option>
                            <option>Rent</option>
                            <option>Salary</option>
                            <option>Freelance</option>
                            <option>Shopping</option>
                            <option>Health</option>
                        </select>
                        <span className="error-msg">{errors.category?.message}</span>
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select {...register("type")}>
                            <option value="">Select Type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <span className="error-msg">{errors.type?.message}</span>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" {...register("date")} />
                        <span className="error-msg">{errors.date?.message}</span>
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea placeholder="Add any details..." rows="3" {...register("notes")} />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="checkbox" id="recurring" style={{ width: 'auto', marginRight: '0.5rem' }} {...register("recurring")} />
                        <label htmlFor="recurring" style={{ marginBottom: 0, cursor: 'pointer' }}>
                            Mark as Recurring (e.g. Rent, Subscription)
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" type="submit">
                            {editTransaction ? "Update" : "Add"}
                        </button>
                        {editTransaction && (
                            <button className="btn-action" type="button" onClick={handleCancel}>Cancel</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}