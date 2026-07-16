import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import StaggeredMenu from './StaggeredMenu';
import { FaTimes } from 'react-icons/fa';


const Navbar = () => {
    const { isAuth, role, logout, token, name, user } = useContext(AuthContext);
    const [profileExists, setprofileExists] = useState(false);
    const [navImage, setNavImage] = useState(null); // Live tracker loop for local update synchronization
    const navigate = useNavigate();
    const location = useLocation();

    // 🍉 Fetch profile image directly from database to show update instantly without re-login
    const getLiveNavProfile = async () => {
        if (!token) return;
        try {
            const endpoint = role === 'pandit' ? 'pandit/my-profile' : 'user/my-profile';
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            if (role === 'pandit' && res.pandit?.image) {
                setNavImage(res.pandit.image);
            } else if (role === 'user' && res.user?.image) {
                setNavImage(res.user.image);
            }
        } catch (error) {
            console.log("Error loading nav live image asset:", error);
        }
    };

    const checkPanditProfile = async () => {
        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/pandit/check-profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const res = await data.json();
            setprofileExists(res.exists);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            getLiveNavProfile(); // Load real-time uploaded file structure
            checkPanditProfile();
        }
    }, [role, token, location.pathname]); // Reloads automatically when navigating pages

    // Sirf "Join as Pandit" dismissal track karna hai — koi switch-role feature nahi
    const [showPanditLink, setShowPanditLink] = useState(true);

    const checkBannerDismissal = () => {
        const promptKey = 'hidePanditNavbarPill_' + (name ? name.replace(/\s+/g, '_') : 'guest');
        const dismissed = localStorage.getItem(promptKey);
        setShowPanditLink(dismissed !== 'true');
    };

    useEffect(() => {
        checkBannerDismissal();
        const handleStorageChange = () => checkBannerDismissal();
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [location.pathname, isAuth, role, name]);

    const getInitials = (userName) => {
        if (!userName) return "U";
        return userName.trim().charAt(0).toUpperCase();
    };

    const socialItems = [
        { label: 'Twitter', link: 'https://twitter.com' },
        { label: 'GitHub', link: 'https://github.com' },
        { label: 'LinkedIn', link: 'https://linkedin.com' }
    ];

    const menuItems = [];

    // "Join as Pandit" — sirf role 'user' ke liye, jiska pandit profile nahi hai, aur jisne dismiss nahi kiya — Home se PEHLE
    if (isAuth && role === 'user' && showPanditLink && !profileExists) {
        menuItems.push({ label: 'Join as Pandit', ariaLabel: 'Join as Pandit', link: '/addPandit' });
    }

    if (role !== 'pandit') {
        menuItems.push({ label: 'Home', ariaLabel: 'Go to home page', link: '/' });
    }

    if (isAuth) {
        menuItems.push({ label: 'Pandits', ariaLabel: 'Browse all Pandits', link: '/pandits' });
    }

    if (isAuth && role === 'user') {
        menuItems.push({ label: 'About Us', ariaLabel: 'About Us', link: '/about' });
        menuItems.push({ label: 'Contact Us', ariaLabel: 'Contact Us', link: '/contact' });
        menuItems.push({ label: 'My Bookings', ariaLabel: 'My Bookings', link: '/my-bookings' });
        menuItems.push({ label: 'Dashboard', ariaLabel: 'Dashboard', link: '/dashboard' });
    }

    // Pandit ke liye — sirf Dashboard/Requests/Update Profile, KOI switch-to-user option nahi
    if (isAuth && role === 'pandit') {
        if (profileExists) {
            menuItems.push({ label: 'Dashboard', ariaLabel: 'Dashboard', link: '/pandit-dashboard' });
            menuItems.push({ label: 'Requests', ariaLabel: 'Requests', link: '/pandit-dashboard/requests' });
            menuItems.push({ label: 'Update Profile', ariaLabel: 'Update Profile', link: '/pandit-dashboard/update-profile' });
        } else {
            menuItems.push({ label: 'Create Profile', ariaLabel: 'Create Profile', link: '/addPandit' });
        }
    }

    if (isAuth && role === 'admin') {
        menuItems.push({ label: 'Admin Dashboard', ariaLabel: 'Admin Dashboard', link: '/admin' });
    }

    if (isAuth) {
        menuItems.push({ label: 'My Profile', ariaLabel: 'My Profile', link: '/my-profile' });
        menuItems.push({
            label: 'Logout',
            ariaLabel: 'Logout',
            link: '#',
            onClick: () => {
                logout();
                navigate('/');
            }
        });
    } else {
        menuItems.push({ label: 'Login', ariaLabel: 'Login', link: '/login' });
        menuItems.push({ label: 'Register', ariaLabel: 'Register', link: '/register' });
    }

    return (
        <>
            <style>{`
                @media (min-width: 991px) {
                    .desktop-navbar-wrapper {
                        display: block !important;
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 1020 !important;
                        background-color: #ffffff !important;
                    }
                    .mobile-navbar-wrapper {
                        display: none !important;
                    }
                }
                @media (max-width: 990px) {
                    .desktop-navbar-wrapper {
                        display: none !important;
                    }
                    .mobile-navbar-wrapper {
                        display: block !important;
                    }
                }
                .mobile-navbar-wrapper .staggered-menu-header {
                    background: #ffffff !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    padding: 1rem 1.5rem !important;
                    position: fixed !important;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    pointer-events: auto;
                    transition: background 0.3s ease;
                    border-bottom: 1px solid #f1e7dd;
                }
                .mobile-navbar-wrapper .staggered-menu-wrapper[data-open] .staggered-menu-header {
                    background: #ffffff !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    border-bottom: 1px solid #f1e7dd;
                }
                .mobile-navbar-wrapper .sm-toggle {
                    margin-left: auto;
                    font-size: 0.95rem;
                }
            `}</style>

            <div className="desktop-navbar-wrapper">
                <nav className="navbar navbar-expand-lg navbar-light border-bottom sticky-navbar py-2 px-3">
                    <div className="container-fluid container-lg d-flex align-items-center justify-content-between">

                        {/* Brand Logo */}
                        <NavLink
                            className="navbar-brand d-flex align-items-center"
                            to={role === 'pandit' ? '/pandit-dashboard' : '/'}
                            style={{ textDecoration: 'none' }}
                        >
                            <span className="fw-bold fs-3 text-primary-orange" style={{ letterSpacing: '-0.5px' }}>
                                Book<span style={{ color: '#2d1e18' }}>My</span>Pandit
                            </span>
                        </NavLink>

                        {/* Mobile Toggler */}
                        <button
                            className="navbar-toggler border-0 shadow-none"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarContent"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* Navbar Content Links */}
                        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
                            <ul className="navbar-nav align-items-center gap-2 gap-lg-3 mb-2 mb-lg-0 mt-2 mt-lg-0">

                                {/* JOIN AS PANDIT PILL — HOME SE PEHLE, dismissible */}
                                {isAuth && role === 'user' && !profileExists && showPanditLink && (
                                    <li className="nav-item me-lg-2 animate-scale-in">
                                        <div
                                            className="btn btn-orange px-3 py-1.5 rounded-pill d-flex align-items-center gap-2"
                                            style={{ fontSize: '13px', cursor: 'pointer' }}
                                            onClick={() => navigate('/addPandit')}
                                        >
                                            Join as Pandit
                                            <span
                                                className="d-flex align-items-center justify-content-center rounded-circle bg-white text-orange"
                                                style={{ width: '16px', height: '16px', padding: '2px', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const promptKey = 'hidePanditNavbarPill_' + (name ? name.replace(/\s+/g, '_') : 'guest');
                                                    localStorage.setItem(promptKey, 'true');
                                                    setShowPanditLink(false);
                                                    window.dispatchEvent(new Event('storage'));
                                                }}
                                            >
                                                <FaTimes size={8} style={{ color: 'var(--primary-orange)', display: 'block' }} />
                                            </span>
                                        </div>
                                    </li>
                                )}

                                {/* PUBLIC LINK */}
                                {role !== 'pandit' && (
                                    <li className="nav-item">
                                        <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/' ? 'text-primary-orange' : 'text-dark'}`} to="/">
                                            Home
                                        </NavLink>
                                    </li>
                                )}

                                {/* PANDITS DIRECTORY LINK (ONLY LOGGED-IN USERS) */}
                                {isAuth && (
                                    <li className="nav-item">
                                        <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/pandits' ? 'text-primary-orange' : 'text-dark'}`} to="/pandits">
                                            Pandits
                                        </NavLink>
                                    </li>
                                )}

                                {/* LOGGED IN CUSTOMER LINKS */}
                                {isAuth && role === 'user' && (
                                    <>
                                        <li className="nav-item">
                                            <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/about' ? 'text-primary-orange' : 'text-dark'}`} to="/about">
                                                About Us
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/contact' ? 'text-primary-orange' : 'text-dark'}`} to="/contact">
                                                Contact Us
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/my-bookings' ? 'text-primary-orange' : 'text-dark'}`} to="/my-bookings">
                                                My Bookings
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/dashboard' ? 'text-primary-orange' : 'text-dark'}`} to="/dashboard">
                                                Dashboard
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {/* ADMIN LINKS */}
                                {isAuth && role === 'admin' && (
                                    <li className="nav-item">
                                        <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/admin' ? 'text-primary-orange' : 'text-dark'}`} to="/admin">
                                            Admin Dashboard
                                        </NavLink>
                                    </li>
                                )}

                                {/* PANDIT LINKS — koi switch-to-user/yajman button nahi, sirf dashboard-related links */}
                                {isAuth && role === 'pandit' && (
                                    <>
                                        {profileExists ? (
                                            <>
                                                <li className="nav-item">
                                                    <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/pandit-dashboard' ? 'text-primary-orange' : 'text-dark'}`} to="/pandit-dashboard">
                                                        Dashboard
                                                    </NavLink>
                                                </li>
                                                <li className="nav-item">
                                                    <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/pandit-dashboard/requests' ? 'text-primary-orange' : 'text-dark'}`} to="/pandit-dashboard/requests">
                                                        Requests
                                                    </NavLink>
                                                </li>
                                                <li className="nav-item">
                                                    <NavLink className={`nav-link fw-semibold px-2 ${location.pathname === '/pandit-dashboard/update-profile' ? 'text-primary-orange' : 'text-dark'}`} to="/pandit-dashboard/update-profile">
                                                        Update Profile
                                                    </NavLink>
                                                </li>
                                            </>
                                        ) : (
                                            <li className="nav-item">
                                                <NavLink className="nav-link fw-semibold text-dark px-2" to="/addPandit">
                                                    Create Profile
                                                </NavLink>
                                            </li>
                                        )}
                                    </>
                                )}

                                {/* AUTH BUTTONS / DROPDOWN & LOGOUT */}
                                {!isAuth ? (
                                    <>
                                        <li className="nav-item ms-lg-2">
                                            <NavLink className="btn btn-outline-orange px-4 rounded-pill" to="/login" style={{ fontSize: '14px' }}>
                                                Login
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="btn btn-orange px-4 rounded-pill" to="/register" style={{ fontSize: '14px' }}>
                                                Register
                                            </NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item d-flex align-items-center gap-3 m-0 ms-lg-2 navbar-user-controls-block dropdown">

                                        {/* Clickable Profile Circle Avatar Frame */}
                                        <div
                                            className="d-flex align-items-center justify-content-center text-white fw-bold rounded-circle shadow-sm user-avatar-badge-circle"
                                            title={name || "User Profile"}
                                            onClick={() => navigate('/my-profile')}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: '#8f82f7',
                                                fontSize: '15px',
                                                cursor: 'pointer',
                                                border: '2px solid #ffffff',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {navImage || user?.image ? (
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/assets/${navImage || user?.image}`}
                                                    alt="user profile picture"
                                                    className="w-100 h-100 object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        const fallbackTxt = e.target.nextSibling;
                                                        if (fallbackTxt) fallbackTxt.style.display = 'block';
                                                    }}
                                                />
                                            ) : null}

                                            <span style={{ display: (navImage || user?.image) ? 'none' : 'block' }}>
                                                {getInitials(name)}
                                            </span>
                                        </div>

                                        {/* Logout */}
                                        <button
                                            className="btn btn-sm btn-outline-orange px-3 rounded-2"
                                            style={{ fontSize: '13px', padding: '6px 12px' }}
                                            onClick={() => {
                                                logout();
                                                navigate('/');
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                )}

                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            <div className="mobile-navbar-wrapper">
                <StaggeredMenu
                    position="right"
                    items={menuItems}
                    socialItems={socialItems}
                    displaySocials
                    displayItemNumbering={false}
                    menuButtonColor="#2d1e18"
                    openMenuButtonColor="#2d1e18"
                    changeMenuColorOnOpen={true}
                    colors={['#f26522', '#fffaf4']}
                    logoUrl="/path-to-your-logo.svg"
                    accentColor="#f26522"
                    onMenuOpen={() => console.log('Menu opened')}
                    onMenuClose={() => console.log('Menu closed')}
                />
                <div style={{ height: '60px' }}></div>
            </div>
        </>
    );
};

export default Navbar;  