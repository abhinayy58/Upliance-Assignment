import React from "react";
import { loadAllForms } from "../utils/localStorage";
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MyFormsPage() {
  const forms = loadAllForms();
  const navigate = useNavigate();
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">My Forms</Typography>
      <List>
        {forms.length === 0 && (
          <Typography sx={{ p: 2 }}>No saved forms</Typography>
        )}
        {forms.map((f) => (
          <ListItemButton
            key={f.id}
            onClick={() => navigate(`/preview/${f.id}`)}
          >
            <ListItemText
              primary={f.name}
              secondary={new Date(f.createdAt).toLocaleString()}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
