// src/screens/HomeScreen.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Layout from "../../components/navigation/Layout";

export default function HomeScreen({ navigation }) {
  return (
    <Layout
      activeTab="Home" // Changed from "home" to "Home" to match your route name
      navigation={navigation} // Pass the full navigation object instead of navigate function
      onBellPress={() => navigation.navigate("Notifications")}
      onAvatarPress={() => navigation.navigate("Profile")}
    >
      <View style={styles.content}>
        <Text style={styles.h1}>Welcome back 👋</Text>
        {/* your page content */}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
  h1: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
});