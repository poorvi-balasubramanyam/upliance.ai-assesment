import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Delete, Add, DragIndicator } from '@mui/icons-material';
import { FormField, ValidationRule, SelectOption, DerivedField } from '../../types/form';

interface FieldEditorProps {
  field: FormField;
  availableFields: FormField[];
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, availableFields, onUpdate, onDelete }) => {
  const [showValidation, setShowValidation] = useState(false);
  const [showDerived, setShowDerived] = useState(field.isDerived || false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const updateField = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates });
  };

  const addValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required',
    };
    updateField({
      validationRules: [...field.validationRules, newRule]
    });
  };

  const updateValidationRule = (index: number, rule: ValidationRule) => {
    const rules = [...field.validationRules];
    rules[index] = rule;
    updateField({ validationRules: rules });
  };

  const removeValidationRule = (index: number) => {
    const rules = field.validationRules.filter((_, i) => i !== index);
    updateField({ validationRules: rules });
  };

  const addOption = () => {
    const options = field.options || [];
    const newOption: SelectOption = {
      label: `Option ${options.length + 1}`,
      value: `option${options.length + 1}`
    };
    updateField({ options: [...options, newOption] });
  };

  const updateOption = (index: number, option: SelectOption) => {
    const options = [...(field.options || [])];
    options[index] = option;
    updateField({ options });
  };

  const removeOption = (index: number) => {
    const options = (field.options || []).filter((_, i) => i !== index);
    updateField({ options });
  };

  const toggleDerived = () => {
    const isDerived = !showDerived;
    setShowDerived(isDerived);
    updateField({
      isDerived,
      derivedConfig: isDerived ? {
        parentFields: [],
        formula: '',
        formulaType: 'sum'
      } : undefined
    });
  };

  const updateDerivedConfig = (updates: Partial<DerivedField>) => {
    updateField({
      derivedConfig: { ...field.derivedConfig!, ...updates }
    });
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 6,
        mb: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1}>
          <Box display="flex" alignItems="center">
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: 6,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              mr: { xs: 1, sm: 2 },
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}>
              <DragIndicator sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </Box>
            <Box>
              <Typography 
                variant={isMobile ? "h6" : "h6"}
                sx={{ 
                  fontWeight: 600,
                  color: '#1e293b',
                  mb: 0.5
                }}
              >
                {field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field
              </Typography>
              <Chip 
                label={field.type}
                size="small"
                sx={{ 
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  '& .MuiChip-label': {
                    px: 1.5,
                  }
                }}
              />
            </Box>
          </Box>
          <IconButton 
            onClick={() => onDelete(field.id)}
            color="error"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              background: 'rgba(239, 68, 68, 0.1)',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.2)',
                transform: 'scale(1.1)',
              }
            }}
          >
            <Delete />
          </IconButton>
        </Box>

        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Field Label"
              value={field.label}
              onChange={(e) => updateField({ label: e.target.value })}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" height="100%" flexWrap="wrap" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={field.required}
                    onChange={(e) => updateField({ required: e.target.checked })}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label="Required"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showDerived}
                    onChange={toggleDerived}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label="Derived Field"
              />
            </Box>
          </Grid>

          {!showDerived && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Default Value"
                value={field.defaultValue}
                onChange={(e) => updateField({ defaultValue: e.target.value })}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
          )}

          {showDerived && field.derivedConfig && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Derived Field Configuration
              </Typography>
              <Box mb={2}>
                <FormControl fullWidth margin="normal" size={isMobile ? "small" : "medium"}>
                  <InputLabel>Formula Type</InputLabel>
                  <Select
                    value={field.derivedConfig.formulaType}
                    onChange={(e) => updateDerivedConfig({ formulaType: e.target.value as any })}
                  >
                    <MenuItem value="age">Calculate Age from Date</MenuItem>
                    <MenuItem value="sum">Sum of Numbers</MenuItem>
                    <MenuItem value="concat">Concatenate Text</MenuItem>
                    <MenuItem value="custom">Custom Formula</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" size={isMobile ? "small" : "medium"}>
                  <InputLabel>Parent Fields</InputLabel>
                  <Select
                    multiple
                    value={field.derivedConfig.parentFields}
                    onChange={(e) => updateDerivedConfig({ parentFields: e.target.value as string[] })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={availableFields.find(f => f.id === value)?.label || value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {availableFields.filter(f => f.id !== field.id && !f.isDerived).map((f) => (
                      <MenuItem key={f.id} value={f.id}>
                        {f.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {field.derivedConfig.formulaType === 'custom' && (
                  <TextField
                    fullWidth
                    label="Custom Formula"
                    value={field.derivedConfig.formula}
                    onChange={(e) => updateDerivedConfig({ formula: e.target.value })}
                    helperText="Use field IDs in your formula (e.g., field_123 + field_456)"
                    margin="normal"
                    size={isMobile ? "small" : "medium"}
                  />
                )}
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Button
            onClick={() => setShowValidation(!showValidation)}
            size={isMobile ? "small" : "medium"}
            sx={{ mb: 2 }}
          >
            {showValidation ? 'Hide' : 'Show'} Validation Rules
          </Button>

          {showValidation && (
            <Box>
              {field.validationRules.map((rule, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 1, p: { xs: 1, sm: 2 } }}>
                  <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Rule Type</InputLabel>
                        <Select
                          value={rule.type}
                          onChange={(e) => updateValidationRule(index, { ...rule, type: e.target.value as any })}
                        >
                          <MenuItem value="required">Required</MenuItem>
                          <MenuItem value="minLength">Min Length</MenuItem>
                          <MenuItem value="maxLength">Max Length</MenuItem>
                          <MenuItem value="email">Email Format</MenuItem>
                          <MenuItem value="password">Password</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {['minLength', 'maxLength'].includes(rule.type) && (
                      <Grid item xs={12} sm={2}>
                        <TextField
                          size="small"
                          type="number"
                          label="Value"
                          value={rule.value || ''}
                          onChange={(e) => updateValidationRule(index, { ...rule, value: parseInt(e.target.value) })}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Error Message"
                        value={rule.message}
                        onChange={(e) => updateValidationRule(index, { ...rule, message: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton onClick={() => removeValidationRule(index)} color="error" size="small">
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Card>
              ))}
              <Button
                startIcon={<Add />}
                onClick={addValidationRule}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{ mt: 1 }}
              >
                Add Validation Rule
              </Button>
            </Box>
          )}
        </Box>

        {['select', 'radio', 'checkbox'].includes(field.type) && (
          <Box mt={showValidation ? 2 : 0}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Options
            </Typography>
            {field.options?.map((option, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1} flexWrap="wrap" gap={1}>
                <TextField
                  size="small"
                  label="Label"
                  value={option.label}
                  onChange={(e) => updateOption(index, { ...option, label: e.target.value })}
                />
                <TextField
                  size="small"
                  label="Value"
                  value={option.value}
                  onChange={(e) => updateOption(index, { ...option, value: e.target.value })}
                />
                <IconButton onClick={() => removeOption(index)} color="error" size="small">
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={addOption}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ mt: 1 }}
            >
              Add Option
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FieldEditor;