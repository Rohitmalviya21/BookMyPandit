import React, { useEffect, useState } from 'react';

const SearchBar = ({
    search,
    setSearch,
    searchPandits
}) => {
    const placeholders = [
        'Search Ganesh Pooja...',
        'Search Satyanarayan Katha...',
        'Search Akhand Ramayan...',
        'Search Griha Pravesh...',
        'Search Havan Pooja...'
    ];

    const [placeholder, setPlaceholder] = useState(placeholders[0]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % placeholders.length;
            setPlaceholder(placeholders[index]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="search-bar-container p-1 bg-white rounded-pill shadow-sm border d-flex align-items-center">
            {/* Search Glass Icon on Left */}
            <div className="ps-3 pe-2 text-muted d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </div>

            {/* Input Field */}
            <input
                type="text"
                placeholder={placeholder}
                 value={search}
                 onChange={(e) => {

    console.log(e.target.value);

    setSearch(e.target.value);
}
    }
                className="form-control border-0 shadow-none bg-transparent py-2.5 px-2 text-dark fs-6"
                style={{ fontSize: '15px' }}
            />

            {/* Round Search Button on Right */}
            <button
          
                className="btn btn-orange rounded-circle p-0 d-flex align-items-center justify-content-center custom-search-action-btn"
                type="button"
                style={{ width: '45px', height: '45px', minWidth: '45px' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-search text-white" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </button>
        </div>
    );
};

export default SearchBar;