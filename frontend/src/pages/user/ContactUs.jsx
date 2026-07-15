import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaLock } from 'react-icons/fa';

const ContactUs = () => {
    const { isAuth, token, name } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Auto-populate name if user is logged in
    useEffect(() => {
        if (isAuth && name) {
            setForm((prev) => ({
                ...prev,
                name: name
            }));
        }
    }, [isAuth, name]);

    const handleEvent = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const sendContact = async (e) => {
        e.preventDefault();
        
        if (!isAuth) {
            toast.error('You must be logged in to submit an inquiry.');
            return;
        }

        const { name: uName, email, subject, message } = form;

        // Simple validation checks
        if (!uName || !email || !subject || !message) {
            toast.warning('Please fill in all required fields.');
            return;
        }

        // Email validation regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warning('Please provide a valid email address.');
            return;
        }

        setLoading(true);

        try {
            const data = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: uName,
                    email,
                    subject,
                    message
                })
            });

            const res = await data.json();
            
            if (data.ok) {
                toast.success(res.msg || 'Inquiry message submitted successfully!');
                // Reset form values, retaining name if authenticated
                setForm({
                    name: isAuth ? name : '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                toast.error(res.msg || 'Failed to submit inquiry.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-5 bg-light-cream min-vh-100 d-flex align-items-center animate-fade-in-up">
            <div className="container py-2 text-start">
                
                {/* Section Header */}
                <div className="text-center mb-5">
                    <span className="small text-primary-orange fw-bold text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Get In Touch</span>
                    <h2 className="fw-bold fs-2 text-dark mb-2 font-traditional">Contact Our Support Team</h2>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                        <span style={{ color: '#f26522', fontSize: '10px' }}>◆</span>
                        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                    </div>
                    <p className="text-muted small mt-2">Have a question or query? Send us a secure message and we will respond shortly.</p>
                </div>

                <div className="row g-4 justify-content-center">
                    
                    {/* Left Column: Contact info support tiles */}
                    <div className="col-12 col-lg-4">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white glass-card d-flex flex-column justify-content-between">
                            <div>
                                <h4 className="fw-bold text-dark font-traditional mb-3">Spiritual Support HQ</h4>
                                <p className="text-muted small mb-4">Feel free to reach out to us through any of our official communications networks. Our team is here to assist you.</p>
                                
                                <div className="d-flex flex-column gap-3">
                                    {/* Tile 1: Phone */}
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle saffron-gradient-bg text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                                            <FaPhoneAlt />
                                        </div>
                                        <div>
                                            <span className="text-muted small-text-10 text-uppercase tracking-wide d-block">Phone Support</span>
                                            <strong className="text-dark small">+91 98765 43210</strong>
                                        </div>
                                    </div>

                                    {/* Tile 2: Email */}
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle saffron-gradient-bg text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                                            <FaEnvelope />
                                        </div>
                                        <div>
                                            <span className="text-muted small-text-10 text-uppercase tracking-wide d-block">Email Support</span>
                                            <strong className="text-dark small">support@bookmypandit.com</strong>
                                        </div>
                                    </div>

                                    {/* Tile 3: Address */}
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle saffron-gradient-bg text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                                            <FaMapMarkerAlt />
                                        </div>
                                        <div>
                                            <span className="text-muted small-text-10 text-uppercase tracking-wide d-block">Spiritual HQ</span>
                                            <strong className="text-dark small">Varanasi Ghat Road, UP, India</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge visual mockup */}
                            <div className="mt-4 pt-3 border-top-dash text-center">
                                <span className="small-text-11 text-muted d-block">🛡️ 100% Secure Communications</span>
                                <span className="small-text-10 text-muted-footer d-block mt-0.5">Your email privacy is strictly protected.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Secure contact form OR Login alert */}
                    <div className="col-12 col-lg-7">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white glass-card">
                            {isAuth ? (
                                <form onSubmit={sendContact} className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center justify-content-between border-bottom-subtle pb-2 mb-2">
                                        <h4 className="fw-bold text-dark font-traditional mb-0">Send a Secure Inquiry</h4>
                                        <span className="badge bg-orange-tint text-primary-orange px-2 py-1 rounded-pill small-text-10">Connected</span>
                                    </div>
                                    
                                    <div className="row g-3">
                                        {/* Name Input */}
                                        <div className="col-12 col-md-6 text-start">
                                            <label htmlFor="name" className="form-label small fw-bold text-muted mb-1">Your Name</label>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                name="name" 
                                                value={form.name} 
                                                onChange={handleEvent} 
                                                placeholder="Enter full name" 
                                                className="form-control form-pro-input rounded-3"
                                                required 
                                            />
                                        </div>

                                        {/* Email Input */}
                                        <div className="col-12 col-md-6 text-start">
                                            <label htmlFor="email" className="form-label small fw-bold text-muted mb-1">Your Email</label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                name="email" 
                                                value={form.email} 
                                                onChange={handleEvent} 
                                                placeholder="name@example.com" 
                                                className="form-control form-pro-input rounded-3"
                                                required 
                                            />
                                        </div>
                                    </div>

                                    {/* Subject Input */}
                                    <div className="col-12 text-start">
                                        <label htmlFor="subject" className="form-label small fw-bold text-muted mb-1">Subject</label>
                                        <input 
                                            type="text" 
                                            id="subject" 
                                            name="subject" 
                                            value={form.subject} 
                                            onChange={handleEvent} 
                                            placeholder="What is this regarding?" 
                                            className="form-control form-pro-input rounded-3"
                                            required 
                                        />
                                    </div>

                                    {/* Message Textarea */}
                                    <div className="col-12 text-start">
                                        <label htmlFor="message" className="form-label small fw-bold text-muted mb-1">Your Message</label>
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            value={form.message} 
                                            onChange={handleEvent} 
                                            rows="5" 
                                            placeholder="Write your ritual queries, feedback, or support requests here..." 
                                            className="form-control form-pro-input rounded-3"
                                            style={{ resize: 'none' }}
                                            required 
                                        />
                                    </div>

                                    {/* Action Submit trigger */}
                                    <div className="text-end mt-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-orange px-4 py-2.5 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Sending Message...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPaperPlane style={{ fontSize: '13px' }} /> Send Message ➔
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* Unauthenticated Guest fallback screen */
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center py-5">
                                    <div className="rounded-circle bg-orange-tint text-primary-orange d-flex align-items-center justify-content-center mb-4" style={{ width: '70px', height: '70px', fontSize: '28px' }}>
                                        <FaLock />
                                    </div>
                                    <h4 className="fw-bold text-dark font-traditional mb-2">Inquiry System Secured</h4>
                                    <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '380px' }}>
                                        To protect user data and ensure secure communication pipelines, you must be logged in to submit official support inquiries.
                                    </p>
                                    <div className="d-flex align-items-center gap-2">
                                        <NavLink to="/login" className="btn btn-orange px-4 py-2 rounded-3 fw-bold shadow-sm">
                                            Log In Now ➔
                                        </NavLink>
                                        <NavLink to="/register" className="btn btn-outline-orange px-4 py-2 rounded-3 fw-bold">
                                            Register Account
                                        </NavLink>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default ContactUs;