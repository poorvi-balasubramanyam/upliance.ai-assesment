import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TextFields,
  Numbers,
  Notes,
  ArrowDropDown,
  RadioButtonChecked,
  CheckBox,
  Event,
} from '@mui/icons-material';
import { FormField } from '../../types/form';

interface FieldTypeSelectorProps {
  onAddField: (field: FormField) => void;
  existingFields?: FormField[];
}

const fieldTypes = [
  { type: 'text' as const, label: 'Text', icon: TextFields, color: '#6366f1' },
  { type: 'number' as const, label: 'Number', icon: Numbers, color: '#ec4899' },
  { type: 'textarea' as const, label: 'Textarea', icon: Notes, color: '#f59e0b' },
  { type: 'select' as const, label: 'Select', icon: ArrowDropDown, color: '#10b981' },
  { type: 'radio' as const, label: 'Radio', icon: RadioButtonChecked, color: '#8b5cf6' },
  { type: 'checkbox' as const, label: 'Checkbox', icon: CheckBox, color: '#ef4444' },
  { type: 'date' as const, label: 'Date', icon: Event, color: '#06b6d4' },
];

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onAddField, existingFields = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const createField = (type: FormField['type']) => {
    // Calculate the minimum order to place new field at the top
    const minOrder = existingFields.length > 0 
      ? Math.min(...existingFields.map(field => field.order)) - 1
      : 0;

    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      defaultValue: type === 'checkbox' ? [] : type === 'number' ? 0 : '',
      validationRules: [],
      options: ['select', 'radio', 'checkbox'].includes(type) ? [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ] : undefined,
      order: minOrder,
    };
    onAddField(newField);
  };

  return (
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
        <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"}
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Add New Field
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              maxWidth: { xs: 400, sm: 500 },
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Choose from our collection of field types to build your perfect form
          </Typography>
        </Box>
        
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          {fieldTypes.map(({ type, label, icon: Icon, color }) => (
            <Grid item xs={6} sm={6} md={4} key={type}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => createField(type)}
                startIcon={
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                    color: color,
                    mr: { xs: 1, sm: 2 },
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${color}30 0%, ${color}20 100%)`,
                      transform: 'scale(1.05)',
                    }
                  }}>
                    <Icon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  </Box>
                }
                sx={{
                  height: { xs: 60, sm: 80 },
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  borderRadius: 6,
                  border: '2px solid',
                  borderColor: 'rgba(99, 102, 241, 0.1)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  color: '#1e293b',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${color}10 0%, transparent 100%)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                  },
                  '&:hover': {
                    borderColor: color,
                    background: 'rgba(255, 255, 255, 0.8)',
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${color}20`,
                    '&::before': {
                      opacity: 1,
                    },
                    '& .MuiButton-startIcon': {
                      transform: 'scale(1.1)',
                    }
                  },
                  '&:active': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default FieldTypeSelector;