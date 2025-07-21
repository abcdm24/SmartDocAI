import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  //Box,
  Button,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import PsychologyIcon from "@mui/icons-material/Psychology";

const MainLayout = () => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            <PsychologyIcon
              sx={{ fontSize: 40, mr: 1, verticalAlign: "middle" }}
            />
            SmartDoc AI
          </Link>
          <Button color="inherit" component={Link} to="/upload">
            Upload
          </Button>
        </Typography>
      </Toolbar>
    </AppBar>
    <Container sx={{ mt: 4 }}>
      <Outlet />
    </Container>
  </>
);

export default MainLayout;
