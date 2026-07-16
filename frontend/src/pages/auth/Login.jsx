import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
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
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const res = await data.json();

            if (!data.ok) {
                toast.error(res.msg);
                setLoading(false);
                return;
            }

            login(res.token, res.user.role, res.user.name);
            toast.success(res.msg);

            if (res.user.role === 'admin') {
                navigate('/admin');
            } else if (res.user.role === 'pandit') {
                navigate('/pandit-dashboard');
            } else {
                navigate('/');
            }

            setFormData({ email: '', password: '' });

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {

        try {

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/auth/google`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: credentialResponse.credential
                    })
                }
            );

            const res = await response.json();

            if (!response.ok) {
                toast.error(res.msg);
                return;
            }

            login(
                res.token,
                res.role,
                res.name
            );

            toast.success(res.msg);

            if (res.role === "pandit") {

                navigate("/pandit-dashboard");

            } else {

                navigate("/");

            }

        } catch (error) {

            console.log(error);

            toast.error("Google Login Failed");
        }

    };


    return (
        <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5">
            <div className="container">
                <div className="row justify-content-center w-100 m-0">
                    <div className="col-12 col-sm-10 col-md-7 col-lg-4 p-0">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative overflow-hidden animate-fade-in-up">

                            {/* Decorative Top Accent Line */}
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)' }}></div>

                            {/* Branding Header Area */}
                            <div className="text-center mb-4 mt-2">
                                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">
                                    Welcome Back
                                </h3>
                                <p className="text-muted small px-2">
                                    Sign in to continue your spiritual booking portal
                                </p>
                            </div>

                            {/* Core Action Login Form */}
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

                                {/* Email Input Group wrapper */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Email Address</label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">
                                            <FaEnvelope />
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-icon"
                                            placeholder="Enter your email"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Password Input Group wrapper */}
                                <div className="form-group-block text-start">
                                    <div className="d-flex align-items-center justify-content-between mb-1.5 px-1">
                                        <label className="small fw-semibold text-dark mb-0">Password</label>
                                        <NavLink
                                            to="/forgot-password"
                                            className="text-primary-orange text-decoration-none fw-medium hover-underline-trigger"
                                            style={{ fontSize: '12px' }}
                                        >
                                            Forgot Password?
                                        </NavLink>
                                    </div>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">
                                            <FaLock />
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-both"
                                            placeholder="Enter your password"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="auth-eye-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            disabled={loading}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit trigger button block */}
                                <button
                                    type="submit"
                                    className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm text-uppercase tracking-wider mt-3 btn-auth-submit d-flex align-items-center justify-content-center gap-2"
                                    style={{ fontSize: '13.5px', letterSpacing: '0.5px' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Logging In...</span>
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                                <GoogleLogin

                                    onSuccess={handleGoogleSuccess}

                                    onError={() => {

                                        console.log("Login Failed");

                                    }}

                                />
                            </form>

                            {/* Redirect Footer anchors */}
                            <div className="text-center mt-4 pt-1 border-top border-light">
                                <p className="text-muted small mb-0">
                                    Don't have an account?{' '}
                                    <NavLink
                                        to="/register"
                                        className="text-primary-orange fw-bold text-decoration-none hover-underline-trigger"
                                    >
                                        Register Here
                                    </NavLink>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;