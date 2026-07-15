import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const Booking = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        poojaType: '',
        date: '',
        address: ''
    });

    const [bookedDates, setBookedDates] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState('');
    const [duration, setDuration] = useState(1);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/booking/booked-dates/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBookedDates(data.bookedDates || []);
                }
            } catch (error) {
                console.log("Error fetching booked dates:", error);
            }
        };
        if (id) {
            fetchBookedDates();
        }
    }, [id]);

    const getDatesInRange = (startDateStr, daysCount) => {
        if (!startDateStr) return [];
        const dates = [];
        const [year, month, day] = startDateStr.split('-').map(Number);
        for (let i = 0; i < daysCount; i++) {
            const d = new Date(year, month - 1, day + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            dates.push(`${yyyy}-${mm}-${dd}`);
        }
        return dates;
    };

    const selectedDatesList = getDatesInRange(selectedDate, duration);
    const hasConflict = selectedDatesList.some(d => bookedDates.includes(d));

    const handleDateSelect = (dateStr) => {
        setSelectedDate(dateStr);
        const dates = getDatesInRange(dateStr, duration);
        setForm(prev => ({
            ...prev,
            date: dates.join(',')
        }));
    };

    const handleDurationChange = (e) => {
        const newDuration = Number(e.target.value);
        setDuration(newDuration);
        if (selectedDate) {
            const dates = getDatesInRange(selectedDate, newDuration);
            setForm(prev => ({
                ...prev,
                date: dates.join(',')
            }));
        }
    };

    const handleEvent = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { poojaType, date, address } = form;

        if (!poojaType || !date || !address) {
            toast.error('All fields are required');
            return;
        }

        if (hasConflict) {
            toast.error('One or more of the selected dates are already booked.');
            return;
        }

        try {
            const data = await fetch('http://localhost:5000/api/booking/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    panditId: id,
                    poojaType,
                    date,
                    address
                })
            });

            const res = await data.json();

            if (!data.ok) {
                toast.error(res.msg);
                return;
            }

            toast.success(res.msg);
            setForm({
                poojaType: '',
                date: '',
                address: ''
            });
            setSelectedDate('');
            setDuration(1);
            
            // Booking successful hone ke baad direct user ko transaction list tracks par bhejenge
            navigate('/my-bookings');

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    // Calendar generation
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const calendarCells = [];
    for (let i = 0; i < firstDay; i++) {
        calendarCells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        calendarCells.push(d);
    }

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5">
            <style>{`
                @media (min-width: 768px) {
                    .calendar-dropdown-side {
                        left: 105% !important;
                        top: 0 !important;
                        width: 350px !important;
                    }
                }
                @media (max-width: 767px) {
                    .calendar-dropdown-side {
                        left: 0 !important;
                        top: 100% !important;
                        width: 100% !important;
                        margin-top: 5px !important;
                    }
                }
            `}</style>
            <div className="container">
                <div className="row justify-content-center w-100 m-0">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 p-0">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative">
                            
                            {/* Top Decorative Brand Border Line */}
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}></div>

                            {/* Section Header */}
                            <div className="text-center mb-4 mt-2">
                                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">
                                    Schedule Pooja Ritual
                                </h3>
                                <p className="text-muted small">
                                    Fill in the dynamic specifications to lock your slot with the selected Pandit
                                </p>
                            </div>

                            {/* Booking Action Form Framework */}
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                
                                {/* Pooja Type Option Dropdown Selector (Type and Typo Free Industry Control) */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Select Pooja Type</label>
                                    <select
                                        name="poojaType"
                                        value={form.poojaType}
                                        onChange={handleEvent}
                                        className="form-select px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <option value="">-- Choose Pooja / Ritual --</option>
                                        <option value="Ganesh Pooja">Ganesh Pooja</option>
                                        <option value="Havan Pooja">Havan Pooja</option>
                                        <option value="Griha Pravesh">Griha Pravesh</option>
                                        <option value="Satyanarayan Katha">Satyanarayan Katha</option>
                                        <option value="Mata Pujan">Mata Pujan</option>
                                        <option value="Mundan Sanskar">Mundan Sanskar</option>
                                        <option value="Marriage Pooja">Marriage Pooja</option>
                                    </select>
                                </div>

                                {/* Auspicious Date Selection Picker */}
                                <div className="form-group-block text-start position-relative">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Select Auspicious Date</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedDate ? `${selectedDate} (${duration} ${duration === 1 ? 'Day' : 'Days'})` : ''}
                                        onClick={() => setShowCalendar(!showCalendar)}
                                        placeholder="Click to select dates from calendar"
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                                    />
                                    
                                    {showCalendar && (
                                        <div className="card border rounded-4 shadow-lg p-3 position-absolute bg-white calendar-dropdown-side" style={{ zIndex: 100, minWidth: '320px' }}>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <button type="button" className="btn btn-sm btn-outline-secondary border-0" onClick={handlePrevMonth}>&lt;</button>
                                                <span className="fw-bold text-dark font-traditional">{months[currentMonth]} {currentYear}</span>
                                                <button type="button" className="btn btn-sm btn-outline-secondary border-0" onClick={handleNextMonth}>&gt;</button>
                                            </div>

                                            {/* Days of week header */}
                                            <div className="d-grid gap-1 mb-2 text-center text-muted fw-bold" style={{ gridTemplateColumns: 'repeat(7, 1fr)', fontSize: '12px' }}>
                                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                                                    <div key={day}>{day}</div>
                                                ))}
                                            </div>

                                            {/* Days grid */}
                                            <div className="d-grid gap-1 text-center" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                                                {calendarCells.map((day, idx) => {
                                                    if (day === null) {
                                                        return <div key={`empty-${idx}`}></div>;
                                                    }
                                                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                    const cellDate = new Date(currentYear, currentMonth, day);
                                                    const isPast = cellDate < today;
                                                    const isBooked = bookedDates.includes(dateStr);
                                                    const isDisabled = isPast || isBooked;
                                                    const isSelected = selectedDate === dateStr;
                                                    const isInRange = selectedDatesList.includes(dateStr);

                                                    let cellClass = "d-flex align-items-center justify-content-center rounded-circle";
                                                    let cellStyle = {
                                                        width: '36px',
                                                        height: '36px',
                                                        fontSize: '13px',
                                                        cursor: 'pointer',
                                                        margin: 'auto',
                                                        transition: 'all 0.2s'
                                                    };

                                                    if (isDisabled) {
                                                        cellStyle.color = '#c0c0c0';
                                                        cellStyle.cursor = 'not-allowed';
                                                        if (isBooked) {
                                                            cellStyle.textDecoration = 'line-through';
                                                            cellStyle.backgroundColor = '#ffebe6';
                                                            cellStyle.color = '#e11d48';
                                                        }
                                                    } else if (isSelected) {
                                                        cellStyle.backgroundColor = 'var(--primary-orange)';
                                                        cellStyle.color = '#fff';
                                                        cellStyle.fontWeight = 'bold';
                                                    } else if (isInRange) {
                                                        cellStyle.backgroundColor = '#ffe8cc';
                                                        cellStyle.color = 'var(--primary-orange)';
                                                        cellStyle.fontWeight = '600';
                                                    }

                                                    return (
                                                        <div
                                                            key={`day-${day}`}
                                                            style={cellStyle}
                                                            className={cellClass}
                                                            onClick={() => !isDisabled && handleDateSelect(dateStr)}
                                                        >
                                                            {day}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            
                                            <div className="mt-3 pt-2 border-top d-flex justify-content-end">
                                                <button type="button" className="btn btn-sm btn-orange text-white border-0" onClick={() => setShowCalendar(false)}>Close Calendar</button>
                                            </div>
                                        </div>
                                    )}
                                    <small className="text-muted mt-1 ms-1 d-block" style={{ fontSize: '11px' }}>
                                        Note: Booking will be confirmed only if the Pandit is available on the selected date.
                                    </small>
                                </div>

                                {/* Duration Selector */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Duration (in Days)</label>
                                    <select
                                        name="duration"
                                        value={duration}
                                        onChange={handleDurationChange}
                                        className="form-select px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <option value={1}>1 Day (Standard Pooja)</option>
                                        <option value={2}>2 Days</option>
                                        <option value={3}>3 Days (Extended Rituals)</option>
                                        <option value={4}>4 Days</option>
                                        <option value={5}>5 Days (Maha Anushthan)</option>
                                        <option value={6}>6 Days</option>
                                        <option value={7}>7 Days (Vedic Saptah)</option>
                                    </select>
                                </div>

                                {hasConflict && (
                                    <div className="alert alert-danger py-2 px-3 small rounded-3 mb-0 text-start" style={{ fontSize: '12px' }}>
                                        ⚠️ One or more dates in this selection are already booked. Please choose a different start date or duration.
                                    </div>
                                )}

                                {/* Full Detail Target Venue Address Textarea */}
                                <div className="form-group-block text-start">
                                    <label className="small fw-semibold text-dark mb-1.5 ms-1">Full Venue Address</label>
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleEvent}
                                        className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                                        rows="3"
                                        style={{ resize: 'none' }}
                                    />
                                </div>

                                {/* Form Submit Button */}
                                <button 
                                    type="submit" 
                                    className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm text-uppercase tracking-wider mt-3 btn-auth-submit"
                                    style={{ fontSize: '13.5px', letterSpacing: '0.5px' }}
                                    disabled={hasConflict}
                                >
                                    Confirm Booking Request
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Booking;