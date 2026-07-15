import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEvent = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!email || !password) {
            toast.error('All fields are required');
            return;
        }

        setLoading(true);

        try {
            const data = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, isAdminLogin: true })
            });

            const res = await data.json();

            if (!data.ok) {
                toast.error(res.msg || 'Login failed');
                setLoading(false);
                return;
            }

            login(res.token, res.user.role, res.user.name);
            toast.success('Admin login successful');
            navigate('/admin');

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5">
            <div className="container">
                <div className="row justify-content-center w-100 m-0">
                    <div className="col-12 col-sm-10 col-md-7 col-lg-4 p-0">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative overflow-hidden">
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)' }}></div>
                            <div className="text-center mb-4 mt-2">
                                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">Admin Portal</h3>
                                <p className="text-muted small px-2">Access the administrative command dashboard</p>
                            </div>
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Email Address</label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon"><FaEnvelope /></span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-icon"
                                            placeholder="Enter admin email"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Password</label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon"><FaLock /></span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-both"
                                            placeholder="Enter admin password"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="auth-eye-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold mt-3 btn-auth-submit" disabled={loading}>
                                    {loading ? 'Authenticating...' : 'Sign In as Admin'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminLogin;
