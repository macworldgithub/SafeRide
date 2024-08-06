import {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  Dimensions,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import MoveBackButton from '../components/MoveBackButton';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import {primaryColor} from '../GlobalConfig/Colors';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
export default function OTPVerificationScreen({navigation}: any) {
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [otp4, setOtp4] = useState('');
  const [otp5, setOtp5] = useState('');
  const ref = useRef();
  const onSendCodePress = () => {
    console.group(otp1 + otp2 + otp3 + otp4 + otp5);
    navigation.navigate('NewPassword');
  };
  const ResendCode = () => {
    console.group(otp1 + otp2 + otp3 + otp4 + otp5);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <MoveBackButton navigation={navigation} />
      <Image
        source={require('../assets/images/logo1.png')}
        style={{alignSelf: 'center'}}
      />
      <View style={GlobalStyles.HeadingContainer}>
        <Text style={GlobalStyles.Heading}>OTP Verification</Text>
        <Text style={GlobalStyles.Paragraph}>
          Please enter the verification code we just sent you.
        </Text>
      </View>
      <View style={GlobalStyles.LabelAndFieldConatiner}>
        <View
          style={{
            display: 'flex',
            gap: 10,
            flexDirection: 'row',
            width: screenWidth * 0.8,
            marginTop: 6,
          }}>
          <TextInput
            style={styles.InputBox}
            placeholder="X"
            maxLength={1}
            keyboardType="numeric"
            value={otp1}
            onChangeText={val => setOtp1(val)}
          />
          <TextInput
            style={styles.InputBox}
            placeholder="X"
            maxLength={1}
            keyboardType="numeric"
            value={otp2}
            onChangeText={val => setOtp2(val)}
          />
          <TextInput
            style={styles.InputBox}
            placeholder="X"
            keyboardType="numeric"
            maxLength={1}
            value={otp3}
            onChangeText={val => setOtp3(val)}
          />
          <TextInput
            style={styles.InputBox}
            placeholder="X"
            keyboardType="numeric"
            maxLength={1}
            value={otp4}
            onChangeText={val => setOtp4(val)}
          />
          <TextInput
            style={styles.InputBox}
            placeholder="X"
            keyboardType="numeric"
            maxLength={1}
            value={otp5}
            onChangeText={val => setOtp5(val)}
          />
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={onSendCodePress} style={GlobalStyles.Button}>
          <Text style={GlobalStyles.ButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          marginTop: 20,
        }}>
        <Text style={{fontSize: 16}}>Don't Recieve Code??</Text>
        <Text
          onPress={ResendCode}
          style={{color: primaryColor, fontWeight: '500', fontSize: 16}}>
          Resend it
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  InputBox: {
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    textAlign: 'center',
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: primaryColor,
  },
});
