import { FormField, FormValues } from '../types/form';

export const calculateDerivedValue = (field: FormField, values: FormValues): any => {
  if (!field.isDerived || !field.derivedConfig) {
    return values[field.id] || field.defaultValue;
  }

  const { parentFields, formula, formulaType } = field.derivedConfig;
  const parentValues = parentFields.map(fieldId => values[fieldId]);

  switch (formulaType) {
    case 'age':
      if (parentValues[0]) {
        const birthDate = new Date(parentValues[0] as string);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return Math.max(0, age);
      }
      return 0;
    case 'sum':
      return parentValues.reduce((sum, val) => sum + (Number(val) || 0), 0);
    case 'concat':
      return parentValues.filter(val => val).join(' ');
    case 'custom':
      try {
        // Simple formula evaluation for basic arithmetic
        let formulaStr = formula;
        parentFields.forEach((fieldId, index) => {
          const value = parentValues[index] || 0;
          formulaStr = formulaStr.replace(new RegExp(`\\b${fieldId}\\b`, 'g'), String(value));
        });
        return eval(formulaStr);
      } catch {
        return 0;
      }
    default:
      return field.defaultValue;
  }
};