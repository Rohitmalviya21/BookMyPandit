import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Recovery = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');

        if (!storedEmail) {
            toast.error('Email not found. Please try again');
            navigate('/forgot-password');
        } else {
            setEmail(storedEmail);
        }
    }, [navigate]);

    const handleEvent = async (e) => {
        e.preventDefault();

        if (!otp) {
            toast.error('Please Enter OTP');
            return;
        }

        try {
            setLoading(true);
            const data = await fetch("http://localhost:5000/api/auth/verify-otp", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });
            const res = await data.json();

            if (!data.ok) {
                toast.error(res.msg || 'Invalid OTP');
                return;
            }
            
            toast.success("OTP verified successfully");

            setTimeout(() => {
                navigate('/reset-password');
            }, 1500);
            
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
                    {/* Compact layout alignment matching other auth blocks */}
                    <div className="col-12 col-sm-10 col-md-7 col-lg-4 p-0">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative overflow-hidden">
                            
                            {/* Decorative Top Accent Line */}
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)' }}></div>

                            {/* Section Header Branding Area */}
                            <div className="text-center mb-4 mt-2">
                                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">
                                    Security Verification
                                </h3>
                                <p className="text-muted small px-1">
                                    An OTP security token has been dispatched to <span className="text-dark fw-semibold">{email || 'your email'}</span>
                                </p>
                            </div>

                            {/* Core Action Submit Form */}
                            <form onSubmit={handleEvent} className="d-flex flex-column gap-3">
                                
                                {/* One-Time Password Input box */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Enter 6-Digit OTP</label>
                                    <input 
                                        type="text" 
                                        maxLength="6"
                                        value={otp} 
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none text-center fw-bold font-monospace tracking-widest fs-5"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Form Action Submit Button with continuous interaction protection */}
                                <button 
                                    type="submit" 
                                    className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm text-uppercase tracking-wider mt-3 btn-auth-submit d-flex align-items-center justify-content-center gap-2"
                                    style={{ fontSize: '13.5px', letterSpacing: '0.5px' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                            </form>

                             {/* Back link route fallback configuration */}
                             <div className="text-center mt-4 pt-1 border-top border-light d-flex flex-column gap-2">
                                 <span className="text-muted small">
                                     Didn't get the code?{' '}
                                     <span 
                                         className="text-primary-orange fw-bold cursor-pointer hover-underline-trigger" 
                                         onClick={() => navigate('/forgot-password')}
                                         style={{ cursor: 'pointer' }}
                                     >
                                         Resend
                                     </span>
                                 </span>
                                 {localStorage.getItem("token") && (
                                     <span 
                                         className="text-muted small cursor-pointer hover-underline-trigger fw-bold text-primary-orange"
                                         style={{ cursor: 'pointer' }}
                                         onClick={() => navigate('/my-profile')}
                                     >
                                         Cancel & Go Back
                                     </span>
                                 )}
                             </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Recovery;