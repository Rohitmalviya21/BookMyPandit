import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddPandit = () => {
    const { token, login, name } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        specialization: '',
        experience: '',
        location: '',
        fees: '',
        bio: ''
    });
    const [image, setImage] = useState(null);

    const handleEvent = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { specialization, experience, location, fees, bio } = formData;

        if (!specialization || !experience || !location || !fees || !bio) {
            toast.error("All fields are required");
            return;
        }

        try {
            // Append multi-part network data matrix
            const data = new FormData();
            data.append('specialization', specialization);
            data.append('experience', experience);
            data.append('location', location);
            data.append('fees', fees);
            data.append('bio', bio);

            if (image) {
                data.append('image', image);
            }

            const response = await fetch('http://localhost:5000/api/pandit/add', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                    // 🍉 Rule: Dynamic Multer binary uploads me manual Content-Type header kabhi mat lagana!
                },
                body: data
            });

            const res = await response.json();

            if (!response.ok) {
                toast.error(res.msg);
                return;
            }

            toast.success(res.msg || "Profile Created Successfully");
            
            // Core session update
            if (res.token && res.role) {
                login(res.token, res.role, name);
            }
            
            // Core memory cleanup hooks trigger
            setFormData({
                specialization: '',
                experience: '',
                location: '',
                fees: '',
                bio: ''
            });
            setImage(null); // File track state cleanup
            
            navigate('/pandit-dashboard');

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5">
            <div className="container">
                <div className="row justify-content-center w-100 m-0">
                    <div className="col-12 col-sm-10 col-md-9 col-lg-6 p-0">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative overflow-hidden">
                            
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)' }}></div>

                            <div className="text-center mb-4 mt-2">
                                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">
                                    Create Pandit Profile
                                </h3>
                                <p className="text-muted small">
                                    Onboard onto the platform by providing your core vedic expertise details
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Specialization / Core Expertise</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleEvent}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                    />
                                </div>

                                <div className="row g-3 m-0 p-0">
                                    <div className="col-12 col-md-6 p-0 pe-md-2 text-start">
                                        <label className="small fw-semibold text-dark mb-1.5 ms-1">Experience (In Years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 p-0 ps-md-2 text-start">
                                        <label className="small fw-semibold text-dark mb-1.5 ms-1">Operating Location / City</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        />
                                    </div>
                                </div>

                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Dakshina / Fees (₹ Per Pooja)</label>
                                    <input
                                        type="number"
                                        name="fees"
                                        value={formData.fees}
                                        onChange={handleEvent}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                    />
                                </div>

                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Professional Biography / Description</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleEvent}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        rows="4"
                                        style={{ resize: 'none' }}
                                    />
                                </div>

                                {/* Premium Custom Upload UI styling block hook */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Profile Photo (Passport Size)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control px-3 py-2 rounded-3 custom-file-pro shadow-none"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                    {image && <span className="text-success small-text-11 mt-1 d-block">✓ Asset selected: {image.name}</span>}
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm text-uppercase tracking-wider mt-3 btn-auth-submit"
                                    style={{ fontSize: '13.5px', letterSpacing: '0.5px' }}
                                >
                                    Create Profile Now
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AddPandit;