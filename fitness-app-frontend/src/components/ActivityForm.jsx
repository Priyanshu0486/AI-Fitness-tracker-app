import React, { useState } from 'react'
import Box from '@mui/material/Box';
import {
  Button, FormControl, InputLabel, MenuItem, Select, TextField,
  Typography, Paper
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { addActivity } from '../services/api';

const darkInput = {
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(124,77,255,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#7c4dff' },
  },
  '& .MuiInputLabel-root': { color: '#999' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7c4dff' },
  '& .MuiSelect-icon': { color: '#999' },
};

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addActivity(activity);
      onActivityAdded();
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Paper sx={{
      p: 4,
      mb: 4,
      background: 'linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%)',
      borderRadius: 3,
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        🏋️ Log New Activity
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2, ...darkInput }}>
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={activity.type}
            label="Activity Type"
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: '#2a2a40',
                  color: '#e0e0e0',
                  '& .MuiMenuItem-root:hover': { background: 'rgba(124,77,255,0.15)' },
                  '& .Mui-selected': { background: 'rgba(124,77,255,0.25) !important' },
                }
              }
            }}
          >
            <MenuItem value="RUNNING">🏃 Running</MenuItem>
            <MenuItem value="WALKING">🚶 Walking</MenuItem>
            <MenuItem value="CYCLING">🚴 Cycling</MenuItem>
            <MenuItem value="SWIMMING">🏊 Swimming</MenuItem>
            <MenuItem value="YOGA">🧘 Yoga</MenuItem>
            <MenuItem value="WEIGHT_TRAINING">🏋️ Weight Training</MenuItem>
            <MenuItem value="HIKING">🥾 Hiking</MenuItem>
            <MenuItem value="CARDIO">❤️ Cardio</MenuItem>
            <MenuItem value="STRETCHING">🤸 Stretching</MenuItem>
            <MenuItem value="PILATES">💪 Pilates</MenuItem>
            <MenuItem value="DANCE">💃 Dance</MenuItem>
            <MenuItem value="MARTIAL_ARTS">🥋 Martial Arts</MenuItem>
            <MenuItem value="SPORTS">⚽ Sports</MenuItem>
            <MenuItem value="ROWING">🚣 Rowing</MenuItem>
            <MenuItem value="JUMP_ROPE">🪢 Jump Rope</MenuItem>
            <MenuItem value="ELLIPTICAL">🔄 Elliptical</MenuItem>
            <MenuItem value="OTHER">📌 Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Duration (minutes)"
          type="number"
          fullWidth
          sx={{ mb: 2, ...darkInput }}
          value={activity.duration}
          onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        />
        <TextField
          label="Calories Burned"
          type="number"
          fullWidth
          sx={{ mb: 3, ...darkInput }}
          value={activity.caloriesBurned}
          onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<Add />}
          sx={{
            background: 'linear-gradient(135deg, #7c4dff, #448aff)',
            py: 1.5,
            fontSize: '0.95rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #651fff, #2979ff)',
              boxShadow: '0 6px 20px rgba(124, 77, 255, 0.5)',
            }
          }}
        >
          Add Activity
        </Button>
      </Box>
    </Paper>
  )
}

export default ActivityForm