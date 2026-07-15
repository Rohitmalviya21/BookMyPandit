import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaOm, FaUsers, FaShieldAlt } from 'react-icons/fa';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <section className="min-vh-100 bg-light-cream py-5">
            <div className="container py-3">
                
                {/* 1. Header Area Section */}
                <div className="text-center mb-5 max-w-card mx-auto">
                    <span className="small text-primary-orange fw-bold text-uppercase tracking-wider" style={{ fontSize: '12px' }}>
                        Our Story
                    </span>
                    <h1 className="fw-bold fs-1 text-dark mt-1 mb-3 font-traditional">
                        Connecting Tradition With Trust
                    </h1>
                    <p className="text-muted style-text-para mx-auto" style={{ maxWidth: '650px' }}>
                        Welcome to BookMyPandit, where we bridge the gap between ancient Vedic wisdom and modern technology to help you perform your rituals with ultimate accuracy and peace of mind.
                    </p>
                </div>

                {/* 2. Interactive Two-Column Split Info Grid */}
                <div className="row g-4 align-items-center mb-5 pt-2">
                    <div className="col-12 col-md-6 text-start pe-md-4">
                        <h3 className="fw-bold font-traditional mb-3 fs-3">Our Core Philosophy</h3>
                        <p className="text-muted small-text-13 lh-lg mb-4">
                            We believe that sacred rituals and poojas are not just events, but spiritual pathways to happiness and balance. Finding a qualified, verified, and knowledgeable Pandit should not be a matter of chance. That's why we meticulously onboard only certified Vedic specialists onto our platform.
                        </p>
                        
                        {/* Premium Checkpoints Stack */}
                        <div className="d-flex flex-column gap-2.5 mb-4">
                            <div className="d-flex align-items-center gap-2 small-text-13 fw-semibold text-dark-50">
                                <FaCheckCircle className="text-primary-orange" /> 100% Certified Vedic Gurus & Pandits
                            </div>
                            <div className="d-flex align-items-center gap-2 small-text-13 fw-semibold text-dark-50">
                                <FaCheckCircle className="text-primary-orange" /> Completely Transparent Dakshina Pricing
                            </div>
                            <div className="d-flex align-items-center gap-2 small-text-13 fw-semibold text-dark-50">
                                <FaCheckCircle className="text-primary-orange" /> Personalized Samagri Guidance & Support
                            </div>
                        </div>

                        <button className="btn btn-orange px-4 py-2.5 rounded-pill fw-bold shadow-sm" onClick={() => navigate('/')}>
                            Explore Our Pandits ➔
                        </button>
                    </div>

                    {/* Right-side Feature Matrix Blocks */}
                    <div className="col-12 col-md-6 ps-md-4">
                        <div className="row g-3">
                            {/* Card 1: Authentic Methodologies */}
                            <div className="col-12 col-sm-6 text-start">
                                <div className="card border-0 rounded-4 p-4 shadow-xs bg-white h-100 industry-metric-card">
                                    <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-orange-tint text-primary-orange mb-3 fs-4">
                                        <FaOm />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-2 small-heading-adjust">Vedic Authenticity</h5>
                                    <p className="text-muted small-text-12 mb-0" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                        All rituals are strictly guided according to Sanatan Dharma scriptures and traditions.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Safe & Secure Ecosystem */}
                            <div className="col-12 col-sm-6 text-start">
                                <div className="card border-0 rounded-4 p-4 shadow-xs bg-white h-100 industry-metric-card">
                                    <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-blue-tint text-primary-blue mb-3 fs-4">
                                        <FaShieldAlt />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-2 small-heading-adjust">Shielded Trust</h5>
                                    <p className="text-muted small-text-12 mb-0" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                        Verified identification, ratings, and digital secure logs for all your bookings.
                                    </p>
                                </div>
                            </div>

                            {/* Card 3: Growing Community */}
                            <div className="col-12 text-start">
                                <div className="card border-0 rounded-4 p-4 shadow-xs bg-white industry-metric-card d-flex flex-row align-items-center gap-4">
                                    <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-green-tint text-success fs-3">
                                        <FaUsers />
                                    </div>
                                    <div className="lh-sm">
                                        <h5 className="fw-bold text-dark mb-1 small-heading-adjust">Our Ever-Growing Family</h5>
                                        <p className="text-muted small-text-12 mb-0" style={{ fontSize: '13px' }}>
                                            Thousands of Yajman accounts across India trust us for their home warming, weddings, and ancestral rituals.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Stats Banner */}
                <div className="bg-white rounded-4 shadow-sm border border-light p-4 mt-5">
                    <div className="row text-center g-3">
                        <div className="col-4 border-end border-light">
                            <h2 className="fw-extrabold text-primary-orange mb-1 font-monospace fs-2">50+</h2>
                            <span className="text-muted small-text-11 text-uppercase tracking-wider">Verified Pandits</span>
                        </div>
                        <div className="col-4 border-end border-light">
                            <h2 className="fw-extrabold text-dark mb-1 font-monospace fs-2">10k+</h2>
                            <span className="text-muted small-text-11 text-uppercase tracking-wider">Rituals Completed</span>
                        </div>
                        <div className="col-4">
                            <h2 className="fw-extrabold text-dark mb-1 font-monospace fs-2">4.9★</h2>
                            <span className="text-muted small-text-11 text-uppercase tracking-wider">Yajman Rating</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutUs;