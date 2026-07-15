import React, { useContext, useEffect, useState } from 'react';
import { FaUsers, FaCheckCircle, FaClock, FaInbox, FaCalendarAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const PanditDashboard = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [recentBookings, setRecentBookings] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const businessMetrics = [
        { month: 'Jan', earnings: 4500, requests: 2 },
        { month: 'Feb', earnings: 8500, requests: 4 },
        { month: 'Mar', earnings: stats.totalRequests > 0 ? stats.totalRequests * 3500 : 7000, requests: stats.totalRequests || 3 },
        { month: 'Apr', earnings: stats.acceptedBooking > 0 ? stats.acceptedBooking * 4000 : 12000, requests: stats.acceptedBooking || 5 },
        { month: 'May', earnings: 9000, requests: 4 },
        { month: 'Jun', earnings: 15000, requests: 6 }
    ];

    // Primary coordinates calculator (Earnings saffron curve)
    const pointsSaffron = businessMetrics.map((d, i) => ({
        x: i * 85 + 40,
        y: 130 - (d.earnings * 0.007) // scaled
    }));
    const pathSaffron = pointsSaffron.reduce((acc, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");
    const areaSaffron = pointsSaffron.length > 0 
        ? `${pathSaffron} L ${pointsSaffron[pointsSaffron.length - 1].x} 145 L ${pointsSaffron[0].x} 145 Z`
        : "";

    // Secondary coordinates calculator (Requests blue curve)
    const pointsBlue = businessMetrics.map((d, i) => ({
        x: i * 85 + 40,
        y: 130 - (d.requests * 16) // scaled
    }));
    const pathBlue = pointsBlue.reduce((acc, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const getDashBoardStats = async () => {
        try {
            const data = await fetch('http://localhost:5000/api/booking/pandit-dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await data.json();
            setStats(res || {});
        } catch (error) {
            console.log(error);
        }
    };

    const getRecentBookings = async () => {
        try {
            const data = await fetch('http://localhost:5000/api/booking/recent-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await data.json();
            setRecentBookings(res.bookings || []);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            getDashBoardStats();
            getRecentBookings();
        }
    }, [token]);

    // Status styling maps matrix helper
    const getStatusPill = (status) => {
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
                
                {/* Dashboard Responsive Title Header */}
                <div className="text-start mb-4 pb-3 border-bottom-subtle">
                    <span className="small text-primary-orange fw-bold text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Management Hub</span>
                    <h2 className="fw-bold fs-2 text-dark mb-0 font-traditional">Pandit Dashboard</h2>
                    <p className="text-muted small mb-0 mt-0.5">Track your overall ritual conversions, upcoming events, and user queries</p>
                </div>

                {/* Top Row: Business Counter Metrics Framework */}
                <div className="row g-4 justify-content-start mb-5">
                    
                    {/* Block 1: Total Requests */}
                    <div className="col-12 col-md-4">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white industry-metric-card d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-blue-tint text-primary-blue">
                                <FaUsers />
                            </div>
                            <div className="lh-sm text-start">
                                <span className="text-muted small fw-medium tracking-wide text-uppercase" style={{ fontSize: '11px' }}>Total Requests</span>
                                <h2 className="fw-extrabold text-dark mb-0 mt-1 fs-2">{stats.totalRequests || 0}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Block 2: Accepted Conversions */}
                    <div className="col-12 col-md-4">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white industry-metric-card d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-green-tint text-success">
                                <FaCheckCircle />
                            </div>
                            <div className="lh-sm text-start">
                                <span className="text-muted small fw-medium tracking-wide text-uppercase" style={{ fontSize: '11px' }}>Accepted Bookings</span>
                                <h2 className="fw-extrabold text-dark mb-0 mt-1 fs-2">{stats.acceptedBooking || 0}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Block 3: Pending Queues */}
                    <div className="col-12 col-md-4">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white industry-metric-card d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-orange-tint text-primary-orange">
                                <FaClock />
                            </div>
                            <div className="lh-sm text-start">
                                <span className="text-muted small fw-medium tracking-wide text-uppercase" style={{ fontSize: '11px' }}>Pending Action</span>
                                <h2 className="fw-extrabold text-dark mb-0 mt-1 fs-2">{stats.pendingBooking || 0}</h2>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Spiritual Business Analytics Dashboard */}
                <div className="row g-4 mb-5 animate-fade-in-up delay-100 text-start">
                    
                    {/* Hired & Dakshina Growth Wave */}
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 rounded-4 p-4 shadow-xs bg-white h-100 glass-card position-relative overflow-visible">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <h5 className="fw-bold text-dark font-traditional mb-0">Ritual Dakshina & Demand Waves</h5>
                                    <span className="text-muted small-text-11">Dakshina earnings vs. request counts over time</span>
                                </div>
                                <div className="d-flex gap-2">
                                    <span className="badge bg-orange-tint text-primary-orange border-0 px-2 py-1 rounded-pill small-text-10">● Dakshina (₹)</span>
                                    <span className="badge bg-blue-tint text-primary-blue border-0 px-2 py-1 rounded-pill small-text-10">● Bookings</span>
                                </div>
                            </div>
                            
                            <div className="position-relative my-2" style={{ height: '160px' }}>
                                <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none" className="svg-chart-container overflow-visible">
                                    <defs>
                                        <linearGradient id="panditAreaSaffron" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#f26522" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#f26522" stopOpacity="0.00" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Grid Lines */}
                                    <line x1="20" y1="30" x2="480" y2="30" className="chart-grid-line" />
                                    <line x1="20" y1="70" x2="480" y2="70" className="chart-grid-line" />
                                    <line x1="20" y1="110" x2="480" y2="110" className="chart-grid-line" />
                                    <line x1="20" y1="145" x2="480" y2="145" className="chart-axis-line" />
                                    
                                    {/* Area saffron fill */}
                                    {areaSaffron && <path d={areaSaffron} fill="url(#panditAreaSaffron)" style={{ transition: 'all 0.5s ease' }} />}
                                    
                                    {/* Primary Saffron Line Curve */}
                                    {pathSaffron && <path d={pathSaffron} className="chart-line-curve" />}
                                    
                                    {/* Secondary Blue Line Curve */}
                                    {pathBlue && <path d={pathBlue} className="chart-line-curve-secondary" />}
                                    
                                    {/* Hover vertical dashed line */}
                                    {hoveredIndex !== null && (
                                        <line 
                                            x1={pointsSaffron[hoveredIndex].x} 
                                            y1="20" 
                                            x2={pointsSaffron[hoveredIndex].x} 
                                            y2="145" 
                                            stroke="#6b5a52" 
                                            strokeWidth="1" 
                                            strokeDasharray="2 2" 
                                        />
                                    )}
                                    
                                    {/* Primary Saffron Interactive Dot Nodes */}
                                    {pointsSaffron.map((pt, i) => (
                                        <g key={`saffron-${i}`}>
                                            {hoveredIndex === i && (
                                                <circle 
                                                    cx={pt.x} 
                                                    cy={pt.y} 
                                                    r="9" 
                                                    fill="none" 
                                                    stroke="#f26522" 
                                                    strokeWidth="1.5" 
                                                    className="glowing-pulse-ring" 
                                                    style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                                                />
                                            )}
                                            <circle 
                                                cx={pt.x} 
                                                cy={pt.y} 
                                                r="5.5" 
                                                className="chart-interactive-node"
                                                onMouseEnter={() => setHoveredIndex(i)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                            />
                                        </g>
                                    ))}

                                    {/* Secondary Blue Interactive Dot Nodes */}
                                    {pointsBlue.map((pt, i) => (
                                        <g key={`blue-${i}`}>
                                            {hoveredIndex === i && (
                                                <circle 
                                                    cx={pt.x} 
                                                    cy={pt.y} 
                                                    r="9" 
                                                    fill="none" 
                                                    stroke="#3b82f6" 
                                                    strokeWidth="1.5" 
                                                    className="glowing-pulse-ring" 
                                                    style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                                                />
                                            )}
                                            <circle 
                                                cx={pt.x} 
                                                cy={pt.y} 
                                                r="5" 
                                                className="chart-interactive-node-blue"
                                                onMouseEnter={() => setHoveredIndex(i)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                            />
                                        </g>
                                    ))}
                                </svg>
                                
                                {/* Dynamic Interactive Absolute HTML Tooltip Panel */}
                                {hoveredIndex !== null && (
                                    <div 
                                        className="position-absolute chart-dynamic-tooltip px-3 py-2 text-start"
                                        style={{
                                            left: `${(pointsSaffron[hoveredIndex].x / 500) * 100}%`,
                                            top: `${(pointsSaffron[hoveredIndex].y / 160) * 100 - 45}%`,
                                            transform: 'translateX(-50%)',
                                            transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1), top 0.2s ease',
                                            opacity: 1
                                        }}
                                    >
                                        <div className="fw-bold text-uppercase small-text-10 text-primary-orange">{businessMetrics[hoveredIndex].month} Summary</div>
                                        <div className="small fw-semibold mt-0.5">💰 Dakshina: ₹{businessMetrics[hoveredIndex].earnings.toLocaleString('en-IN')}</div>
                                        <div className="small-text-11 text-muted-footer">📈 Volume: {businessMetrics[hoveredIndex].requests} Requests</div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Chart Labels Footer */}
                            <div className="d-flex align-items-center justify-content-between px-3 mt-1">
                                {businessMetrics.map((d, i) => (
                                    <span key={i} className="small-text-11 fw-bold text-muted" style={{ width: '40px', textAlign: 'center' }}>
                                        {d.month}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Specialization breakdown progress bars */}
                    <div className="col-12 col-lg-4">
                        <div className="card border-0 rounded-4 p-4 shadow-xs bg-white h-100 glass-card">
                            <h5 className="fw-bold text-dark font-traditional mb-3">Ritual Distribution</h5>
                            <div className="d-flex flex-column gap-3 py-1">
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="small fw-semibold text-dark">Ganesh Pooja</span>
                                        <span className="small text-muted-dot text-size-11">42% (5)</span>
                                    </div>
                                    <div className="progress rounded-pill" style={{ height: '7px', backgroundColor: '#f1e7dd' }}>
                                        <div className="progress-bar rounded-pill saffron-gradient-bg" role="progressbar" style={{ width: '42%' }} aria-valuenow="42" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="small fw-semibold text-dark">Havan & Shanti</span>
                                        <span className="small text-muted-dot text-size-11">25% (3)</span>
                                    </div>
                                    <div className="progress rounded-pill" style={{ height: '7px', backgroundColor: '#f1e7dd' }}>
                                        <div className="progress-bar rounded-pill bg-info" role="progressbar" style={{ width: '25%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="small fw-semibold text-dark">Griha Pravesh</span>
                                        <span className="small text-muted-dot text-size-11">18% (2)</span>
                                    </div>
                                    <div className="progress rounded-pill" style={{ height: '7px', backgroundColor: '#f1e7dd' }}>
                                        <div className="progress-bar rounded-pill bg-success" role="progressbar" style={{ width: '18%' }} aria-valuenow="18" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="small fw-semibold text-dark">Satyanarayan Katha</span>
                                        <span className="small text-muted-dot text-size-11">15% (2)</span>
                                    </div>
                                    <div className="progress rounded-pill" style={{ height: '7px', backgroundColor: '#f1e7dd' }}>
                                        <div className="progress-bar rounded-pill bg-warning" role="progressbar" style={{ width: '15%' }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-1 border-top-dash text-center">
                                <span className="small-text-11 text-muted">Average booking valuation: <strong className="text-primary-orange">₹3,800</strong></span>
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* Bottom Row: Recent Bookings Modern Data Table System */}
                <div className="card border-0 rounded-4 shadow-xs p-4 bg-white text-start">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="text-primary-orange fs-5 d-flex align-items-center"><FaInbox /></div>
                        <h5 className="fw-bold text-dark font-traditional mb-0">Recent Incoming Requests</h5>
                    </div>

                    {recentBookings && recentBookings.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle custom-dashboard-table mb-0">
                                <thead className="table-light-head">
                                    <tr>
                                        <th className="py-3 px-4 text-secondary text-uppercase tracking-wider text-size-10 fw-bold">Customer / Yajman</th>
                                        <th className="py-3 text-secondary text-uppercase tracking-wider text-size-10 fw-bold">Pooja Type</th>
                                        <th className="py-3 text-secondary text-uppercase tracking-wider text-size-10 fw-bold">Ritual Date</th>
                                        <th className="py-3 px-4 text-end text-secondary text-uppercase tracking-wider text-size-10 fw-bold">Status State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking) => (
                                        <tr key={booking._id} className="table-row-interaction">
                                            {/* Customer Name */}
                                            <td className="py-3 px-4 fw-bold text-dark font-heading-pro">
                                                {booking.userId?.name || "Guest Yajman"}
                                            </td>
                                            {/* Pooja Type Category */}
                                            <td className="py-3 text-muted small-text-13">
                                                <span className="bg-light text-dark px-2.5 py-1 rounded-2 border fw-medium">{booking.poojaType}</span>
                                            </td>
                                            {/* Date Mapping String */}
                                            <td className="py-3 text-muted small-text-13">
                                                <span className="d-flex align-items-center gap-1.5">
                                                    <FaCalendarAlt className="text-muted-dot text-size-11" />
                                                    {booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                                </span>
                                            </td>
                                            {/* Pill Status Badge alignment */}
                                            <td className="py-3 px-4 text-end">
                                                <span className={`badge px-2.5 py-1.5 rounded-pill text-uppercase font-monospace tracking-wide text-size-10 ${getStatusPill(booking.status)}`}>
                                                    ● {booking.status || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Empty state container */
                        <div className="text-center py-5 border rounded-3 border-dashed">
                            <div className="text-muted fs-3 mb-2">📥</div>
                            <h6 className="fw-bold text-dark-50 mb-1">No Recent Requests Active</h6>
                            <p className="text-muted small mb-0">When customers request pooja bookings, their slots validation will list right here.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default PanditDashboard;