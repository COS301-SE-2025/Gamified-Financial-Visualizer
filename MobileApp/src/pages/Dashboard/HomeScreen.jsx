// src/screens/HomeScreen.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Layout from "../../components/navigation/Layout";

export default function HomeScreen({ navigation }) {
  const navigate = (key) => {
    // map nav keys to your routes
    const map = {
      home: "Home",
      transactions: "Transactions",
      budgets: "Budgets",
      insights: "Insights",
      import: "Import",
      goals: "Goals",
      goalCreate: "GoalCreate",
      support: "Support",
      more: "More",
    };
    navigation.navigate(map[key] ?? "Home");
  };

  return (
    <Layout
      activeTab="home"
      navigate={navigate}
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
