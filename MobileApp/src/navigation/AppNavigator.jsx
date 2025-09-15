// src/navigation/AppNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth
import LoginScreen from '../pages/Auth/LoginScreen';
import RegisterScreen from '../pages/Auth/RegisterScreen';
import HomeScreen from '../pages/Dashboard/HomeScreen';

// Accounts
import Transaction from '../pages/Accounts/Transaction';
import Budget from '../pages/Accounts/Budget'; // Fixed import
import Import from '../pages/Accounts/Import';
import Insights from '../pages/Accounts/Insights';

// Community
import Challenges from '../pages/Community/Challenges';
import Community from '../pages/Community/Community';
import Friends from '../pages/Community/Friends';
import Social from '../pages/Community/Social';

// Goals
import Goal from '../pages/Goals/Goal';
import CreateGoal from '../pages/Goals/CreateGoal';

// Profile
import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Profile/Settings';

// Support
import FAQs from '../pages/Supports/FAQs';
import Overview from '../pages/Supports/Overview';
import Tutorials from '../pages/Supports/Tutorials';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      {/* Auth Group */}
      <React.Fragment>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </React.Fragment>
      
      {/* Main */}
      <Stack.Screen name="Home" component={HomeScreen} />
      
      {/* Accounts Group */}
      <React.Fragment>
        <Stack.Screen name="Transaction" component={Transaction} />
        <Stack.Screen name="Budget" component={Budget} />
        <Stack.Screen name="Insights" component={Insights} />
        <Stack.Screen name="Import" component={Import} />
      </React.Fragment>
      
      {/* Goals Group */}
      <React.Fragment>
        <Stack.Screen name="Goal" component={Goal} />
        <Stack.Screen name="CreateGoal" component={CreateGoal} />
      </React.Fragment>
      
      {/* Community Group */}
      <React.Fragment>
        <Stack.Screen name="Social" component={Social} />
        <Stack.Screen name="Friends" component={Friends} />
        <Stack.Screen name="Community" component={Community} />
        <Stack.Screen name="Challenges" component={Challenges} />
      </React.Fragment>
      
      {/* Support Group */}
      <React.Fragment>
        <Stack.Screen name="Tutorials" component={Tutorials} />
        <Stack.Screen name="FAQs" component={FAQs} />
        <Stack.Screen name="Overview" component={Overview} />
      </React.Fragment>
      
      {/* Profile Group */}
      <React.Fragment>
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Profile" component={Profile} />
      </React.Fragment>
    </Stack.Navigator>
  );
}