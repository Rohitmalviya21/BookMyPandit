import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        role: 'user',
        name: '',
        email: '',
        contact: '',
        password: '',
        confirm_password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEvent = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, contact, password, confirm_password, role } = form;

        if (!name || !email || !contact || !password || !confirm_password) {
            toast.error("All fields are required");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(contact)) {
            toast.error("Invalid contact number. It should be a 10-digit number.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirm_password) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    name,
                    email,
                    contact,
                    password,
                    confirm_password
                })
            });

            const res = await data.json();

            if (!data.ok) {
                toast.error(res.msg);
                setLoading(false);
                return;
            }

            toast.success(res.msg);
            setForm({
                name: '',
                email: '',
                contact: '',
                password: '',
                confirm_password: '',
                role: 'user'
            });

            // Registration successful hone par automatic proper secure login route transition
            navigate('/login');

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5">
            <div className="container">
                <div className="row justify-content-center w-100 m-0">
                    {/* Width adjusted to col-lg-5 to perfectly hold extra fields without stretching fields vertically */}
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 p-0">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative overflow-hidden animate-fade-in-up">

                            {/* Decorative Top Accent Brand Line */}
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)' }}></div>

                            {/* Branding Header Area */}
                            <div className="text-center mb-4 mt-2">
                                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">
                                    Create Account
                                </h3>
                                <p className="text-muted small">
                                    Join us to explore and book trusted veda pandits online
                                </p>
                            </div>

                            {/* Core Action Register Form */}
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

                                {/* Full Name Field */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Full Name</label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">
                                            <FaUser />
                                        </span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-icon shadow-none"
                                            placeholder="Enter your full name"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Two-Column Input Flex Layout (Email & Contact Side-by-Side on desktop) */}
                                <div className="row g-3 m-0 p-0">
                                    <div className="col-12 col-md-6 p-0 pe-md-2 text-start">
                                        <label className="small fw-semibold text-dark mb-1.5 ms-1">Email Address</label>
                                        <div className="auth-input-wrapper">
                                            <span className="auth-input-icon">
                                                <FaEnvelope />
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleEvent}
                                                className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-icon shadow-none"
                                                placeholder="email@example.com"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 p-0 ps-md-2 text-start">
                                        <label className="small fw-semibold text-dark mb-1.5 ms-1">Contact Number</label>
                                        <div className="auth-input-wrapper">
                                            <span className="auth-input-icon">
                                                <FaPhoneAlt />
                                            </span>
                                            <input
                                                type="number"
                                                name="contact"
                                                value={form.contact}
                                                onChange={handleEvent}
                                                className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-icon shadow-none"
                                                placeholder="Phone number"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>


                                {/* Password Verification Grid Side-by-Side */}
                                <div className="row g-3 m-0 p-0">
                                    <div className="col-12 col-md-6 p-0 pe-md-2 text-start">
                                        <label className="small fw-semibold text-dark mb-1.5 ms-1">Password</label>
                                        <div className="auth-input-wrapper">
                                            <span className="auth-input-icon">
                                                <FaLock />
                                            </span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={form.password}
                                                onChange={handleEvent}
                                                className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-both shadow-none"
                                                placeholder="Create password"
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
                                    <div className="col-12 col-md-6 p-0 ps-md-2 text-start">
                                        <label className="small fw-semibold text-dark mb-1.5 ms-1">Confirm Password</label>
                                        <div className="auth-input-wrapper">
                                            <span className="auth-input-icon">
                                                <FaLock />
                                            </span>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirm_password"
                                                value={form.confirm_password}
                                                onChange={handleEvent}
                                                className="form-control px-3 py-2.5 rounded-3 form-pro-input auth-input-with-both shadow-none"
                                                placeholder="Confirm password"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                className="auth-eye-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                disabled={loading}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Action Trigger Submit button */}
                                <button
                                    type="submit"
                                    className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm text-uppercase tracking-wider mt-3 btn-auth-submit d-flex align-items-center justify-content-center gap-2"
                                    style={{ fontSize: '13.5px', letterSpacing: '0.5px' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Registering...</span>
                                        </>
                                    ) : (
                                        "Register Account"
                                    )}
                                </button>
                            </form>

                            {/* Form Redirect Footer anchors */}
                            <div className="text-center mt-4 pt-1 border-top border-light">
                                <p className="text-muted small mb-0">
                                    Already have an account?{' '}
                                    <NavLink
                                        to="/login"
                                        className="text-primary-orange fw-bold text-decoration-none hover-underline-trigger"
                                    >
                                        Login Here
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

export default Register;