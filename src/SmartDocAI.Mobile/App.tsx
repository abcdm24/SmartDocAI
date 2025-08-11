// App.tsx
import * as React from "react";
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Provider as PaperProvider,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import UploadScreen from "./screens/UploadScreen";
import SummarizeScreen from "./screens/SummarizeScreen";
import AskAIScreen from "./screens/AskAIScreen";
import HomeScreen from "./screens/HomeScreen";
import { DocumentProvider } from "./context/DocumentContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import AuthNavigator from "./navigation/AuthNavigator";
import AppNavigator from "./navigation/AppNavigator";
import { View } from "react-native";
import LayoutScreen from "./components/LayoutScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Upload: undefined;
  Summarize: undefined;
  AskAI: undefined;
};

//const Stack = createNativeStackNavigator<RootStackParamList>();

// function RootNavigation() {
//   const { token, loading } = useContext(AuthContext);
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }
//   return token ? <AppNavigator /> : <AuthNavigator />;
// }

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <DocumentProvider>
            <NavigationContainer>
              <LayoutScreen>
                {/* <RootNavigation /> */}
                <AppNavigator />
              </LayoutScreen>
            </NavigationContainer>
          </DocumentProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

// export default function App() {
//   return (
//     // <SafeAreaProvider>
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <PaperProvider>
//         <DocumentProvider>
//           <NavigationContainer>
//             <Stack.Navigator initialRouteName="Home">
//               <Stack.Screen
//                 name="Home"
//                 component={HomeScreen}
//                 options={{ title: "SmartDocAI" }}
//               />
//               <Stack.Screen
//                 name="Upload"
//                 component={UploadScreen}
//                 options={{ title: "SmartDocAI - Upload" }}
//               />
//               <Stack.Screen
//                 name="Summarize"
//                 component={SummarizeScreen}
//                 options={{ title: "SmartDocAI - Summarize" }}
//               />
//               <Stack.Screen
//                 name="AskAI"
//                 component={AskAIScreen}
//                 options={{ title: "SmartDocAI - Ask AI" }}
//               />
//             </Stack.Navigator>
//           </NavigationContainer>
//         </DocumentProvider>
//       </PaperProvider>
//     </GestureHandlerRootView>
//     // </SafeAreaProvider>
//   );
// }
