import {Dimensions, StyleSheet} from 'react-native';
import {primaryColor} from './Colors';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 8,
    alignItems: 'center',
  },
  SocialLoginContainer: {
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
    width: 0.8 * screenWidth,
    marginBottom: 14,
  },
  SocialLoginBox: {
    borderWidth: 1,
    height: 45,
    borderColor: primaryColor,
    flex: 1,
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  Button: {
    backgroundColor: primaryColor,
    width: 0.8 * screenWidth,
    height: 40,
    borderRadius: 6,
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  Line: {
    height: 1,
    flex: 1,
    backgroundColor: '#4E4E4E',
  },
  LineContainer: {
    display: 'flex',
    marginVertical: 30,
    width: 0.8 * screenWidth,
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  LabelAndFieldConatiner: {
    marginBottom: 16,
    display: 'flex',
    gap: 6,
    flexDirection: 'column',
  },
  ForgotPasswordConatiner: {
    width: 0.8 * screenWidth,
  },
  ForgotPasswordTitle: {
    textAlign: 'right',
    color: '#00BFF3',
    fontSize: 14,
    fontWeight: '500',
  },
  InputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#151515'
  },
  HeadingContainer: {
    marginBottom: 23,
    marginTop: 26,
    width: 0.8 * screenWidth,
  },
  Heading: {
    fontSize: 24,
    // textAlign: "left",
    // fontFamily: "Work Sans",
    fontWeight: 'bold',
    color: '#151515'
  },
  Paragraph: {
    fontSize: 16,
    marginTop: 6,
    color: '#151515'
  },
  InputFieldConatiner: {
    borderWidth: 1,
    borderColor: primaryColor,
    width: 0.8 * screenWidth,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 6,
    paddingLeft: 13,
    paddingRight: 13,
    paddingBottom: 6,
    gap: 10,
  },
  InputField: {
    flex: 1,
    borderRadius: 6,
    color:'#000'
  },
});
export default GlobalStyles;
