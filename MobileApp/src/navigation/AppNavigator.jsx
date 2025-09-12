import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/Auth/LoginScreen';
import RegisterScreen from '../pages/Auth/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
