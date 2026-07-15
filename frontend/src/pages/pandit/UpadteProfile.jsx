import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UpdateProfile = () => {
    const { token } = useContext(AuthContext);

    const [form, setForm] = useState({
        specialization: '',
        experience: '',
        location: '',
        fees: '',
        bio: '',
        image: ''
    });

    const [image, setImage] = useState(null);

    const handleEvent = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const getMyProfile = async () => {
        try {
            const response = await fetch(
                'http://localhost:5000/api/pandit/my-profile',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const res = await response.json();

            if (res.pandit) {
                setForm({
                    specialization: res.pandit.specialization || '',
                    experience: res.pandit.experience || '',
                    location: res.pandit.location || '',
                    fees: res.pandit.fees || '',
                    bio: res.pandit.bio || '',
                    image: res.pandit.image || ''
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            getMyProfile();
        }
    }, [token]);

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('specialization', form.specialization);
            data.append('experience', form.experience);
            data.append('location', form.location);
            data.append('fees', form.fees);
            data.append('bio', form.bio);

            if (image) {
                data.append('image', image);
            }

            const response = await fetch(
                'http://localhost:5000/api/pandit/update-profile',
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: data
                }
            );

            const res = await response.json();

            if (!response.ok) {
                toast.error(res.msg);
                return;
            }

            toast.success(res.msg);
            setImage(null); // Clear selected file handle cache
            getMyProfile();

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5">
            <div className="container">
                <div className="row justify-content-center w-100 m-0">
                    {/* Balanced professional dashboard form container size */}
                    <div className="col-12 col-sm-10 col-md-9 col-lg-6 p-0">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative overflow-hidden">

                            {/* Premium Top Decorative Brand Line */}
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)' }}></div>

                            {/* Section Branding Headers */}
                            <div className="text-center mb-4 mt-2">
                                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">
                                    Update Pandit Profile
                                </h3>
                                <p className="text-muted small">
                                    Refine your corporate details, operating location coordinates, and profile metrics
                                </p>
                            </div>

                            {/* Live Backend Multer Asset Image Preview Hub */}
                            {form.image && (
                                <div className="text-center mb-4 d-flex justify-content-center">
                                    <div className="position-relative p-1 rounded-circle border border-2 border-dashed" style={{ borderColor: 'var(--primary-orange)', width: '110px', height: '110px' }}>
                                        <img
                                           
                                            src={`http://localhost:5000/assets/${form.image}`}
                                            alt="profile live review"
                                            className="w-100 h-100 rounded-circle object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                /* Fallback agar assets folder me temporary file sync na ho rahi ho */
                                                e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Main Configuration Input Form */}
                            <form onSubmit={updateProfile} className="d-flex flex-column gap-3">

                                {/* Specialization Field */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Specialization / Core Expertise</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={form.specialization}
                                        onChange={handleEvent}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        required
                                    />
                                </div>

                                {/* Two-Column Responsive Grid Layout for compact design consistency */}
                                <div className="row g-3 m-0 p-0">
                                    {/* Experience Input */}
                                    <div className="col-12 col-md-6 p-0 pe-md-2 text-start">
                                        <label className="small fw-semibold text-dark mb-1.5 ms-1">Experience (In Years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={form.experience}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                            required
                                        />
                                    </div>
                                    {/* Location Input */}
                                    <div className="col-12 col-md-6 p-0 ps-md-2 text-start">
                                        <label className="small fw-semibold text-dark mb-1.5 ms-1">Operating Location / City</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={form.location}
                                            onChange={handleEvent}
                                            className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Fees Dakshina Segment field block */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Dakshina / Fees (₹ Per Pooja)</label>
                                    <input
                                        type="number"
                                        name="fees"
                                        value={form.fees}
                                        onChange={handleEvent}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        required
                                    />
                                </div>

                                {/* Professional Biography Textarea description */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Professional Biography / Description</label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleEvent}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        rows="4"
                                        style={{ resize: 'none' }}
                                        required
                                    />
                                </div>

                                {/* Profile Photo Upload Override Block */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Replace Profile Photo (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control px-3 py-2 rounded-3 custom-file-pro shadow-none"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                    {image && <span className="text-success small-text-11 mt-1 d-block">✓ New image chosen: {image.name}</span>}
                                </div>

                                {/* Action Form Trigger Update Button */}
                                <button
                                    type="submit"
                                    className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm text-uppercase tracking-wider mt-3 btn-auth-submit"
                                    style={{ fontSize: '13.5px', letterSpacing: '0.5px' }}
                                >
                                    Save Profile Changes
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpdateProfile;