import 'react-native-gesture-handler';
import './global.css'; // web only; harmless on native

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#f6f7f9' },
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <AppNavigator />
    </NavigationContainer>
  );
}
