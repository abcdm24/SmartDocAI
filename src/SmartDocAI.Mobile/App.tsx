// App.tsx
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import UploadScreen from "./screens/UploadScreen";
import SummarizeScreen from "./screens/SummarizeScreen";
import AskAIScreen from "./screens/AskAIScreen";
import HomeScreen from "./screens/HomeScreen";
import { DocumentProvider } from "./context/DocumentContext";
export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Summarize: undefined;
  AskAI: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <DocumentProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "SmartDocAI" }}
              />
              <Stack.Screen
                name="Upload"
                component={UploadScreen}
                options={{ title: "SmartDocAI - Upload" }}
              />
              <Stack.Screen
                name="Summarize"
                component={SummarizeScreen}
                options={{ title: "SmartDocAI - Summarize" }}
              />
              <Stack.Screen
                name="AskAI"
                component={AskAIScreen}
                options={{ title: "SmartDocAI - Ask AI" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DocumentProvider>
      </PaperProvider>
    </GestureHandlerRootView>
    // </SafeAreaProvider>
  );
}
