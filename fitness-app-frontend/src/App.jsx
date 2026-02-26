import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Button, Typography, Box } from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/authSlice';
import ActivityDetails from './components/ActivityDetails';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import { FitnessCenter, Logout } from '@mui/icons-material';

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext)
  const dispatch = useDispatch()

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({
        token, user: tokenData, userId: tokenData.sub
      }));
    }
  }, [tokenData, token, dispatch])

  const ActivityPage = () => {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
        <ActivityForm onActivityAdded={() => window.location.reload()} />
        <ActivityList />
      </Box>
    )
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
    }}>
      <Router>
        {!token ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            gap: 3,
          }}>
            <FitnessCenter sx={{ fontSize: 64, color: '#7c4dff' }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              AI Fitness Tracker
            </Typography>
            <Typography variant="body1" sx={{ color: '#999', mb: 2 }}>
              Track your workouts and get AI-powered recommendations
            </Typography>
            <Button
              variant='contained'
              onClick={() => logIn()}
              sx={{
                background: 'linear-gradient(135deg, #7c4dff, #448aff)',
                px: 5, py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(124, 77, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #651fff, #2979ff)',
                  boxShadow: '0 6px 25px rgba(124, 77, 255, 0.5)',
                }
              }}
            >
              Sign In to Get Started
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            {/* Top Nav */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: { xs: 2, md: 4 },
              py: 2,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FitnessCenter sx={{ color: '#7c4dff', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                  AI Fitness Tracker
                </Typography>
              </Box>
              <Button
                startIcon={<Logout />}
                onClick={() => logOut()}
                sx={{
                  color: '#999',
                  textTransform: 'none',
                  '&:hover': { color: '#ff5252', background: 'rgba(255,82,82,0.08)' }
                }}
              >
                Logout
              </Button>
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Routes>
                <Route path='/activities' element={<ActivityPage />} />
                <Route path='/activities/:id' element={<ActivityDetails />} />
                <Route path='/' element={token ? <Navigate to='/activities' replace /> : null} />
              </Routes>
            </Box>
          </Box>
        )}
      </Router>
    </Box>
  )
}

export default App
