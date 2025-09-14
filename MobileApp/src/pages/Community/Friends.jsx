import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Friends = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample friends data
  const friends = [
    { username: "james_link", tier: "Silver", avatar: require('../../assets/avatars/avatar1.png') },
    { username: "beached_in", tier: "Gold", avatar: require('../../assets/avatars/avatar2.png') },
    { username: "miss_smith", tier: "Gold", avatar: require('../../assets/avatars/avatar3.png') },
  ];

  // Suggested new friends
  const suggestedFriends = [
    { username: "thats_me", tier: "Platinum", avatar: require('../../assets/avatars/avatar4.png') },
    { username: "sunflower", tier: "Gold", avatar: require('../../assets/avatars/avatar5.png') },
    { username: "randy", tier: "Silver", avatar: require('../../assets/avatars/avatar6.png') },
    { username: "kyle_guy", tier: "Wood", avatar: require('../../assets/avatars/avatar7.png') },
  ];

  // Leaderboard data
  const leaderboard = [
    { rank: 1, username: "finance_guru", tier: "Platinum", xp: 4500 },
    { rank: 2, username: "investor_pro", tier: "Platinum", xp: 4200 },
    { rank: 3, username: "savings_master", tier: "Gold", xp: 3800 },
    { rank: 4, username: "thats_me", tier: "Platinum", xp: 3700 },
    { rank: 5, username: "beached_in", tier: "Gold", xp: 3500 },
  ];

  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return '#e5e4e2';
      case 'gold': return '#ffd700';
      case 'silver': return '#c0c0c0';
      case 'wood': return '#cd853f';
      default: return '#6aa84f';
    }
  };

  const getTierTextColor = (tier) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return '#333333';
      case 'gold': return '#333333';
      default: return '#ffffff';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Community</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Your Friends Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Friends</Text>
          {friends.map((friend, index) => (
            <TouchableOpacity key={index} style={styles.friendCard}>
              <Image source={friend.avatar} style={styles.avatar} />
              <View style={styles.friendInfo}>
                <Text style={styles.username}>{friend.username}</Text>
                <View style={[styles.tierBadge, { backgroundColor: getTierColor(friend.tier) }]}>
                  <Text style={[styles.tierText, { color: getTierTextColor(friend.tier) }]}>
                    {friend.tier}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.messageButton}>
                <Icon name="message-circle" size={20} color="#6aa84f" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Someone New Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Someone New</Text>
          {suggestedFriends.map((friend, index) => (
            <TouchableOpacity key={index} style={styles.friendCard}>
              <Image source={friend.avatar} style={styles.avatar} />
              <View style={styles.friendInfo}>
                <Text style={styles.username}>{friend.username}</Text>
                <View style={[styles.tierBadge, { backgroundColor: getTierColor(friend.tier) }]}>
                  <Text style={[styles.tierText, { color: getTierTextColor(friend.tier) }]}>
                    {friend.tier}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Icon name="user-plus" size={20} color="#6aa84f" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaderboard Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          {leaderboard.map((user, index) => (
            <View key={index} style={styles.leaderboardCard}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>#{user.rank}</Text>
              </View>
              <View style={styles.leaderboardInfo}>
                <Text style={styles.leaderboardUsername}>{user.username}</Text>
                <View style={styles.leaderboardDetails}>
                  <View style={[styles.tierBadge, { backgroundColor: getTierColor(user.tier) }]}>
                    <Text style={[styles.tierText, { color: getTierTextColor(user.tier) }]}>
                      {user.tier}
                    </Text>
                  </View>
                  <Text style={styles.xpText}>{user.xp} XP</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Add Friends Button */}
        <TouchableOpacity style={styles.addFriendsButton}>
          <Icon name="user-plus" size={20} color="white" />
          <Text style={styles.addFriendsText}>Add Friends</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
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
  friendCard: {
    flexDirection: 'row',
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  leaderboardCard: {
    flexDirection: 'row',
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
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6aa84f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  leaderboardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  addFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6aa84f',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  addFriendsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Friends;