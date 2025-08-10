import React, { useState } from "react";
import { Field } from "../types";
import {
  Card,
  CardContent,
  TextField,
  IconButton,
  Box,
  FormControlLabel,
  Switch,
  Button,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { updateField, removeField } from "../store/slices/formBuilder";

export default function FieldEditor({
  field,
}: {
  field: Field;
  index: number;
}) {
  const dispatch = useDispatch();
  const [local, setLocal] = useState<Field>(field);

  const save = () => dispatch(updateField({ id: field.id, patch: local }));

  return (
    <Card sx={{ my: 1 }}>
      <CardContent>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="Label"
            value={local.label}
            onChange={(e) => setLocal({ ...local, label: e.target.value })}
            size="small"
            sx={{ flex: 1 }}
          />
          <IconButton onClick={() => dispatch(removeField(field.id))}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={local.required}
                onChange={(e) =>
                  setLocal({ ...local, required: e.target.checked })
                }
              />
            }
            label="Required"
          />
          <TextField
            label="Default"
            size="small"
            value={local.defaultValue ?? ""}
            onChange={(e) =>
              setLocal({ ...local, defaultValue: e.target.value })
            }
          />
        </Box>

        {(local.type === "select" || local.type === "radio") && (
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Options (comma separated)"
              size="small"
              fullWidth
              value={(local.options || []).join(",")}
              onChange={(e) =>
                setLocal({
                  ...local,
                  options: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          </Box>
        )}

        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small" onClick={save}>
            Update
          </Button>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Chip label={`Type: ${local.type}`} />
        </Box>
      </CardContent>
    </Card>
  );
}
