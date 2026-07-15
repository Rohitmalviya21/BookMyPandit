import React from 'react';

const PopularPoojas = () => {
    // Highly reliable, clean and professional production-ready vector graphics links
    const poojas = [
        {
            title: 'Ganesh Pooja',
            description: 'Invite blessings of Lord Ganesha',
            image: '/image/poojaimg/mohnish-landge-q1EYz9ktPH8-unsplash.jpg'
        },
        {
            title: 'Havan Pooja',
            description: 'Purify your home & soul with Havan',
            image: '/image/poojaimg/bala-kumar-Dx3r4sGetF8-unsplash.jpg'
        },
        {
            title: 'Akhand Ramayan',
            description: 'Peace, prosperity & happiness',
            image: '/image/poojaimg/prashant-UaYlw1K6DPQ-unsplash.jpg'
        },
        {
            title: 'Griha Pravesh',
            description: 'Bring positivity to your new home',
            image: '/image/poojaimg/awesome-sauce-creative--aCFcojh42g-unsplash.jpg'
        },
        {
            title: 'Satyanarayan Katha',
            description: 'For well-being & prosperity',
            image: '/image/poojaimg/laavanya-bhat-U1537TifQ7A-unsplash.jpg'
        }
    ];

    return (
        <section id="poojas" className="py-5 bg-white position-relative overflow-hidden">
            <div className="container py-2">
                
                {/* Header Section */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold fs-3 text-dark mb-2 font-traditional">
                        Popular Poojas
                    </h2>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <div style={{ width: '35px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                        <span style={{ color: '#f26522', fontSize: '9px' }}>◆</span>
                        <div style={{ width: '35px', height: '1.5px', backgroundColor: '#f26522' }}></div>
                    </div>
                </div>

                {/* 5 Column Grid Wrapper with Strict Constraints */}
                <div className="position-relative px-lg-3">
                    <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 justify-content-center">
                        
                        {poojas.map((pooja, index) => (
                            <div className="col" key={index}>
                                <div className="card h-100 border-0 rounded-4 overflow-hidden production-pooja-card bg-white">
                                    
                                    {/* Strictly constrained aspect-ratio container */}
                                    <div className="pooja-img-container position-relative">
                                        <img
                                            src={pooja.image}
                                            alt={pooja.title}
                                            className="w-100 h-100 pooja-pro-img"
                                            loading="lazy"
                                        />
                                        <div className="pooja-card-shade"></div>
                                    </div>

                                    {/* Minimalist Professional Card Body */}
                                    <div className="card-body text-center d-flex flex-column justify-content-between p-3 bg-white">
                                        <div>
                                            <h6 className="fw-bold text-dark mb-1 fs-6 text-truncate-1">
                                                {pooja.title}
                                            </h6>
                                            <p className="text-muted text-center mb-0 text-truncate-2">
                                                {pooja.description}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Premium Slider Control Button (Mockup layout match) */}
                    <button className="d-none d-xl-flex position-absolute top-50 end-0 translate-middle-y bg-white shadow rounded-circle align-items-center justify-content-center border next-slide-pro-btn" 
                         style={{ width: '36px', height: '36px', zIndex: 10, right: '-12px', border: '1px solid #f1e6dc' }}>
                        <span style={{ color: '#6b5a52', fontSize: '11px', fontWeight: 'bold' }}>➔</span>
                    </button>
                </div>

            </div>
        </section>
    );
};

export default PopularPoojas;