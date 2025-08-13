import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')} // Replace with your actual logo file
        className="w-24 h-24 mb-4"
        resizeMode="contain"
      />

      {/* Title */}
      <Text className="text-2xl font-semibold text-green-900 mb-6">Register</Text>

      {/* Full Name */}
      <View className="w-full mb-4">
        <Text className="text-green-900 mb-1">Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
          className="border border-gray-400 rounded-full px-4 py-2"
        />
      </View>

      {/* Email */}
      <View className="w-full mb-4">
        <Text className="text-green-900 mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          className="border border-gray-400 rounded-full px-4 py-2"
          keyboardType="email-address"
        />
      </View>

      {/* Password */}
      <View className="w-full mb-4">
        <Text className="text-green-900 mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          className="border border-gray-400 rounded-full px-4 py-2"
        />
      </View>

      {/* Username */}
      <View className="w-full mb-6">
        <Text className="text-green-900 mb-1">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Choose a username"
          className="border border-gray-400 rounded-full px-4 py-2"
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity className="bg-lime-400 rounded-full w-full py-3 mb-4">
        <Text className="text-center text-white font-semibold">Register</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Text className="text-sm text-gray-600">
        Already have an account?{' '}
        <Text
          className="font-bold text-green-900"
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Text>
      </Text>
    </ScrollView>
  );
};

export default SignUpScreen;
