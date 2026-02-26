import { Card, CardContent, Grid, Typography, Box, Chip } from '@mui/material'
import { FitnessCenter, Timer, LocalFireDepartment } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { getActivities } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const activityEmojis = {
    RUNNING: '🏃',
    WALKING: '🚶',
    CYCLING: '🚴',
    SWIMMING: '🏊',
    YOGA: '🧘',
    WEIGHT_TRAINING: '🏋️',
    HIKING: '🥾',
    CARDIO: '❤️',
    STRETCHING: '🤸',
    PILATES: '💪',
    DANCE: '💃',
    MARTIAL_ARTS: '🥋',
    SPORTS: '⚽',
    ROWING: '🚣',
    JUMP_ROPE: '🪢',
    ELLIPTICAL: '🔄',
    OTHER: '📌',
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        📋 Your Activities
      </Typography>
      <Grid container spacing={2}>
        {activities.map((activity) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
            <Card
              onClick={() => navigate(`/activities/${activity.id}`)}
              sx={{
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(124,77,255,0.2)',
                  border: '1px solid rgba(124,77,255,0.3)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={activity.type}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #7c4dff, #448aff)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                  <Typography sx={{ fontSize: '1.5rem' }}>
                    {activityEmojis[activity.type] || '🏋️'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Timer sx={{ fontSize: 18, color: '#00e5ff' }} />
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    {activity.duration} minutes
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalFireDepartment sx={{ fontSize: 18, color: '#ff5252' }} />
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    {activity.caloriesBurned} calories
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ActivityList