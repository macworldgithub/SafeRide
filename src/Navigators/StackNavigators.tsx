import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignupScreen from '../screens/Signup';
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import ForgetPasswordScreen from '../screens/forgetPassword';
import OTPVerificationScreen from '../screens/otpverification';
import NewPasswordScreen from '../screens/newPassword';
import RideDetails from '../screens/rideDeatils';
import RideDetailsEdit from '../screens/rideDetailsEdits';
import RequestDone from '../screens/requestDone';
import RideComplete from '../screens/rideComplete';
import SelectVehicle from '../screens/SelectVehicle';
import PaymentMethods from '../screens/PaymentMethods.';
import Settings from '../screens/Settings';
import History from '../screens/History';
import AboutUs from '../screens/AboutUs';
import ShareScreen from '../screens/Share.Screen';
import MyDrawer from './DrawerNavigator';
import ProfileSettings from '../screens/ProfileSettings';
import MapsScreen from '../screens/MapsScreen';
import SplashScreen from '../screens/SplashScreen';
import BookingDetails from '../screens/BookingDetails';

const MainStack = () => {
  const MainStack = createStackNavigator();
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Main"
        component={MyDrawer}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

export const MyStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Home"
        component={MainStack}
        options={{headerShown: false}}
      />
      <Stack.Screen name="SelectVehicle" component={SelectVehicle} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="OTP" component={OTPVerificationScreen} />
      <Stack.Screen name="RideDetails" component={RideDetails} />
      <Stack.Screen name="MapScreen" component={MapsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />

      <Stack.Screen name="RideComplete" component={RideComplete} />
      <Stack.Screen name="RideDetailsEdit" component={RideDetailsEdit} />
      <Stack.Screen name="RequestDone" component={RequestDone} />
      <Stack.Screen name="Payment" component={PaymentMethods} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="Share" component={ShareScreen} />
      <Stack.Screen name="Profile" component={ProfileSettings} />
    </Stack.Navigator>
  );
};
