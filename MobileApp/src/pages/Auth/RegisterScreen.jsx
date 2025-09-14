// src/screens/auth/RegisterScreen.jsx
import { useState } from "react";
import {
  View, Text, TextInput, Pressable, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Image, StyleSheet, StatusBar
} from "react-native";
import Logo from "../../../assets/Logo1.png";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPw] = useState("");
  const [username, setUsername] = useState("");

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
            <Text style={styles.title}>Register</Text>

            {/* Fields */}
            <Field label="Full Name">
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor="#9aa3af"
                autoCapitalize="words"
                style={styles.input}
              />
            </Field>

            <Field label="Email">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#9aa3af"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </Field>

             <Field label="Username">
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#9aa3af"
                autoCapitalize="none"
                style={styles.input}
              />
            </Field>

            <Field label="Password">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#9aa3af"
                secureTextEntry
                style={styles.input}
              />
            </Field>

            <Field label="Confirm Password">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPw}
                placeholder="Confirm Password"
                placeholderTextColor="#9aa3af"
                secureTextEntry
                style={styles.input}
              />
            </Field>

            {/* CTA */}
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>

            {/* Footer */}
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 12, color: "#4b5563", marginBottom: 8 }}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },
  scrollBody: { flexGrow: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    alignSelf: "stretch",
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
  },
  brandWrap: { alignItems: "center", marginBottom: 16 },
  logo: { width: 64, height: 64, marginBottom: 8 },
  brandName: { color: "#6aa84f", fontWeight: "600" },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    color: "#1f2937",
    fontWeight: "600",
    marginBottom: 28,
  },
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
  footerText: { textAlign: "center", fontSize: 12, color: "#6b7280", marginTop: 12 },
  link: { color: "#6aa84f", fontWeight: "600" },
});
