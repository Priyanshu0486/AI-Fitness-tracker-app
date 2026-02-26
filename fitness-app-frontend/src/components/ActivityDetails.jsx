import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Chip, Divider, Button,
  CircularProgress, List, ListItem, ListItemIcon, ListItemText,
  Card, CardContent, Alert, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';
import {
  ArrowBack, FitnessCenter, Timer, LocalFireDepartment,
  CalendarToday, TrendingUp, Lightbulb, Shield, CheckCircle, Delete
} from '@mui/icons-material';
import { getActivityById, getActivityRecommendations, deleteActivity } from '../services/api';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const actRes = await getActivityById(id);
        setActivity(actRes.data);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
        setError('Failed to load activity details.');
      } finally {
        setLoading(false);
      }

      try {
        setRecLoading(true);
        const recRes = await getActivityRecommendations(id);
        setRecommendation(recRes.data);
      } catch (err) {
        console.error('No recommendations found:', err);
        setRecommendation(null);
      } finally {
        setRecLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const darkCard = {
    background: 'linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%)',
    color: '#e0e0e0',
    borderRadius: 3,
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    }
  };

  const sectionHeader = {
    fontWeight: 700,
    color: '#fff',
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#7c4dff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/activities')} sx={{ mt: 2 }}>
          Back to Activities
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: 1100,
      mx: 'auto',
      width: '100%',
    }}>
      {/* Top Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/activities')}
          sx={{
            color: '#b0b0b0',
            textTransform: 'none',
            fontSize: '0.95rem',
            '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.05)' }
          }}
        >
          Back to Activities
        </Button>
        <Button
          startIcon={<Delete />}
          onClick={() => setDeleteDialogOpen(true)}
          sx={{
            color: '#ff5252',
            textTransform: 'none',
            fontSize: '0.95rem',
            border: '1px solid rgba(255,82,82,0.3)',
            borderRadius: 2,
            px: 2,
            '&:hover': { background: 'rgba(255,82,82,0.1)', borderColor: '#ff5252' }
          }}
        >
          Delete Activity
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { background: '#2a2a40', color: '#e0e0e0', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Activity?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#999' }}>
            This will permanently delete this activity and cannot be undone. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#999', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setDeleting(true);
              try {
                await deleteActivity(id);
                navigate('/activities');
              } catch (err) {
                console.error('Failed to delete:', err);
                setError('Failed to delete activity.');
                setDeleteDialogOpen(false);
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting}
            sx={{
              color: '#fff',
              background: '#ff5252',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { background: '#ff1744' },
              '&:disabled': { background: '#993333', color: '#ccc' }
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activity Header */}
      <Paper sx={{
        ...darkCard,
        p: 4,
        mb: 3,
        background: 'linear-gradient(135deg, #1a1a40 0%, #2d1b69 50%, #1a1a40 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Chip
              label={activity?.type}
              sx={{
                background: 'linear-gradient(135deg, #7c4dff, #448aff)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                px: 1,
                mb: 1.5,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Activity Details
            </Typography>
          </Box>
          {activity?.createdAt && (
            <Chip
              icon={<CalendarToday sx={{ color: '#b0b0b0 !important', fontSize: 16 }} />}
              label={new Date(activity.createdAt).toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
              })}
              variant="outlined"
              sx={{ color: '#b0b0b0', borderColor: 'rgba(255,255,255,0.15)' }}
            />
          )}
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ ...darkCard, p: 3, textAlign: 'center' }}>
            <FitnessCenter sx={{ fontSize: 40, color: '#7c4dff', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
              Activity Type
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mt: 0.5 }}>
              {activity?.type}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ ...darkCard, p: 3, textAlign: 'center' }}>
            <Timer sx={{ fontSize: 40, color: '#00e5ff', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
              Duration
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mt: 0.5 }}>
              {activity?.duration} <span style={{ fontSize: '0.8rem', color: '#999' }}>min</span>
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ ...darkCard, p: 3, textAlign: 'center' }}>
            <LocalFireDepartment sx={{ fontSize: 40, color: '#ff5252', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
              Calories Burned
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mt: 0.5 }}>
              {activity?.caloriesBurned} <span style={{ fontSize: '0.8rem', color: '#999' }}>kcal</span>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Metrics */}
      {activity?.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
        <Paper sx={{ ...darkCard, p: 3, mb: 3 }}>
          <Typography variant="h6" sx={sectionHeader}>
            📊 Additional Metrics
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(activity.additionalMetrics).map(([key, value]) => (
              <Grid size={{ xs: 6, sm: 3 }} key={key}>
                <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.03)' }}>
                  <Typography variant="body2" sx={{ color: '#999', textTransform: 'capitalize', fontSize: '0.75rem' }}>
                    {key}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    {String(value)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* AI Recommendations Section */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 3 }} />
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        🤖 AI Recommendations
      </Typography>

      {recLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#7c4dff' }} />
        </Box>
      ) : !recommendation ? (
        <Paper sx={{ ...darkCard, p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#999', mb: 1 }}>
            Recommendations not available yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            AI recommendations are being generated. Please check back later.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Analysis */}
          {recommendation.recommendation && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ ...darkCard, p: 3 }}>
                <Typography variant="h6" sx={sectionHeader}>
                  <TrendingUp sx={{ color: '#7c4dff' }} /> Analysis
                </Typography>
                {recommendation.recommendation.split('\n').filter(line => line.trim()).map((paragraph, idx) => (
                  <Typography key={idx} variant="body1" sx={{ color: '#ccc', mb: 1.5, lineHeight: 1.7 }}>
                    {paragraph}
                  </Typography>
                ))}
              </Paper>
            </Grid>
          )}

          {/* Improvements */}
          {recommendation.improvement && recommendation.improvement.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ ...darkCard, p: 3, height: '100%' }}>
                <Typography variant="h6" sx={sectionHeader}>
                  <TrendingUp sx={{ color: '#00e676' }} /> Improvements
                </Typography>
                <List dense>
                  {recommendation.improvement.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle sx={{ color: '#00e676', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ sx: { color: '#ccc', fontSize: '0.9rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {/* Suggestions */}
          {recommendation.suggestions && recommendation.suggestions.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ ...darkCard, p: 3, height: '100%' }}>
                <Typography variant="h6" sx={sectionHeader}>
                  <Lightbulb sx={{ color: '#ffab00' }} /> Workout Suggestions
                </Typography>
                <List dense>
                  {recommendation.suggestions.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Lightbulb sx={{ color: '#ffab00', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ sx: { color: '#ccc', fontSize: '0.9rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {/* Safety */}
          {recommendation.safety && recommendation.safety.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ ...darkCard, p: 3 }}>
                <Typography variant="h6" sx={sectionHeader}>
                  <Shield sx={{ color: '#ff5252' }} /> Safety Guidelines
                </Typography>
                <List dense>
                  {recommendation.safety.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Shield sx={{ color: '#ff5252', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ sx: { color: '#ccc', fontSize: '0.9rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default ActivityDetails;