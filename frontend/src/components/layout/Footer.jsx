import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube
} from 'react-icons/fa';

const Footer = () => {
    const navigate = useNavigate();

    const handleScrollToSection = (sectionId) => {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <footer className="bg-footer-dark text-white pt-5 pb-3 mt-5">
            <div className="container">
                <div className="row g-4 justify-content-between">
                    
                    {/* Brand Info Column */}
                    <div className="col-lg-3 col-md-12 text-center text-md-start">
                        <h4 
                            className="fw-bold mb-3 text-white tracking-tight font-traditional"
                            onClick={() => {
                                navigate('/');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            Book<span className="text-primary-orange">My</span>Pandit
                        </h4>
                        <p className="small text-muted-footer lh-base mb-4">
                            Book trusted Pandits online for all Poojas & rituals. We bring spirituality right at your doorstep with authenticated expertise.
                        </p>
                        {/* Social Icons inside Footer Brand segment as shown in layout footer left */}
                        <div className="d-flex justify-content-center justify-content-md-start gap-2">
                            <a href="#facebook" className="footer-social-badge"><FaFacebookF /></a>
                            <a href="#instagram" className="footer-social-badge"><FaInstagram /></a>
                            <a href="#youtube" className="footer-social-badge"><FaYoutube /></a>
                            <a href="#twitter" className="footer-social-badge"><FaTwitter /></a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="col-lg-2 col-md-4 col-6 ps-lg-5">
                        <h6 className="text-uppercase fw-bold text-white small tracking-wider mb-3">
                            Quick Links
                        </h6>
                        <ul className="list-unstyled footer-links-list d-flex flex-column gap-2 small">
                            <li>
                                <span 
                                    onClick={() => {
                                        navigate('/');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    className="footer-nav-item-link"
                                >
                                    Home
                                </span>
                            </li>
                             <li>
                                <span 
                                    onClick={() => handleScrollToSection('poojas')}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    className="footer-nav-item-link"
                                >
                                    Poojas
                                </span>
                             </li>
                             <li>
                                <span 
                                    onClick={() => handleScrollToSection('pandits')}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    className="footer-nav-item-link"
                                >
                                    Pandits
                                </span>
                             </li>
                             <li><NavLink to="/about">About Us</NavLink></li>
                             <li><NavLink to="/contact">Contact Us</NavLink></li>
                        </ul>
                    </div>

                    {/* Popular Services Column */}
                    <div className="col-lg-2 col-md-4 col-6">
                        <h6 className="text-uppercase fw-bold text-white small tracking-wider mb-3">
                            Popular Poojas
                        </h6>
                        <ul className="list-unstyled footer-links-list d-flex flex-column gap-2 small">
                            <li><a href="#ganesh">Ganesh Pooja</a></li>
                            <li><a href="#havan">Havan Pooja</a></li>
                            <li><a href="#ramayan">Akhand Ramayan</a></li>
                            <li><a href="#griha">Griha Pravesh</a></li>
                            <li><a href="#satyanarayan">Satyanarayan Katha</a></li>
                        </ul>
                    </div>

                    {/* Support & Policies Column */}
                    <div className="col-lg-2 col-md-4 col-12">
                        <h6 className="text-uppercase fw-bold text-white small tracking-wider mb-3">
                            Support
                        </h6>
                        <ul className="list-unstyled footer-links-list d-flex flex-column gap-2 small">
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#terms">Terms & Conditions</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#refund">Refund Policy</a></li>
                            <li><a href="#cancel">Cancellation Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription Column (Template image layout matching) */}
                    <div className="col-lg-3 col-md-12 text-center text-lg-start">
                        <h6 className="text-uppercase fw-bold text-white small tracking-wider mb-3">
                            Newsletter
                        </h6>
                        <p className="small text-muted-footer mb-3">
                            Subscribe to get updates on auspicious dates, festival updates & offers.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="d-flex flex-column gap-2">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="form-control form-control-sm bg-transparent border-footer-input text-white py-2 px-3 shadow-none rounded-2"
                                style={{ fontSize: '13px' }}
                            />
                            <button type="submit" className="btn btn-sm btn-orange w-100 py-2 rounded-2 fw-semibold tracking-wide">
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Border Partition line */}
                <hr className="my-4" style={{ borderColor: 'rgba(241, 231, 221, 0.08)' }} />

                {/* Copyright Line */}
                <div className="text-center">
                    <p className="mb-0 text-muted-footer" style={{ fontSize: '12px' }}>
                        © 2026 BookMyPandit. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;