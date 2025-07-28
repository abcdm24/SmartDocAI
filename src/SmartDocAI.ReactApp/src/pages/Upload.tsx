import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  InputLabel,
  Input,
  Stack,
  CircularProgress,
  Box,
  TextField,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
//import { Helmet } from "react-helmet-async";
import api from "../api/axios.ts";
import ErrorBoundary from "../components/ErrorBoundary.tsx";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  //const [userPrompt, setUserPrompt] = useState("Summarize the document");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackBarMessage, setSnackBarMessage] = useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
  //   "success"
  // );

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  // const showSnackbar = (
  //   message: string,
  //   severity: "success" | "error" = "success"
  // ) => {
  //   setSnackBarMessage(message);
  //   setSnackbarSeverity(severity);
  //   setSnackbarOpen(true);
  // };

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  // const handleUpload = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!file) return alert("Please select a file");
  //   alert(`Uploading: ${file.name}`);
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   const response = await fetch("http://localhost:5000/api/documents/upload", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   const data = await response.json();
  //   if (response.ok) {
  //     alert(`File uploaded successfully: ${data.id}`);
  //   } else {
  //     alert(`Upload failed: ${data.error}`);
  //   }
  // };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Within handleUpload file selected:", file?.name);
    if (!file) {
      setSnackbar({
        open: true,
        message: "Please select a file",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDocId(response.data.id);
      setSnackbar({
        open: true,
        message: `File uploaded: ${response.data.name}`,
        severity: "success",
      });

      const extractRes = await api.get(`/${response.data.id}/extract-text`);
      setExtractedText(extractRes.data.text);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Upload or Extraction failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Doc id state updated:", docId);
  }, [docId]);

  useEffect(() => {
    console.log("File state updated:", file?.name);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setExtractedText(""); // Clear previous extracted text
      setSummary(""); // Clear previous summary
      setAiResponse(""); // Clear previous AI response
      setDocId(""); // Clear previous document ID
    }
  };

  const handleSummarize = async () => {
    if (!docId) return;
    setLoading(true);
    try {
      console.log("handleSuumarize function called with ");

      const res = await api.get(`/${docId}/Summarize`);
      setSummary(res.data.summary);
      setSnackbar({
        open: true,
        message: "Summary generated successfully.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Summary generation failed.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Summary state updated:", summary);
  }, [summary]);

  const handleAskAI = async () => {
    if (!docId || !userPrompt.trim()) return;
    setLoading(true);
    try {
      const res = await api.post(`/${docId}/Ask`, JSON.stringify(userPrompt), {
        headers: { "Content-Type": "application/json" },
      });
      setAiResponse(res.data.response);
      setSnackbar({ open: true, message: "AI responded", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to get AI response",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleUploadAndExtract = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!file) return showSnackbar("Please select a file", "error");

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   setLoading(true);
  //   try {
  //     // const response = await fetch(
  //     //   "http:localhost:5000/api/documents/extract",
  //     //   {
  //     //     method: "POST",
  //     //     body: formData,
  //     //   }
  //     // );
  //     // const data = await response.json();
  //     // if (response.ok) {
  //     //   setExtractedText(data.Text);
  //     //   showSnackbar("Text extracted successfully");
  //     // } else {
  //     //   showSnackbar(`Extraction failed: ${data.error}`, "error");
  //     // }
  //     const response = await api.post("/extract", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     setExtractedText(response.data.Text);
  //     showSnackbar("Text extracted successfully");
  //   } catch (err) {
  //     console.error(err);
  //     showSnackbar("Error during text extraction", "error");
  //   }
  //   setLoading(false);
  // };

  // const handlePromptAI = async () => {
  //   if (!extractedText)
  //     return showSnackbar("No extracted text available", "error");

  //   setLoading(true);

  //   try {
  //     // const response = await fetch("http://localhost:5000/api/analyze", {
  //     //   method: "POST",
  //     //   headers: { "Content-Type": "application/json" },
  //     //   body: JSON.stringify({ extractedText, userPrompt }),
  //     // });
  //     // const data = await response.json();
  //     // if (response.ok) {
  //     //   setAiResponse(data.summary);
  //     //   showSnackbar("AI response generated");
  //     // } else {
  //     //   showSnackbar(`AI response failed: ${data.error}`, "error");
  //     // }

  //     const response = await api.post(
  //       "/analyze",
  //       { extractedText, userPrompt },
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     setAiResponse(response.data.summary);
  //     showSnackbar("AI response generated");
  //   } catch (err) {
  //     console.error(err);
  //     showSnackbar("Error during AI prompt", "error");
  //   }

  //   setLoading(false);
  // };

  return (
    <>
      {/* <Helmet>
        <title>SmartDoc AI - Upload</title>
      </Helmet> */}
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Stack spacing={4}>
          <Typography variant="h4" gutterBottom>
            <UploadFileIcon
              sx={{ fontSize: 32, mr: 1, verticalAlign: "middle" }}
            />
            Upload document
          </Typography>
          {/* <form onSubmit={handleUpload}>
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
        </form> */}
          {/* Upload Form */}
          {/* <form onSubmit={handleUploadAndExtract}> */}
          <ErrorBoundary>
            <form onSubmit={handleUpload} data-testid="upload-form">
              <Stack spacing={2}>
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
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Upload & Extract"
                  )}
                </Button>
              </Stack>
            </form>
          </ErrorBoundary>
          {/* Extracted Text and Prompt Input */}
          <ErrorBoundary>
            {extractedText && (
              <Stack spacing={3} mt={5}>
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    data-testid="extracted-text-title"
                  >
                    Extracted Text
                  </Typography>
                  <TextField
                    multiline
                    fullWidth
                    rows={10}
                    value={extractedText}
                    variant="outlined"
                  />
                </Box>
                {/* <TextField
                fullWidth
                label="Enter your prompt"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handlePromptAI}
                disabled={loading}
              > 
                {loading ? <CircularProgress size={24} /> : "Ask AI"}
              </Button>*/}
                <Button
                  variant="contained"
                  onClick={handleSummarize}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Generate Summary"
                  )}
                </Button>
              </Stack>
            )}
          </ErrorBoundary>

          {/* AI Summary */}
          <ErrorBoundary>
            {summary && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  <Typography>{summary}</Typography>
                </CardContent>
              </Card>
            )}
          </ErrorBoundary>
          <ErrorBoundary>
            <Stack spacing={3} mt={5}>
              <TextField
                title="ask-ai-textfield"
                label="Ask something about the document"
                fullWidth
                multiline
                rows={3}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleAskAI}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Ask AI"}
              </Button>
            </Stack>
          </ErrorBoundary>

          {/* AI Response Display */}
          <ErrorBoundary>
            {aiResponse && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Response
                  </Typography>
                  <Typography>{aiResponse}</Typography>
                </CardContent>
              </Card>
            )}
          </ErrorBoundary>
        </Stack>
      </Container>
      {/* Snackbar for notifications */}
      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
          variant="filled"
        >
          {snackBarMessage}
        </Alert>
      </Snackbar> */}
      <ErrorBoundary>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={handleCloseSnackbar}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ErrorBoundary>
    </>
  );
};

export default Upload;
