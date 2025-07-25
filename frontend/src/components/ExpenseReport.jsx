import React, { useState, useEffect } from 'react';
import { FaRupeeSign, FaSearch } from 'react-icons/fa';
import { MdDateRange } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdError } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const ExpenseReport = () => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [navigate, userId]);

    const reportRef = React.useRef();

    const downloadPDF = () => {
        const input = reportRef.current;
        // Temporarily show the PDF content
        input.style.display = 'block';

        html2canvas(input, {
            scale: 2, // Higher quality
            logging: false,
            useCORS: true
        }).then((canvas) => {
            input.style.display = 'none'; // Hide again after capture

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Add margins
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
            pdf.save(`Expense_Report_${fromDate}_to_${toDate}.pdf`);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/search_expense/${userId}/?from=${fromDate}&to=${toDate}`);
            const data = await response.json();
            setExpenses(data.expenses || []);
            setGrandTotal(data.total || 0);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong');
        }
    };

    return (
        <div className='container mt-5'>
            {/* Visible Page Header */}
            <div className="text-center mb-3">
                <h2>
                    <MdDateRange className="me-2" />
                    Datewise Expense Report
                </h2>
                <p className="text-muted">Track your spending between selected dates</p>
            </div>

            {/* Search Form */}
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text bg-light"><MdDateRange /></span>
                        <input
                            type="date"
                            className="form-control"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text bg-light"><MdDateRange /></span>
                        <input
                            type="date"
                            className="form-control"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='col-md-4'>
                    <button type="submit" className="btn btn-primary w-100 lead">
                        <FaSearch className='me-2' /> Search
                    </button>
                </div>
            </form>

            {/* Hidden PDF Content */}
            <div ref={reportRef} style={{ display: 'none' }}>
                <div className="pdf-header text-center mb-4 p-4">
                    <h1 className="text-primary fw-bold">TrakX Expense Report</h1>
                    <div className="invoice-info mt-3">
                        <p style={{ marginBottom: '5px' }}>
                            <strong>Report Period:</strong> {fromDate} to {toDate}
                        </p>
                        <p style={{ marginBottom: '5px' }}>
                            <strong>Generated On:</strong> {new Date().toLocaleDateString()}
                        </p>
                        <p>
                            <strong>User ID:</strong> {userId}
                        </p>
                    </div>
                </div>

                <table className='table table-bordered'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Sr No.</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((exp, index) => (
                                <tr key={exp.id}>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{index + 1}</td>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{exp.ExpenseDate}</td>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{exp.ExpenseItem}</td>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{exp.ExpenseCost}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='4' className='text-center text-muted'><MdError className='me-2' />No Expenses Found</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='3' style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>Total:</td>
                            <td style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold', color: 'green' }}>
                                <FaRupeeSign className='me-2' style={{ color: 'green' }} />{grandTotal}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div className="pdf-footer mt-4 text-center p-3">
                    <p className="text-muted small">
                        Thank you for using TrakX - Your personal expense tracker
                    </p>
                </div>
            </div>

            {/* Visible Table */}
            <div className="mt-4">
                <table className='table table-striped table-bordered rounded'>
                    <thead style={{ backgroundColor: '#1e293b', color: 'white' }}>
                        <tr>
                            <th style={{ textAlign: 'center', padding: '12px' }}>Sr No.</th>
                            <th style={{ textAlign: 'center', padding: '12px' }}>Date</th>
                            <th style={{ textAlign: 'center', padding: '12px' }}>Items</th>
                            <th style={{ textAlign: 'center', padding: '12px' }}>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((exp, index) => (
                                <tr key={exp.id}>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{index + 1}</td>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{exp.ExpenseDate}</td>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{exp.ExpenseItem}</td>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{exp.ExpenseCost}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='4' className='text-center text-muted'><MdError className='me-2' />No Expenses Found</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='3' style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>Total:</td>
                            <td style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold', color: 'green' }}>
                                <FaRupeeSign className='me-2' style={{ color: 'green' }} />{grandTotal}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* PDF Download Button */}
            {expenses.length > 0 && (
                <div className="mt-3 text-center">
                    <button onClick={downloadPDF} className="btn btn-danger">
                        Download PDF Report
                    </button>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ExpenseReport;