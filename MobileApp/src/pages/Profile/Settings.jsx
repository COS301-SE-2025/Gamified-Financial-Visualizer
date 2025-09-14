import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Settings = ({ navigation }) => {
  // Sample user data
  const user = {
    username: "satoshi_nak",
    progress: "2029/2029", // Assuming this is some progress metric
    avatar: require('../../assets/Logo1.png'), // Update path as needed
  };

  // State for toggle switches
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [securityNotifications, setSecurityNotifications] = React.useState(true);

  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  const toggleSecurityNotifications = () => setSecurityNotifications(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with user info */}
        <View style={styles.header}>
          <Image source={user.avatar} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.progress}>{user.progress}</Text>
        </View>

        <View style={styles.divider} />

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="moon" size={22} color="#6aa84f" />
              <Text style={styles.optionText}>Theme</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="bell" size={22} color="#6aa84f" />
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notificationsEnabled ? "#6aa84f" : "#f4f3f4"}
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="mail" size={22} color="#6aa84f" />
              <Text style={styles.optionText}>Verification email</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="shield" size={22} color="#6aa84f" />
              <Text style={styles.optionText}>Security notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={securityNotifications ? "#6aa84f" : "#f4f3f4"}
              onValueChange={toggleSecurityNotifications}
              value={securityNotifications}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="edit-2" size={22} color="#6aa84f" />
              <Text style={styles.optionText}>Change Username</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="lock" size={22} color="#6aa84f" />
              <Text style={styles.optionText}>Current Password</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="key" size={22} color="#6aa84f" />
              <Text style={styles.optionText}>New Password</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="image" size={22} color="#6aa84f" />
              <Text style={styles.optionText}>Change Avatar</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#64748b" />
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
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  progress: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
  },
});

export default Settings;