//
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
//import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";

function App() {
  return (
    <Router>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/upload">Upload Document</Link>
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/upload" element={<Upload />} />
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
