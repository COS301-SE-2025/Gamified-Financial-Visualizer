import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const CreateGoal = ({ navigation }) => {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [goalType, setGoalType] = useState('');
  const [category, setCategory] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const goalTypes = ['Savings', 'Debt Payment', 'Investment', 'Emergency Fund', 'Other'];
  const categories = ['Personal', 'Education', 'Travel', 'Home', 'Vehicle', 'Health', 'Other'];

  const handleCreateGoal = () => {
    if (!goalName || !targetAmount || !goalType || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically save the goal to your database/state
    Alert.alert('Success', 'Goal created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create a Goal</Text>
        
        {/* Goal Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Goal Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter goal name"
            value={goalName}
            onChangeText={setGoalName}
          />
        </View>

        {/* Target Amount */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Target Amount (R)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
          />
        </View>

        {/* Date Selection */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}

        {/* Goal Type */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Goal Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={goalType}
              onValueChange={(itemValue) => setGoalType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Goal Type" value="" />
              {goalTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Category */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        {/* XP Reward */}
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>XP Reward: 200 XP</Text>
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
          <Text style={styles.createButtonText}>Create Goal</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  xpContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  xpText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  createButton: {
    backgroundColor: '#6aa84f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateGoal;