import { createNativeStackNavigator } from '@react-navigation/native-stack';

{/**Auth */}
import LoginScreen from '../pages/Auth/LoginScreen';
import RegisterScreen from '../pages/Auth/RegisterScreen';
import HomeScreen from '../pages/Dashboard/HomeScreen';

{/**Account pages */}
import Transactions from '../pages/Accounts/Transaction'; 
import Budget from '../pages/Accounts/Budget';
import Imports from '../pages/Accounts/Imports'; 
import Insights from '../pages/Accounts/Insights';

{/**Community Pages */}
import Challenges from '../pages/Community/Challenges';
import Communities from '../pages/Community/Community'; 
import Friends from '../pages/Community/Friends';
import Social from '../pages/Community/Social';

{/**Goals */}
import Goal from '../pages/Goals/Goal';
import CreateGoal from '../pages/Goals/CreateGoal';

{/**Profile */}
import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Profile/Settings';

{/**Support */}
import FAQs from '../pages/Supports/FAQs';
import Overview from '../pages/Supports/Overview';
import Tutorials from '../pages/Supports/Tutorials';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="Budget" component={Budget} />
      <Stack.Screen name="Insights" component={Insights} />
      <Stack.Screen name="Imports" component={Imports} />
      <Stack.Screen name="Goal" component={Goal} />
      <Stack.Screen name="CreateGoal" component={CreateGoal} />
      <Stack.Screen name="Social" component={Social} />
      <Stack.Screen name="Friends" component={Friends} />
      <Stack.Screen name="Communities" component={Communities} /> {/* Fixed: Changed to "Communities" */}
      <Stack.Screen name="Challenges" component={Challenges} />
      <Stack.Screen name="Tutorials" component={Tutorials} />
      <Stack.Screen name="FAQs" component={FAQs} />
      <Stack.Screen name="Overview" component={Overview} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} /> 
    </Stack.Navigator>
  );
}