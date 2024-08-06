import 'expo-dev-client';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React from 'react';
import {useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {MyStack} from './src/Navigators/StackNavigators';
import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import store, {persistor} from './src/redux/store';
import { AlertNotificationRoot } from 'react-native-alert-notification';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertNotificationRoot>
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        </AlertNotificationRoot>
      </PersistGate>
    </Provider>
  );
}

export default App;

registerRootComponent(App);
