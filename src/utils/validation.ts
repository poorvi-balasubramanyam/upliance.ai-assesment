import { ValidationRule, FormField, FormValues, FormErrors } from '../types/form';

export const validateField = (field: FormField, value: any): string[] => {
  const errors: string[] = [];

  field.validationRules.forEach(rule => {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message);
        }
        break;
      case 'minLength':
        if (value && typeof value === 'string' && rule.value && value.length < rule.value) {
          errors.push(rule.message);
        }
        break;
      case 'maxLength':
        if (value && typeof value === 'string' && rule.value && value.length > rule.value) {
          errors.push(rule.message);
        }
        break;
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(rule.message);
          }
        }
        break;
      case 'password':
        if (value && typeof value === 'string') {
          if (value.length < 8 || !/\d/.test(value)) {
            errors.push(rule.message);
          }
        }
        break;
    }
  });

  return errors;
};

export const validateForm = (fields: FormField[], values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  fields.forEach(field => {
    const fieldErrors = validateField(field, values[field.id]);
    if (fieldErrors.length > 0) {
      errors[field.id] = fieldErrors;
    }
  });

  return errors;
};