// src/pages/Profile/Settings.jsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Switch,
  TextInput,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Layout from "../../components/navigation/Layout";

// Assets - replace with your local images
import CoverImage from "../../../assets/pixelAllyway.jpeg";
import ProfileAvatar from "../../../assets/Ramen.png";

const AVATARS = [
  { id: 1, uri: "https://i.pravatar.cc/100?img=1" },
  { id: 2, uri: "https://i.pravatar.cc/100?img=2" },
  { id: 3, uri: "https://i.pravatar.cc/100?img=3" },
  { id: 4, uri: "https://i.pravatar.cc/100?img=4" },
  { id: 5, uri: "https://i.pravatar.cc/100?img=5" },
  { id: 6, uri: "https://i.pravatar.cc/100?img=6" },
  { id: 7, uri: "https://i.pravatar.cc/100?img=7" },
  { id: 8, uri: "https://i.pravatar.cc/100?img=8" },
  { id: 9, uri: "https://i.pravatar.cc/100?img=9" },
  { id: 10, uri: "https://i.pravatar.cc/100?img=10" },
  { id: 11, uri: "https://i.pravatar.cc/100?img=11" },
  { id: 12, uri: "https://i.pravatar.cc/100?img=12" },
  { id: 13, uri: "https://i.pravatar.cc/100?img=13" },
  { id: 14, uri: "https://i.pravatar.cc/100?img=14" },
];

const COLORS = {
  bg: "#F6F8FB",
  white: "#FFFFFF",
  text: "#0F172A",
  sub: "#6B7280",
  green: "#7CB342",
  greenDark: "#689F38",
  greenSoft: "#E8F5E8",
  greenSofter: "#F1F8E9",
  pillBorder: "#C8E6C9",
  amber: "#FFC107",
  amberDark: "#FF8F00",
  cardBorder: "#E5E7EB",
  inputBg: "#F8FAFD",
  inputBorder: "#E3EAF3",
};

