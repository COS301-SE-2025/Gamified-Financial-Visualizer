import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Profile = ({ navigation }) => {
  // Sample user data
  const user = {
    username: "satoshi_nak",
    avatar: require('../../assets/Logo1.png'), // Update path as needed
    tier: "Silver",
    xp: 2029,
    level: 15,
  };

  // Sample communities data
  const communities = [
    { name: "Cash cows", members: "$Members", xp: 604 },
    { name: "Investment Club", members: "245 Members", xp: 892 },
    { name: "Savings Heroes", members: "189 Members", xp: 456 },
    { name: "Budget Masters", members: "312 Members", xp: 723 },
  ];

  // Sample user statistics
  const userStats = {
    goalsCompleted: 12,
    goalsInProgress: 3,
    totalSavings: 12500,
    daysActive: 87,
    challengesCompleted: 8,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with user info */}
        <View style={styles.header}>
          <Image source={user.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>{user.tier} Tier</Text>
            </View>
            <View style={styles.xpContainer}>
              <Icon name="award" size={16} color="#6aa84f" />
              <Text style={styles.xpText}>{user.xp} XP • Level {user.level}</Text>
            </View>
          </View>
        </View>

        {/* Active Communities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Communities</Text>
          {communities.map((community, index) => (
            <View key={index} style={styles.communityCard}>
              <View style={styles.communityInfo}>
                <Text style={styles.communityName}>{community.name}</Text>
                <Text style={styles.communityMembers}>{community.members}</Text>
              </View>
              <View style={styles.xpBadge}>
                <Text style={styles.xpBadgeText}>{community.xp} XP</Text>
              </View>
            </View>
          ))}
        </View>

        {/* User Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.goalsCompleted}</Text>
              <Text style={styles.statLabel}>Goals Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.goalsInProgress}</Text>
              <Text style={styles.statLabel}>Goals in Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${userStats.totalSavings.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Savings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.daysActive}</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.challengesCompleted}</Text>
              <Text style={styles.statLabel}>Challenges Completed</Text>
            </View>
          </View>
        </View>

        {/* Additional Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="settings" size={20} color="#6aa84f" />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Achievements')}
          >
            <Icon name="award" size={20} color="#6aa84f" />
            <Text style={styles.actionButtonText}>Achievements</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  tierBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tierText: {
    color: '#6aa84f',
    fontSize: 14,
    fontWeight: '600',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    color: '#64748b',
    fontSize: 14,
    marginLeft: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  communityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  communityMembers: {
    fontSize: 14,
    color: '#64748b',
  },
  xpBadge: {
    backgroundColor: '#f0f9eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpBadgeText: {
    color: '#6aa84f',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6aa84f',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    color: '#6aa84f',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Profile;