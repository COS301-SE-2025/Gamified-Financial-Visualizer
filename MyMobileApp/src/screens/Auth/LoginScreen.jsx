import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')} // Replace with your actual logo path
        className="w-24 h-24 mb-4"
        resizeMode="contain"
      />

      {/* Title */}
      <Text className="text-2xl font-semibold text-green-900 mb-6">Login</Text>

      {/* Username Input */}
      <View className="w-full mb-4">
        <Text className="text-green-900 mb-1">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          className="border border-gray-400 rounded-full px-4 py-2"
          placeholder="Enter username"
        />
      </View>

      {/* Password Input */}
      <View className="w-full mb-6">
        <Text className="text-green-900 mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border border-gray-400 rounded-full px-4 py-2"
          placeholder="Enter password"
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity className="bg-lime-400 rounded-full w-full py-3 mb-4">
        <Text className="text-center text-white font-semibold">Login</Text>
      </TouchableOpacity>

      {/* Footer Link */}
      <Text className="text-sm text-gray-600">
        New to the Gamified Finance?{' '}
        <Text
          className="font-bold text-green-900"
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
