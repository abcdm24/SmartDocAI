//
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
//import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import Register from "./pages/Register";
import { useAuth } from "./auth/AuthContext";

function NavBar() {
  const { token, setToken, user, setUser } = useAuth();
  console.log(`Navbar-token:`, token, "user:", user);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    //localStorage.removeItem("jwtToken");
    //localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box display="flex" gap={2} p={2} alignItems="center" bgcolor="#f5f5f5">
      <Link to="/">Home</Link>
      <Link to="/upload">Upload Document</Link>
      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Typography sx={{ marginLeft: "auto" }}>Hi, {user?.name}</Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}
    </Box>
  );
}

function App() {
  return (
    <Router>
      {/* <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/upload">Upload Document</Link>
        <Link to="/Login">Login</Link>
        <Link to="/Register">Register</Link>
      </nav> */}
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    // <Routes>
    //   <Route path="/" element={<MainLayout />}>
    //     <Route index element={<Home />} />
    //     <Route path="upload" element={<Upload />} />
    //   </Route>
    // </Routes>
  );
}

export default App;
