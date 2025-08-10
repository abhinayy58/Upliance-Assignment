import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadFormById, loadAllForms } from "../utils/localStorage";
import { FormSchema, Field } from "../types";
import {
  Box,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
} from "@mui/material";

function evaluateDerived(expression: string, fields: Record<string, any>) {
  try {
    // Limit scope — expose only `fields` and Math
    // eslint-disable-next-line no-new-func
    const fn = new Function("fields", "Math", `return (${expression})`);
    return fn(fields, Math);
  } catch (e:unknown) {
    console.error(e.message);
    return "";
  }
}

export default function PreviewPage() {
  const { id } = useParams();
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const loaded = loadFormById(id);
      if (loaded) setSchema(loaded);
    } else {
      const all = loadAllForms();
      if (all.length > 0) setSchema(all[all.length - 1]);
    }
  }, [id]);

  useEffect(() => {
    if (!schema) return;
    // initialize defaults
    const initial: Record<string, any> = {};
    schema.fields.forEach((f) => {
      initial[f.id] = f.defaultValue ?? "";
    });
    setValues(initial);
  }, [schema]);

  useEffect(() => {
    if (!schema) return;
    // compute derived fields
    const derivedFields = schema.fields.filter((f) => f.derived?.enabled);
    if (derivedFields.length === 0) return;
    const next = { ...values };
    derivedFields.forEach((f) => {
      // evaluate
      next[f.id] = evaluateDerived(f.derived!.expression, next);
    });
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, schema]);

  const validateField = (f: Field, val: any): string | null => {
    const v = f.validation;
    if (!v) return null;
    if (v.notEmpty && (val === "" || val === null || val === undefined))
      return "Required";
    if (typeof val === "string") {
      if (v.minLength && val.length < v.minLength)
        return `Min length ${v.minLength}`;
      if (v.maxLength && val.length > v.maxLength)
        return `Max length ${v.maxLength}`;
      if (v.email) {
        const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!re.test(val)) return "Invalid email";
      }
      if (v.customPassword) {
        const re = /^(?=.*\d).{8,}$/;
        if (!re.test(val))
          return "Password must be at least 8 chars and contain a number";
      }
    }
    return null;
  };

  if (!schema)
    return <Typography>No form found. Save a form first.</Typography>;

  const onChange = (id: string, value: any) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    // validate
    const f = schema.fields.find((x) => x.id === id);
    if (f) {
      const e = validateField(f, value);
      setErrors((prev) => ({ ...prev, [id]: e ?? "" }));
    }
  };

  const onSubmit = () => {
    // validate all
    const newErrors: Record<string, string> = {};
    schema.fields.forEach((f) => {
      const e = validateField(f, values[f.id]);
      if (e) newErrors[f.id] = e;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert(
        "Form submitted (values not persisted): " +
          JSON.stringify(values, null, 2)
      );
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Preview — {schema.name}</Typography>
      <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
        {schema.fields.map((f) => (
          <Box key={f.id}>
            {f.type === "text" && (
              <TextField
                fullWidth
                label={f.label}
                value={values[f.id] ?? ""}
                onChange={(e) => onChange(f.id, e.target.value)}
                helperText={errors[f.id]}
                error={!!errors[f.id]}
              />
            )}
            {f.type === "number" && (
              <TextField
                fullWidth
                type="number"
                label={f.label}
                value={values[f.id] ?? ""}
                onChange={(e) => onChange(f.id, e.target.value)}
                helperText={errors[f.id]}
                error={!!errors[f.id]}
              />
            )}
            {f.type === "textarea" && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label={f.label}
                value={values[f.id] ?? ""}
                onChange={(e) => onChange(f.id, e.target.value)}
                helperText={errors[f.id]}
                error={!!errors[f.id]}
              />
            )}
            {f.type === "select" && (
              <TextField
                select
                fullWidth
                label={f.label}
                value={values[f.id] ?? ""}
                onChange={(e) => onChange(f.id, e.target.value)}
                helperText={errors[f.id]}
                error={!!errors[f.id]}
              >
                {(f.options || []).map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {f.type === "radio" && (
              <Box>
                <Typography>{f.label}</Typography>
                <RadioGroup
                  value={values[f.id] ?? ""}
                  onChange={(e) => onChange(f.id, e.target.value)}
                >
                  {(f.options || []).map((o) => (
                    <FormControlLabel
                      key={o}
                      value={o}
                      control={<Radio />}
                      label={o}
                    />
                  ))}
                </RadioGroup>
              </Box>
            )}
            {f.type === "checkbox" && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!values[f.id]}
                    onChange={(e) => onChange(f.id, e.target.checked)}
                  />
                }
                label={f.label}
              />
            )}
            {f.type === "date" && (
              <TextField
                type="date"
                fullWidth
                label={f.label}
                InputLabelProps={{ shrink: true }}
                value={values[f.id] ?? ""}
                onChange={(e) => onChange(f.id, e.target.value)}
              />
            )}
            {f.derived?.enabled && (
              <Typography variant="caption">
                Derived field — computed
              </Typography>
            )}
          </Box>
        ))}

        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