export default function Settings({ navigation }) {
  // Toggles
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [otpOnLogin, setOtpOnLogin] = useState(false);

  // Account fields
  const [username, setUsername] = useState("satoshi_nak");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Avatar picker
  const [selectedAvatar, setSelectedAvatar] = useState(12);

  const dirty = useMemo(() => {
    return (
      username !== "satoshi_nak" ||
      currentPassword.length > 0 ||
      newPassword.length > 0 ||
      darkMode !== false ||
      notifications !== true ||
      otpOnLogin !== false ||
      selectedAvatar !== 12
    );
  }, [username, currentPassword, newPassword, darkMode, notifications, otpOnLogin, selectedAvatar]);

  const handleCancel = () => {
    setDarkMode(false);
    setNotifications(true);
    setOtpOnLogin(false);
    setUsername("satoshi_nak");
    setCurrentPassword("");
    setNewPassword("");
    setSelectedAvatar(12);
  };

  const handleSave = () => {
    navigation?.goBack?.();
  };

  return (
    <Layout
      activeTab="Settings"
      navigation={navigation}
      onBellPress={() => navigation.navigate("Notifications")}
      onAvatarPress={() => navigation.navigate("Profile")}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header matching Profile design */}
          <View style={styles.headerCard}>
            <View style={styles.coverWrap}>
              <Image source={CoverImage} style={styles.cover} />
              <View style={styles.coverOverlay} />
              
              {/* Name pill positioned at bottom of cover */}
              <View style={styles.namePill}>
                <Image source={ProfileAvatar} style={styles.pillAvatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.pillUsername}>satoshi_nak</Text>
                  <Text style={styles.pillJoined}>Joined: 21/07/2027</Text>
                </View>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.headerButtons}>
              <Pressable onPress={handleCancel} style={[styles.pillBtn, styles.cancelBtn]}>
                <Icon name="x-circle" size={16} color={COLORS.greenDark} />
                <Text style={[styles.pillBtnText, { color: COLORS.greenDark }]}>Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={handleSave} 
                disabled={!dirty} 
                style={[styles.pillBtn, styles.saveBtn, !dirty && styles.saveBtnDisabled]}
              >
                <Icon name="save" size={16} color="#fff" />
                <Text style={[styles.pillBtnText, { color: "#fff" }]}>Save</Text>
              </Pressable>
            </View>
          </View>

          {/* Settings Card */}
          <View style={styles.card}>
            <SectionLabel label="Settings" />
            
            <View style={styles.rowBetween}>
              <View style={styles.toggleGroup}>
                <Text style={styles.toggleTitle}>Theme</Text>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  thumbColor={darkMode ? COLORS.green : "#fff"}
                  trackColor={{ false: "#E6E9EF", true: COLORS.greenSoft }}
                />
                <Text style={styles.toggleHint}>Light and Dark mode</Text>
              </View>

              <View style={styles.toggleGroup}>
                <Text style={styles.toggleTitle}>Notifications</Text>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  thumbColor={notifications ? COLORS.green : "#fff"}
                  trackColor={{ false: "#E6E9EF", true: COLORS.greenSoft }}
                />
                <Text style={styles.toggleHint}>Turn in-app notifications on or off</Text>
              </View>
            </View>

            <View style={[styles.toggleGroup, styles.singleToggle]}>
              <Text style={styles.toggleTitle}>Verification email</Text>
              <Switch
                value={otpOnLogin}
                onValueChange={setOtpOnLogin}
                thumbColor={otpOnLogin ? COLORS.green : "#fff"}
                trackColor={{ false: "#E6E9EF", true: COLORS.greenSoft }}
              />
              <Text style={styles.toggleHint}>Step OTP verification on login</Text>
            </View>
          </View>

          {/* Account Card */}
          <View style={styles.card}>
            <SectionLabel label="Account" />
            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Change Username</Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter new username"
                  style={styles.input}
                  placeholderTextColor={COLORS.sub}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  style={styles.input}
                  placeholderTextColor={COLORS.sub}
                />
              </View>
              <View style={styles.inputColFull}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  style={styles.input}
                  placeholderTextColor={COLORS.sub}
                />
              </View>
          </View>
          </View>

          {/* Avatar Picker */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Change Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((a) => {
                const isSelected = selectedAvatar === a.id;
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => setSelectedAvatar(a.id)}
                    style={[styles.avatarItem, isSelected && styles.avatarItemSelected]}
                  >
                    <Image source={{ uri: a.uri }} style={styles.avatarImg} />
                    {isSelected && (
                      <View style={styles.tickBadge}>
                        <Icon name="check" size={12} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
}

function SectionLabel({ label }) {
  return (
    <View style={styles.sectionLabel}>
      <Text style={styles.sectionLabelText}>{label}</Text>
    </View>
  );
}

const cardShadow = {
  shadowColor: "#0f172a",
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },

  // Header matching Profile design
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: "hidden",
    marginBottom: 16,
    ...cardShadow,
  },
  coverWrap: { height: 120, position: "relative" },
  cover: { width: "100%", height: "100%", resizeMode: "cover" },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  // Name pill positioned at bottom of cover
  namePill: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...cardShadow,
  },
  pillAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  userInfo: { flex: 1 },
  pillUsername: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  pillJoined: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.amber,
  },

  headerButtons: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    padding: 12,
  },
  pillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  cancelBtn: {
    backgroundColor: COLORS.greenSofter,
    borderWidth: 1,
    borderColor: COLORS.pillBorder,
  },
  saveBtn: {
    backgroundColor: COLORS.green,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  pillBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Generic card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...cardShadow,
  },

  sectionLabel: {
    alignSelf: "flex-start",
    backgroundColor: "#E6F3FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#B3D9FF",
  },
  sectionLabelText: {
    color: "#1976D2",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // Toggles
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  toggleGroup: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 12,
    gap: 6,
  },
  singleToggle: {
    marginTop: 14,
    flex: 0, // Don't flex to fill width
  },
  toggleTitle: {
    fontWeight: "800",
    color: COLORS.text,
    fontSize: 13,
  },
  toggleHint: {
    fontSize: 11,
    color: COLORS.sub,
  },

  // Inputs
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  inputCol: {
    width: "48%", // Fixed width for side-by-side layout
  },
  inputColFull: {
    width: "100%", // Full width for new password
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    height: 44,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.text,
  },

  // Avatar picker
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // Reduced gap for 7 per row
  },
  avatarItem: {
    width: "13%", // Approximately 7 items per row (100% / 7 ≈ 14.3%, minus gaps)
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.greenSofter,
    position: "relative",
  },
  avatarItemSelected: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenSoft,
  },
  avatarImg: {
    width: "85%",
    height: "85%",
    borderRadius: 999,
  },
  tickBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});