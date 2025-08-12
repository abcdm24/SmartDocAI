// import React from "react";
// import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
// import { BrowserRouter as Router } from "react-router-dom";
//import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./auth/AuthContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <HelmetProvider> */}
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
    {/* </HelmetProvider> */}
    {/* <Router>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
      </HelmetProvider>
    </Router> */}
  </StrictMode>
);
