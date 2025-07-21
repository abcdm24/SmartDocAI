import { Container, Typography, Divider } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>SmartDoc AI - Home</title>
      </Helmet>
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h3" gutterBottom>
          <PsychologyIcon
            sx={{ fontSize: 40, mr: 1, verticalAlign: "middle" }}
          />
          SmartDoc AI
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {/* Upload and analyze business documents with AI-powered insights. */}
          Upload and analyze documents with AI-powered insights.
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography>
          start by navigating to the <strong>Upload</strong> page.
        </Typography>
      </Container>
    </>
  );
};

export default Home;
