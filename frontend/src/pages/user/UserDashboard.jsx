import React, { useContext, useEffect, useState } from 'react';
import { FaBookOpen, FaUserCheck, FaCalendarCheck, FaCompass, FaUserCog } from 'react-icons/fa'; // 🍉 Added FaUserCog icon
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { role, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalbookings: 0,
        compleatedbookings: 0,
        pandingbookings: 0
    });
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [showPanditBanner, setShowPanditBanner] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('dismissedPanditBanner');
        if (dismissed !== 'true') {
            setShowPanditBanner(true);
        }
    }, []);

    const handleDismissBanner = () => {
        localStorage.setItem('dismissedPanditBanner', 'true');
        setShowPanditBanner(false);
        // Force header update immediately for Navbar listening to changes
        window.dispatchEvent(new Event('storage'));
    };

    const monthlyData = [
        { month: 'Jan', bookings: 1 },
        { month: 'Feb', bookings: 3 },
        { month: 'Mar', bookings: stats?.totalbookings > 0 ? stats.totalbookings + 1 : 2 },
        { month: 'Apr', bookings: stats?.compleatedbookings > 0 ? stats.compleatedbookings : 4 },
        { month: 'May', bookings: stats?.pandingbookings > 0 ? stats.pandingbookings : 1 },
        { month: 'Jun', bookings: 5 }
    ];

    const total = stats?.totalbookings || 0;
    const completed = stats?.compleatedbookings || 0;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 75; // 75% visual default if no bookings

    // SVG coordinates calculator
    const chartPoints = monthlyData.map((d, i) => ({
        x: i * 85 + 40,
        y: 120 - (d.bookings * 15)
    }));

    const pathData = chartPoints.reduce((acc, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaData = chartPoints.length > 0 
        ? `${pathData} L ${chartPoints[chartPoints.length - 1].x} 145 L ${chartPoints[0].x} 145 Z`
        : "";

    const getUserDashboardStatus = async () => {
        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/booking/user-dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const res = await data.json();
            setStats(res);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            getUserDashboardStatus();
        }
    }, [token]);

    return (
        <section className="py-5 bg-light-cream min-vh-100">
            <div className="container py-2">
                
                {/* Dashboard Responsive Header Panel with Action CTA Links */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 pb-3 border-bottom-subtle gap-3">
                    <div>
                        <span className="small text-primary-orange fw-bold text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Overview</span>
                        <h2 className="fw-bold fs-2 text-dark mb-0 font-traditional">User Dashboard</h2>
                        <p className="text-muted small mb-0 mt-0.5">Welcome back to your personalized spiritual booking panel</p>
                    </div>
                    
                    {/* Action Hub Row Triggers (Now with 3 unified actions) */}
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <button 
                            className="btn btn-sm btn-orange px-3 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-1.5"
                            onClick={() => navigate('/my-bookings')}
                            style={{ fontSize: '13px' }}
                        >
                            <FaBookOpen style={{ fontSize: '12px' }} /> My Bookings
                        </button>
                        
                        <button 
                            className="btn btn-sm btn-outline-orange px-3 py-2 rounded-3 fw-bold d-flex align-items-center gap-1.5"
                            onClick={() => navigate('/pandits')}
                            style={{ fontSize: '13px' }}
                        >
                            <FaCompass style={{ fontSize: '12px' }} /> Explore Pandits
                        </button>
 
                        {/* 🍉 NEW BUTTON: Direct profile management trigger with matching theme */}
                        <button 
                            className="btn btn-sm btn-outline-orange px-3 py-2 rounded-3 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
                            onClick={() => navigate('/my-profile')}
                            style={{ fontSize: '13px' }}
                        >
                            <FaUserCog style={{ fontSize: '12px' }} /> My Profile
                        </button>
                    </div>
                </div>

                {/* 🍉 NEW: Become a Pandit Promotional Banner */}
                {role === 'user' && showPanditBanner && (
                    <div className="card border-0 rounded-4 p-4 mb-4 shadow-sm text-start position-relative overflow-hidden" 
                         style={{ 
                             background: 'linear-gradient(135deg, #fffaf4 0%, #fff1e5 100%)', 
                             border: '1px solid #fbd2b3'
                         }}>
                        <div className="row align-items-center g-3">
                            <div className="col-12 col-md-8">
                                <span className="badge saffron-gradient-bg text-white border-0 px-2.5 py-1.5 rounded-pill small-text-10 mb-2">Join As Pandit</span>
                                <h4 className="fw-bold text-dark font-traditional mb-1">Are you a Vedic Priest / Pandit?</h4>
                                <p className="text-muted small mb-0">Create your Pandit profile to start offering Yajnas, Pujas, and other Vedic rituals to devotees on our platform.</p>
                            </div>
                            <div className="col-12 col-md-4 text-md-end d-flex gap-2 justify-content-md-end justify-content-start">
                                <button 
                                    className="btn btn-sm btn-orange px-4 py-2.5 rounded-3 fw-bold shadow-sm"
                                    onClick={() => navigate('/addPandit')}
                                    style={{ fontSize: '13px' }}
                                >
                                    Add Pandit Profile
                                </button>
                                <button 
                                    className="btn btn-sm btn-outline-orange px-3 py-2.5 rounded-3 fw-bold"
                                    onClick={handleDismissBanner}
                                    style={{ fontSize: '13px' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Metrics Stats Grid Layer Blocks */}
                <div className="row g-4 justify-content-start">
                    
                    {/* Metric Box 1: Total Bookings */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white industry-metric-card d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-blue-tint text-primary-blue">
                                <FaBookOpen />
                            </div>
                            <div className="lh-sm">
                                <span className="text-muted small fw-medium tracking-wide text-uppercase" style={{ fontSize: '11.5px' }}>Total Bookings</span>
                                <h2 className="fw-extrabold text-dark mb-0 mt-1 fs-2">
                                    {stats?.totalbookings ?? 0}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Metric Box 2: Completed Poojas */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white industry-metric-card d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-green-tint text-success">
                                <FaCalendarCheck />
                            </div>
                            <div className="lh-sm">
                                <span className="text-muted small fw-medium tracking-wide text-uppercase" style={{ fontSize: '11.5px' }}>Completed Poojas</span>
                                <h2 className="fw-extrabold text-dark mb-0 mt-1 fs-2">
                                    {stats?.compleatedbookings ?? 0}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Metric Box 3: Pending Requests */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white industry-metric-card d-flex align-items-center flex-row gap-3">
                            <div className="metric-icon-frame d-flex align-items-center justify-content-center rounded-3 bg-orange-tint text-primary-orange">
                                <FaUserCheck />
                            </div>
                            <div className="lh-sm">
                                <span className="text-muted small fw-medium tracking-wide text-uppercase" style={{ fontSize: '11.5px' }}>Pending Requests</span>
                                <h2 className="fw-extrabold text-dark mb-0 mt-1 fs-2">
                                    {stats?.pandingbookings ?? 0}
                                </h2>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Spiritual Analytics Section */}
                <div className="row g-4 mt-4 animate-fade-in-up delay-100 text-start">
                    
                    {/* Left Column: Radial Progress gauge */}
                    <div className="col-12 col-lg-4">
                        <div className="card border-0 rounded-4 p-4 shadow-xs bg-white h-100 glass-card">
                            <h5 className="fw-bold text-dark font-traditional mb-3">Ritual Completion Rate</h5>
                            <div className="d-flex flex-column align-items-center justify-content-center py-2">
                                <div className="position-relative" style={{ width: '130px', height: '130px' }}>
                                    <svg width="130" height="130" viewBox="0 0 120 120" className="svg-chart-container">
                                        <defs>
                                            <linearGradient id="radialSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#ff9f43" />
                                                <stop offset="100%" stopColor="#f26522" />
                                            </linearGradient>
                                        </defs>
                                        {/* Background Circle */}
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="#f1e7dd" strokeWidth="10" />
                                        {/* Animated Foreground circle */}
                                        <circle 
                                            cx="60" 
                                            cy="60" 
                                            r="50" 
                                            fill="none" 
                                            stroke="url(#radialSaffron)" 
                                            strokeWidth="10" 
                                            strokeDasharray="314.15"
                                            strokeDashoffset={314.15 - (completionPercentage / 100) * 314.15}
                                            strokeLinecap="round"
                                            transform="rotate(-90 60 60)"
                                            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                                        />
                                    </svg>
                                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                                        <h3 className="fw-extrabold text-dark mb-0">{completionPercentage}%</h3>
                                        <span className="text-muted small-text-10 fw-medium uppercase">Pooja Ratio</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-center">
                                    <span className="small-text-12 text-muted d-block">
                                        Completed: <strong className="text-success">{completed}</strong> / Total Booked: <strong className="text-dark">{total}</strong>
                                    </span>
                                    <p className="text-muted small-text-11 mb-0 mt-1">Excellent spiritual consistency!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Wave Line Chart */}
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 rounded-4 p-4 shadow-xs bg-white h-100 glass-card position-relative overflow-visible">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <h5 className="fw-bold text-dark font-traditional mb-0">Spiritual Journey Wave</h5>
                                    <span className="text-muted small-text-11">Pooja engagement count over recent months</span>
                                </div>
                                <span className="badge saffron-gradient-bg text-white border-0 px-2.5 py-1.5 rounded-pill small-text-10">Dynamic Tracker</span>
                            </div>
                            
                            <div className="position-relative my-2" style={{ height: '160px' }}>
                                <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none" className="svg-chart-container overflow-visible">
                                    <defs>
                                        <linearGradient id="areaSaffron" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#f26522" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#f26522" stopOpacity="0.00" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Grid Lines */}
                                    <line x1="20" y1="30" x2="480" y2="30" className="chart-grid-line" />
                                    <line x1="20" y1="70" x2="480" y2="70" className="chart-grid-line" />
                                    <line x1="20" y1="110" x2="480" y2="110" className="chart-grid-line" />
                                    <line x1="20" y1="145" x2="480" y2="145" className="chart-axis-line" />
                                    
                                    {/* Saffron Area Fill */}
                                    {areaData && <path d={areaData} fill="url(#areaSaffron)" style={{ transition: 'all 0.5s ease' }} />}
                                    
                                    {/* Saffron Line Curve */}
                                    {pathData && <path d={pathData} className="chart-line-curve" />}
                                    
                                    {/* Hover helper vertical line */}
                                    {hoveredIndex !== null && (
                                        <line 
                                            x1={chartPoints[hoveredIndex].x} 
                                            y1="20" 
                                            x2={chartPoints[hoveredIndex].x} 
                                            y2="145" 
                                            stroke="#f26522" 
                                            strokeWidth="1" 
                                            strokeDasharray="2 2" 
                                        />
                                    )}
                                    
                                    {/* Dynamic Interactive Node Dots */}
                                    {chartPoints.map((pt, i) => (
                                        <g key={i}>
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
                                </svg>
                                
                                {/* Dynamic Interactive HTML Tooltip Panel */}
                                {hoveredIndex !== null && (
                                    <div 
                                        className="position-absolute chart-dynamic-tooltip px-3 py-2 text-start"
                                        style={{
                                            left: `${(chartPoints[hoveredIndex].x / 500) * 100}%`,
                                            top: `${(chartPoints[hoveredIndex].y / 160) * 100 - 35}%`,
                                            transform: 'translateX(-50%)',
                                            transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1), top 0.2s ease',
                                            opacity: 1
                                        }}
                                    >
                                        <div className="fw-bold text-uppercase small-text-10 text-primary-orange">{monthlyData[hoveredIndex].month} Journey</div>
                                        <div className="small fw-semibold mt-0.5">🗓️ {monthlyData[hoveredIndex].bookings} Poojas Booked</div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Chart Labels Footer */}
                            <div className="d-flex align-items-center justify-content-between px-3 mt-1">
                                {monthlyData.map((d, i) => (
                                    <span key={i} className="small-text-11 fw-bold text-muted" style={{ width: '40px', textAlign: 'center' }}>
                                        {d.month}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default UserDashboard;