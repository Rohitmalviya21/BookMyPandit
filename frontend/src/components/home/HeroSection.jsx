import React from 'react';
import SearchBar from './SearchBar';
import RotatingText from '../RotatingText/RotatingText';

const HeroSection = ({
    search,
    setSearch,
    searchPandits
}) => {
    return (
        <section className="hero-section position-relative overflow-hidden py-5 bg-light-cream">
            {/* Background Decorative elements (Optional visual design support) */}
            <div className="position-absolute top-0 start-0 opacity-10 m-4 d-none d-md-block" style={{ fontSize: '40px' }}>🔔</div>
            <div className="position-absolute top-0 end-0 opacity-10 m-4 d-none d-md-block" style={{ fontSize: '40px' }}>🔔</div>

            <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
                <div className="row align-items-center g-5">
                    
                    {/* Left Side Content Column */}
                    <div className="col-lg-7 text-center text-lg-start">
                        <h1 className="display-4 fw-bold lh-sm mb-3 main-hero-title">
                            Book Trusted <br />
                            <span className="text-primary-orange">
                                <RotatingText
                                    texts={[
                                        "Vedic Purohits",
                                        "Hindu Priests",
                                        "Ritual Specialists",
                                        "Experienced Pandits",
                                        "Katha Vachaks",
                                        "Teerth Purohits"
                                    ]}
                                    mainClassName="d-inline-flex text-primary-orange"
                                    rotationInterval={4500}
                                    animatePresenceMode="wait"
                                    loop={true}
                                    auto={true}
                                />
                            </span>
                        </h1>
                        
                        <p className="lead text-muted mb-4 fs-6 style-text-para" style={{ maxWidth: '520px', lineHeight: '1.6' }}>
                            Verified Pandits for all Poojas & Rituals. <br className="d-none d-md-block" />
                            Book Online Anytime, Anywhere.
                        </p>

                        {/* Badges/Features Row with Icons */}
                        <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4 pt-2">
                            <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white rounded-3 shadow-xs feature-badge">
                                <span className="p-1 rounded-circle bg-orange-light text-primary-orange d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px', backgroundColor: 'rgba(242,101,34,0.1)' }}>✓</span>
                                <span className="small fw-semibold text-dark">Verified Pandits</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white rounded-3 shadow-xs feature-badge">
                                <span className="p-1 rounded-circle bg-orange-light text-primary-orange d-flex align-items-center justify-content-center fw-bold" style={{ width: '24px', height: '24px', fontSize: '13px', backgroundColor: 'rgba(242,101,34,0.1)' }}>₹</span>
                                <span className="small fw-semibold text-dark">Affordable Prices</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white rounded-3 shadow-xs feature-badge">
                                <span className="p-1 rounded-circle bg-orange-light text-primary-orange d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px', backgroundColor: 'rgba(242,101,34,0.1)' }}>🕒</span>
                                <span className="small fw-semibold text-dark">Timely Service</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white rounded-3 shadow-xs feature-badge">
                                <span className="p-1 rounded-circle bg-orange-light text-primary-orange d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px', backgroundColor: 'rgba(242,101,34,0.1)' }}>🎧</span>
                                <span className="small fw-semibold text-dark">24/7 Support</span>
                            </div>
                        </div>

                        {/* Search Bar Injection Point */}
                        <div className="mb-4 mx-auto mx-lg-0" style={{ maxWidth: '560px' }}>
                           <SearchBar
        search={search}
        setSearch={setSearch}
        searchPandits={searchPandits}
    />
                        </div>

                        {/* Popular Searches Inline Tags */}
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-2 mt-3 text-start">
                            <span className="small text-muted fw-medium me-1">Popular Searches:</span>
                            <span className="badge bg-white text-dark border px-3 py-2 rounded-pill cursor-pointer hover-orange-badge">Ganesh Pooja</span>
                            <span className="badge bg-white text-dark border px-3 py-2 rounded-pill cursor-pointer hover-orange-badge">Akhand Ramayan</span>
                            <span className="badge bg-white text-dark border px-3 py-2 rounded-pill cursor-pointer hover-orange-badge">Griha Pravesh</span>
                            <span className="badge bg-white text-dark border px-3 py-2 rounded-pill cursor-pointer hover-orange-badge">Satyanarayan Katha</span>
                        </div>
                    </div>

                    {/* Right Side Vector Image Column */}
                    <div className="col-lg-5 text-center position-relative d-flex align-items-center justify-content-center">
                        {/* Background glowing/decorative arc frame similar to template image */}
                        <div className="position-absolute translate-middle-y start-50 top-50 rounded-circle opacity-10" style={{ width: '110%', height: '110%', background: 'radial-gradient(circle, var(--primary-orange) 0%, transparent 70%)', zIndex: 1 }}></div>
                        
                        <img
                            src="/image/herobg/hero-pandit.png"
                            alt="Book Trusted Pandit Online"
                            className="img-fluid position-relative hero-main-img"
                            style={{ 
                                zIndex: 2, 
                                maxHeight: '460px', 
                                width: '100%',
                                objectFit: 'cover',
                                borderRadius: '24px',
                                boxShadow: '0 15px 35px rgba(242, 101, 34, 0.15)'
                            }}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;