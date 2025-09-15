// src/components/navigation/Layout.jsx
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

export default function Layout({
  children,
  activeTab,
  onBellPress,
  onAvatarPress,
}) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <TopBar
        onBellPress={onBellPress}
        onMenuPress={() => setSidebarVisible(true)}
        onAvatarPress={onAvatarPress}
      />
      <View style={styles.body} pointerEvents="box-none">
        {children}
      </View>

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeTab={activeTab}
        // No need to pass navigation prop anymore
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  body: { flex: 1 },
});