import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUsers, FaCompass, FaCalendarAlt, FaEnvelope, FaCheckCircle, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('pandits');
    const [loading, setLoading] = useState(true);

    const [pandits, setPandits] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [contacts, setContacts] = useState([]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            } else {
                toast.error(data.msg || 'Failed to fetch admin stats');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load stats');
        }
    };

    const fetchPandits = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/pandits`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setPandits(data.pandits || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setBookings(data.bookings || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/contact-messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setContacts(data.contacts || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemovePandit = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this Pandit profile? Their account role will be reset to 'user'.");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/pandits/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.msg || 'Pandit profile removed successfully');
                fetchStats();
                fetchPandits();
            } else {
                toast.error(data.msg || 'Failed to remove Pandit');
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    const handleResolveContact = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/contact-messages/${id}/resolve`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.msg || 'Message resolved');
                fetchStats();
                fetchContacts();
            } else {
                toast.error(data.msg || 'Failed to resolve message');
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        if (token) {
            setLoading(true);
            Promise.all([fetchStats(), fetchPandits(), fetchBookings(), fetchContacts()])
                .finally(() => setLoading(false));
        }
    }, [token]);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light-cream">
                <div className="spinner-border text-primary-orange" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <section className="py-5 bg-light-cream min-vh-100 text-start">
            <div className="container py-2">
                <div className="mb-4 pb-3 border-bottom-subtle">
                    <span className="small text-primary-orange fw-bold text-uppercase tracking-wider">Admin System</span>
                    <h2 className="fw-bold fs-2 text-dark mb-0 font-traditional">Admin Operations Dashboard</h2>
                    <p className="text-muted small mb-0 mt-0.5">Oversee yajmans, verified pandits, bookings, and contact inquiries</p>
                </div>

                {/* Stats cards grid */}
                <div className="row g-4 justify-content-start mb-5">
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-blue-tint text-primary-blue fs-4 p-3" style={{ width: '50px', height: '50px' }}>
                                <FaUsers />
                            </div>
                            <div>
                                <span className="text-muted small fw-medium text-uppercase block" style={{ fontSize: '11px' }}>Total Yajmans</span>
                                <h3 className="fw-bold text-dark mb-0">{stats?.totalUsers || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-orange-tint text-primary-orange fs-4 p-3" style={{ width: '50px', height: '50px' }}>
                                <FaCompass />
                            </div>
                            <div>
                                <span className="text-muted small fw-medium text-uppercase block" style={{ fontSize: '11px' }}>Total Pandits</span>
                                <h3 className="fw-bold text-dark mb-0">{stats?.totalPandits || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-green-tint text-success fs-4 p-3" style={{ width: '50px', height: '50px' }}>
                                <FaCalendarAlt />
                            </div>
                            <div>
                                <span className="text-muted small fw-medium text-uppercase block" style={{ fontSize: '11px' }}>Total Bookings</span>
                                <h3 className="fw-bold text-dark mb-0">{stats?.totalBookings || 0}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-blue-tint text-primary-blue fs-4 p-3" style={{ width: '50px', height: '50px', backgroundColor: '#f3e8ff', color: '#9333ea' }}>
                                <FaEnvelope />
                            </div>
                            <div>
                                <span className="text-muted small fw-medium text-uppercase block" style={{ fontSize: '11px' }}>Pending Messages</span>
                                <h3 className="fw-bold text-dark mb-0">{stats?.pendingContactMessages || 0}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation tabs */}
                <div className="card border-0 rounded-4 p-4 shadow-xs bg-white mb-4">
                    <ul className="nav nav-pills mb-4 border-bottom pb-3 gap-2">
                        <li className="nav-item">
                            <button className={`nav-link px-4 py-2 rounded-pill fw-bold ${activeTab === 'pandits' ? 'bg-orange-active text-white' : 'text-dark bg-light'}`} onClick={() => setActiveTab('pandits')}>Verified Pandits</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link px-4 py-2 rounded-pill fw-bold ${activeTab === 'bookings' ? 'bg-orange-active text-white' : 'text-dark bg-light'}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link px-4 py-2 rounded-pill fw-bold ${activeTab === 'contacts' ? 'bg-orange-active text-white' : 'text-dark bg-light'}`} onClick={() => setActiveTab('contacts')}>Contact Messages</button>
                        </li>
                    </ul>

                    {/* Tabs Content */}
                    {activeTab === 'pandits' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light text-secondary">
                                    <tr>
                                        <th>Name</th>
                                        <th>Specialization</th>
                                        <th>Location</th>
                                        <th>Fees (₹)</th>
                                        <th>Experience</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pandits.length > 0 ? pandits.map(p => (
                                        <tr key={p._id}>
                                            <td className="fw-semibold">{p.userId?.name || 'N/A'}</td>
                                            <td>{p.specialization}</td>
                                            <td>{p.location}</td>
                                            <td className="font-monospace">₹{p.fees}</td>
                                            <td>{p.experience} Years</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1.5 rounded-3 fw-bold" onClick={() => handleRemovePandit(p._id)}>
                                                    <FaTrash style={{ fontSize: '11px' }} /> Remove
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="text-center py-4 text-muted">No Pandit profiles registered.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light text-secondary">
                                    <tr>
                                        <th>Yajman (User)</th>
                                        <th>Pandit</th>
                                        <th>Pooja Type</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length > 0 ? bookings.map(b => (
                                        <tr key={b._id}>
                                            <td>{b.userId?.name || 'Guest User'}</td>
                                            <td>{b.panditId?.userId?.name || 'Assigning...'}</td>
                                            <td className="fw-semibold text-primary-orange">{b.poojaType}</td>
                                            <td>{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                            <td>
                                                <span className={`badge px-2.5 py-1.5 rounded-pill text-uppercase font-monospace tracking-wide text-size-10 ${
                                                    b.status === 'completed' ? 'bg-success-subtle text-success border border-success-subtle' :
                                                    b.status === 'cancelled' ? 'bg-danger-subtle text-danger border border-danger-subtle' :
                                                    b.status === 'accepted' ? 'bg-info-subtle text-info border border-info-subtle' :
                                                    'bg-warning-subtle text-warning-dark border border-warning-subtle'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="text-center py-4 text-muted">No bookings scheduled yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'contacts' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light text-secondary">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Message</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.length > 0 ? contacts.map(c => (
                                        <tr key={c._id}>
                                            <td className="fw-semibold">{c.name}</td>
                                            <td className="font-monospace">{c.email}</td>
                                            <td className="text-dark-50">{c.subject}</td>
                                            <td className="text-truncate" style={{ maxWidth: '200px' }} title={c.message}>{c.message}</td>
                                            <td>
                                                <span className={`badge px-2.5 py-1.5 rounded-pill text-uppercase font-monospace tracking-wide text-size-10 ${
                                                    c.status === 'resolved' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning-dark border border-warning-subtle'
                                                }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td>
                                                {c.status === 'pending' ? (
                                                    <button className="btn btn-sm btn-success-action d-inline-flex align-items-center gap-1.5 rounded-3 fw-bold" onClick={() => handleResolveContact(c._id)}>
                                                        <FaCheckCircle style={{ fontSize: '11px' }} /> Mark Resolved
                                                    </button>
                                                ) : (
                                                    <span className="text-success fw-bold small-text-11">✓ Resolved</span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="text-center py-4 text-muted">No contact messages received.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom orange theme support css injection */}
            <style>{`
                .bg-orange-active {
                    background-color: var(--primary-orange) !important;
                }
                .btn-success-action {
                    background-color: #f0fdf4;
                    color: #15803d;
                    border: 1px solid #bbf7d0;
                }
                .btn-success-action:hover {
                    background-color: #dcfce7;
                }
            `}</style>
        </section>
    );
};

export default AdminDashboard;
