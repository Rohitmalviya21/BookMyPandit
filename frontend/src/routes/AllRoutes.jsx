import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import WithoutFooterLayout from './WithoutFooterLayout';
import PanditLayout from '../Layouts/PanditLayout';
import ErrorBoundary from '../components/layout/ErrorBoundary';
import AdminProtectedRoute from './AdminProtectedRoute';
import ProtectedRoute from './ProtectedRoute';

// PERFORMANCE OPTIMIZATION:
// Lazy loading page routes using React.lazy() and Suspense.
// Why it is used: Loads component chunks only when their specific route is accessed.
// What problem it solves: Reduces the initial bundle size and accelerates initial load time.
// What output improvement we get: Faster time-to-interactive and less bandwidth usage for unused routes.
// Why modern companies use it: Essential for standard enterprise SPA build configurations to keep bundle sizes manageable.
const Home = React.lazy(() => import('../pages/user/Home'));
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const AddPandit = React.lazy(() => import('../pages/pandit/AddPandit'));
const PanditDetails = React.lazy(() => import('../pages/pandit/PanditDetails'));
const Booking = React.lazy(() => import('../pages/user/Booking'));
const MyBookings = React.lazy(() => import('../pages/user/MyBookings'));
const UserDashboard = React.lazy(() => import('../pages/user/UserDashboard'));
const PanditDashboard = React.lazy(() => import('../pages/pandit/PanditDashboard'));
const PanditBookings = React.lazy(() => import('../pages/pandit/PanditBookings'));
const UpdateProfile = React.lazy(() => import('../pages/pandit/UpadteProfile'));
const Email = React.lazy(() => import('../pages/auth/Email'));
const Recovery = React.lazy(() => import('../pages/auth/Recovery'));
const ResetPass = React.lazy(() => import('../pages/auth/ResetPass'));
const UserProfile = React.lazy(() => import('../pages/user/UserProfile'));
const AboutUs = React.lazy(() => import('../pages/user/AboutUs'));
const ContactUs = React.lazy(() => import('../pages/user/ContactUs'));
const AllPandits = React.lazy(() => import('../pages/user/AllPandits'));
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
const AdminLogin = React.lazy(() => import('../pages/auth/AdminLogin'));

// PERFORMANCE OPTIMIZATION:
// Loading fallback component to indicate progress when chunk is being loaded.
const LoadingFallback = () => (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light-cream">
        <div className="spinner-border text-primary-orange" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

const AllRoutes = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* ==========================================================================
                           1. PUBLIC / AUTH PAGES (Footer strictly hidden for focus conversions)
                           ========================================================================== */}
                    <Route path='/login' element={<WithoutFooterLayout><Login /></WithoutFooterLayout>} />
                    <Route path='/register' element={<WithoutFooterLayout><Register /></WithoutFooterLayout>} />

                    <Route path='/admin/login' element={<WithoutFooterLayout><AdminLogin /></WithoutFooterLayout>} />

                    <Route path='/forgot-password' element={<WithoutFooterLayout><Email /></WithoutFooterLayout>} />
                    <Route path='/recovery' element={<WithoutFooterLayout><Recovery /></WithoutFooterLayout>} />
                    <Route path='/reset-password' element={<WithoutFooterLayout><ResetPass /></WithoutFooterLayout>} />

                    <Route path='/my-profile' element={<ProtectedRoute><WithoutFooterLayout><UserProfile/></WithoutFooterLayout></ProtectedRoute>}/>

                    <Route path='/about' element = {<Layout><AboutUs/></Layout>}/>
                    <Route path='/contact' element={<Layout><ContactUs/></Layout>}/>
                    <Route path='/pandits' element={<Layout><AllPandits /></Layout>} />


                    {/* ==========================================================================
                           2. USER & CUSTOMER PAGES (Full layout with custom Header & Footer enabled)
                           ========================================================================== */}
                    <Route path='/' element={<Layout><Home /></Layout>} />
                    <Route path='/addPandit' element={<ProtectedRoute><Layout><AddPandit /></Layout></ProtectedRoute>} />
                    <Route path='/pandit/:id' element={<ProtectedRoute><Layout><PanditDetails /></Layout></ProtectedRoute>} />
                    <Route path='/booking/:id' element={<ProtectedRoute><Layout><Booking /></Layout></ProtectedRoute>} />
                    <Route path='/my-bookings' element={<ProtectedRoute><Layout><MyBookings /></Layout></ProtectedRoute>} />
                    <Route path='/dashboard' element={<ProtectedRoute><Layout><UserDashboard /></Layout></ProtectedRoute>} />
                    <Route path='/admin' element={<AdminProtectedRoute><WithoutFooterLayout><AdminDashboard /></WithoutFooterLayout></AdminProtectedRoute>} />

                    {/* ==========================================================================
                           3. PANDIT PRIVATE MANAGEMENT SYSTEM (Nested Dashboard Engine - Clean Base Layout)
                           ========================================================================== */}
                    <Route path='/pandit-dashboard' element={ <PanditLayout />}>
                        <Route index element={ <ProtectedRoute><PanditDashboard /></ProtectedRoute> } />
                        <Route path='requests' element={<ProtectedRoute><PanditBookings /></ProtectedRoute>} />
                        <Route path='update-profile' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
                    </Route>

                </Routes>
            </Suspense>
        </ErrorBoundary>

    );
};

export default AllRoutes;