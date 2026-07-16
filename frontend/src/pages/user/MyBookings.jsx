import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaStar, FaRegStar } from 'react-icons/fa';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const openReviewModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setRating(5);
        setComment('');
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/review/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ bookingId: selectedBookingId, rating, comment })
            });

            const res = await response.json();
            if (!response.ok) {
                toast.error(res.msg || 'Failed to submit review');
                return;
            }

            toast.success(res.msg || 'Review submitted successfully');
            setShowReviewModal(false);
            getMyBookings();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setReviewLoading(false);
        }
    };

    const getMyBookings = async () => {
        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/booking/my-bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await data.json();
            setBookings(res.bookings || []);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking request?");
        if (!confirmCancel) return;

        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/booking/cancel/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const res = await data.json();

            if (!data.ok) {
                toast.error(res.msg || 'Failed to cancel booking');
                return;
            }

            toast.success(res.msg || 'Booking cancelled successfully');
            getMyBookings();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        if (token) {
            getMyBookings();
        }
    }, [token]);

    // Premium minimal spinner loader layer
    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light-cream">
                <div className="spinner-border text-primary-orange" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Dynamic color status badge badge system switcher helper matrix
    const getStatusStyles = (status) => {
        const cleanStatus = status?.toLowerCase() || 'pending';
        switch (cleanStatus) {
            case 'completed':
                return 'bg-success-subtle text-success border border-success-subtle';
            case 'cancelled':
            case 'rejected':
                return 'bg-danger-subtle text-danger border border-danger-subtle';
            default:
                return 'bg-warning-subtle text-warning-dark border border-warning-subtle';
        }
    };

    return (
        <section className="py-5 bg-light-cream min-vh-100">
            <div className="container py-2">
                
                {/* Clean Section Header */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold fs-2 text-dark mb-1 font-traditional">
                        My Bookings
                    </h2>
                    <p className="text-muted small">View and monitor all your scheduled poojas and assigned pandit profiles</p>
                    <div className="d-flex align-items-center justify-content-center gap-1 mt-2">
                        <div style={{ width: '20px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                        <span style={{ color: '#f26522', fontSize: '8px' }}>◆</span>
                        <div style={{ width: '20px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                    </div>
                </div>

                {/* Grid Container Block System */}
                <div className="row g-4 justify-content-start">
                    {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch" key={booking._id}>
                                <div className="card w-100 border-0 rounded-4 p-4 shadow-xs bg-white booking-pro-card position-relative overflow-hidden">
                                    
                                    {/* Top Header Row inside Card: Pooja Type Title & Balanced Pill Status Badge */}
                                    <div className="d-flex align-items-start justify-content-between mb-3 pb-2 border-bottom border-light w-100">
                                        <div className="text-start truncate-width-block">
                                            <h5 className="fw-bold text-dark mb-0 font-heading-pro text-truncate" title={booking.poojaType}>
                                                {booking.poojaType || "Vedic Ritual"}
                                            </h5>
                                        </div>
                                        <span className={`badge px-2.5 py-1.5 rounded-pill text-uppercase font-monospace tracking-wide text-size-10 shrink-0 ms-2 ${getStatusStyles(booking.status)}`}>
                                            ● {booking.status || 'Pending'}
                                        </span>
                                    </div>

                                    {/* Card Middle Parameters Body Specs Layer */}
                                    <div className="d-flex flex-column gap-2 text-start text-muted mb-3 fs-6 flex-grow-1">
                                        <div className="small-text-13 text-dark-50 text-truncate">
                                            👤 Pandit: <span className="fw-bold text-dark">{booking.panditId?.userId?.name || "Assigning Soon"}</span>
                                        </div>
                                        <div className="small-text-12">
                                            📆 Date: <span className="fw-medium text-dark-50">{booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                                        </div>
                                        <div className="small-text-12 text-truncate" title={booking.address}>
                                            📍 Venue: <span className="text-dark-50">{booking.address || "N/A"}</span>
                                        </div>
                                        {booking.panditId?.userId?.contact && (
                                            <div className="small-text-12">
                                                📞 Contact: <span className="text-dark-50 font-monospace">{booking.panditId.userId.contact}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Visual bottom dynamic tracker line footer element decoration */}
                                    <div className="mt-auto pt-2 border-top border-light-subtle d-flex align-items-center justify-content-between">
                                        <span className="small text-muted text-size-11">ID: #{booking._id?.slice(-6).toUpperCase()}</span>
                                        {booking.status === 'pending' && (
                                            <button 
                                                className="btn btn-sm btn-outline-danger px-2.5 py-1 rounded-2 fw-semibold"
                                                style={{ fontSize: '12px' }}
                                                onClick={() => cancelBooking(booking._id)}
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                        {booking.status === 'completed' && (
                                            booking.hasReview ? (
                                                <span className="text-success fw-bold" style={{ fontSize: '12px' }}>✓ Reviewed</span>
                                            ) : (
                                                <button 
                                                    className="btn btn-sm btn-orange px-2.5 py-1 rounded-2 fw-semibold text-white border-0"
                                                    style={{ fontSize: '12px', backgroundColor: 'var(--primary-orange)' }}
                                                    onClick={() => openReviewModal(booking._id)}
                                                >
                                                    Write a Review
                                                </button>
                                            )
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))
                    ) : (
                        /* Modern clean empty data viewport fallback screen state */
                        <div className="col-12 text-center py-5">
                            <div className="card border-0 rounded-4 p-5 shadow-xs bg-white max-w-card mx-auto">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                                    alt="no-booking"
                                    className="mb-4 mx-auto opacity-75"
                                    style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                                />
                                <h4 className="fw-bold text-dark font-traditional mb-2">No Bookings Found</h4>
                                <p className="text-muted small px-3 mb-4">You haven't booked any pooja rituals yet. Explore our trusted pandit directory to schedule your first auspicious event.</p>
                                <NavLink to="/pandits" className="btn btn-orange px-4 py-2 rounded-pill fw-bold mx-auto shadow-sm btn-size-adjust">
                                    Book First Pooja
                                </NavLink>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {showReviewModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold text-dark font-traditional mb-0">Write a Review</h5>
                                <button type="button" className="btn-close shadow-none border-0 bg-transparent text-dark font-monospace fs-4 p-0 m-0" onClick={() => setShowReviewModal(false)} aria-label="Close" style={{ outline: 'none' }}>×</button>
                            </div>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="modal-body text-center d-flex flex-column gap-3">
                                    <p className="text-muted small mb-1">Select rating stars and write feedback details below</p>
                                    
                                    <div className="d-flex justify-content-center gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onClick={() => setRating(star)}
                                                style={{ cursor: 'pointer', fontSize: '26px', color: star <= rating ? '#ffc107' : '#e4e5e9' }}
                                                className="star-selection-icon"
                                            >
                                                {star <= rating ? <FaStar /> : <FaRegStar />}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="form-group-block text-start">
                                        <label className="small fw-semibold text-dark mb-1 ms-1">Review Description (Optional)</label>
                                        <textarea
                                            className="form-control px-3 py-2 rounded-3 form-pro-input shadow-none"
                                            rows="3"
                                            placeholder="Write your pooja experience details..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0 justify-content-end gap-2">
                                    <button type="button" className="btn btn-sm btn-light px-3 py-2 rounded-3 fw-bold" onClick={() => setShowReviewModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-sm btn-orange px-3 py-2 rounded-3 fw-bold text-white border-0" disabled={reviewLoading} style={{ backgroundColor: 'var(--primary-orange)' }}>
                                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MyBookings;