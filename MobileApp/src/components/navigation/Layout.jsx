// src/components/navigation/Layout.jsx
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import TopBar from "./topBar";
import Sidebar from "./Sidebar";

export default function Layout({ 
  children, 
  activeTab, 
  navigate, 
  onBellPress, 
}) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <TopBar 
        onBellPress={onBellPress} 
        onMenuPress={() => setSidebarVisible(true)}
      />
      <View style={styles.body}>{children}</View>
      
      <Sidebar 
        visible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)}
        activeTab={activeTab}
        navigate={navigate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  body: { 
    flex: 1,
  },
});