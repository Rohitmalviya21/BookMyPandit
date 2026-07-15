import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaCheck, FaTimes, FaInbox } from 'react-icons/fa';

const PanditBookings = () => {
    const { token } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);

    const getPanditBookings = async () => {
        try {
            const data = await fetch('http://localhost:5000/api/booking/pandit-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await data.json();
            setBookings(res.bookings || []);
        } catch (error) {
            console.log(error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const data = await fetch(`http://localhost:5000/api/booking/status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            const res = await data.json();

            if (!data.ok) {
                toast.error(res.msg || 'Something went wrong');
                return;
            }

            toast.success(res.msg);
            getPanditBookings();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };
    const completeBooking = async (id) => {
        try {
            const data = await fetch(`http://localhost:5000/api/booking/complete/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const res = await data.json();

            if (!data.ok) {
                toast.error(res.msg || 'Something went wrong');
                return;
            }

            toast.success(res.msg);
            getPanditBookings();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        if (token) {
            getPanditBookings();
        }
    }, [token]);

    // Color dynamic badge switch helpers mapping
    const getStatusStyles = (status) => {
        const cleanStatus = status?.toLowerCase() || 'pending';
        switch (cleanStatus) {
            case 'accepted':
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

                {/* Section Header */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold fs-2 text-dark mb-1 font-traditional">
                        Booking Requests
                    </h2>
                    <p className="text-muted small">Process upcoming religious rituals slots and customer validations</p>
                    <div className="d-flex align-items-center justify-content-center gap-1 mt-2">
                        <div style={{ width: '20px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                        <span style={{ color: '#f26522', fontSize: '8px' }}>◆</span>
                        <div style={{ width: '20px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                    </div>
                </div>

                {/* Grid Grid Loops Flow */}
                <div className="row g-4 justify-content-start">
                    {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch" key={booking._id}>
                                <div className="card w-100 border-0 rounded-4 p-4 shadow-xs bg-white booking-pro-card position-relative overflow-hidden d-flex flex-column justify-content-between">

                                    <div>
                                        {/* Top Card Metric Header Row: Pooja Title & Dynamic Pill */}
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

                                        {/* Middle Specifications Parameter rows */}
                                        <div className="d-flex flex-column gap-2 text-start text-muted mb-4 fs-6">
                                            <div className="small-text-13 text-dark-50 text-truncate">
                                                <FaUser className="text-muted-dot text-size-11 me-1" /> Yajman: <span className="fw-bold text-dark">{booking.userId?.name || "Guest User"}</span>
                                            </div>
                                            <div className="small-text-12">
                                                <FaCalendarAlt className="text-muted-dot text-size-11 me-1" /> Date: <span className="fw-medium text-dark-50">{booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                                            </div>
                                            <div className="small-text-12 text-truncate" title={booking.address}>
                                                <FaMapMarkerAlt className="text-muted-dot text-size-11 me-1" /> Venue: <span className="text-dark-50">{booking.address || "N/A"}</span>
                                            </div>
                                            {booking.userId?.contact && (
                                                <div className="small-text-12">
                                                    <FaPhoneAlt className="text-muted-dot text-size-11 me-1" /> Contact: <span className="text-dark-50 font-monospace">{booking.userId.contact}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Interactive Actions Blocks controls conditional */}
                                    {/* Footer Interactive Actions Blocks controls conditional */}
                                    <div className="mt-auto pt-2 border-top border-light-subtle">
                                        {booking.status === 'pending' ? (
                                            <div className="d-flex align-items-center gap-2 w-100">
                                                <button
                                                    className="btn btn-sm btn-success-action flex-grow-1 py-2 rounded-2 fw-bold d-flex align-items-center justify-content-center gap-1.5"
                                                    onClick={() => updateStatus(booking._id, 'accepted')}
                                                >
                                                    <FaCheck style={{ fontSize: '11px' }} /> Accept
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger-action flex-grow-1 py-2 rounded-2 fw-bold d-flex align-items-center justify-content-center gap-1.5"
                                                    onClick={() => updateStatus(booking._id, 'cancelled')}
                                                >
                                                    <FaTimes style={{ fontSize: '11px' }} /> Reject
                                                </button>
                                            </div>
                                        ) : booking.status === 'accepted' ? (
                                            <div className="w-100">
                                                <button
                                                    className="btn btn-sm w-100 py-2 rounded-2 fw-bold d-flex align-items-center justify-content-center gap-1.5"
                                                    style={{
                                                        backgroundColor: '#f26522',
                                                        color: '#fff',
                                                        border: 'none'
                                                    }}
                                                    onClick={() => completeBooking(booking._id)}
                                                >
                                                    <FaCheck style={{ fontSize: '11px' }} /> Mark as Completed
                                                </button>
                                            </div>
                                        ) : (
                                            /* Locked state placeholder layout buttons — completed/cancelled */
                                            <div className="w-100">
                                                <button
                                                    className={`btn btn-sm w-100 py-2 rounded-2 fw-bold disabled-status-indicator text-capitalize`}
                                                    disabled
                                                    style={{
                                                        backgroundColor: booking.status === 'completed' ? '#f0fdf4' : '#fef2f2',
                                                        color: booking.status === 'completed' ? '#15803d' : '#b91c1c',
                                                        border: `1px solid ${booking.status === 'completed' ? '#bbf7d0' : '#fecaca'}`,
                                                        fontSize: '13px',
                                                        cursor: 'not-allowed'
                                                    }}
                                                >
                                                    {booking.status === 'completed' ? '✓ Ritual Completed' : '✕ Request Declined'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                ))
                ) : (
                /* Empty state placeholder fallbacks container rules */
                <div className="col-12 text-center py-5">
                    <div className="card border-0 rounded-4 p-5 shadow-xs bg-white max-w-card mx-auto">
                        <div className="text-primary-orange mb-4 mx-auto opacity-75 d-flex align-items-center justify-content-center rounded-circle bg-tint" style={{ width: '65px', height: '65px', fontSize: '24px' }}>
                            <FaInbox />
                        </div>
                        <h4 className="fw-bold text-dark font-traditional mb-2">No Requests Active</h4>
                        <p className="text-muted small px-3 mb-0">You have zero pending or historic ritual bookings allocated right now. New invitations will prompt status controls triggers here immediately.</p>
                    </div>
                </div>
                    )}
            </div>

        </div>
        </section >
    );
};

export default PanditBookings;