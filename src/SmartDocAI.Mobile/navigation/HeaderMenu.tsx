import React, { useContext, useState } from "react";
import { Menu, Button, IconButton } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const HeaderMenu = ({ docId }: { docId: string }) => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  console.log(`Header menu user val:${user}`);
  return (
    <Menu
      visible={menuVisible}
      onDismiss={closeMenu}
      anchor={
        <View style={styles.anchorContainer}>
          <Text style={styles.welcomeText}>Welcome {user?.name || "User"}</Text>
          <IconButton
            icon="account-circle"
            iconColor="#fff"
            size={28}
            onPress={() => setMenuVisible(!menuVisible)}
          />
        </View>
      }
      contentStyle={{ backgroundColor: "#fff" }}
    >
      <Menu.Item
        onPress={() => {
          closeMenu();
          navigation.navigate("Upload" as never);
        }}
        title="Upload"
        disabled={!user}
      />
      <Menu.Item
        onPress={() => {
          closeMenu();
          navigation.navigate("Summarize" as never);
        }}
        title="Summarize"
        disabled={!docId}
      />
      <Menu.Item
        onPress={() => {
          closeMenu();
          navigation.navigate("AskAI" as never);
        }}
        title="Ask AI"
        disabled={!docId}
      />
      <Menu.Item
        onPress={() => {
          closeMenu();
          logout();
        }}
        title="Logout"
        disabled={!user}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  anchorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 4,
  },
});
export default HeaderMenu;
