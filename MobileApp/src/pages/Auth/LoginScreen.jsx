// src/screens/auth/LoginScreen.jsx
import { useState } from "react";
import {
  View, Text, TextInput, Pressable, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Image, StyleSheet, StatusBar
} from "react-native";
import Logo from "../../../assets/Logo1.png";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }], // make sure this matches your route name
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {/* Brand */}
            <View style={styles.brandWrap}>
              <Image source={Logo} resizeMode="contain" style={styles.logo} />
              <Text style={styles.brandName}>Gamified Finance</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Login</Text>

            {/* Username */}
            <View style={styles.field}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#9aa3af"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#9aa3af"
                secureTextEntry
                style={styles.input}
              />
            </View>

            {/* CTA */}
            <Pressable style={styles.button} onPress={goHome}>
            <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            {/* Footer */}
            <Text style={styles.footerText}>
              New to Gamified Finance?{" "}
              <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },

  scrollBody: { flexGrow: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignSelf: "stretch",
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",

    // 🔑 Control vertical placement
    justifyContent: "center",   // centers form vertically
    paddingTop: 20,             // small top padding so logo isn't glued
  },

  brandWrap: { alignItems: "center", marginBottom: 12 },
  logo: { width: 64, height: 64, marginBottom: 6 },
  brandName: { color: "#6aa84f", fontWeight: "600" },

  title: {
    fontSize: 28,
    textAlign: "center",
    color: "#1f2937",
    fontWeight: "700",
    marginBottom: 24,   // tighter spacing below title
  },

  field: { marginBottom: 14 },
  label: { fontSize: 12, color: "#4b5563", marginBottom: 6 },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    color: "#111827",
    fontSize: 16,
  },

  button: {
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6aa84f",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  footerText: { textAlign: "center", fontSize: 12, color: "#6b7280", marginTop: 16 },
  link: { color: "#6aa84f", fontWeight: "600" },
});

