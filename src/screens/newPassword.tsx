import {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  Dimensions,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from 'react-native-heroicons/solid';

import MoveBackButton from '../components/MoveBackButton';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import {primaryColor} from '../GlobalConfig/Colors';

export default function NewPasswordScreen({navigation}: any) {
  const [showPassword, setShowPasswrd] = useState(false);
  const [showConfirmPassword, setShowConfirmPasswrd] = useState(false);
  const [password, setPassword] = useState('');
  const changeConfirmPasswordVisiblity = () => {
    setShowConfirmPasswrd(!showConfirmPassword);
  };
  const changePasswordVisiblity = () => {
    setShowPasswrd(!showPassword);
  };
  const UpdatePass = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <MoveBackButton navigation={navigation} />
      <Image
        source={require('../assets/images/logo1.png')}
        style={{alignSelf: 'center'}}
      />
      <View style={GlobalStyles.HeadingContainer}>
        <Text style={GlobalStyles.Heading}>Create New Password</Text>
        <Text style={GlobalStyles.Paragraph}>
          Your new password must be unique from the previously used.
        </Text>
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
            placeholder="Enter Your Password .."
            underlineColorAndroid="transparent"
            secureTextEntry={showConfirmPassword ? false : true}
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
        <TouchableOpacity onPress={UpdatePass} style={GlobalStyles.Button}>
          <Text style={GlobalStyles.ButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
