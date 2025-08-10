import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import CreatePage from "./pages/CreateForm";
import PreviewPage from "./pages/Preview";
import MyFormsPage from "./pages/MyForms";

export default function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Upliance - Assignment
          </Typography>
          <Button color="inherit" component={Link} to="/create">
            Create
          </Button>
          <Button color="inherit" component={Link} to="/preview">
            Preview
          </Button>
          <Button color="inherit" component={Link} to="/myforms">
            My Forms
          </Button>
        </Toolbar>
      </AppBar>
      <Container className="container">
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
          <Route path="/myforms" element={<MyFormsPage />} />
        </Routes>
      </Container>
    </div>
  );
}
