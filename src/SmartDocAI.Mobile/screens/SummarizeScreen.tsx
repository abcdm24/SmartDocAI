import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, ActivityIndicator, Card } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useDocument } from "../context/DocumentContext";
import api from "../api/axios";
import axios from "axios";
type Props = NativeStackScreenProps<RootStackParamList, "Summarize">;

const SummarizeScreen: React.FC<Props> = ({ navigation }) => {
  const { docId } = useDocument();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    try {
      if (!docId) {
        setError("No document uploaded yet.");
        return;
      }
      //console.log(`DocId to summarize: ${docId}`);
      setLoading(true);
      setError("");
      const response = await api.get(`documents/${docId}/summarize`);
      //console.log(`Response received: ${response.data.summary}`);
      if (!response.status || response.status !== 200) {
        throw new Error("Failed to summarize document.");
      }
      const text = await response.data.summary;
      //console.log(`Response received: ${response}`);
      setSummary(text);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to summarize document."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while summarizing the document.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    //console.log("Summary state updated:", summary);
  }, [summary]);

  useEffect(() => {
    //console.log("Loading state updated:", loading);
  }, [loading]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Card>
        <Card.Title title="Document Summary" />
        <Button
          mode="contained"
          onPress={handleSummarize}
          disabled={loading}
          testID="summarize-button"
        >
          Summarize
        </Button>
        {loading && (
          <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
        )}
        {error ? (
          <Text style={{ color: "red", marginTop: 20 }}>{error}</Text>
        ) : summary ? (
          <Text style={{ marginTop: 20 }}>{summary}</Text>
        ) : null}
      </Card>
      {summary && (
        <View style={{ marginTop: 20 }}>
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
            onPress={() => navigation.navigate("AskAI")}
          >
            Ask AI
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default SummarizeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
