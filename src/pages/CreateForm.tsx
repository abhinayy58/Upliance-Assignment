import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  addField,
  setFormName,
} from "../store/slices/formBuilder";
import { Field } from "../types";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { saveForm } from "../utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import FieldEditor from "../shared/FileEditor";

export default function CreatePage() {
  const dispatch = useDispatch();
  const workingForm = useSelector((s: RootState) => s.formBuilder.workingForm);
  const [saving, setSaving] = useState(false);

  const add = (type: Field["type"]) => dispatch(addField({ type }));

  const onSave = () => {
    if (!workingForm.name) {
      alert("Please give the form a name before saving");
      return;
    }
    setSaving(true);
    const schema = {
      id: workingForm.id ?? uuidv4(),
      name: workingForm.name!,
      createdAt: new Date().toISOString(),
      fields: workingForm.fields,
    };
    saveForm(schema);
    setSaving(false);
    alert("Form saved to localStorage");
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Form name"
              value={workingForm.name ?? ""}
              onChange={(e) => dispatch(setFormName(e.target.value))}
              fullWidth
            />
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={saving}
            >
              Save
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {workingForm.fields.length === 0 && (
            <Typography color="textSecondary">
              Add fields using the buttons on the right
            </Typography>
          )}
          {workingForm.fields.map((f, idx) => (
            <FieldEditor key={f.id} field={f} index={idx} />
          ))}
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Add Field</Typography>
          <Box sx={{ display: "grid", gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => add("text")}
            >
              Text
            </Button>
            <Button variant="outlined" onClick={() => add("number")}>
              Number
            </Button>
            <Button variant="outlined" onClick={() => add("textarea")}>
              Textarea
            </Button>
            <Button variant="outlined" onClick={() => add("select")}>
              Select
            </Button>
            <Button variant="outlined" onClick={() => add("radio")}>
              Radio
            </Button>
            <Button variant="outlined" onClick={() => add("checkbox")}>
              Checkbox
            </Button>
            <Button variant="outlined" onClick={() => add("date")}>
              Date
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
