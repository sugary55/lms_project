import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Divider, CircularProgress } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

// Components & Pages
import Navbar from './components/navbar';
import HeroSection from './components/herosection';
import Courses from './pages/Course';
import CourseDetails from './pages/CourseDetails';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';

// Library
import { supabase } from './library/supabaseClient';
import { syncUserWithMongoDb } from './library/syncDB';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check existing session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
      setLoading(false);
    };
    checkUser();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        setUser(session.user);
        await syncUserWithMongoDb(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { queryParams: { prompt: 'select_account' } }
    });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      <Navbar User={user} handleLogout={handleLogout} handleLogin={handleLogin} />

      <Routes>
        {/* --- HOMEPAGE --- */}
        <Route path='/' element={
          <>
            <HeroSection User={user} />
            <Container maxWidth="lg" sx={{ py: 8 }}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                {user ? (
                  <Typography variant="h4" fontWeight="800" color="primary">
                    Welcome back, {user.user_metadata?.full_name || user.email.split('@')[0]}!
                  </Typography>
                ) : (
                  <Typography variant="h4" fontWeight="800" color="text.primary">
                    Start Your Journey Today
                  </Typography>
                )}
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Explore our premium curriculum designed for academic excellence.
                </Typography>
              </Box>

              <Divider sx={{ mb: 8, opacity: 0.6 }} />
              
              <Courses />
            </Container>
          </>
        } />

        {/* --- ABOUT US --- */}
        <Route path="/about" element={<AboutUs />} />

        {/* --- ADMIN DASHBOARD --- */}
        <Route path='/admin' element={<AdminDashboard />} />

        {/* --- COURSE DETAILS (Protected) --- */}
        <Route path='/course/:id' element={
          user ? (
            <CourseDetails user={user} />
          ) : (
            <LoginRequiredView handleLogin={handleLogin} />
          )
        } />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

/**
 * A clean, dedicated view for non-authenticated users trying to access details
 */
const LoginRequiredView = ({ handleLogin }) => (
  <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
    <Box sx={{ 
      p: 6, 
      bgcolor: '#f8faff', 
      borderRadius: 8, 
      border: '1px dashed', 
      borderColor: 'primary.light' 
    }}>
      <LockOutlined sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
      <Typography variant="h4" fontWeight="900" gutterBottom>
        Login Required
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Please sign in to view the full course syllabus, lesson materials, and enrollment options.
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        onClick={handleLogin}
        sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 'bold' }}
      >
        Sign In with Google
      </Button>
    </Box>
  </Container>
);

export default App;