import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, NavLink } from 'react-router-dom';

const Email = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleEvent = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please Enter Your Email');
            return; 
        }

        try {
            const data = await fetch('http://localhost:5000/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const res = await data.json();
            console.log(res);

            if (!data.ok) {
                return toast.error(res.msg || 'Unable to send email');
            }

            toast.success('OTP sent to your email');
            setEmail('');
            
            localStorage.setItem('email',email)
            setTimeout(() => {
                navigate('/recovery')
            }, 3000);

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5">
            <div className="container">
                <div className="row justify-content-center w-100 m-0">
                    {/* Compact centralized width column matching with Login/Register pages layout design */}
                    <div className="col-12 col-sm-10 col-md-7 col-lg-4 p-0">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative overflow-hidden">
                            
                            {/* Decorative Top Accent Line */}
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)' }}></div>

                            {/* Section Header Branding Area */}
                            <div className="text-center mb-4 mt-2">
                                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">
                                    Verify Email
                                </h3>
                                <p className="text-muted small px-1">
                                    Enter your registered email address to receive a secure OTP code token
                                </p>
                            </div>

                            {/* Core Action Submit Form */}
                            <form onSubmit={handleEvent} className="d-flex flex-column gap-3">
                                
                                {/* Email Address Input framework */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        required
                                    />
                                </div>

                                {/* Form Action Submit Button */}
                                <button 
                                    type="submit" 
                                    className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm text-uppercase tracking-wider mt-3 btn-auth-submit"
                                    style={{ fontSize: '13.5px', letterSpacing: '0.5px' }}
                                >
                                    Send OTP
                                </button>
                            </form>

                            {/* Redirect Footer Anchors */}
                            <div className="text-center mt-4 pt-1 border-top border-light">
                                <p className="text-muted small mb-0">
                                    {localStorage.getItem("token") ? (
                                        <NavLink 
                                            to="/my-profile" 
                                            className="text-primary-orange fw-bold text-decoration-none hover-underline-trigger"
                                        >
                                            Cancel & Go Back
                                        </NavLink>
                                    ) : (
                                        <>
                                            Remembered your password?{' '}
                                            <NavLink 
                                                to="/login" 
                                                className="text-primary-orange fw-bold text-decoration-none hover-underline-trigger"
                                            >
                                                Back to Login
                                            </NavLink>
                                        </>
                                    )}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Email;