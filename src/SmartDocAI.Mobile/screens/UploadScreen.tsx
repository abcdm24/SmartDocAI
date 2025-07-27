import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, Card, ActivityIndicator } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerResult } from "expo-document-picker";
import api from "../api/axios";
import { ScrollView } from "react-native-gesture-handler";
import { useDocument } from "../context/DocumentContext";
type Props = NativeStackScreenProps<RootStackParamList, "Upload">;

const UploadScreen: React.FC<Props> = ({ navigation }) => {
  //const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  //const [docId, setDocId] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extracting, setExtracting] = useState<boolean>(false);
  const { docId, setDocId } = useDocument();
  const { fileName, setFileName } = useDocument();

  const handlePickDocument = async () => {
    const result: DocumentPickerResult = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ],
    });

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setFileName(file.name);
      setExtractedText(null);
      handleUploadDocument(file);
    }
  };

  const handleUploadDocument = async (doc: {
    uri: string;
    name: string;
    mimeType?: string;
  }) => {
    try {
      setUploading(true);
      setUploadSuccess(false);
      const formData = new FormData();
      formData.append("file", {
        uri: doc.uri,
        name: doc.name,
        type: doc.mimeType || "application/octet-stream",
      } as any);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDocId(response.data.id);
      setUploadSuccess(true);

      await handleExtractText(response.data.id);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const handleExtractText = async (docId: string) => {
    try {
      setExtracting(true);
      const response = await api.get(`/${docId}/extract-text`);
      setExtractedText(response.data.text);
      console.log("Extracted Text:", response.data.text);
    } catch (err) {
      console.error("Text extraction failed:", err);
      setExtractedText("Failed to extract text.");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      <Card>
        <Card.Title title="Upload a document" />
        <Card.Content>
          <Button mode="contained" onPress={handlePickDocument}>
            {uploading ? "Uploading..." : "Select Document"}
          </Button>
          {fileName && (
            <Text style={{ marginTop: 10 }}>Selected: {fileName}</Text>
          )}
          {uploading && (
            <ActivityIndicator animating={true} style={{ marginTop: 10 }} />
          )}
          {uploadSuccess && docId && (
            <Text style={{ marginTop: 10, color: "green" }}>
              Uploaded Sucessfully.
            </Text>
          )}
        </Card.Content>
      </Card>
      {extracting && (
        <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
      )}
      {extractedText && (
        <Card style={{ marginTop: 20 }}>
          <Card.Title title="Extracted Text" />
          <Card.Content>
            <Text>{extractedText}</Text>
          </Card.Content>
        </Card>
      )}

      {docId && (
        <View style={{ marginTop: 20 }}>
          <Text>Document ID: {docId}</Text>
          <Button
            mode="outlined"
            style={{ marginTop: 12 }}
            onPress={() => navigation.navigate("Home")}
          >
            Go to Home
          </Button>
          <Button
            mode="contained"
            style={{ marginTop: 12 }}
            onPress={() => navigation.navigate("Summarize")}
          >
            Summarize
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: { marginTop: 16 },
});
