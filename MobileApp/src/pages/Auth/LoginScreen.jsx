import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";
import Logo from "../../../assets/GF-Logo.png";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    console.log({ username, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            {/* Brand header */}
            <View style={styles.brandHeader}>
              <Image source={Logo} resizeMode="contain" style={styles.logo} />
              <Text style={styles.brandText}>Gamified Finance</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Login</Text>

            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="Username"
                placeholderTextColor="#9aa3af"
                style={styles.input}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="#9aa3af"
                style={styles.input}
              />
            </View>

            {/* CTA */}
            <Pressable onPress={onLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            {/* Footer link */}
            <Text style={styles.footerText}>
              New to the Gamified Finance?{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation?.navigate?.("Register")}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingVertical: height * 0.02, // 2% of screen height
  },
  card: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 400,
    minHeight: height * 0.6, // Minimum 60% of screen height
    borderRadius: 24,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 25,
    elevation: 5,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: width * 0.12, // 12% of screen width
    height: width * 0.12, // Maintain aspect ratio
    marginBottom: 8,
    maxWidth: 40,
    maxHeight: 40,
  },
  brandText: {
    fontSize: 14,
    color: "#6aa84f",
    fontWeight: "600",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    color: "#1f2937",
    fontWeight: "bold",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 8,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "white",
    color: "#111827",
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6aa84f",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
  },
  linkText: {
    color: "#6aa84f",
    fontWeight: "600",
  },
});