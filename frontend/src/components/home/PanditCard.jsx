import React from 'react';
import { useNavigate } from 'react-router-dom';

// PERFORMANCE OPTIMIZATION:
// React.memo added to wrap PanditCard.
// Why it is used: It prevents unnecessary re-rendering of this card component when parent re-renders unless its props change.
// What problem it solves: Rendering lag when displaying large lists of pandit cards.
// What output improvement we get: Faster list scrolling and reduced rendering cycles.
// Why modern companies use it: Standard React optimization for list items to maintain steady 60fps UI rendering.
const PanditCard = React.memo(({ pandit }) => {
    const navigate = useNavigate();
    const defaultImg = "https://images.unsplash.com/photo-1567591974573-ef3c3119f23c?auto=format&fit=crop&w=400&q=80";

    return (
        <div className="card h-100 pro-pandit-card border-0 bg-white shadow-sm overflow-hidden" onClick={() => navigate(`/pandit/${pandit?._id}`)}>

            {/* Top Aspect Ratio Frame */}
            <div className="card-img-wrapper position-relative overflow-hidden">
                <img
                    src={
                        pandit?.image
                            ? `http://localhost:5000/assets/${pandit.image}`
                            : defaultImg
                    }
                    alt="pandit"
                    className="w-100 h-100 dynamic-pandit-avatar"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = defaultImg;
                    }}
                />
                <span className="position-absolute top-0 start-0 m-3 badge industry-badge-verified d-flex align-items-center gap-1">
                    🛡️ Verified
                </span>
            </div>

            {/* Content Payload Layer */}
            <div className="card-body p-4 d-flex flex-column justify-content-between position-relative">
                <div className="card-info-top">
                    {/* Header: Name & Ratings */}
                    <div className="d-flex align-items-start justify-content-between mb-2">
                        <h5 className="fw-bold text-dark mb-0 text-truncate font-heading-pro me-2" title={pandit?.userId?.name}>
                            {pandit?.userId?.name || "Verified Pandit"}
                        </h5>
                        {pandit?.totalReviews > 0 ? (
                            <div className="d-flex align-items-center gap-1 px-2.5 py-1 bg-warning-light rounded-pill shrink-0">
                                <span className="text-warning small" style={{ fontSize: '11px', lineHeight: '1' }}>★</span>
                                <span className="fw-bold text-dark small-text-11">{pandit?.averageRating || 0}</span>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-1 px-2.5 py-1 bg-light rounded-pill shrink-0">
                                <span className="text-muted small-text-11 fw-semibold">New</span>
                            </div>
                        )}
                    </div>

                    {/* Meta Specifications */}
                    <div className="text-muted d-flex flex-column gap-2 mb-3 pt-1">
                        <div className="small-text-13 text-dark-50 text-truncate">
                            🎓 Specialist: <span className="fw-semibold text-dark">{pandit?.specialization || "Vedic Specialist"}</span>
                        </div>
                        <div className="small-text-12 d-flex align-items-center gap-2">
                            <span>💼 {pandit?.experience || "5+ Yrs"} Exp</span>
                            <span className="text-muted-dot">•</span>
                            <span className="text-truncate">📍 {pandit?.location || "India"}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Interactive Trigger Area (No text cutting layout) */}
                <div className="cta-interactive-container position-relative mt-auto pt-3 border-top-dash">

                    {/* State A: Pricing State (Default view) */}
                    <div className="d-flex align-items-center justify-content-between default-pricing-view">
                        <div className="lh-sm">
                            <span className="text-muted block small-text-10 text-uppercase tracking-wider">Dakshina</span>
                            <div className="fw-extrabold fs-5 text-primary-orange">
                                ₹{pandit?.fees ? Number(pandit.fees).toLocaleString('en-IN') : "499"}
                                <span className="text-muted fw-normal small-text-11">/pooja</span>
                            </div>
                        </div>
                        <button className="btn btn-action-arrow p-0 d-flex align-items-center justify-content-center rounded-circle text-white shadow-sm" style={{ width: '38px', height: '38px' }}>
                            ➔
                        </button>
                    </div>

                    {/* State B: Button View (Slides up smoothly without overlapping text) */}
                    <div className="hover-action-view position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <button
                            className="btn btn-orange w-100 h-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                            style={{ fontSize: '14px', border: 'none' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/pandit/${pandit?._id}`);
                            }}
                        >
                            Book Now ➔
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
});

export default PanditCard;