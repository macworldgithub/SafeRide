import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {useCallback, useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from 'react-native-heroicons/solid';
import Facebook from '../components/Icons/Facebook';
import GmailIcon from '../components/Icons/Gmail';
import AppleIcon from '../components/Icons/Apple';

import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import {primaryColor} from '../GlobalConfig/Colors';
import {loginAccount} from '../functions/apiFunctions/appaccess/login';
import {useDispatch} from 'react-redux';
import {setUserData} from '../reduxSlices/user/userSlice';
import {getAccountDetails} from '../functions/apiFunctions/appaccess/getAccountDetails';
import {useSelector} from 'react-redux';
import {
  CommonActions,
  NavigationProp,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {getPaymentDetails} from '../functions/apiFunctions/appaccess/paymemntDetails';
import {
  PaymentState,
  setPaymentData,
} from '../reduxSlices/payment/paymentSlice';
import { RideDetails } from '../reduxSlices/ride/rideSlice';
import { popAndNavigate } from '../functions/common/PopAndNavigate';

type NavigationProps = NavigationProp<ParamListBase>;

type Props = {
  navigation: NavigationProps;
  route: any;
};

export interface UserState {
  data: {
    CUST_ID: string;
    TOKEN: string;
    CODE: string;
    FNAME: string;
    LNAME: string;
    MPHONE: string;
    EMAIL: string;
  };
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [showPassword, setShowPasswrd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const paymentData = useSelector(
    (state: {payment: PaymentState}) => state.payment.data,
  );
  const userData = useSelector((state: {user: UserState}) => state.user.data);
  const rideDetails = useSelector((state: {rideDetails: RideDetails}) => state.rideDetails.data);

  console.log("rideDetails in LOGIN ", rideDetails);


  useFocusEffect(
    useCallback(() => {
      // Check if user has a token and no address, then navigate to Payment
      console.log('checked if the user is already logged in', paymentData.ADDRESS, userData?.TOKEN);
      if (userData?.TOKEN && !paymentData.ADDRESS) {
        navigation.navigate('Payment');
      } else if (userData?.TOKEN && paymentData.ADDRESS) {
        navigation.navigate('Home');
      }
    }, [userData, paymentData, navigation]),
  );

  const changePasswordVisiblity = () => {
    setShowPasswrd(!showPassword);
  };

  const goToForgetPassword = () => {
    navigation.navigate('ForgetPassword');
  };
  const onLoginPress = async () => {
    console.log('tried to login', email, password);
    const response = await loginAccount(email, password);
    if (response.ResponseCode === 200) {
      dispatch(setUserData(response));
      const accountDetails = await getAccountDetails(
        response.CUST_ID ? response.CUST_ID : '',
        response.TOKEN ? response.TOKEN : '',
      );
      const paymentDetails = await getPaymentDetails(
        response.CUST_ID ? response.CUST_ID : '',
        response.TOKEN ? response.TOKEN : '',
      );
      if (
        accountDetails.ResponseCode === 200 &&
        paymentDetails.ResponseCode === 200
      ){
        dispatch(setUserData(accountDetails));
        dispatch(setPaymentData(paymentDetails));
      }else {

      }
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Login Success',
        textBody: response.ResponseText,
        button: 'Close',
        onHide: async () => {
          console.log('paymentDetails from LOGIN', paymentDetails);
          if (accountDetails.ResponseCode === 200 && paymentDetails.ResponseCode === 200) {
            if (paymentDetails.ResponseText?.toString() === 'No credit card stored') {
              navigation.navigate('Payment');
              return;
            }
            if (rideDetails.DEST_CITY) {
              popAndNavigate(navigation, 'RideDetails');              
            }else{
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'Home' },
                  ],
                })
              );
            }
            // Handle error fetching account details
          } else {
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'Error',
              textBody: `${accountDetails.ResponseText}${paymentDetails.ResponseText}`,
              button: 'Close',
            });
          }
        },
      });
    } else {
      // Show alert notification for wrong password
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Login Failed',
        textBody: response.ResponseText,
        button: 'Close',
      });
    }
  };

  const goToSignUp = () => {
    navigation.navigate('Signup');
  };

  useEffect(() => {
    if (userData.CUST_ID || userData.TOKEN || userData.CODE) {
      console.log('CUST_ID:', userData.CUST_ID);
      console.log('TOKEN:', userData.TOKEN);
      console.log('CODE:', userData.CODE);
      console.log('Full name', userData.FNAME);
      console.log('Last name', userData.LNAME);
      console.log('Phone', userData.MPHONE);
      console.log('Email', userData.EMAIL);
    }
  }, [userData]);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView
        style={{marginBottom: 30}}
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('../assets/images/saferidelogo_b.jpg')}
          style={{alignSelf: 'center', marginTop: 100, width:180, height:60}}
        />
        <View style={GlobalStyles.HeadingContainer}>
          <Text style={GlobalStyles.Heading}>Login</Text>
          <Text style={GlobalStyles.Paragraph}>
            Login to continue using the app.
          </Text>
        </View>
        <View style={GlobalStyles.LabelAndFieldConatiner}>
          <Text style={GlobalStyles.InputLabel}>Email</Text>
          <View style={GlobalStyles.InputFieldConatiner}>
            <EnvelopeIcon color={primaryColor} />
            <TextInput
              textContentType="emailAddress"
              style={GlobalStyles.InputField}
              placeholder="Enter Your Email .."
              underlineColorAndroid="transparent"
              value={email}
              onChangeText={val => setEmail(val)}
              placeholderTextColor={'#4E4E4E'}
            />
          </View>
        </View>
        <View style={GlobalStyles.LabelAndFieldConatiner}>
          <Text style={GlobalStyles.InputLabel}>Password</Text>
          <View style={GlobalStyles.InputFieldConatiner}>
            <LockClosedIcon color={primaryColor} />
            <TextInput
              textContentType="password"
              style={GlobalStyles.InputField}
              placeholder="Enter Your Password .."
              underlineColorAndroid="transparent"
              secureTextEntry={showPassword ? false : true}
              value={password}
              onChangeText={val => setPassword(val)}
              placeholderTextColor={'#4E4E4E'}
            />
            {showPassword ? (
              <EyeIcon onPress={changePasswordVisiblity} color={primaryColor} />
            ) : (
              <EyeSlashIcon
                onPress={changePasswordVisiblity}
                color={primaryColor}
              />
            )}
          </View>
        </View>
        <View style={GlobalStyles.ForgotPasswordConatiner}>
          <Text
            onPress={goToForgetPassword}
            style={GlobalStyles.ForgotPasswordTitle}>
            Forgot Password ?
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={onLoginPress} style={GlobalStyles.Button}>
            <Text style={GlobalStyles.ButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={GlobalStyles.LineContainer}>
          <View style={GlobalStyles.Line} />
          <View>
            <Text style={{color: '#4E4E4E', fontSize: 14}}>Or Login With</Text>
          </View>
          <View style={GlobalStyles.Line} />
        </View> */}

        {/* <View style={GlobalStyles.SocialLoginContainer}>
          <TouchableOpacity style={GlobalStyles.SocialLoginBox}>
            <Facebook />
          </TouchableOpacity>
          <TouchableOpacity style={GlobalStyles.SocialLoginBox}>
            <GmailIcon />
          </TouchableOpacity>
          <TouchableOpacity style={GlobalStyles.SocialLoginBox}>
            <AppleIcon />
          </TouchableOpacity>
        </View> */}

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            marginTop: 10,
          }}>
          <Text style={{fontSize: 16, color: '#151515'}}>
            Don't have an account?
          </Text>
          <Text
            onPress={goToSignUp}
            style={{color: primaryColor, fontWeight: '500', fontSize: 16}}>
            Register
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;