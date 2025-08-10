export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export type ValidationRule = {
  notEmpty?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  email?: boolean;
  customPassword?: boolean;
};

export type Field = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: unknown;
  options?: string[];
  validation?: ValidationRule;
  derived?: {
    enabled: boolean;
    parents: string[];
    expression: string; // simple JS expression where parent fields referenced by id, e.g., "(fields['dob'] ? (new Date()).getFullYear()-new Date(fields['dob']).getFullYear(): '')"
  };
};

export type FormSchema = {
  id: string;
  name: string;
  createdAt: string;
  fields: Field[];
};
