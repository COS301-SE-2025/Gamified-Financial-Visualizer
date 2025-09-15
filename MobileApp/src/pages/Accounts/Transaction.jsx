// src/pages/Accounts/Transaction.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Layout from "../../components/navigation/Layout";
export default function Transaction({ navigation }) {
  return (
    <Layout
      activeTab="Transaction" // This should match the route name
      onBellPress={() => navigation.navigate("Notifications")}
      onAvatarPress={() => navigation.navigate("Profile")}
    >
      {/* Your transaction content */}
    </Layout>
  );
}