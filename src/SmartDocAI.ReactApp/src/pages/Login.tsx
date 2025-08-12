import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  //const navigate = useNavigate();

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post(`auth/login`, form);
      if (!res.status) throw new Error("Invalid credentials");
      //console.log("res.data =", res.data);
      //console.log("res.data.user =", res.data.user);
      //console.log(
      //  "keys:",
      //  res.data.user ? Object.keys(res.data.user) : "no user"
      //);
      //localStorage.setItem("jwtToken", res.data.token);
      //console.log(`token:${res.data.token}`);
      //console.log(`User:${res.data.user.Name}, ${res.data.user.Email}`);
      //console.log(`User: ${JSON.stringify(res.data.user)}`);

      //const serverUser = res.data.user ?? res.data.userDto ?? res.data;
      //const normalizedUser = {
      //  name:
      //    serverUser?.name ?? serverUser?.Name ?? serverUser?.userName ?? "",
      //  email:
      //    serverUser?.email ??
      //    serverUser?.Email ??
      //    serverUser?.EmailAddress ??
      //    "",
      //};
      //console.log("normalizedUser:", normalizedUser);
      //console.log("serverUser:", serverUser);
      setToken(res.data.token);
      setUser(res.data.user);

      setSnackbarMessage("Login successful");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

      //navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // const handleLogin = async () => {
  //   try {
  //     const response = await api.post("/login", { email, password });

  //     const token = response.data.token;
  //     setToken(token);
  //   } catch (err) {
  //     console.error("Login failed", err);
  //   }
  // };

  return (
    // <div>
    //   <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
    //   <input
    //     placeholder="Password"
    //     type="password"
    //     onChange={(e) => setPassword(e.target.value)}
    //   />
    //   <button onClick={handleLogin}>Login</button>
    // </div>
    <>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                },
              }}
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
