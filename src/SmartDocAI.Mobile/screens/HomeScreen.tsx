import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Surface, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useDocument } from "../context/DocumentContext";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  //const navigation = useNavigation();
  const { docId } = useDocument();
  const [contentWidth, setContentWidth] = useState<number | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContentWidth(width);
  };

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#f5f5f5" }}>
      {/* <View style={{ alignItems: "center", padding: 16 }}>  */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <View
          style={{ flexDirection: "row", alignItems: "flex-end" }}
          onLayout={handleLayout}
        >
          <MaterialCommunityIcons name="brain" size={64} color="#6200ee" />
          <Text
            variant="headlineMedium"
            style={{ textAlign: "center", marginTop: 12 }}
          >
            SmartDoc AI
          </Text>
        </View>
        <View
          style={{ marginTop: 12, alignItems: "flex-start", marginLeft: 2 }}
        >
          <Text
            variant="bodyMedium"
            style={{ marginTop: 8, textAlign: "center", color: "#666" }}
          >
            Analyze documents with AI-powered insights.
          </Text>
          <Text variant="bodyMedium">
            start by navigating to the{" "}
            <Text style={{ fontWeight: "bold" }}>Upload</Text> page.
          </Text>
        </View>
        {/* </View> */}
      </View>
      <Surface style={styles.card}>
        <MaterialCommunityIcons
          name="file-upload-outline"
          size={28}
          color="#6200ee"
        />
        <Text variant="titleMedium" style={styles.label}>
          Upload Document
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Upload")}
          style={styles.button}
        >
          Upload & Extract
        </Button>
      </Surface>

      {docId && (
        <Surface style={styles.card}>
          <MaterialCommunityIcons
            name="file-document-edit-outline"
            size={28}
            color="#6200ee"
          />
          <Text variant="titleMedium" style={styles.label}>
            Summarize Document
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Summarize")}
            style={styles.button}
          >
            Summarize
          </Button>
        </Surface>
      )}

      {docId && (
        <Surface style={styles.card}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={28}
            color="#6200ee"
          />
          <Text variant="titleMedium" style={styles.label}>
            Ask AI
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AskAI")}
            style={styles.button}
          >
            Ask AI
          </Button>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "white",
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    //fontSize: 18,
    //color: "#6200ee",
    //marginLeft: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  button: {
    marginTop: 4,
    width: "80%",
  },
});
export default HomeScreen;
