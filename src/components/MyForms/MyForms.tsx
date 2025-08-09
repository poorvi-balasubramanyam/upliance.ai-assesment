import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Paper,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Preview, Delete, Build, FolderOpen, AutoAwesome, Edit } from '@mui/icons-material';
import { RootState } from '../../store';
import { loadSavedForms, loadFormForPreview, loadFormForEdit } from '../../store/formBuilderSlice';
import { loadFormsFromStorage, saveFormsToStorage } from '../../utils/localStorage';
import { useNavigate } from 'react-router-dom';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { savedForms } = useSelector((state: RootState) => state.formBuilder);

  useEffect(() => {
    const forms = loadFormsFromStorage();
    dispatch(loadSavedForms(forms));
  }, [dispatch]);

  const handlePreviewForm = (formId: string) => {
    const form = savedForms.find(f => f.id === formId);
    if (form) {
      dispatch(loadFormForPreview(form));
      navigate('/preview');
    }
  };

  const handleEditForm = (formId: string) => {
    const form = savedForms.find(f => f.id === formId);
    if (form) {
      dispatch(loadFormForEdit(form));
      navigate('/create');
    }
  };

  const handleDeleteForm = (formId: string) => {
    const updatedForms = savedForms.filter(f => f.id !== formId);
    dispatch(loadSavedForms(updatedForms));
    saveFormsToStorage(updatedForms);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
        <Paper 
          elevation={0}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            p: { xs: 3, sm: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            }
          }}
        >
          <FolderOpen sx={{ 
            fontSize: { xs: 48, sm: 64 }, 
            color: '#6366f1',
            mb: 3,
            filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))'
          }} />
          
          <Typography 
            variant={isMobile ? "h5" : "h4"}
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            No Saved Forms
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              mb: 4,
              maxWidth: { xs: 400, sm: 500 },
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            You haven't saved any forms yet. Create and save a form in the Form Builder to see it here.
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<Build />}
            onClick={() => navigate('/create')}
            size={isMobile ? "small" : "medium"}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              }
            }}
          >
            Create Your First Form
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header Section */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 8,
          p: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AutoAwesome sx={{ 
                mr: { xs: 1, sm: 2 }, 
                fontSize: { xs: 24, sm: 28, md: 32 },
                color: '#ec4899',
                filter: 'drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3))'
              }} />
              <Typography 
                variant={isMobile ? "h4" : "h3"}
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                My Forms
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748b',
                ml: { xs: 3, sm: 6 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Manage and preview your saved forms
            </Typography>
          </Box>
          
          <Chip 
            label={`${savedForms.length} Form${savedForms.length !== 1 ? 's' : ''}`}
            color="secondary"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              fontWeight: 600,
              borderWidth: '2px',
              '& .MuiChip-label': {
                px: { xs: 1, sm: 2 },
              }
            }}
          />
        </Box>
      </Paper>

      {/* Forms Grid */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {savedForms.map((form) => (
          <Grid item xs={12} sm={6} lg={4} key={form.id}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 8,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant={isMobile ? "h6" : "h6"}
                  gutterBottom 
                  noWrap
                  sx={{ 
                    fontWeight: 600,
                    color: '#1e293b',
                    mb: 2
                  }}
                >
                  {form.name}
                </Typography>
                
                <Typography 
                  color="textSecondary" 
                  variant="body2" 
                  gutterBottom
                  sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Created: {formatDate(form.createdAt)}
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  <Chip
                    label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  />
                  {form.fields.some(f => f.isDerived) && (
                    <Chip
                      label="Has derived fields"
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  {form.fields.some(f => f.required) && (
                    <Chip
                      label="Has required fields"
                      size="small"
                      color="warning"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Box>

                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    opacity: 0.8
                  }}
                >
                  Field types: {Array.from(new Set(form.fields.map(f => f.type))).join(', ')}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<Preview />}
                  onClick={() => handlePreviewForm(form.id)}
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: 4
                  }}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEditForm(form.id)}
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: 4
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteForm(form.id)}
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: 4
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Help Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          '& .MuiAlert-icon': {
            fontSize: 24,
          }
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          <strong>Tip:</strong> Click "Preview" on any form to see how it will appear to users. 
          You can also go to the Form Builder to create new forms or edit existing ones.
        </Typography>
      </Alert>
    </Box>
  );
};

export default MyForms;