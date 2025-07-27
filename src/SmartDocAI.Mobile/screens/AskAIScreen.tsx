import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useDocument } from "../context/DocumentContext";
import api from "../api/axios";

type Props = NativeStackScreenProps<RootStackParamList, "AskAI">;

const AskAIScreen: React.FC<Props> = () => {
  const { docId, setDocId } = useDocument();
  const { fileName, setFileName } = useDocument();
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    try {
      setLoading(true);
      console.log;
      const response = await api.post(`/${docId}/ask`, question, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 200) {
        throw new Error("Failed to get answer from AI");
      }
      console.log("AI Response:", response.data.response);
      setAnswer(response.data.response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = async (text: string) => {
    setQuestion(text);
    setError(""); // Clear error when user starts typing
    setAnswer(""); // Clear previous answer
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge">Ask AI About "{fileName}"</Text>
      <TextInput
        label="Enter your question"
        value={question}
        onChangeText={handleQuestionChange}
        mode="outlined"
        multiline
        style={{ marginVertical: 16 }}
      />
      <Button mode="contained" onPress={handleAsk} disabled={loading}>
        Ask AI
      </Button>
      {loading && (
        <ActivityIndicator animating={true} style={{ marginTop: 16 }} />
      )}
      {answer ? (
        <Card style={{ marginTop: 16 }}>
          <Card.Title title="AI Response" />
          <Card.Content>
            <Text>{answer}</Text>
          </Card.Content>
        </Card>
      ) : null}
      {error ? (
        <Text style={{ color: "red", marginTop: 16 }}>{error}</Text>
      ) : null}
    </ScrollView>
  );
};

export default AskAIScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
