import React, { useState } from 'react';
import PanditCard from './PanditCard';

// PERFORMANCE OPTIMIZATION:
// React.memo added to wrap OurPandits.
// Why it is used: Avoids unnecessary list re-renders when parent states unrelated to the pandits list update.
// What problem it solves: Prevents full list recalculation and child re-renders.
// What output improvement we get: Smoother home page loading and search interactions.
// Why modern companies use it: Enhances overall frame-rate consistency in list display pages.
const OurPandits = React.memo(({ pandits }) => {
    const [showAll, setShowAll] = useState(false);

    const displayedPandits = showAll ? pandits : (pandits ? pandits.slice(0, 4) : []);

    return (
        <section id="pandits" className="py-5 bg-light-cream overflow-hidden">
            <div className="container py-2">

                {/* Section Header */}
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom-subtle">
                    <div>
                        <span className="small text-primary-orange fw-bold text-uppercase tracking-wide" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Premium Profiles</span>
                        <h2 className="fw-bold fs-2 text-dark mb-0 font-traditional">
                            Our Verified Pandits
                        </h2>
                    </div>

                    {pandits && pandits.length > 0 && (
                        <button 
                            onClick={() => setShowAll(!showAll)}
                            className="btn btn-sm btn-outline-orange px-4 py-2 rounded-pill text-decoration-none fw-bold shadow-xs"
                            style={{ fontSize: '12.5px' }}
                        >
                            {showAll ? "View Less" : "View All"}
                        </button>
                    )}
                </div>

                {/* 4-Column Grid Layout - Dynamic slice expansion */}
                <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 justify-content-start">
                    {displayedPandits && displayedPandits.length > 0 ? (
                        displayedPandits.map((pandit) => (
                            <div className="col d-flex align-items-stretch animate-scale-in" key={pandit._id || pandit.id}>
                                <PanditCard pandit={pandit} />
                            </div>
                        ))
                    ) : (
                        <div className="w-100 text-center py-5 bg-white rounded-4 border text-muted small shadow-sm">
                            🔄 Loading trusted pandit profiles...
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
});

export default OurPandits;