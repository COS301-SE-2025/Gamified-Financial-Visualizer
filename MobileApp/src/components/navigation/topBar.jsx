// src/components/navigation/TopBar.jsx
import React, { useState, useRef } from "react";
import { View, Text, Image, Pressable, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Logo from "../../../assets/Logo1.png";

export default function TopBar({
  onBellPress,
  onMenuPress,
  username = "satoshi_nak",
  tier = "Silver",
  notifications = 5,
  avatarSource = Logo,
}) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const bump = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left: hamburger */}
        <Pressable onPress={onMenuPress} style={styles.hamburger}>
          <Icon name="menu" size={26} color="#111827" />
        </Pressable>

        {/* Center: brand logo */}
        <View style={styles.brandCenter}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Right: notification bell and user info */}
        <View style={styles.rightRow}>
          <Pressable onPress={onBellPress} style={styles.bellWrap}>
            <Icon name="bell" size={22} color="#111827" />
            {notifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications}</Text>
              </View>
            )}
          </Pressable>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPress={() => {
                bump();
                setShowAvatarMenu((v) => !v);
              }}
              style={styles.userChip}
            >
              <Image source={avatarSource} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.handle} numberOfLines={1}>
                  {username}
                </Text>
                <Text style={styles.tier}>{tier}</Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { 
    zIndex: 100,
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
  hamburger: { 
    padding: 8,
    marginRight: 8,
  },
  brandCenter: { 
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  logo: { 
    width: 32, 
    height: 32,
  },
  rightRow: { 
    flexDirection: "row", 
    alignItems: "center",
    marginLeft: "auto",
  },
  bellWrap: { 
    marginRight: 16, 
    padding: 6, 
    position: "relative" 
  },
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
  badgeText: { 
    color: "#fff", 
    fontSize: 10, 
    fontWeight: "800" 
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  avatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16 
  },
  userInfo: {
    marginLeft: 8,
  },
  handle: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#111827" 
  },
  tier: { 
    fontSize: 12, 
    color: "#6b7280", 
    marginTop: 2 
  },
});