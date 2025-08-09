export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number | string;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DerivedField {
  parentFields: string[];
  formula: string;
  formulaType: 'age' | 'sum' | 'concat' | 'custom';
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue: string | number | boolean | string[];
  validationRules: ValidationRule[];
  options?: SelectOption[];
  isDerived?: boolean;
  derivedConfig?: DerivedField;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormErrors {
  [fieldId: string]: string[];
}

export interface FormValues {
  [fieldId: string]: string | number | boolean | string[];
}