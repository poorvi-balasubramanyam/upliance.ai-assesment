import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Save, AutoAwesome, Add, ClearAll } from '@mui/icons-material';
import { RootState } from '../../store';
import { addField, updateField, removeField, saveForm, loadSavedForms, setFormName, clearCurrentForm, updateForm } from '../../store/formBuilderSlice';
import { saveFormsToStorage, loadFormsFromStorage } from '../../utils/localStorage';
import FieldTypeSelector from './FieldTypeSelector';
import FieldEditor from './FieldEditor';
import { FormField } from '../../types/form';

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentForm, savedForms, editingFormId } = useSelector((state: RootState) => state.formBuilder);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [formName, setFormName] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);

  useEffect(() => {
    const forms = loadFormsFromStorage();
    dispatch(loadSavedForms(forms));
  }, [dispatch]);

  useEffect(() => {
    if (savedForms.length > 0) {
      saveFormsToStorage(savedForms);
    }
  }, [savedForms]);

  const handleAddField = (field: FormField) => {
    dispatch(addField(field));
  };

  const handleUpdateField = (field: FormField) => {
    dispatch(updateField(field));
  };

  const handleRemoveField = (fieldId: string) => {
    dispatch(removeField(fieldId));
  };

  const handleFormNameChange = (name: string) => {
    dispatch(setFormName(name));
  };

  const handleClearAllFields = () => {
    if (window.confirm('Are you sure you want to clear all fields and form data? This action cannot be undone.')) {
      dispatch(clearCurrentForm());
    }
  };

  const handleSaveForm = () => {
    if (currentForm.fields.length === 0) {
      return;
    }
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (formName.trim()) {
      if (editingFormId) {
        // Update existing form
        dispatch(updateForm(formName.trim()));
      } else {
        // Create new form
        dispatch(saveForm(formName.trim()));
      }
      setSaveDialogOpen(false);
      setFormName('');
      setShowSuccess(true);
    }
  };

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
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AutoAwesome sx={{ 
                mr: { xs: 1, sm: 2 }, 
                fontSize: { xs: 24, sm: 28, md: 32 },
                color: '#6366f1',
                filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))'
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
                Form Builder
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
              Create beautiful, dynamic forms with our intuitive builder
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }} flexWrap="wrap">
            <Chip 
              label={`${currentForm.fields.length} Fields`}
              color="primary"
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
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveForm}
              disabled={currentForm.fields.length === 0}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                }
              }}
            >
              {editingFormId 
                ? (isMobile ? "Update" : "Update Form")
                : (isMobile ? "Save" : "Save Form")
              }
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Form Name Section */}
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          }
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"}
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Form Name
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Give your form a descriptive name that will appear to users
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          label="Form Name"
          placeholder="e.g., Student Registration Form"
          value={currentForm.name}
          onChange={(e) => handleFormNameChange(e.target.value)}
          size={isMobile ? "small" : "medium"}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              background: 'rgba(255, 255, 255, 0.7)',
            }
          }}
        />
      </Paper>

      {/* Field Type Selector */}
      <Box mb={{ xs: 2, sm: 3, md: 4 }}>
        <FieldTypeSelector onAddField={handleAddField} existingFields={currentForm.fields} />
      </Box>

      {/* Form Fields Section */}
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          }
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center">
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
                Form Fields
              </Typography>
              <Chip 
                label={currentForm.fields.length}
                color="success"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            
            {currentForm.fields.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearAll />}
                onClick={handleClearAllFields}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderWidth: '2px',
                  fontWeight: 500,
                  '&:hover': {
                    borderWidth: '2px',
                    background: 'rgba(239, 68, 68, 0.04)',
                  }
                }}
              >
                {isMobile ? "Clear All" : "Clear All Fields"}
              </Button>
            )}
          </Box>
          
          {currentForm.fields.length === 0 ? (
            <Box 
              textAlign="center" 
              py={{ xs: 6, sm: 8 }}
              sx={{ 
                border: '2px dashed',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                borderRadius: 6,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  zIndex: 0,
                }
              }}
            >
              <Add sx={{ 
                fontSize: { xs: 36, sm: 48 }, 
                color: '#6366f1',
                mb: 2,
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))'
              }} />
              <Typography 
                variant={isMobile ? "h6" : "h5"}
                sx={{ 
                  color: '#1e293b',
                  fontWeight: 600,
                  mb: 1,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                No fields added yet
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#64748b',
                  maxWidth: { xs: 300, sm: 400 },
                  mx: 'auto',
                  position: 'relative',
                  zIndex: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Use the field types above to start building your form. Each field can be customized with validation rules and settings.
              </Typography>
            </Box>
          ) : (
            <Box>
              {currentForm.fields
                .slice().sort((a, b) => a.order - b.order)
                .map((field, index) => (
                  <Box key={field.id} sx={{ mb: index < currentForm.fields.length - 1 ? 3 : 0 }}>
                    <FieldEditor
                      field={field}
                      availableFields={currentForm.fields}
                      onUpdate={handleUpdateField}
                      onDelete={handleRemoveField}
                    />
                    {index < currentForm.fields.length - 1 && (
                      <Divider sx={{ my: 2, opacity: 0.3 }} />
                    )}
                  </Box>
                ))}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Save Dialog */}
      <Dialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
                <DialogTitle sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          {editingFormId ? "Update Form" : "Save Form"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setSaveDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 4 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSave} 
            variant="contained"
            sx={{ 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              }
            }}
                      >
              {editingFormId ? "Update" : "Save"}
            </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            borderRadius: 4,
            fontWeight: 500,
            '& .MuiAlert-icon': {
              fontSize: 24,
            }
          }}
        >
          {editingFormId ? "Form updated successfully!" : "Form saved successfully!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormBuilder;