import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HeaderMenu from "../navigation/HeaderMenu";
import { getToken, deleteToken } from "../utils/storage";
import { useDocument } from "../context/DocumentContext";
import { jwtDecode } from "jwt-decode";

interface LayoutPageProps {
  children: React.ReactNode;
}

interface DecodedToken {
  name?: string;
}

export default function LayoutScreen({ children }: LayoutPageProps) {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const [username, setUsername] = useState<string>("");
  const { docId } = useDocument();
  useEffect(() => {
    const loadUser = async () => {
      const token = await getToken("authtoken");
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          setUsername(decoded?.name || "");
        } catch (error) {
          console.log("Error decoding token", error);
        }
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await deleteToken("authtoken");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" as never }],
    });
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: "#6200ee" }}>
        <MaterialCommunityIcons
          name="brain"
          size={28}
          color="#fff"
          style={{ marginHorizontal: 8 }}
        />
        <Appbar.Content
          title="SmartDocAI"
          titleStyle={{ color: "#fff", fontSize: 18 }}
        />
        <HeaderMenu docId={docId as any} />
        {/* <Appbar.Action icon="account-circle" onPress={handleLogout} /> */}
      </Appbar.Header>
      <View style={{ flex: 1 }}>{children}</View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, backgroundColor: "#fff" },
  username: { color: "#fff", marginRight: 10, fontSize: 16 },
});
