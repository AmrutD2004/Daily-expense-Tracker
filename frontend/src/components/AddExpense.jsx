import React, { useState, useEffect } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { MdDateRange } from "react-icons/md";
import { CiCirclePlus, CiShoppingCart } from "react-icons/ci";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

import { useNavigate, Link } from 'react-router-dom'
const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    ExpenseDate: '',
    ExpenseItem: '',
    ExpenseCost: '',
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/add_expense/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // FIXED
        body: JSON.stringify({ ...formData, UserId: userId })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <h2 className="text-center mb-3">
            <CiCirclePlus className="me-2" />
            Add Expense
          </h2>
          <p className="text-center text-muted mb-4">Track Your New Spending Here</p>

          <form onSubmit={handleSubmit}>
            {/* Fullname */}
            <div className="mb-3">
              <label className="form-label">Expense Date</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><MdDateRange /></span>
                <input
                  type="date"
                  name="ExpenseDate"
                  className="form-control"
                  value={formData.ExpenseDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Expense Item</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><CiShoppingCart /></span>
                <input
                  type="text"
                  name="ExpenseItem"
                  className="form-control"
                  placeholder="Enter Expense Item(e.g. Groceries, petrol, etc.)"
                  value={formData.ExpenseItem}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label">Expense Cost</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><RiMoneyRupeeCircleLine /></span>
                <input
                  type="number"
                  name="ExpenseCost"
                  className="form-control"
                  placeholder="Enter amount spent"
                  value={formData.ExpenseCost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100 lead">
              Add Expense
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AddExpense
