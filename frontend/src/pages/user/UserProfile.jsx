import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhoneAlt, FaEnvelope, FaUpload, FaSave, FaShieldAlt, FaLock } from 'react-icons/fa';

const UserProfile = () => {
    const navigate = useNavigate();
    const { token, role, login, name } = useContext(AuthContext);
    const [profileExists, setprofileExists] = useState(false);
    const [showPanditSwitchBtn, setShowPanditSwitchBtn] = useState(true);
    const [showProfilePrompt, setShowProfilePrompt] = useState(true);

    const [form, setForm] = useState({
        name: '',
        email: '',
        contact: '',
        image: ''
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // Local URL tracker for instant upload previews
    const [loading, setLoading] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passLoading, setPassLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setPassLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/user/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
            });

            const res = await response.json();
            if (response.ok) {
                toast.success(res.msg || "Password updated successfully");
                setShowPasswordModal(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(res.msg || "Failed to update password");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setPassLoading(false);
        }
    };

    const checkPanditProfile = async () => {
        try {
            const data = await fetch('http://localhost:5000/api/pandit/check-profile', {
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

    // const handleSwitchRole = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5000/api/user/switch-role', {
    //             method: 'PUT',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         const res = await response.json();
    //         if (response.ok) {
    //             login(res.token, res.role, res.name);
    //             if (res.role === 'pandit') {
    //                 navigate('/pandit-dashboard');
    //             } else {
    //                 navigate('/');
    //             }
    //         } else {
    //             console.error(res.msg);
    //         }
    //     } catch (error) {
    //         console.error("Error switching profile role:", error);
    //     }
    // };

    const handleSwitchRole = () => {
        navigate('/addPandit'); // useNavigate hook se
    };
    const checkSwitchBtnDismissal = () => {
        const dismissed = localStorage.getItem('dismissedPanditSwitch');
        if (dismissed === 'true') {
            setShowPanditSwitchBtn(false);
        } else {
            setShowPanditSwitchBtn(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const getMyProfile = async () => {
        try {
            const data = await fetch('http://localhost:5000/api/user/my-profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const res = await data.json();

            if (res.user) {
                setForm({
                    name: res.user.name || '',
                    email: res.user.email || '',
                    contact: res.user.contact || '',
                    image: res.user.image || ''
                });
            }
        } catch (error) {
            console.log("Error loading user profile parameters:", error);
        }
    };

    useEffect(() => {
        if (token) {
            getMyProfile();
            checkPanditProfile();
        }
        checkSwitchBtnDismissal();

        const profilePromptKey = 'hidePanditProfilePrompt_' + (name ? name.replace(/\s+/g, '_') : 'guest');
        if (localStorage.getItem(profilePromptKey) === 'true') {
            setShowProfilePrompt(false);
        } else {
            setShowProfilePrompt(true);
        }

        const handleStorageChange = () => {
            checkSwitchBtnDismissal();
            if (localStorage.getItem(profilePromptKey) === 'true') {
                setShowProfilePrompt(false);
            } else {
                setShowProfilePrompt(true);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [token, name]);

    // Track chosen file changes to update local previews immediately
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file)); // Generate instant blob URL preview
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', form.name);
            data.append('contact', form.contact);

            if (image) {
                data.append('image', image);
            }

            const response = await fetch('http://localhost:5000/api/user/update-profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: data
            });

            const res = await response.json();

            if (!response.ok) {
                toast.error(res.msg || "Failed to update profile settings.");
                return;
            }

            toast.success(res.msg || "Profile settings updated successfully!");
            setImage(null);
            setPreviewUrl(null); // Reset local preview on success
            getMyProfile();

        } catch (error) {
            console.error("Error updating profile settings:", error);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Fallback avatar
    const fallbackImg = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    return (
        <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5 animate-fade-in-up">
            <div className="container py-2 text-start">

                {/* Section Header */}
                <div className="text-center mb-5">
                    <span className="small text-primary-orange fw-bold text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Account Settings</span>
                    <h2 className="fw-bold fs-2 text-dark mb-2 font-traditional">Personal Profile Manager</h2>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                        <span style={{ color: '#f26522', fontSize: '10px' }}>◆</span>
                        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                    </div>
                    <p className="text-muted small mt-2">Manage your yajman identification parameters, phone verification, and profile avatar.</p>
                </div>

                <div className="row g-4 justify-content-center align-items-stretch">

                    {/* Left Column: Interactive Avatar & Account Stats Card */}
                    <div className="col-12 col-lg-4 col-md-5">
                        <div className="card h-100 border-0 rounded-4 p-4 text-center bg-white shadow-xs glass-card d-flex flex-column justify-content-between">
                            <div>
                                {/* Verification Badge Header */}
                                <div className="text-end mb-2">
                                    <span className="badge bg-orange-tint text-primary-orange px-2.5 py-1.5 rounded-pill small-text-10 border border-orange-light d-inline-flex align-items-center gap-1">
                                        <FaShieldAlt style={{ fontSize: '10px' }} /> Secure Yajman Profile
                                    </span>
                                </div>

                                {/* Dynamic local preview circle */}
                                <div className="position-relative mx-auto mb-4 p-1 rounded-circle border border-2 border-dashed shadow-sm" style={{ borderColor: 'var(--primary-orange)', width: '130px', height: '130px' }}>
                                    <img
                                        src={
                                            previewUrl
                                                ? previewUrl
                                                : (form.image ? `http://localhost:5000/assets/${form.image}` : fallbackImg)
                                        }
                                        alt="Yajman preview"
                                        className="w-100 h-100 rounded-circle object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = fallbackImg;
                                        }}
                                    />
                                    {previewUrl && (
                                        <span className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px', fontSize: '10px' }} title="Unsaved Local Preview">
                                            ✏️
                                        </span>
                                    )}
                                </div>

                                <h4 className="fw-bold text-dark font-traditional mb-1">
                                    {form.name || "Yajman User"}
                                </h4>

                                <span className="badge bg-blue-tint text-primary-blue px-3 py-1.5 rounded-pill small-text-10 font-monospace tracking-wide mb-3">
                                    ● CUSTOMER / YAJMAN
                                </span>

                                {/* 🍉 Become a Pandit dismissible fallback system */}
                                {role === 'user' && showProfilePrompt && (
                                    <div className="d-flex align-items-center justify-content-center gap-2 bg-orange-tint border border-orange-light rounded-2 px-2 py-1.5 mb-3 w-100 mx-auto" style={{ maxWidth: '240px' }}>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-orange py-1 px-2.5 rounded-2 fw-semibold"
                                            style={{ fontSize: '12px', border: 'none' }}
                                            onClick={() => navigate('/addPandit')}
                                        >
                                            Become a Pandit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm text-muted p-0 border-0 shadow-none lh-1 fs-5"
                                            onClick={() => {
                                                const profilePromptKey = 'hidePanditProfilePrompt_' + (name ? name.replace(/\s+/g, '_') : 'guest');
                                                localStorage.setItem(profilePromptKey, 'true');
                                                setShowProfilePrompt(false);
                                                window.dispatchEvent(new Event('storage'));
                                            }}
                                            style={{ cursor: 'pointer', background: 'transparent' }}
                                            title="Don't show this again"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}

                                {/* Security and info badges details grid */}
                                <div className="d-flex flex-column gap-2 mb-4 text-start border-top-dash pt-3">
                                    <div className="d-flex align-items-center gap-2 small-text-12 text-muted">
                                        <FaEnvelope className="text-muted-dot" /> Email ID:
                                        <strong className="text-dark-50 text-truncate font-monospace" title={form.email}>{form.email || "N/A"}</strong>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 small-text-12 text-muted">
                                        <FaPhoneAlt className="text-muted-dot" /> Contact:
                                        <strong className="text-dark-50 font-monospace">{form.contact || "N/A"}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Privacy notes */}
                            <div className="mt-4 pt-3 border-top-dash text-center">
                                <span className="small-text-10 text-muted d-block">🔒 Encryption standard secured</span>
                                <span className="small-text-9 text-muted-footer d-block mt-0.5">Your parameters will never be shared without consent.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: General Credentials Form Card */}
                    <div className="col-12 col-lg-7 col-md-7">
                        <div className="card h-100 border-0 rounded-4 p-4 shadow-xs bg-white glass-card">
                            <form onSubmit={updateProfile} className="d-flex flex-column gap-3">
                                <h4 className="fw-bold text-dark font-traditional mb-1 pb-2 border-bottom">Profile Parameters Configuration</h4>

                                {/* Full Name Input */}
                                <div className="form-group-block text-start">
                                    <label htmlFor="formName" className="small fw-semibold text-dark mb-1.5 ms-1 d-flex align-items-center gap-1.5">
                                        <FaUser className="text-muted" style={{ fontSize: '11px' }} /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="formName"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                {/* Email Address (Disabled Secure Endpoint Record) */}
                                <div className="form-group-block text-start">
                                    <label htmlFor="formEmail" className="small fw-semibold text-muted mb-1.5 ms-1 d-flex align-items-center gap-1.5">
                                        <FaEnvelope className="text-muted" style={{ fontSize: '11px' }} /> Secure Account Email
                                    </label>
                                    <input
                                        type="email"
                                        id="formEmail"
                                        name="email"
                                        value={form.email}
                                        className="form-control px-3 py-2.5 rounded-3 bg-light text-muted border border-light-subtle shadow-none font-monospace"
                                        style={{ cursor: 'not-allowed' }}
                                        disabled
                                    />
                                    <span className="small-text-10 text-muted mt-1 ms-1 d-block">💡 Security locks: Email addresses cannot be modified on active yajman sessions.</span>
                                </div>

                                {/* Contact Number Input */}
                                <div className="form-group-block text-start">
                                    <label htmlFor="formContact" className="small fw-semibold text-dark mb-1.5 ms-1 d-flex align-items-center gap-1.5">
                                        <FaPhoneAlt className="text-muted" style={{ fontSize: '11px' }} /> Contact Phone Number
                                    </label>
                                    <input
                                        type="number"
                                        id="formContact"
                                        name="contact"
                                        value={form.contact}
                                        onChange={handleChange}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none font-monospace"
                                        placeholder="Enter phone contact"
                                        required
                                    />
                                </div>

                                {/* Dynamic Avatar Selector Upload Input */}
                                <div className="form-group-block text-start">
                                    <label htmlFor="formFile" className="small fw-semibold text-dark mb-1.5 ms-1 d-flex align-items-center gap-1.5">
                                        <FaUpload className="text-muted" style={{ fontSize: '11px' }} /> Upload Profile Image
                                    </label>
                                    <input
                                        type="file"
                                        id="formFile"
                                        accept="image/*"
                                        className="form-control px-3 py-2 rounded-3 custom-file-pro shadow-none"
                                        onChange={handleFileChange}
                                    />
                                    {image && (
                                        <span className="text-success small-text-11 mt-1.5 d-block fw-semibold">
                                            ✓ Selected File: {image.name} ({Math.round(image.size / 1024)} KB)
                                        </span>
                                    )}
                                </div>
                                {/* Save & Change Password Buttons */}
                                <div className="text-end mt-3 border-top-dash pt-3 d-flex flex-wrap justify-content-between align-items-center gap-3">

                                    <button
                                        type="button"
                                        className="btn btn-outline-orange px-4 py-2.5 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                                        onClick={() => setShowPasswordModal(true)}
                                    >
                                        <FaLock style={{ fontSize: '13px' }} /> Change Password
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-orange px-4 py-2.5 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave style={{ fontSize: '13px' }} /> Save Settings ➔
                                            </>
                                        )}
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            </div>

            {showPasswordModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold text-dark font-traditional mb-0">Change Account Password</h5>
                                <button type="button" className="btn-close shadow-none border-0 bg-transparent text-dark font-monospace fs-4 p-0 m-0" onClick={() => setShowPasswordModal(false)} aria-label="Close" style={{ outline: 'none' }}>×</button>
                            </div>
                            <form onSubmit={handlePasswordChange}>
                                <div className="modal-body text-start d-flex flex-column gap-3">
                                    <div className="form-group-block">
                                        <label className="small fw-semibold text-dark mb-1 ms-1">Current Password</label>
                                        <input
                                            type="password"
                                            className="form-control px-3 py-2 rounded-3 form-pro-input shadow-none"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-block">
                                        <label className="small fw-semibold text-dark mb-1 ms-1">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control px-3 py-2 rounded-3 form-pro-input shadow-none"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-block">
                                        <label className="small fw-semibold text-dark mb-1 ms-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control px-3 py-2 rounded-3 form-pro-input shadow-none"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0 justify-content-end gap-2">
                                    <button type="button" className="btn btn-sm btn-light px-3 py-2 rounded-3 fw-bold" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-sm btn-orange px-3 py-2 rounded-3 fw-bold text-white border-0" disabled={passLoading} style={{ backgroundColor: 'var(--primary-orange)' }}>
                                        {passLoading ? 'Updating...' : 'Update Password'}
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

export default UserProfile;