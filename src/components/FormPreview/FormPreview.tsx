import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Paper,
  Chip,
  Snackbar,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { Preview, Build, ArrowBack, CheckCircle, List } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { setPreviewValue, setPreviewErrors, clearCurrentForm, loadSavedForms, loadFormForPreview } from '../../store/formBuilderSlice';
import { validateForm } from '../../utils/validation';
import { calculateDerivedValue } from '../../utils/derivedFields';
import { loadFormsFromStorage } from '../../utils/localStorage';
import FormRenderer from './FormRenderer';

const FormPreview: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentForm, previewValues, previewErrors, savedForms } = useSelector((state: RootState) => state.formBuilder);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    // Load saved forms when component mounts
    const forms = loadFormsFromStorage();
    dispatch(loadSavedForms(forms));
  }, [dispatch]);

  useEffect(() => {
    // Update derived fields when dependencies change
    currentForm.fields.forEach(field => {
      if (field.isDerived) {
        const derivedValue = calculateDerivedValue(field, previewValues);
        dispatch(setPreviewValue({ fieldId: field.id, value: derivedValue }));
      }
    });
  }, [currentForm.fields, previewValues, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(setPreviewValue({ fieldId, value }));
    
    // Validate the form
    const errors = validateForm(currentForm.fields, { ...previewValues, [fieldId]: value });
    dispatch(setPreviewErrors(errors));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const errors = validateForm(currentForm.fields, previewValues);
    dispatch(setPreviewErrors(errors));
    
    if (Object.keys(errors).length === 0) {
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success state
      setShowSuccess(true);
      
      // Clear all form values after successful submission
      currentForm.fields.forEach(field => {
        dispatch(setPreviewValue({ fieldId: field.id, value: field.type === 'checkbox' ? false : field.type === 'number' ? 0 : '' }));
      });
      
      // Clear errors
      dispatch(setPreviewErrors({}));
      
      // Reset submitting state
      setIsSubmitting(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    dispatch(clearCurrentForm());
    navigate('/create');
  };

  const handleSelectForm = (formId: string) => {
    const form = savedForms.find(f => f.id === formId);
    if (form) {
      dispatch(loadFormForPreview(form));
    }
  };

  if (currentForm.fields.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Form Selector Section */}
        {savedForms.length > 0 && (
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
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              }
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <List sx={{ 
                mr: { xs: 1, sm: 2 }, 
                fontSize: { xs: 24, sm: 28 },
                color: '#8b5cf6',
                filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))'
              }} />
              <Typography 
                variant={isMobile ? "h6" : "h5"}
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Select a Form to Preview
              </Typography>
            </Box>

            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Choose a saved form</InputLabel>
              <Select
                value=""
                onChange={(e) => handleSelectForm(e.target.value as string)}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              >
                {savedForms.map((form) => (
                  <MenuItem key={form.id} value={form.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Typography noWrap sx={{ flex: 1, mr: 2 }}>{form.name}</Typography>
                      <Chip 
                        label={`${form.fields.length} fields`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )}

        {/* Empty State */}
        <Paper 
          elevation={0}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            p: { xs: 3, sm: 4, md: 6 },
            textAlign: 'center',
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
          <Preview sx={{ 
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
            {savedForms.length > 0 ? 'Select a Form Above' : 'No Form to Preview'}
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
            {savedForms.length > 0 
              ? 'Choose a saved form from the dropdown above to preview it, or create a new form in the Form Builder.'
              : 'You need to create a form first before you can preview it. Add some fields in the Form Builder, then come back here to see how your form will look to users.'
            }
          </Typography>
          
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
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
              Go to Form Builder
            </Button>
            {savedForms.length > 0 && (
              <Button 
                variant="outlined"
                onClick={() => navigate('/myforms')}
                size={isMobile ? "small" : "medium"}
                sx={{ borderWidth: '2px' }}
              >
                View All Forms
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Preview sx={{ 
                mr: { xs: 1, sm: 2 }, 
                fontSize: { xs: 24, sm: 28, md: 32 },
                color: '#10b981',
                filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
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
                Form Preview
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
              See how your form will appear to users
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }} flexWrap="wrap">
            <Chip 
              label={`${currentForm.fields.length} Fields`}
              color="success"
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
            {savedForms.length > 1 && (
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Switch</InputLabel>
                <Select
                  value={currentForm.name ? savedForms.find(f => f.name === currentForm.name)?.id || '' : ''}
                  onChange={(e) => handleSelectForm(e.target.value as string)}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  {savedForms.map((form) => (
                    <MenuItem key={form.id} value={form.id}>
                      <Typography noWrap sx={{ maxWidth: 150 }}>
                        {form.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Form Preview */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
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
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box display="flex" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mr: 2
              }}
            >
              {currentForm.name || 'Untitled Form'}
            </Typography>
            {!currentForm.name && (
              <Chip 
                label="Unsaved Form"
                size="small"
                color="warning"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
          
          <Box component="form" noValidate>
            {currentForm.fields
              .slice()
              .sort((a, b) => b.order - a.order)
              .map((field) => (
                <FormRenderer
                  key={field.id}
                  field={field}
                  value={previewValues[field.id]}
                  errors={previewErrors[field.id] || []}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              ))}
          </Box>

          {Object.keys(previewErrors).length > 0 && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3,
                borderRadius: 4,
                '& .MuiAlert-icon': {
                  fontSize: 24,
                }
              }}
            >
              Please fix the errors above before submitting.
            </Alert>
          )}

          <Box display="flex" gap={2} mt={4} flexWrap="wrap">
            <Button 
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/create')}
              size={isMobile ? "small" : "medium"}
              sx={{ borderWidth: '2px' }}
            >
              {isMobile ? "Back" : "Back to Builder"}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : (isMobile ? 'Submit' : 'Submit Form')}
            </Button>
          </Box>
        </CardContent>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          icon={<CheckCircle />}
          sx={{ 
            borderRadius: 4,
            fontWeight: 500,
            '& .MuiAlert-icon': {
              fontSize: 24,
            }
          }}
        >
          Form submitted successfully! The form has been reset.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormPreview;