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
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  PhoneIcon,
  UserIcon,
} from 'react-native-heroicons/solid';
import Facebook from '../components/Icons/Facebook';
import GmailIcon from '../components/Icons/Gmail';
import AppleIcon from '../components/Icons/Apple';
import {primaryColor} from '../GlobalConfig/Colors';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import {createAccount} from '../functions/apiFunctions/appaccess/signup';
import {useDispatch, useSelector} from 'react-redux';
import {setUserData} from '../reduxSlices/user/userSlice';
import {getPaymentDetails} from '../functions/apiFunctions/appaccess/paymemntDetails';
import {getAccountDetails} from '../functions/apiFunctions/appaccess/getAccountDetails';
import {
  CommonActions,
  NavigationProp,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {PaymentState} from '../reduxSlices/payment/paymentSlice';
import {popAndNavigate} from '../functions/common/PopAndNavigate';

export interface PersistState {
  rehydrated: boolean;
  version: number;
}

export interface UserData {
  CODE: string;
  CUST_ID: string;
  TOKEN: string;
}

export interface UserState {
  data: UserData;
}

export interface RootState {
  _persist: PersistState;
  user: UserState;
}

type NavigationProps = NavigationProp<ParamListBase>;

export default function SignupScreen({navigation}: any) {
  const [showPassword, setShowPasswrd] = useState(false);
  const [showConfirmPassword, setShowConfirmPasswrd] = useState(false);
  const [email, setEmail] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const userData = useSelector((state: RootState) => state.user.data);
  const paymentData = useSelector(
    (state: {payment: PaymentState}) => state.payment.data,
  );
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      // Check if user has a token and no address, then navigate to Payment
      console.log(
        'checked if the user is already logged in',
        paymentData.ADDRESS,
      );
      if (userData?.TOKEN && !paymentData.ADDRESS) {
        navigation.navigate('Payment');
      }
    }, [userData, paymentData, navigation]),
  );

  useEffect(() => {
    console.log('userData', userData);
  }, [email]);

  const changeConfirmPasswordVisiblity = () => {
    setShowConfirmPasswrd(!showConfirmPassword);
  };

  const changePasswordVisiblity = () => {
    setShowPasswrd(!showPassword);
  };

  const onCreateAccount = async () => {
    console.log(email, password);

    if (password !== confirmPassword) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Password Mismatch',
        textBody:
          'The password and confirm password do not match. Please try again.',
        button: 'close',
      });
      return;
    }

    const fname = userFirstName;
    const lname = userLastName;
    const mphone = phone;
    const pass2 = password;

    try {
      const response = await createAccount(
        fname,
        lname,
        mphone,
        email,
        password,
        pass2,
      );
      if (response.ResponseCode === 200) {
        const accountDetails = await getAccountDetails(
          response.CUST_ID ? response.CUST_ID : '',
          response.TOKEN ? response.TOKEN : '',
        );
        if (accountDetails.ResponseCode === 200) {
          dispatch(
            setUserData({
              ...accountDetails,
              TOKEN: response.TOKEN,
            }),
          );
          popAndNavigate(navigation, 'Payment');
          // Handle error fetching account details
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Account Created',
            textBody: response.ResponseText,
            button: 'close',
            // onHide() {
            //   navigation.navigate('Login');
            // }
          });
        } else {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Details Fetch',
            textBody: accountDetails.ResponseText,
            button: 'close',
            // onHide() {
            //   navigation.navigate('Login');
            // }
          });
        }
        // dispatch(setUserData(response));
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Account Creation Failed',
          textBody: response.ResponseText,
          button: 'close',
        });
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody:
          'An error occurred while creating your account. Please try again later.',
        button: 'close',
      });
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView
        style={{marginBottom: 30}}
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('../assets/images/saferidelogo_b.jpg')}
          style={{alignSelf: 'center', width: 180, height: 60, marginTop: 60}}
        />
        <View style={GlobalStyles.HeadingContainer}>
          <Text style={GlobalStyles.Heading}>Sign Up</Text>
          <Text style={GlobalStyles.Paragraph}>
            Enter your Personal Information
          </Text>
        </View>
        <View style={GlobalStyles.LabelAndFieldConatiner}>
          <Text style={GlobalStyles.InputLabel}>First Name</Text>
          <View style={GlobalStyles.InputFieldConatiner}>
            <UserIcon color={primaryColor} />
            <TextInput
              textContentType="username"
              style={GlobalStyles.InputField}
              placeholder="Enter Your First Name .."
              underlineColorAndroid="transparent"
              value={userFirstName}
              onChangeText={setUserFirstName}
              placeholderTextColor={'#4E4E4E'}
            />
          </View>
        </View>
        <View style={GlobalStyles.LabelAndFieldConatiner}>
          <Text style={GlobalStyles.InputLabel}>Last Name</Text>
          <View style={GlobalStyles.InputFieldConatiner}>
            <UserIcon color={primaryColor} />
            <TextInput
              textContentType="username"
              style={GlobalStyles.InputField}
              placeholder="Enter Your Last Name .."
              underlineColorAndroid="transparent"
              value={userLastName}
              onChangeText={setUserLastName}
              placeholderTextColor={'#4E4E4E'}
            />
          </View>
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
              onChangeText={setEmail}
              placeholderTextColor={'#4E4E4E'}
            />
          </View>
        </View>
        <View style={GlobalStyles.LabelAndFieldConatiner}>
          <Text style={GlobalStyles.InputLabel}>Mobile Number</Text>
          <View style={GlobalStyles.InputFieldConatiner}>
            <PhoneIcon color={primaryColor} />
            <TextInput
              style={GlobalStyles.InputField}
              placeholder="Enter Your Mobile Number .."
              underlineColorAndroid="transparent"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
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
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
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
        <View style={GlobalStyles.LabelAndFieldConatiner}>
          <Text style={GlobalStyles.InputLabel}>Confirm Password</Text>
          <View style={GlobalStyles.InputFieldConatiner}>
            <LockClosedIcon color={primaryColor} />
            <TextInput
              textContentType="password"
              style={GlobalStyles.InputField}
              placeholder="Enter Your Confirm Password .."
              underlineColorAndroid="transparent"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor={'#4E4E4E'}
            />
            {showConfirmPassword ? (
              <EyeIcon
                onPress={changeConfirmPasswordVisiblity}
                color={primaryColor}
              />
            ) : (
              <EyeSlashIcon
                onPress={changeConfirmPasswordVisiblity}
                color={primaryColor}
              />
            )}
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={GlobalStyles.Button}
            onPress={onCreateAccount}>
            <Text style={GlobalStyles.ButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={GlobalStyles.LineContainer}>
          <View style={GlobalStyles.Line} />
          <View>
            <Text style={{color: '#4E4E4E', fontSize: 14}}>Or Signup With</Text>
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
          }}>
          <Text style={{fontSize: 16, color: '#424242'}}>
            Do you have an account?
          </Text>
          <Text
            onPress={goToLogin}
            style={{color: primaryColor, fontWeight: '500', fontSize: 16}}>
            Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}