import React, { useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Logo from "../../../assets/Logo1.png";

const { width } = Dimensions.get("window");

export default function Sidebar({
  visible,
  onClose,
  activeTab,
  navigation, 
  username = "satoshi_nak",
  tier = "Silver",
  avatarSource = Logo,
}) {
  const [openKeys, setOpenKeys] = useState({
    accounts: false,
    goals: false,
    learn: false,
    community: false,
    achievements: false,
    support: false,
  });

  const toggle = (key) => setOpenKeys((s) => ({ ...s, [key]: !s[key] }));

  const sections = useMemo(
    () => [
      {
        items: [{ key: "home", label: "Home", icon: "home", route: "HomeScreen" }], 
      },
      {
        items: [
          {
            key: "accounts",
            label: "Accounts",
            icon: "credit-card",
            expandable: true,
            children: [
              // Updated to match your exact file names
              { key: "transactions", label: "Transactions", icon: "shuffle", route: "Transactions" },
              { key: "budget", label: "Budget", icon: "pie-chart", route: "Budget" },
              { key: "insights", label: "Insights", icon: "bar-chart-2", route: "Insights" },
              { key: "imports", label: "Imports", icon: "download-cloud", route: "Imports" },
            ],
          },
        ],
      },
      {
        items: [
          {
            key: "goals",
            label: "Goals",
            icon: "target",
            expandable: true,
            children: [
              { key: "all-goals", label: "All Goals", icon: "list", route: "Goal" }, 
              { key: "create-goal", label: "Create a Goal", icon: "plus-circle", route: "CreateGoal" },
            ],
          },
        ],
      },
      {
        items: [
          {
            key: "learn",
            label: "Learn",
            icon: "book",
            expandable: true,
            children: [
              { key: "all-modules", label: "All Modules", icon: "layers", route: "Learn" },
              { key: "complete", label: "Completed", icon: "check-circle", route: "LearnComplete" },
              { key: "incomplete", label: "Incomplete", icon: "circle", route: "LearnIncomplete" },
            ],
          },
        ],
      },
      {
        items: [
          {
            key: "community",
            label: "Community",
            icon: "users",
            expandable: true,
            children: [
              { key: "social", label: "Social", icon: "message-circle", route: "Social" },
              { key: "friends", label: "Friends", icon: "user-check", route: "Friends" },
              { key: "communities", label: "Communities", icon: "grid", route: "Communities" },
              { key: "challenges", label: "Challenges", icon: "flag", route: "Challenges" },
            ],
          },
        ],
      },
      {
        items: [
          {
            key: "achievements",
            label: "Achievements",
            icon: "award",
            expandable: true,
            children: [
              { key: "ach-all", label: "All", icon: "star", route: "Achievements" },
              { key: "ach-completed", label: "Completed", icon: "check", route: "AchievementsCompleted" },
              { key: "ach-incomplete", label: "Incomplete", icon: "clock", route: "AchievementsIncomplete" },
            ],
          },
        ],
      },
      {
        items: [
          {
            key: "support",
            label: "Support",
            icon: "help-circle",
            expandable: true,
            children: [
              { key: "tutorials", label: "Tutorials", icon: "play-circle", route: "Tutorials" },
              { key: "faq", label: "FAQ", icon: "help-circle", route: "FAQs" },
              { key: "overview", label: "Overview", icon: "book-open", route: "Overview" },
            ],
          },
        ],
      },
      {
        items: [
          {
            key: "profile",
            label: "Profile",
            icon: "user",
            expandable: true,
            children: [
              { key: "settings", label: "Settings", icon: "settings", route: "Settings" },
              { key: "profile", label: "Profile", icon: "user", route: "Profile" },
            ],
          },
        ],
      },
    ],
    []
  );

  const go = (route) => {
    if (route) {
      navigation.navigate(route); 
      onClose?.();
    }
  };

  if (!visible) return null;

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sidebar}>
        {/* Header */}
        <View style={styles.header}>
          {/* Profile strip */}
          <View style={styles.profileRow}>
            <Image source={avatarSource} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.username} numberOfLines={1}>
                {username}
              </Text>
              <Text style={styles.tierPlain}>{tier}</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {sections.map((section, index) => (
            <View key={index} style={styles.menuSection}>
              {section.items.map((item) => {
                const active = activeTab === item.key;
                const isOpen = item.expandable ? openKeys[item.key] : false;

                return (
                  <View key={item.key}>
                    <Pressable
                      style={[styles.menuItem, active && styles.activeMenuItem]}
                      onPress={item.expandable ? () => toggle(item.key) : () => go(item.route)}
                    >
                      <Icon
                        name={item.icon}
                        size={20}
                        color={active ? "#6aa84f" : "#64748b"}
                        style={styles.menuIcon}
                      />
                      <Text style={[styles.menuText, active && styles.activeMenuText]}>{item.label}</Text>

                      {item.expandable ? (
                        <Icon
                          name={isOpen ? "chevron-up" : "chevron-down"}
                          size={18}
                          color="#94a3b8"
                          style={styles.expandIcon}
                        />
                      ) : null}

                      {active && <View style={styles.activeIndicator} />}
                    </Pressable>

                    {/* Children */}
                    {item.expandable && isOpen && (
                      <View style={styles.childrenWrap}>
                        {item.children.map((c) => (
                          <Pressable 
                            key={c.key} 
                            style={styles.childItem} 
                            onPress={() => go(c.route)}
                          >
                            <Icon name={c.icon} size={18} color="#6b7280" style={styles.childIcon} />
                            <Text style={styles.childText}>{c.label}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={styles.logoutButton}
            onPress={() => {
              onClose?.();
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

// Your styles remain the same...
const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.82,
    maxWidth: 340,
    backgroundColor: "#fff",
    zIndex: 1000,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eef5ee",
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: { width: 36, height: 36, marginRight: 10 },
  brandText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6aa84f",
    flex: 1,
  },
  closeButton: { padding: 4 },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  profileInfo: { flex: 1 },
  username: { fontSize: 16, fontWeight: "700", color: "#111827" },
  tierPlain: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  scrollContent: { paddingBottom: 24 },
  menuSection: { marginTop: 8 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    position: "relative",
  },
  activeMenuItem: { backgroundColor: "#f0f9eb" },
  menuIcon: { width: 24, marginRight: 12 },
  menuText: { fontSize: 16, color: "#334155", fontWeight: "500", flex: 1 },
  activeMenuText: { color: "#6aa84f", fontWeight: "600" },
  expandIcon: { marginLeft: "auto" },
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
  childrenWrap: {
    marginLeft: 36,
    marginBottom: 4,
  },
  childItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 4,
  },
  childIcon: { width: 20, marginRight: 10 },
  childText: { fontSize: 14, color: "#374151" },
  footer: {
    marginTop: "auto",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eef5ee",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: { fontSize: 16, color: "#ef4444", fontWeight: "500", marginLeft: 12 },
});