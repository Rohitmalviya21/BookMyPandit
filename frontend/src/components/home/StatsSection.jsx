import React from 'react';

const StatsSection = () => {
    // Icons array me hain par unhe design template ke mutabik cleanly display karenge
    const stats = [
        {
            number: '500+',
            title: 'Verified Pandits'
        },
        {
            number: '10K+',
            title: 'Bookings Completed'
        },
        {
            number: '24/7',
            title: 'Customer Support'
        },
        {
            number: '100%',
            title: 'Trusted Platform'
        }
    ];

    return (
        <section className="py-4 bg-white stats-clean-layout">
            <div className="container">
                {/* 4-Column Fluid Metric row */}
                <div className="row text-center g-3">
                    {stats.map((item, index) => (
                        <div className="col-6 col-lg-3" key={index}>
                            <div className="py-3 px-2 content-stat-block">
                                {/* Big Bold Metric Display */}
                                <h2 className="display-5 fw-extrabold mb-1 numeric-counter-text">
                                    {item.number}
                                </h2>
                                {/* Description Label */}
                                <p className="text-muted small mb-0 fw-medium text-uppercase tracking-wide stats-label-adjust">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;    