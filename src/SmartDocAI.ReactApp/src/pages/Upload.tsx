import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  InputLabel,
  Input,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Helmet } from "react-helmet-async";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    alert(`Uploading: ${file.name}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  return (
    <>
      <Helmet>
        <title>SmartDoc AI - Upload</title>
      </Helmet>
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          <UploadFileIcon
            sx={{ fontSize: 32, mr: 1, verticalAlign: "middle" }}
          />
          Upload document
        </Typography>
        <form onSubmit={handleUpload}>
          <InputLabel htmlFor="docFile">Select a file</InputLabel>
          <Input
            type="file"
            id="docFile"
            fullWidth
            onChange={handleFileChange}
            required
            inputProps={{ accept: ".pdf,.docx,.txt" }}
            sx={{ my: 2 }}
          />
          <Button variant="contained" type="submit">
            Upload
          </Button>
        </form>
      </Container>
    </>
  );
};

export default Upload;
