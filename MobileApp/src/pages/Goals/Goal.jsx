// src/pages/Goals/CreateGoal.jsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Layout from "../../components/navigation/Layout";

/** ---------- Small, reusable UI bits ---------- */
function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function SectionHeader({ title, right }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {right}
    </View>
  );
}

function ProgressBar({ percent = 0 }) {
  return (
    <View style={styles.progressWrap}>
      <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, percent))}%` }]} />
    </View>
  );
}

function Pill({ children }) {
  return <Text style={styles.pill}>{children}</Text>;
}

/** Placeholder donut (keeps the vibe without extra libs) */
function Donut({ percent = 50, label = "Category Breakdown" }) {
  return (
    <Card style={{ paddingVertical: 16 }}>
      <Text style={styles.sectionTitleCentered}>{label}</Text>
      <View style={styles.donutWrap}>
        <View style={styles.donutOuter}>
          <View style={styles.donutInner}>
            <Text style={styles.donutPercent}>{`${percent}%`}</Text>
          </View>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FCD49B" }]} />
          <Text style={styles.legendText}>Donation</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FF7A66" }]} />
          <Text style={styles.legendText}>Spending limit</Text>
        </View>
      </View>

      <Text style={styles.totalText}>Total: 4</Text>
      <Text style={styles.subtleCenter}>Number of Goals Across Types</Text>
    </Card>
  );
}

/** Goal card like in your screenshot */
function GoalCard({ image, title, due, goalAmount, percent = 0, onPress }) {
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <View style={{ height: 148, backgroundColor: "#e6eef5" }}>
        {image ? (
          <Image source={image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={28} color="#7a8795" />
          </View>
        )}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.goalTitle}>{title}</Text>
        <Text style={styles.goalDue}>Due: {due}</Text>

        <ProgressBar percent={percent} />

        <Text style={styles.goalMeta}>
          {goalAmount} goal • {Math.round(percent)}%
        </Text>

        <Pressable onPress={onPress} style={styles.viewMoreBtn}>
          <Text style={styles.viewMoreText}>View More</Text>
          <Icon name="arrow-right" size={16} color="#0A7F2E" />
        </Pressable>
      </View>
    </Card>
  );
}

/** ---------- Main Screen ---------- */
export default function Goal({ navigation }) {
  // Mock data — replace with your API later
  const goals = useMemo(
    () => [
      {
        id: "1",
        title: "Charity Run Donation",
        due: "01 Jul 2025",
        goalAmount: "R2000.00",
        percent: 100,
      },
      {
        id: "2",
        title: "Wedding Budget Cap",
        due: "01 Dec 2025",
        goalAmount: "R15000.00",
        percent: 100,
      },
      {
        id: "3",
        title: "Sustainable Grocery Plan",
        due: "30 Jun 2025",
        goalAmount: "R3000.00",
        percent: 100,
      },
    ],
    []
  );

  return (
    <Layout
      activeTab="CreateGoal"
      navigation={navigation}
      onBellPress={() => navigation.navigate("Notifications")}
      onAvatarPress={() => navigation.navigate("Profile")}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchRow}>
          <Icon name="search" size={18} color="#84BD59" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search your goals..."
            placeholderTextColor="#84BD59"
            style={styles.searchInput}
          />
        </View>

        {/* 2-column responsive “feel” using stacked cards */}
        {/* Weekly Goal Completion */}
        <Card>
          <SectionHeader title="Weekly Goal Completion" />
          <View style={styles.weekGrid}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <Text key={d} style={styles.weekLabel}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.emptyRow}>
            <View style={styles.emptyEmoji}>
              <Text style={{ fontSize: 18 }}>😴</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyTitle}>Let’s get started!</Text>
              <Text style={styles.subtle}>Track your first goal progress today</Text>
            </View>
          </View>
        </Card>

        {/* Donut / Category Breakdown */}
        <Donut percent={50} />

        {/* Right column in screenshot is “Your Goals” */}
        <Card style={{ padding: 0 }}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <SectionHeader
              title="Your Goals"
              right={<Pill>Page 1 of 2</Pill>}
            />
          </View>

          <FlatList
            data={goals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                <GoalCard
                  title={item.title}
                  due={item.due}
                  goalAmount={item.goalAmount}
                  percent={item.percent}
                  onPress={() => navigation.navigate("GoalDetails", { id: item.id })}
                />
              </View>
            )}
            scrollEnabled={false}
            ListFooterComponent={
              <View style={styles.paginationRow}>
                <Pressable style={styles.paginationBtn}>
                  <Icon name="chevron-left" size={16} color="#6B7280" />
                  <Text style={styles.paginationText}>Prev</Text>
                </Pressable>
                <Pressable style={[styles.paginationBtn, styles.paginationPrimary]}>
                  <Text style={[styles.paginationText, { color: "white" }]}>Next</Text>
                  <Icon name="chevron-right" size={16} color="#fff" />
                </Pressable>
              </View>
            }
          />
        </Card>

        {/* Stat tiles like the orange-coin cards */}
        <View style={styles.statGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Icon name="database" size={20} color="#fff" />
            </View>
            <Text style={styles.statLabel}>Total Goal Target Value</Text>
            <Text style={styles.statValue}>R22000.00</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Icon name="dollar-sign" size={20} color="#fff" />
            </View>
            <Text style={styles.statLabel}>Total Goal Current Value</Text>
            <Text style={styles.statValue}>R30100.00</Text>
          </Card>
        </View>
      </ScrollView>
    </Layout>
  );
}

/** ---------- Styles ---------- */
const GREEN = "#88BC46";
const GREEN_DARK = "#0A7F2E";
const SURFACE = "#FFFFFF";
const BORDER = "#E5E7EB";
const MUTED = "#6B7280";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* Search */
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#BFE1A9",
    backgroundColor: "#F6FBF3",
    height: 44,
    borderRadius: 22,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: "#2D3A2F",
    paddingVertical: 0,
  },

  /* Cards */
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  
});