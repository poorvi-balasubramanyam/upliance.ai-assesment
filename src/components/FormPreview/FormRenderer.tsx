import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormLabel,
  FormGroup,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { FormField, FormValues, FormErrors } from '../../types/form';

interface FormRendererProps {
  field: FormField;
  value: any;
  errors: string[];
  onChange: (value: any) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ field, value, errors, onChange }) => {
  const hasError = errors.length > 0;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            error={hasError}
            helperText={hasError ? errors[0] : ''}
            disabled={field.isDerived}
            sx={{ mb: 2 }}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            required={field.required}
            error={hasError}
            helperText={hasError ? errors[0] : ''}
            disabled={field.isDerived}
            sx={{ mb: 2 }}
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            error={hasError}
            helperText={hasError ? errors[0] : ''}
            disabled={field.isDerived}
            sx={{ mb: 2 }}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={hasError} sx={{ mb: 2 }}>
            <InputLabel required={field.required}>{field.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              label={field.label}
              disabled={field.isDerived}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors[0]}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={hasError} sx={{ mb: 2 }}>
            <FormLabel component="legend" required={field.required}>
              {field.label}
            </FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={field.isDerived} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {hasError && (
              <Typography variant="caption" color="error">
                {errors[0]}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        // Handle checkbox with options (multiple selection)
        if (field.options && field.options.length > 0) {
          return (
            <FormControl component="fieldset" error={hasError} sx={{ mb: 2 }}>
              <FormLabel component="legend" required={field.required}>
                {field.label}
              </FormLabel>
              <FormGroup>
                {field.options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={Array.isArray(value) ? value.includes(option.value) : false}
                        onChange={(e) => {
                          const currentValues = Array.isArray(value) ? [...value] : [];
                          if (e.target.checked) {
                            onChange([...currentValues, option.value]);
                          } else {
                            onChange(currentValues.filter(v => v !== option.value));
                          }
                        }}
                        disabled={field.isDerived}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>
              {hasError && (
                <Typography variant="caption" color="error">
                  {errors[0]}
                </Typography>
              )}
            </FormControl>
          );
        } else {
          // Handle single checkbox (boolean)
          return (
            <FormControl component="fieldset" error={hasError} sx={{ mb: 2 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(value)}
                      onChange={(e) => onChange(e.target.checked)}
                      disabled={field.isDerived}
                    />
                  }
                  label={field.label}
                />
              </FormGroup>
              {hasError && (
                <Typography variant="caption" color="error">
                  {errors[0]}
                </Typography>
              )}
            </FormControl>
          );
        }

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            error={hasError}
            helperText={hasError ? errors[0] : ''}
            disabled={field.isDerived}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {field.isDerived && (
        <Alert severity="info" sx={{ mb: 1 }}>
          This is a derived field - its value is calculated automatically.
        </Alert>
      )}
      {renderField()}
    </Box>
  );
};

export default FormRenderer;