import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { IoIosMail } from "react-icons/io";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImage from '../assets/images/login.png';
import '../assets/css/login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setformData] = useState({
        Email : '',
        Password : '',
    });

    const handleChange = (e) => {
        setformData({...formData,[e.target.name]:e.target.value})
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response=await fetch("http://127.0.0.1:8000/api/login/",{
                method : 'POST',
                header: {'Content-Type': 'application/json'},
                body : JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok){
                toast.success('Login Successfull..');
                localStorage.setItem('userId',data.userId);
                localStorage.setItem('userName',data.userName);

                setTimeout(()=>{
                    navigate('/dashboard')
                },2000);
            }
            else{
                
                toast.error(data.message)
            } 
        }
        catch (error){
            console.error('Error :', error)
            toast.error('Something Went Wrong')
        }
    };
    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-image-container">
                    <img src={loginImage} alt="Login illustration" className="login-image" />
                </div>
                
                <div className="login-form-container">
                    <div className="login-header">
                        <h2 className="login-title">
                            <FaUser className="icon" /> Login
                        </h2>
                        <p className="login-subtitle">Access your expenses dashboard</p>
                    </div>
                    
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-group">
                                <span className="input-group-text"><IoIosMail /></span>
                                <input
                                    type="email"
                                    value={formData.Email}
                                    className="form-control"
                                    required
                                    placeholder="Enter your email"
                                    name="Email"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaLock /></span>
                                <input
                                    type="password"
                                    value={formData.Password}
                                    className="form-control"
                                    required
                                    placeholder="Enter your password"
                                    name="Password"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="login-options">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                            </div>
                            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button className="login-button" type="submit">
                            Login
                        </button>

                        <div className="login-footer">
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;