// src/components/navigation/Sidebar.jsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Logo from "../../../assets/Logo1.png";

const { width } = Dimensions.get('window');

export default function Sidebar({ visible, onClose, activeTab, navigate, username = "satoshi_nak", tier = "Silver" }) {
  if (!visible) return null;

  const mainItems = [
    { key: "home", label: "Home", icon: "home" },
    { key: "accounts", label: "Accounts", icon: "credit-card" },
    { key: "goals", label: "Goals", icon: "target" },
    { key: "community", label: "Community", icon: "users" },
  ];

  const otherItems = [
    { key: "learn", label: "Learn", icon: "book" },
    { key: "achievements", label: "Achievements", icon: "award" },
    { key: "support", label: "Support", icon: "help-circle" },
    { key: "settings", label: "Settings", icon: "settings" },
  ];

  const handleItemPress = (key) => {
    navigate?.(key);
    onClose();
  };

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sidebar}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.headerText}>
            <Text style={styles.brandText}>Gamified Finance</Text>
            <View style={styles.userInfo}>
              <Text style={styles.username}>@{username}</Text>
              <View style={[styles.tierBadge, 
                tier === "Gold" ? styles.goldBadge : 
                tier === "Silver" ? styles.silverBadge : 
                styles.bronzeBadge
              ]}>
                <Text style={styles.tierText}>{tier}</Text>
              </View>
            </View>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#64748b" />
          </Pressable>
        </View>

        {/* Navigation Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>MAIN</Text>
          {mainItems.map((item) => {
            const active = activeTab === item.key;
            return (
              <Pressable
                key={item.key}
                style={[styles.menuItem, active && styles.activeMenuItem]}
                onPress={() => handleItemPress(item.key)}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  color={active ? "#6aa84f" : "#64748b"} 
                  style={styles.menuIcon} 
                />
                <Text style={[styles.menuText, active && styles.activeMenuText]}>
                  {item.label}
                </Text>
                {active && <View style={styles.activeIndicator} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>MORE</Text>
          {otherItems.map((item) => {
            const active = activeTab === item.key;
            return (
              <Pressable
                key={item.key}
                style={[styles.menuItem, active && styles.activeMenuItem]}
                onPress={() => handleItemPress(item.key)}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  color={active ? "#6aa84f" : "#64748b"} 
                  style={styles.menuIcon} 
                />
                <Text style={[styles.menuText, active && styles.activeMenuText]}>
                  {item.label}
                </Text>
                {active && <View style={styles.activeIndicator} />}
              </Pressable>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable 
            style={styles.logoutButton}
            onPress={() => {
              onClose();
              // Handle logout
            }}
          >
            <Icon name="log-out" size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: "#ffffff",
    zIndex: 1000,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  brandText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6aa84f",
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 8,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  goldBadge: {
    backgroundColor: '#FFD700',
  },
  silverBadge: {
    backgroundColor: '#C0C0C0',
  },
  bronzeBadge: {
    backgroundColor: '#CD7F32',
  },
  tierText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: 12,
    paddingLeft: 16,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
    position: "relative",
  },
  activeMenuItem: {
    backgroundColor: "#f0f9eb",
  },
  menuIcon: {
    width: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  activeMenuText: {
    color: "#6aa84f",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#6aa84f",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "500",
    marginLeft: 12,
  },
});