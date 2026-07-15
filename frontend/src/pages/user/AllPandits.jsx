import React, { useEffect, useState } from 'react';
import PanditCard from '../../components/home/PanditCard';

const AllPandits = () => {
    const [pandits, setPandits] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPandits = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/pandit/all');
            if (response.ok) {
                const data = await response.json();
                setPandits(data.pandits || []);
            }
        } catch (error) {
            console.log("Error loading all pandits:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPandits();
    }, []);

    return (
        <section className="py-5 bg-light-cream min-vh-100">
            <div className="container py-2 text-start">
                
                {/* Page Header */}
                <div className="text-center mb-5 mt-2">
                    <span className="small text-primary-orange fw-bold text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Vedic Directory</span>
                    <h2 className="fw-bold fs-2 text-dark mb-2 font-traditional">Our Verified Pandits</h2>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                        <span style={{ color: '#f26522', fontSize: '10px' }}>◆</span>
                        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                    </div>
                    <p className="text-muted small mt-2">Browse profile credentials, specializations, locations, and book your auspicious poojas directly.</p>
                </div>

                {/* 4-Column Responsive Grid */}
                {loading ? (
                    <div className="row g-4 justify-content-center">
                        <div className="col-12 text-center py-5">
                            <div className="spinner-border text-primary-orange" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted small mt-3">Loading verified pandit profiles...</p>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 justify-content-start">
                        {pandits.length > 0 ? (
                            pandits.map((pandit) => (
                                <div className="col d-flex align-items-stretch animate-scale-in" key={pandit._id}>
                                    <PanditCard pandit={pandit} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5 bg-white rounded-4 border text-muted small shadow-sm w-100">
                                🏮 No verified pandits registered at this moment. Please check back later.
                            </div>
                        )}
                    </div>
                )}

            </div>
        </section>
    );
};

export default AllPandits;
