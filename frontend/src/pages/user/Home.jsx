import React, { useEffect, useState, useCallback } from 'react';
import HeroSection from '../../components/home/HeroSection';
import PopularPoojas from '../../components/home/PopularPoojas';
import FeaturesSection from '../../components/home/FeaturesSection';
import OurPandits from '../../components/home/OurPandits';
import PanditCard from '../../components/home/PanditCard';

const Home = () => {
    const [pandits, setPandits] = useState([]);
    const [search, setSearch] = useState('');

    // PERFORMANCE OPTIMIZATION:
    // Applied useCallback to stabilize getAllPandits reference.
    // Why it is used: Keeps the function reference consistent across component renders.
    // What problem it solves: Prevents child components receiving it as prop from re-rendering unnecessarily.
    // What output improvement we get: Stable handler identity.
    // Why modern companies use it: Standard best practice to optimize child components dependencies.
    const getAllPandits = useCallback(async () => {
        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/pandit/all`);
            const res = await data.json();
            setPandits(res.pandits || []);
        } catch (error) {
            console.log("Error fetching all pandits:", error);
        }
    }, []);

    // PERFORMANCE OPTIMIZATION:
    // Applied useCallback to stabilize searchPandits reference.
    // Why it is used: Limits recalculation of the function callback unless the search query changes.
    // What problem it solves: Avoids recreating function on every keystroke render.
    // What output improvement we get: Stable search trigger.
    // Why modern companies use it: To avoid unnecessary allocation and child render cycles.
    const searchPandits = useCallback(async () => {
        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/pandit/search?search=${search}`);
            const res = await data.json();
            console.log("API RESPONSE =>", res);
            setPandits(res.pandits || []);
        } catch (error) {
            console.log("Error searching pandits:", error);
        }
    }, [search]);

    // Dynamic state listener triggers API switch dynamically based on value conditions
  useEffect(() => {

    const timer = setTimeout(() => {

        if (search.trim()) {
            searchPandits();
        } else {
            getAllPandits();
        }

    }, 500); // 500ms debounce

    return () => clearTimeout(timer);

}, [search, searchPandits, getAllPandits]);
    return (
        <main className="bg-white">
            
            {/* Search inputs state injection wrapper panel */}
           <HeroSection

    search={search}

    setSearch={setSearch}

    searchPandits={searchPandits}

/>
{
    search && (
        <section className="container py-4">

            <h4 className="mb-4">
                Search Results
            </h4>

            {
                pandits.length > 0 ? (

                    <div className="row g-4">

                        {pandits.map((pandit) => (

                            <div
                                className="col-lg-3 col-md-4 col-sm-6"
                                key={pandit._id}
                            >
                                <PanditCard pandit={pandit} />
                            </div>

                        ))}

                    </div>

                ) : (

                    <h5 className="text-danger">
                        No Pandit Found
                    </h5>

                )
            }

        </section>
    )
}

            {/* Slider/Grid directory component for trend poojas */}
            <PopularPoojas />

            {/* Solid accent banner highlights metric grids layout */}
            <FeaturesSection />

            {/* Limited Top 8 items profile cards showcase segment */}
            <OurPandits 
                pandits={pandits} 
            />

        </main>
    );
};

export default Home;