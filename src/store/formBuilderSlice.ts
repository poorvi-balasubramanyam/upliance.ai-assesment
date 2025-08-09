import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema, FormValues, FormErrors } from '../types/form';

interface FormBuilderState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  previewValues: FormValues;
  previewErrors: FormErrors;
  savedForms: FormSchema[];
  isPreviewMode: boolean;
  editingFormId: string | null;
}

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    fields: [],
  },
  previewValues: {},
  previewErrors: {},
  savedForms: [],
  isPreviewMode: false,
  editingFormId: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FormField>) => {
      state.currentForm.fields.push(action.payload);
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.currentForm.fields[index] = action.payload;
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.currentForm.fields = action.payload;
    },
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    saveForm: (state, action: PayloadAction<string>) => {
      const newForm: FormSchema = {
        id: Date.now().toString(),
        name: action.payload,
        fields: state.currentForm.fields,
        createdAt: new Date().toISOString(),
      };
      state.savedForms.push(newForm);
      state.currentForm = { name: '', fields: [] };
    },
    loadSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload;
    },
    loadFormForPreview: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm.name = action.payload.name;
      state.currentForm.fields = action.payload.fields;
      state.isPreviewMode = true;
      state.previewValues = {};
      state.previewErrors = {};
    },
    loadFormForEdit: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm.name = action.payload.name;
      state.currentForm.fields = action.payload.fields;
      state.isPreviewMode = false;
      state.editingFormId = action.payload.id;
      state.previewValues = {};
      state.previewErrors = {};
    },
    updateForm: (state, action: PayloadAction<string>) => {
      if (state.editingFormId) {
        const formIndex = state.savedForms.findIndex(form => form.id === state.editingFormId);
        if (formIndex !== -1) {
          state.savedForms[formIndex] = {
            ...state.savedForms[formIndex],
            name: action.payload,
            fields: state.currentForm.fields,
          };
        }
      }
      state.currentForm = { name: '', fields: [] };
      state.editingFormId = null;
    },
    setPreviewValue: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      state.previewValues[action.payload.fieldId] = action.payload.value;
    },
    setPreviewErrors: (state, action: PayloadAction<FormErrors>) => {
      state.previewErrors = action.payload;
    },
    clearCurrentForm: (state) => {
      state.currentForm = { name: '', fields: [] };
      state.isPreviewMode = false;
      state.editingFormId = null;
      state.previewValues = {};
      state.previewErrors = {};
    },
  },
});

export const {
  addField,
  updateField,
  removeField,
  reorderFields,
  setFormName,
  saveForm,
  loadSavedForms,
  loadFormForPreview,
  loadFormForEdit,
  updateForm,
  setPreviewValue,
  setPreviewErrors,
  clearCurrentForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;