import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBriefcase, FaMapMarkerAlt, FaWallet, FaPhoneAlt, FaStar } from 'react-icons/fa';

const PanditDetails = () => {
    const [pandit, setPandit] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);
    const { id } = useParams(); // Yeh router se pandit ki ID nikalta hai
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getSinglePandit = async () => {
        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/pandit/${id}`);
            const res = await data.json();
            setPandit(res.pandit);
        } catch (error) {
            console.log("Error fetching single pandit details:", error);
        }
    };

    const getReviews = async () => {
        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/review/pandit/${id}`);
            const res = await data.json();
            setReviews(res.reviews || []);
        } catch (error) {
            console.log("Error fetching reviews:", error);
        }
    };

    const getBookedDates = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/booking/booked-dates/${id}`);
            if (response.ok) {
                const data = await response.json();
                setBookedDates(data.bookedDates || []);
            }
        } catch (error) {
            console.log("Error fetching booked dates:", error);
        }
    };

    useEffect(() => {
        if (id) {
            getSinglePandit();
            getReviews();
            getBookedDates();
        }
    }, [id]);

    // Fallback image agar kisi pandit ne photo upload nahi ki ho
    const fallbackImg = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    // Calendar generation
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const calendarCells = [];
    for (let i = 0; i < firstDay; i++) {
        calendarCells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        calendarCells.push(d);
    }

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    return (
        <section className="py-5 bg-light-cream min-vh-100">
            <div className="container py-2">
                {pandit ? (
                    <div className="row g-4 justify-content-center">

                        {/* Left Column: Sticky Profile Card Block */}
                        <div className="col-12 col-md-5 col-lg-4">
                            <div className="card border-0 rounded-4 p-4 text-center bg-white shadow-xs sticky-profile-sidebar">

                                {/* 🍉 Yahan par Multer ka dynamic API endpoint backend route call ho raha hai */}
                                <div className="profile-details-avatar mx-auto mb-3 rounded-circle overflow-hidden border border-light shadow-sm" style={{ width: '150px', height: '150px' }}>
                                    <img
                                        src={
                                            pandit.image
                                                ? `${process.env.REACT_APP_API_URL}/assets/${pandit.image}`
                                                : fallbackImg
                                        } // Backend Multer Route API URL
                                        alt={pandit.userId?.name || "Pandit Ji"}
                                        className="w-100 h-100 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = fallbackImg; // Agar image error kare toh default icon aa jaye
                                        }}
                                    />
                                </div>

                                <h4 className="fw-bold text-dark font-traditional mb-1">
                                    {pandit.userId?.name || "Verified Pandit"}
                                </h4>

                                <p className="small fw-semibold text-primary-orange mb-3">
                                    🎓 {pandit.specialization || "Vedic Rituals Specialist"}
                                </p>

                                {/* Rating Badge */}
                                <div className="d-flex align-items-center justify-content-center gap-1 bg-warning-light py-2 px-3 rounded-pill mx-auto mb-4" style={{ width: 'fit-content' }}>
                                    <FaStar className="text-warning small" />
                                    {pandit.totalReviews > 0 ? (
                                        <>
                                            <span className="fw-bold text-dark small">{pandit.averageRating || 0}</span>
                                            <span className="text-muted small">({pandit.totalReviews} {pandit.totalReviews === 1 ? 'Review' : 'Reviews'})</span>
                                        </>
                                    ) : (
                                        <span className="text-muted small">No reviews yet</span>
                                    )}
                                </div>

                                {/* Booking Form Trigger Route */}
                                <button
                                    className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold text-uppercase tracking-wider shadow-sm"
                                    onClick={() => navigate(`/booking/${pandit._id}`)}
                                    style={{ fontSize: '13.5px' }}
                                >
                                    Book Appointment
                                </button>

                                {/* Calendar of Booked Slots */}
                                <div className="mt-4 border-top pt-3 text-start">
                                    <h6 className="fw-bold text-dark text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                        📅 Availability Calendar
                                    </h6>
                                    <p className="text-muted mb-2" style={{ fontSize: '10.5px' }}>
                                        Crossed-out dates in red are already booked by other devotees.
                                    </p>
                                    
                                    <div className="border rounded-3 p-2.5 bg-light" style={{ fontSize: '12px' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none text-dark fw-bold" onClick={handlePrevMonth}>&lt;</button>
                                            <span className="fw-bold text-dark">{months[currentMonth]} {currentYear}</span>
                                            <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none text-dark fw-bold" onClick={handleNextMonth}>&gt;</button>
                                        </div>

                                        <div className="d-grid gap-1 mb-1 text-center text-muted fw-bold" style={{ gridTemplateColumns: 'repeat(7, 1fr)', fontSize: '10px' }}>
                                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                                                <div key={day}>{day}</div>
                                            ))}
                                        </div>

                                        <div className="d-grid gap-1 text-center" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                                            {calendarCells.map((day, idx) => {
                                                if (day === null) {
                                                    return <div key={`empty-${idx}`}></div>;
                                                }
                                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const isBooked = bookedDates.includes(dateStr);

                                                let cellStyle = {
                                                    width: '26px',
                                                    height: '26px',
                                                    fontSize: '11px',
                                                    margin: 'auto',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%'
                                                };

                                                if (isBooked) {
                                                    cellStyle.backgroundColor = '#ffebe6';
                                                    cellStyle.color = '#e11d48';
                                                    cellStyle.textDecoration = 'line-through';
                                                    cellStyle.fontWeight = 'bold';
                                                } else {
                                                    cellStyle.color = '#374151';
                                                }

                                                return (
                                                    <div key={`day-${day}`} style={cellStyle}>
                                                        {day}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex align-items-center gap-1.5 mt-2 justify-content-center" style={{ fontSize: '10.5px' }}>
                                        <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#ffebe6', border: '1px solid #fda4af' }}></span>
                                        <span className="text-muted">Already Booked (Busy)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Detailed Professional Sheets */}
                        <div className="col-12 col-md-7 col-lg-6">
                            <div className="card border-0 rounded-4 p-4 p-sm-5 bg-white shadow-xs h-100 text-start">

                                <h4 className="fw-bold text-dark font-traditional mb-4 pb-2 border-bottom">
                                    Professional Profile Details
                                </h4>

                                {/* Icons Grid Parameters Specs Sheet */}
                                <div className="d-flex flex-column gap-3 mb-4">
                                    <div className="d-flex align-items-center gap-3 py-2 px-3 rounded-3 bg-light-cream-dark">
                                        <div className="detail-icon-box text-primary-orange"><FaBriefcase /></div>
                                        <div>
                                            <span className="text-muted d-block small-text-10 text-uppercase tracking-wide">Experience</span>
                                            <span className="fw-bold text-dark fs-6">{pandit.experience || "0"} Years</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3 py-2 px-3 rounded-3 bg-light-cream-dark">
                                        <div className="detail-icon-box text-primary-orange"><FaMapMarkerAlt /></div>
                                        <div>
                                            <span className="text-muted d-block small-text-10 text-uppercase tracking-wide">Location / City</span>
                                            <span className="fw-bold text-dark fs-6">{pandit.location || "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3 py-2 px-3 rounded-3 bg-light-cream-dark">
                                        <div className="detail-icon-box text-primary-orange"><FaWallet /></div>
                                        <div>
                                            <span className="text-muted d-block small-text-10 text-uppercase tracking-wide">Dakshina / Fees</span>
                                            <span className="fw-bold text-primary-orange fs-5">₹{pandit.fees || "0"}<span className="text-muted fw-normal small-text-11"> / Pooja</span></span>
                                        </div>
                                    </div>

                                    {pandit.userId?.contact && (
                                        <div className="d-flex align-items-center gap-3 py-2 px-3 rounded-3 bg-light-cream-dark">
                                            <div className="detail-icon-box text-primary-orange"><FaPhoneAlt /></div>
                                            <div>
                                                <span className="text-muted d-block small-text-10 text-uppercase tracking-wide">Contact Verification</span>
                                                <span className="fw-bold text-dark fs-6 font-monospace">{pandit.userId.contact}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Biography Segment */}
                                <div className="mt-2">
                                    <h6 className="fw-bold text-dark text-uppercase tracking-wider mb-2" style={{ fontSize: '12px' }}>
                                        Biography / About Pandit Ji
                                    </h6>
                                    <p className="text-muted lh-base small-text-13 bg-light p-3 rounded-3 mb-4" style={{ textAlign: 'justify' }}>
                                        {pandit.bio || "No professional biography available at the moment. This pandit is verified and certified to perform traditional vedic rituals."}
                                    </p>
                                </div>

                                {/* Reviews Segment */}
                                <div className="mt-4 pt-3 border-top">
                                    <h6 className="fw-bold text-dark text-uppercase tracking-wider mb-3" style={{ fontSize: '12px' }}>
                                        Devotee Reviews & Ratings
                                    </h6>
                                    {reviews && reviews.length > 0 ? (
                                        <div className="d-flex flex-column gap-3">
                                            {reviews.map((rev) => (
                                                <div key={rev._id} className="p-3 bg-light rounded-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span className="fw-bold text-dark small">{rev.userId?.name || 'Anonymous Devotee'}</span>
                                                        <span className="small text-muted font-monospace">{new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    <div className="d-flex gap-1 mb-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span key={star} style={{ color: star <= rev.rating ? '#ffc107' : '#e4e5e9', fontSize: '13px' }}>
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {rev.comment && <p className="text-muted small mb-0">{rev.comment}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 bg-light rounded-3">
                                            <p className="text-muted small mb-0">Be the first to review this pandit!</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                ) : (
                    /* Elegant Loader Fallback */
                    <div className="min-vh-50 d-flex align-items-center justify-content-center py-5">
                        <div className="spinner-border text-primary-orange" role="status">
                            <span className="visually-hidden">Loading Profile...</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PanditDetails;