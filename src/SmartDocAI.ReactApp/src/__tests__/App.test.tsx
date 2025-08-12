import { render, screen } from "@testing-library/react";
import App from "../App";
import { describe, it, expect } from "vitest";
//import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../auth/AuthContext";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
      //<HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      //</HelmetProvider>
    );
    expect(screen.getByText("SmartDoc AI")).toBeInTheDocument();
  });
});
