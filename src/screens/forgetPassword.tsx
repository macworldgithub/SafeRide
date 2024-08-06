import {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {EnvelopeIcon} from 'react-native-heroicons/solid';
import MoveBackButton from '../components/MoveBackButton';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import {primaryColor} from '../GlobalConfig/Colors';
import {forgotPassword} from '../functions/apiFunctions/appaccess/forgot';
import {
  AlertNotificationRoot,
  Dialog,
  ALERT_TYPE,
} from 'react-native-alert-notification';

export default function ForgetPasswordScreen({navigation}: any) {
  const [email, setEmail] = useState('');
  const [lname, setLname] = useState('');

  const handleDialogClose = () => {
    navigation.navigate('Login'); // Navigate to login screen after dialog is closed
  };

  const onSendCodePress = async () => {
    try {
      const response = await forgotPassword(email, lname);
      if (response.ResponseCode === 200) {
        Dialog.show({
          type: ALERT_TYPE.INFO,
          title: '',
          textBody: response.ResponseText,
          button: 'Close',
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: response.ResponseText,
          button: 'Close',
        });
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody:
          'An error occurred while sending the reset code. Please try again.',
        button: 'Close',
      });
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View 
        style={{
          width:'83%',
        }}
      >
        <MoveBackButton navigation={navigation} />
      </View>
      <Image
        source={require('../assets/images/saferidelogo_b.jpg')}
        style={{alignSelf: 'center', width: 180, height: 60}}
      />
      <View style={GlobalStyles.HeadingContainer}>
        <Text style={GlobalStyles.Heading}>Forgot Password</Text>
        <Text style={GlobalStyles.Paragraph}>
          Please enter the email address or mobile number linked with your
          account.
        </Text>
      </View>
      <View style={GlobalStyles.LabelAndFieldConatiner}>
        <Text style={GlobalStyles.InputLabel}>Email</Text>
        <View style={GlobalStyles.InputFieldConatiner}>
          <EnvelopeIcon color={primaryColor} />
          <TextInput
            style={GlobalStyles.InputField}
            placeholder="Enter Your Email .."
            underlineColorAndroid="transparent"
            value={email}
            onChangeText={val => setEmail(val)}
          />
        </View>
        <Text style={GlobalStyles.InputLabel}>Last Name</Text>
        <View style={GlobalStyles.InputFieldConatiner}>
          <EnvelopeIcon color={primaryColor} />
          <TextInput
            style={GlobalStyles.InputField}
            placeholder="Enter Your Last Name .."
            underlineColorAndroid="transparent"
            value={lname}
            onChangeText={val => setLname(val)}
          />
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={onSendCodePress} style={GlobalStyles.Button}>
          <Text style={GlobalStyles.ButtonText}>Send Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
