import { useState } from "react";
import {
  View, Text, TextInput, Pressable, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Image,
  StyleSheet,
  Dimensions
} from "react-native";
import Logo from "../../../assets/GF-Logo.png";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const onRegister = () => {
    console.log({ fullName, email, password, username });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Brand header */}
            <View style={styles.brandHeader}>
              <Image source={Logo} resizeMode="contain" style={styles.logo} />
              <Text style={styles.brandText}>Gamified Finance</Text>
            </View>

            <Text style={styles.title}>Register</Text>

            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                placeholder="Full Name"
                placeholderTextColor="#9aa3af"
                style={styles.input}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
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

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="#9aa3af"
                style={styles.input}
              />
            </View>

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

            {/* Register Button */}
            <Pressable
              onPress={onRegister}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>

            {/* Login link */}
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text 
                style={styles.linkText} 
                onPress={() => navigation.navigate("Login")}
              >
                Login
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
    minHeight: height * 0.7, // Minimum 70% of screen height (more fields)
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