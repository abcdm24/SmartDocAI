// HeaderMenu.tsx
import React, { useContext, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { IconButton, List, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const PANEL_WIDTH = 170;
const ANIM_DURATION = 200;
const PANEL_TOP = 100;
const PANEL_MARGIN = 10;

const HeaderMenu = ({ docId }: { docId?: string }) => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);

  const { height: screenH } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current; // 0 hidden, 1 shown

  const openMenu = () => {
    setVisible(true);
    Animated.timing(anim, {
      toValue: 1,
      duration: ANIM_DURATION,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: ANIM_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PANEL_WIDTH, 0],
  });

  const onNavigate = (route: string) => {
    console.log("Called close menu");
    closeMenu();
    console.log("Navigating to ", route);
    //navigation.navigate(route as never);
    setTimeout(() => navigation.navigate(route as never), ANIM_DURATION + 10);
  };

  return (
    <>
      <View style={styles.anchorContainer}>
        <Text style={styles.welcomeText}>Welcome {user?.name || "User"}</Text>
        <IconButton
          icon="account-circle"
          iconColor="#fff"
          size={28}
          onPress={openMenu}
          accessibilityLabel="Open user menu"
        />
      </View>

      {/* Render backdrop + panel in a top-level Portal to avoid clipping */}
      <Portal>
        {visible && (
          <>
            {/* backdrop */}
            <Pressable
              style={styles.backdrop}
              onPress={closeMenu}
              pointerEvents="auto"
            />

            {/* slide-in panel rendered at root (not clipped by header) */}
            <Animated.View
              pointerEvents="auto"
              style={[
                styles.panel,
                {
                  top: PANEL_TOP,
                  //height: undefined, //auto screenH - PANEL_TOP - PANEL_MARGIN,
                  transform: [{ translateX }],
                },
              ]}
            >
              {/* <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>Menu</Text>
                <IconButton icon="close" size={22} onPress={closeMenu} />
              </View> */}

              <List.Section>
                <List.Item
                  title="Home"
                  onPress={() => onNavigate("Home")}
                  left={(props) => <List.Icon {...props} icon="home" />}
                  disabled={!user}
                />
                <List.Item
                  title="Upload"
                  onPress={() => onNavigate("Upload")}
                  left={(props) => <List.Icon {...props} icon="upload" />}
                  disabled={!user}
                />
                <List.Item
                  title="Summarize"
                  onPress={() => onNavigate("Summarize")}
                  left={(props) => (
                    <List.Icon {...props} icon="file-document" />
                  )}
                  disabled={!user}
                />
                <List.Item
                  title="Ask AI"
                  onPress={() => onNavigate("AskAI")}
                  left={(props) => <List.Icon {...props} icon="robot" />}
                  disabled={!user}
                />
                {user ? (
                  <List.Item
                    title="Logout"
                    onPress={() => {
                      closeMenu();
                      logout();
                    }}
                    left={(props) => <List.Icon {...props} icon="logout" />}
                  />
                ) : (
                  <List.Item
                    title="Login"
                    onPress={() => {
                      onNavigate("Login");
                    }}
                    left={(props) => <List.Icon {...props} icon="login" />}
                  />
                )}
              </List.Section>
            </Animated.View>
          </>
        )}
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  anchorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#6200ee",
    overflow: "visible", // keep header itself non-clipping (optional)
  },
  welcomeText: {
    color: "#fff",
    fontSize: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.35)", //"rgba(0,0,0,0.35)",
    zIndex: 10,
  },
  panel: {
    position: "absolute",
    right: 0,
    top: 100,
    bottom: 20,
    height: 300,
    width: PANEL_WIDTH,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 6,
    paddingBottom: 24,
    zIndex: 11,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HeaderMenu;
