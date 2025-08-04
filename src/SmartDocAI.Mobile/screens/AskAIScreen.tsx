import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
  PaperProvider,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useDocument } from "../context/DocumentContext";
import api from "../api/axios";

type Props = NativeStackScreenProps<RootStackParamList, "AskAI">;

type QAItem = {
  question: string;
  answer: string;
};

const AskAIScreen: React.FC<Props> = () => {
  const { docId, setDocId } = useDocument();
  const { fileName, setFileName } = useDocument();
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);

  const handleAsk = async () => {
    if (!docId) {
      setError("No document selected");
      return;
    }
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    try {
      setLoading(true);
      console.log(`ASK AI called with ${docId} for query ${question}`);
      const response = await api.post(`/${docId}/ask`, question, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 200) {
        throw new Error("Failed to get answer from AI");
      }
      console.log("AI Response:", response.data.response);
      setAnswer(response.data.response);
      setQaHistory((prev) => [
        { question, answer: response.data.response },
        ...prev,
      ]);
      setQuestion(""); // Clear question input after asking
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

  useEffect(() => {
    //console.log("question set:", question);
  }, [question]);

  useEffect(() => {
    //console.log("Loading updated", loading);
  }, [loading]);

  useEffect(() => {
    //console.log("answer set", answer);
  }, [answer]);

  useEffect(() => {
    //console.log("docId updated:", docId);
  });

  useEffect(() => {
    //console.log("fileName set", fileName);
  }, [fileName]);

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
        testID="question-input"
      />
      <Button
        mode="contained"
        onPress={handleAsk}
        disabled={loading}
        testID="askai-button"
      >
        Ask AI
      </Button>
      {loading && (
        <ActivityIndicator
          animating={true}
          style={{ marginTop: 16 }}
          testID="loading-indicator"
        />
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
        <Text style={{ color: "red", marginTop: 16 }} testID="error-text">
          {error}
        </Text>
      ) : null}

      {qaHistory.length > 0 && (
        <>
          <Text variant="titleMedium" style={{ marginTop: 24 }}>
            Previous Questions
          </Text>
          {qaHistory.map((item, index) => (
            <Card key={index} style={{ marginTop: 12 }}>
              <Card.Title title={`Q${qaHistory.length - index}`} />
              <Card.Content>
                <Text
                  style={{ fontWeight: "bold" }}
                >{`Q: ${item.question}`}</Text>
                <Text>{`A: ${item.answer}`}</Text>
              </Card.Content>
            </Card>
          ))}
        </>
      )}
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
