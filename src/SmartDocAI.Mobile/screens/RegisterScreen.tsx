import React, { useState, useContext } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const { register } = useContext(AuthContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await register(name, email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text variant="headlineMedium">Register</Text>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginTop: 10 }}
      />
      <TextInput
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={{ marginTop: 10 }}
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        style={{ marginTop: 20 }}
      >
        Register
      </Button>
      <Button
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 10 }}
      >
        Already have an account? Login
      </Button>
    </View>
  );
};

export default RegisterScreen;
