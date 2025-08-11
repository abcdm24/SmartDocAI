import React, { useState, useContext } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      console.log("Calling login in AuthContext");
      await login(email, password);
      console.log("login done");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text variant="headlineMedium">Login</Text>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginTop: 10 }}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={{ marginTop: 20 }}
      >
        Login
      </Button>
      <Button
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 10 }}
      >
        Don't have an account? Register
      </Button>
    </View>
  );
};

export default LoginScreen;
