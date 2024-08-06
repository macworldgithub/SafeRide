import {useCallback, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {ImageBackground} from 'react-native';
import {NavigationProp, ParamListBase, useFocusEffect} from '@react-navigation/native';
import {UserState} from './Signup';
import {useSelector} from 'react-redux';
import {PaymentState} from '../reduxSlices/payment/paymentSlice';

type NavigationProps = NavigationProp<ParamListBase>;
type Props = {
  navigation: NavigationProps;
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default function SplashScreen({navigation}: Props) {
  const userData = useSelector((state: {user: UserState}) => state.user.data);
  const paymentData = useSelector(
    (state: {payment: PaymentState}) => state.payment.data,
  );

  useFocusEffect(
    useCallback(() => {
      // Check if user has a token and no address, then navigate to Payment
      goToScreen();
    }, [userData, paymentData, navigation]),
  );

  const goToScreen = () => {
    const { navigate } = navigation;
    const targetScreen = userData?.TOKEN 
      ? (!paymentData.ADDRESS ? 'Payment' : 'Home') 
      : 'Home';
    navigate(targetScreen);
  };

  useEffect(() => {
    setTimeout(() => {
      goToScreen();
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/splash-bg.png')}
        style={styles.backgroundImage}>
        {/* <Image resizeMode="contain" style={styles.logo} source={require('./assets/splash-image.png')} /> */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={goToScreen}>
            <Text style={styles.head1}>Quick, Easy And Convenient</Text>
          </TouchableOpacity>

          <Text style={styles.paragraph}>
            Save on Party Bus, Limo and Luxury Van Rides
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 8,
  },
  bottomContainer: {
    paddingTop: 24,
    height: screenHeight * 0.25,
    bottom: 0,
    // marginTop: -25,
    position: 'absolute',
    backgroundColor: 'white',
    width: screenWidth,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  paragraph: {
    marginTop: 10,
    fontSize: 14,
    color: '#4E4E4E',
    textAlign: 'center',
  },
  head1: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#151515',
  },
  logo: {
    width: screenWidth * 0.75,
    height: screenHeight * 0.55,
  },
});
