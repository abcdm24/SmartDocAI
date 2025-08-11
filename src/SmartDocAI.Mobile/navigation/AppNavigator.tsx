import React, { useContext, useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Button, Menu, IconButton } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import UploadScreen from "../screens/UploadScreen";
import SummarizeScreen from "../screens/SummarizeScreen";
import AskAIScreen from "../screens/AskAIScreen";
import { AuthContext } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";
import { getToken } from "../utils/storage";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LayoutScreen from "../components/LayoutScreen";
import { RootStackParamList } from "../App";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  //const { user, logout } = useContext(AuthContext);
  //const { docId } = useDocument();
  const { token, loading } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = await getToken("authtoken");
  //     console.log(`authtoken:${token}`);
  //     setIsLoggedIn(!!token);
  //     //setLoading(false);
  //   };
  //   checkAuth();
  // }, []);
  console.log(`isloggeedin:${isLoggedIn}`);
  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="Summarize" component={SummarizeScreen} />
          <Stack.Screen name="AskAI" component={AskAIScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
