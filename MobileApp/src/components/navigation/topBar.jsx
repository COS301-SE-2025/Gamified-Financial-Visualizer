// src/components/navigation/TopBar.jsx
import React, { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Logo from "../../../assets/Logo1.png";
import AvatarMenu from "./AvatarMenu";

export default function TopBar({ 
  onBellPress, 
  onMenuPress,
  username = "satoshi_nak", 
  tier = "Silver",
  coins = 420
}) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleAvatarPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    setShowAvatarMenu(!showAvatarMenu);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left: menu button and brand */}
        <View style={styles.brandRow}>
          <Pressable onPress={onMenuPress} style={styles.menuButton}>
            <Icon name="menu" size={24} color="#0f172a" />
          </Pressable>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.brandText}>Gamified Finance</Text>
            <View style={styles.coinContainer}>
              <Icon name="award" size={12} color="#F59E0B" />
              <Text style={styles.coinText}>{coins} coins</Text>
            </View>
          </View>
        </View>

        {/* Right: actions */}
        <View style={styles.actionsRow}>
          <Pressable onPress={onBellPress} style={styles.iconWrap}>
            <Icon name="bell" size={22} color="#0f172a" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>4</Text>
            </View>
          </Pressable>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable 
              onPress={handleAvatarPress} 
              style={styles.avatarWrap}
            >
              <View style={styles.avatarContainer}>
                <Image source={Logo} style={styles.avatar} />
                <View style={[styles.tierBadge, 
                  tier === "Gold" ? styles.goldBadge : 
                  tier === "Silver" ? styles.silverBadge : 
                  styles.bronzeBadge
                ]}>
                  <Text style={styles.tierText}>{tier.charAt(0)}</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
      
      {/* Avatar Dropdown Menu - positioned relative to the wrapper */}
      <AvatarMenu 
        visible={showAvatarMenu} 
        onClose={() => setShowAvatarMenu(false)}
        username={username}
        tier={tier}
        coins={coins}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
  },
  container: {
    height: 70, 
    backgroundColor: "#ffffff", 
    paddingHorizontal: 16,
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    borderBottomWidth: 1, 
    borderBottomColor: "#E5F1E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  brandRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  logo: { 
    width: 32, 
    height: 32, 
    marginRight: 10 
  },
  brandText: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: "#6aa84f",
    letterSpacing: -0.5
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2
  },
  coinText: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "600",
    marginLeft: 4
  },
  actionsRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  iconWrap: { 
    marginRight: 16, 
    padding: 6,
    position: 'relative',
  },
  badge: {
    position: "absolute", 
    top: 2, 
    right: 2,
    backgroundColor: "#60a5fa", 
    borderRadius: 8, 
    paddingHorizontal: 4, 
    minWidth: 16, 
    height: 16,
    alignItems: "center",
    justifyContent: 'center',
  },
  badgeText: { 
    color: "#fff", 
    fontSize: 10, 
    fontWeight: "800" 
  },
  avatarWrap: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    overflow: "hidden", 
    borderWidth: 2, 
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: { 
    width: "100%", 
    height: "100%" 
  },
  tierBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
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
});