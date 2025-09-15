// src/components/navigation/TopBar.jsx
import React, { useRef } from "react";
import { View, Text, Image, Pressable, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function TopBar({
  onBellPress,
  onMenuPress,
  notifications = 5,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left: hamburger */}
        <Pressable
          onPress={onMenuPress}
          style={styles.hamburger}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icon name="menu" size={26} color="#111827" />
        </Pressable>

        {/* Right: notification bell only */}
        <View style={styles.rightRow}>
          <Pressable onPress={onBellPress} style={styles.bellWrap}>
            <Icon name="bell" size={22} color="#111827" />
            {notifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 1000,          // keep above content
    elevation: 4,          // Android stacking
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  container: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hamburger: { padding: 8 },
  rightRow: { flexDirection: "row", alignItems: "center" },
  bellWrap: { marginRight: 16, padding: 6, position: "relative" },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#ef4444",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
});
