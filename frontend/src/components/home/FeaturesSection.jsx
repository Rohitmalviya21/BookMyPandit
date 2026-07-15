import React from 'react';
import {
    FaUserCheck,
    FaCalendarCheck,
    FaRupeeSign,
    FaShieldAlt,
    FaHeadset
} from 'react-icons/fa';

const FeaturesSection = () => {
    // UI Image Mockup ke sath pure 5 features mapping sequence me:
    const features = [
        {
            icon: <FaUserCheck />,
            title: 'Verified Pandits',
            text: 'All Pandits are verified & experienced'
        },
        {
            icon: <FaCalendarCheck />,
            title: 'Easy Booking',
            text: 'Book your Pandit in just a few clicks'
        },
        {
            icon: <FaRupeeSign />,
            title: 'Affordable Prices',
            text: 'Transparent pricing with no hidden charges'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Secure Payments',
            text: '100% secure payments & data protection'
        },
        {
            icon: <FaHeadset />,
            title: '24/7 Support',
            text: 'We are here to help you anytime'
        }
    ];

    return (
        <section className="py-5 bg-white">
            <div className="container py-3">
                
                {/* Heading Wrapper matching the image template */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold fs-2 text-dark mb-2 font-traditional">
                        Why Choose BookMyPandit?
                    </h2>
                    {/* Orange ethnic line design indicator under the heading */}
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                        <span style={{ color: '#f26522', fontSize: '10px' }}>◆</span>
                        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                    </div>
                </div>

                {/* 5-Column layout grid using native Bootstrap row utilities */}
                <div className="row g-4 row-cols-1 row-cols-md-3 row-cols-lg-5 justify-content-center">
                    {features.map((item, index) => (
                        <div className="col animate-hover-card" key={index}>
                            <div className="h-100 text-center p-4 rounded-4 custom-feature-card bg-white border">
                                
                                {/* Icon wrapper with stylized modern custom border shadow */}
                                <div className="feature-icon-badge mx-auto d-flex align-items-center justify-content-center mb-4 text-primary-orange">
                                    {item.icon}
                                </div>

                                <h5 className="fw-bold text-dark mb-2 small-heading-adjust">
                                    {item.title}
                                </h5>
                                
                                <p className="text-muted small mb-0 lh-base">
                                    {item.text}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;