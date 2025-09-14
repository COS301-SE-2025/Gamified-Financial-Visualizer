// src/components/navigation/AvatarMenu.jsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function AvatarMenu({ visible, onClose, username, tier }) {
  if (!visible) return null;

  const menuItems = [
    { key: "profile", label: "Profile", icon: "user" },
    { key: "settings", label: "Settings", icon: "settings" },
    { key: "logout", label: "Log Out", icon: "log-out", color: "#ef4444" },
  ];

  return (
    <Pressable style={styles.backdrop} onPress={onClose}>
      <View style={styles.menuContainer}>
        {/* User info header */}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.tierContainer}>
            <Icon name="award" size={14} color="#C0C0C0" />
            <Text style={styles.tier}>{tier} Tier</Text>
          </View>
        </View>
        
        {/* Menu items */}
        {menuItems.map((item) => (
          <Pressable 
            key={item.key} 
            style={styles.menuItem}
            onPress={() => {
              onClose();
              // Handle menu item press here
            }}
          >
            <Icon 
              name={item.icon} 
              size={18} 
              color={item.color || "#0f172a"} 
              style={styles.menuIcon} 
            />
            <Text style={[styles.menuText, item.color && { color: item.color }]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    alignItems: "flex-end",
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    width: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 8,
  },
  userInfo: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  tierContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tier: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuIcon: {
    marginRight: 12,
    width: 20,
  },
  menuText: {
    fontSize: 15,
    color: "#0f172a",
  },
});