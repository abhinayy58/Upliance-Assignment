import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Field, FormSchema } from "../../types";
import { v4 as uuidv4 } from "uuid";

type State = {
  workingForm: { id: string | null; name?: string; fields: Field[] };
};

const initialState: State = {
  workingForm: { id: null, name: undefined, fields: [] },
};

const slice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    initNewForm(state) {
      state.workingForm = { id: null, name: undefined, fields: [] };
    },
    loadFormToEdit(state, action: PayloadAction<FormSchema>) {
      state.workingForm = {
        id: action.payload.id,
        name: action.payload.name,
        fields: action.payload.fields,
      };
    },
    addField(state, action: PayloadAction<{ type: Field["type"] }>) {
      const id = uuidv4();
      state.workingForm.fields.push({
        id,
        type: action.payload.type,
        label: `${action.payload.type.toUpperCase()} field`,
        required: false,
        defaultValue: "",
        options:
          action.payload.type === "select" || action.payload.type === "radio"
            ? ["Option 1", "Option 2"]
            : undefined,
        validation: {},
        derived: { enabled: false, parents: [], expression: "" },
      });
    },
    updateField(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Field> }>
    ) {
      const idx = state.workingForm.fields.findIndex(
        (f) => f.id === action.payload.id
      );
      if (idx >= 0)
        state.workingForm.fields[idx] = {
          ...state.workingForm.fields[idx],
          ...action.payload.patch,
        };
    },
    removeField(state, action: PayloadAction<string>) {
      state.workingForm.fields = state.workingForm.fields.filter(
        (f) => f.id !== action.payload
      );
    },
    reorderFields(state, action: PayloadAction<{ from: number; to: number }>) {
      const f = state.workingForm.fields.splice(action.payload.from, 1)[0];
      state.workingForm.fields.splice(action.payload.to, 0, f);
    },
    setFormName(state, action: PayloadAction<string>) {
      state.workingForm.name = action.payload;
    },
    reset(state) {
      state.workingForm = { id: null, name: undefined, fields: [] };
    },
  },
});

export const {
  initNewForm,
  addField,
  updateField,
  removeField,
  reorderFields,
  setFormName,
  loadFormToEdit,
  reset,
} = slice.actions;
export default slice.reducer;
