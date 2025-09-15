// src/pages/Profile/Profile.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Layout from "../../components/navigation/Layout";

// Assets (swap for yours)
import CoverImage from "../../../assets/pixelAllyway.jpeg";
import ProfileAvatar from "../../../assets/Ramen.png";
import Logo from "../../../assets/Logo1.png"; // placeholder for small avatars

const COLORS = {
  bg: "#F6F8FB",
  white: "#FFFFFF",
  text: "#0F172A",
  sub: "#6B7280",
  // greens/yellows tuned to your screenshots
  green: "#7CB342", // Main green from images
  greenDark: "#689F38",
  greenSoft: "#E8F5E8",
  greenSofter: "#F1F8E9",
  pillBorder: "#C8E6C9",
  xp: "#FFF3C4",
  xpText: "#F57F17",
  barTrack: "#E0E0E0",
  barFill: "#8BC34A",
  cardBorder: "#E5E7EB",
  divider: "#EEF2F4",
  amber: "#FFC107",
  amberDark: "#FF8F00",
};

const Profile = ({ navigation }) => {
  // mock data (wire your API later)
  const user = {
    username: "satoshi_nak",
    joined: "Joined: 21/07/2027",
    tier: "Lv Silver",
    toNext: "500 Points to next level",
    progressPct: 60,
  };

  const communities = [
    { id: 1, name: "Cash cows", members: 8, goals: 8, xp: 4504, isActive: true },
    { id: 2, name: "Cash cows", members: 8, goals: 8, xp: 4504, isActive: true },
    { id: 3, name: "Cash cows", members: 8, goals: 8, xp: 4504, isActive: true },
  ];

  const perf = [
    { id: "acc", label: "Accuracy", value: "0%", icon: "trending-up" },
    { id: "rank", label: "Leaderboard", value: "#7", icon: "hash" },
    { id: "ch", label: "Challenges", value: "2", icon: "flag" },
    { id: "go", label: "Goals", value: "1/4", icon: "target" },
  ];

  const achievements = [
    { id: 1, title: "Tutorial Streak", xp: 40, icon: "award" },
    { id: 2, title: "First Transaction", xp: 50, icon: "credit-card" },
    { id: 3, title: "First Challenge", xp: 20, icon: "check-circle" },
  ];

  const goals = [
    { id: 1, name: "Sustainable Grocery Plan", xp: 78, current: 5700, target: 3000 },
    { id: 2, name: "Charity Run Donation", xp: 99, current: 2400, target: 2000 },
    { id: 3, name: "Wedding Budget Cap", xp: 90, current: 18000, target: 15000 },
  ];

  return (
    <Layout
      activeTab="Profile"
      onBellPress={() => navigation.navigate("Notifications")}
      onAvatarPress={() => navigation.navigate("Profile")}
    >
      <ScrollView 
        style={{ flex: 1, backgroundColor: COLORS.bg }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerCard}>
          {/* Cover */}
          <View style={styles.coverWrap}>
            <Image source={CoverImage} style={styles.cover} />
            <View style={styles.coverOverlay} />
          </View>

          {/* Name pill floating over cover */}
          <View style={styles.namePill}>
            <Image source={ProfileAvatar} style={styles.pillAvatar} />
            <Text style={styles.pillUsername}>satoshi_nak</Text>
            <Text style={styles.pillJoined}>Joined: 21/07/2027</Text>
          </View>

          {/* spacer so pill can "hang" over the cover */}
          <View style={{ height: 20 }} />
        </View>
          
        {/* Level card under the header */}
        <View style={styles.tierCard}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>3</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tierTitle}>Lv Silver</Text>
            <Text style={styles.tierSub}>500 Points to next level</Text>
            <View style={styles.ambTrack}>
              <View style={[styles.ambFill, { width: "60%" }]} />
            </View>
          </View>
        </View>

        {/* ACTIVE COMMUNITIES */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Active Communities</Text>

          {communities.map((c) => (
            <View key={c.id} style={styles.communityCard}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={styles.communityIcon}>
                  <Image source={Logo} style={{ width: 28, height: 28, borderRadius: 14 }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.communityName}>{c.name}</Text>
                  <View style={styles.pillRow}>
                    <View style={styles.pill}>
                      <Icon name="users" size={12} color={COLORS.greenDark} />
                      <Text style={styles.pillText}>{c.members} Members</Text>
                    </View>
                    <View style={styles.pill}>
                      <Icon name="check-square" size={12} color={COLORS.greenDark} />
                      <Text style={styles.pillText}>{c.goals} Goals</Text>
                    </View>
                    <View style={[styles.pill, { backgroundColor: COLORS.xp, borderColor: COLORS.xpText + "40" }]}>
                      <Icon name="zap" size={12} color={COLORS.xpText} />
                      <Text style={[styles.pillText, { color: COLORS.xpText }]}>{c.xp} XP</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.memberFaces}>
                {[Logo, ProfileAvatar, Logo, ProfileAvatar].map((src, i) => (
                  <Image key={i} source={src} style={[styles.face, { left: i * 18 }]} />
                ))}
              </View>

              <View style={styles.activeDot}>
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>
          ))}
        </View>

        {/* USER STATISTICS - Mobile Layout */}
        <View style={styles.userStatsWrap}>
          <Text style={styles.sectionTitle}>User Statistics</Text>
          
          {/* Performance Stats and Current Goals Side by Side */}
          <View style={styles.statsRow}>
            {/* Performance Stats */}
            <View style={styles.statsCardHalf}>
              <View style={styles.cardHeader}>
                <View style={styles.headerIcon}>
                  <Icon name="trending-up" size={18} color={COLORS.greenDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Performance Stats</Text>
                  <Text style={styles.cardSub}>Your gamified metrics</Text>
                </View>
              </View>

              <View style={styles.metricsGrid}>
                {perf.map((m) => (
                  <View key={m.id} style={styles.metricCell}>
                    <Text style={[
                      styles.metricValue,
                      m.id === "acc" && { color: COLORS.green },
                      m.id === "rank" && { color: "#2196F3" },
                      m.id === "ch" && { color: "#E91E63" },
                      m.id === "go" && { color: COLORS.amber }
                    ]}>{m.value}</Text>
                    <Text style={styles.metricLabel}>{m.label}</Text>
                  </View>
                ))}
              </View>
            </View>

          </View>

          
            {/* Current Goals */}
            <View style={styles.statsCardHalf}>
              <View style={styles.cardHeader}>
                <View style={[styles.headerIcon, { backgroundColor: COLORS.greenSofter }]}>
                  <Icon name="star" size={18} color={COLORS.greenDark} />
                </View>
                <Text style={styles.cardTitle}>Current Goals</Text>
              </View>

              {goals.slice(0, 3).map((g) => {
                const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <View key={g.id} style={styles.goalCard}>
                    <View style={styles.goalTop}>
                      <Text style={styles.goalName} numberOfLines={1}>{g.name}</Text>
                      <View style={[styles.pill, { paddingVertical: 2, backgroundColor: COLORS.xp }]}>
                        <Text style={[styles.pillText, { color: COLORS.xpText, fontSize: 10 }]}>+{g.xp} XP</Text>
                      </View>
                    </View>
                    <View style={styles.goalBarTrack}>
                      <View style={[styles.goalBarFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.goalMeta}>
                      {g.current}/{g.target} ({pct}%)
                    </Text>
                  </View>
                );
              })}

              <Pressable style={styles.ctaBtn}>
                <Text style={styles.ctaText}>View All Goals</Text>
              </Pressable>
            </View>

          {/* Recent Achievements - Full Width */}
          <View style={styles.fullCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerIcon}>
                <Icon name="award" size={18} color={COLORS.greenDark} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Recent Achievements</Text>
                <Text style={styles.cardSub}>Earned rewards</Text>
              </View>
            </View>

            <View style={styles.achRow}>
              {achievements.map((a) => (
                <View key={a.id} style={styles.achTile}>
                  <View style={styles.achIconWrap}>
                    <Icon name={a.icon} size={24} color={COLORS.greenDark} />
                  </View>
                  <Text style={styles.achTitle}>{a.title}</Text>
                  <View style={[styles.pill, { 
                    marginTop: 6, 
                    paddingVertical: 3, 
                    backgroundColor: COLORS.xp, 
                    borderColor: COLORS.xpText + "40" 
                  }]}>
                    <Text style={[styles.pillText, { color: COLORS.xpText, fontSize: 10 }]}>+{a.xp} XP</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default Profile;

/* ----------------------------- styles ----------------------------- */

const cardShadow = {
  shadowColor: "#0f172a",
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

const styles = StyleSheet.create({
  // Header styles
  headerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: "hidden",
    ...cardShadow,
  },
  coverWrap: { height: 120, position: "relative" },
  cover: { width: "100%", height: "100%", resizeMode: "cover" },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  // Name pill
  namePill: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: -18,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...cardShadow,
  },
  pillAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  pillUsername: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  pillJoined: {
    marginLeft: "auto",
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.sub,
  },

  // Level card
  tierCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...cardShadow,
  },
  levelBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.amber,
  },
  levelNumber: { fontWeight: "800", color: COLORS.amberDark, fontSize: 16 },
  tierTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  tierSub: { fontSize: 12, color: COLORS.sub, marginTop: 2, marginBottom: 8 },

  // Amber progress bar
  ambTrack: {
    height: 8,
    borderRadius: 10,
    backgroundColor: COLORS.barTrack,
    overflow: "hidden",
  },
  ambFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.amber,
  },

  // Section styles
  sectionWrap: { marginTop: 12, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 10 },

  // Community cards
  communityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 12,
    marginBottom: 12,
    ...cardShadow,
  },
  communityIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.greenSoft, alignItems: "center", justifyContent: "center",
  },
  communityName: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  pillRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  pill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 2,
    backgroundColor: COLORS.greenSoft,
    borderRadius: 999, borderWidth: 1, borderColor: COLORS.pillBorder,
  },
  pillText: { fontSize: 12, color: COLORS.greenDark, fontWeight: "600" },
  memberFaces: { height: 26, marginTop: 10 },
  face: {
    position: "absolute",
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: COLORS.white,
  },
  activeDot: {
    position: "absolute", right: 12, top: 12,
    backgroundColor: COLORS.greenSoft, borderColor: COLORS.pillBorder, borderWidth: 1,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999,
  },
  activeText: { fontSize: 11, color: COLORS.greenDark, fontWeight: "700" },

  // User Statistics
  userStatsWrap: { paddingHorizontal: 16, marginTop: 10 },
  
  // Stats row for side-by-side cards
  statsRow: { 
    flexDirection: "row", 
    gap: 12,
    marginBottom: 12,
  },
  
  statsCardHalf: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    ...cardShadow,
  },

  fullCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    ...cardShadow,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  
  cardTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  cardSub: { fontSize: 11, color: COLORS.sub, marginTop: 2 },

  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metricCell: {
    flexBasis: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 12,
    alignItems: "center",
  },
  metricValue: { fontSize: 18, fontWeight: "900", color: COLORS.greenDark },
  metricLabel: { marginTop: 2, fontSize: 10, color: COLORS.sub },

  // Goals
  goalCard: {
    backgroundColor: COLORS.greenSofter,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.pillBorder,
    padding: 10,
    marginBottom: 8,
  },
  goalTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  goalName: { fontSize: 12, fontWeight: "700", color: COLORS.text, flex: 1, marginRight: 8 },
  goalBarTrack: {
    height: 6,
    borderRadius: 10,
    backgroundColor: "#E6F1D7",
    overflow: "hidden",
  },
  goalBarFill: { height: "100%", backgroundColor: COLORS.barFill, borderRadius: 10 },
  goalMeta: { marginTop: 4, fontSize: 10, color: COLORS.sub },

  ctaBtn: {
    marginTop: 8,
    backgroundColor: COLORS.green,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  ctaText: { color: COLORS.white, fontWeight: "700", fontSize: 12 },

  // Achievements
  achRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  achTile: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.pillBorder,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  achIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.greenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  achTitle: { fontSize: 11, fontWeight: "700", color: COLORS.text, textAlign: "center", marginBottom: 2 },
});