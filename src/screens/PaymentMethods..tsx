// TODO: call the item
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {
  CalendarIcon,
  MapPinIcon,
  LockClosedIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PhoneIcon,
  GlobeAmericasIcon,
  CreditCardIcon,
  UserCircleIcon,
  BuildingLibraryIcon,
} from 'react-native-heroicons/solid';
import MoveBackButton from '../components/MoveBackButton';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useDispatch, useSelector } from 'react-redux';
import {
  PaymentState,
  setPaymentData,
} from '../reduxSlices/payment/paymentSlice';
import AddPaymentInfoComponent from '../components/AddPaymentInfoComponent';
import {
  getPaymentDetails,
  updatePaymentDetails,
} from '../functions/apiFunctions/appaccess/paymemntDetails';
import { UserState } from '../reduxSlices/user/userSlice';
import { RideDetails } from '../reduxSlices/ride/rideSlice';
import { popAndNavigate } from '../functions/common/PopAndNavigate';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PaymentMethods({ navigation, route }: any) {
  const paymentData = useSelector(
    (state: { payment: PaymentState }) => state.payment.data,
  );
  const userData = useSelector((state: { user: UserState }) => state.user.data);
  const rideDetails = useSelector(
    (state: { rideDetails: RideDetails }) => state.rideDetails.data,
  );

  // States
  const [cardTypeCode, setCardTypeCode] = useState(paymentData.CC_TYPE);
  const [cardType, setCardType] = useState('');
  const [holderName, setHolderName] = useState(
    paymentData.CC_NAME ? paymentData.CC_NAME : '',
  );
  const [cardNumber, setCardNumber] = useState(
    paymentData.CC_NO ? paymentData.CC_NO : '',
  );
  const [valid, setValid] = useState(
    paymentData.CC_MO ? `${paymentData.CC_MO}/${paymentData.CC_YR}` : '',
  );
  const [phone, setPhone] = useState(
    paymentData.PHONE ? paymentData.PHONE : userData.MPHONE,
  );
  const [state, setState] = useState(
    paymentData.STATE ? paymentData.STATE : '',
  );
  const [zip, setZip] = useState(paymentData.ZIP ? paymentData.ZIP : '');
  const [securityCode, setSecurityCode] = useState('');
  const [city, setCity] = useState(paymentData.CITY);
  const [address, setAddress] = useState(paymentData.ADDRESS);
  const [havePaymentInfo, setHavePaymentInfo] = useState(
    paymentData.ResponseText == 'No credit card stored' ? false : true,
  );
  const [updateInfo, setUpdateInfo] = useState(false);
  const dispatch = useDispatch();
  const cardTypesData = [
    { title: 'American Express', value: 'A' },
    { title: 'Discover', value: 'D' },
    { title: 'MasterCard', value: 'M' },
    { title: 'Visa', value: 'V' },
  ];
  const ConvertCardTypeCodeToName = () => {
    if (cardTypeCode == 'A') {
      setCardType('American Express');
    } else if (cardTypeCode == 'D') {
      setCardType('Discover');
    } else if (cardTypeCode == 'M') {
      setCardType('MasterCard');
    } else if (cardTypeCode == 'V') {
      setCardType('Visa');
    } else {
      setCardType('Select your Card Type');
    }
  };
  const CheckValidThroughDate = () => {
    if (parseInt(valid[0]) >= 2) {
      setValid(`0` + valid[0] + '/');
    } else if (parseInt(valid[0]) == 1 && parseInt(valid[1]) > 2) {
      setValid(`0` + valid[0] + '/' + valid[1]);
    }
    if (valid.length == 3 && valid[2] != '/') {
      setValid(valid[0] + valid[1] + '/' + valid[2]);
    }
  };

  const UpdateCardInfo = async () => {
    if (
      !cardNumber ||
      !cardType ||
      !phone ||
      !valid ||
      !securityCode ||
      !city ||
      !address
    ) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Updation Failed',
        textBody: 'Please fill all fields',
        button: 'Close',
      });
    } else {
      const response = await updatePaymentDetails(
        userData.CUST_ID,
        userData.TOKEN,
        cardType,
        cardNumber,
        address,
        city,
        securityCode,
        valid,
        phone,
        holderName,
        state,
        zip,
      );
      if (response.ResponseCode === 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Updated Successfully',
          textBody: response.ResponseText,
          button: 'Close',
          onHide: async () => {
            const paymentDetails = await getPaymentDetails(
              userData.CUST_ID ? userData.CUST_ID : '',
              userData.TOKEN ? userData.TOKEN : '',
            );

            if (paymentDetails.ResponseCode === 200) {
              dispatch(setPaymentData(paymentDetails));
              setHavePaymentInfo(true);
              setUpdateInfo(false);
              // Handle error fetching account details
            } else {
              Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: paymentDetails.ResponseText,
                button: 'Close',
              });
            }
          },
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Updation Failed',
          textBody: response.ResponseText,
          button: 'Close',
        });
      }
      console.log(
        cardNumber,
        cardType,
        phone,
        valid,
        securityCode,
        city,
        address,
      );
    }
  };

  useEffect(() => {
    CheckValidThroughDate();
  }, [valid]);
  useEffect(() => {
    ConvertCardTypeCodeToName();
  }, []);
  useEffect(() => {
    ConvertCardTypeCodeToName();
  }, [updateInfo, havePaymentInfo]);
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView style={{ width: screenWidth * 0.8 }} showsVerticalScrollIndicator={false}>
          {/* ----Top Return Icon---- */}

          <View>
            <MoveBackButton navigation={navigation} margin={true} />
          </View>
          {havePaymentInfo ? (
            <View>
              {/* ----image container---- */}
              <View style={styles.imageContainer}>
                <Image
                  source={require('../assets/images/cardimage.png')}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              {/* ----Inputs---- */}
              <View style={styles.InputContainer}>
                <Text style={styles.Labels}>Card Holder Name</Text>
                <View style={styles.InputWrapperEdit}>
                  <UserCircleIcon color="#00BFF3" size={22} />
                  <TextInput
                    style={styles.TextInputEdit}
                    value={holderName}
                    editable={updateInfo ? true : false}
                    onChangeText={setHolderName}
                    placeholderTextColor={'#c0c0c0'}
                    placeholder="Name"
                  />
                </View>

                <Text style={styles.Labels}>Card Type</Text>
                {updateInfo ? (
                  <SelectDropdown
                    data={cardTypesData}
                    onSelect={selectedItem => {
                      setCardType(selectedItem.value);
                    }}
                    renderButton={(selectedItem, isOpened) => {
                      return (
                        <View style={styles.dropdownButtonStyle}>
                          <Text style={styles.dropdownButtonTxtStyle}>
                            {(selectedItem && selectedItem.title) || cardType}
                          </Text>
                          {isOpened ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </View>
                      );
                    }}
                    renderItem={(item, index, isSelected) => {
                      return (
                        <View
                          style={{
                            ...styles.dropdownItemStyle,
                            ...(isSelected && { backgroundColor: '#D2D9DF' }),
                          }}>
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item.title}
                          </Text>
                        </View>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                  />
                ) : (
                  <View style={styles.InputWrapperEdit}>
                    <CreditCardIcon color="#00BFF3" size={17} />
                    <TextInput
                      placeholder="000"
                      keyboardType="numeric"
                      editable={updateInfo ? true : false}
                      style={styles.TextInputEdit}
                      placeholderTextColor={'#c0c0c0'}
                      value={cardType}
                    />
                  </View>
                )}

                <Text style={styles.Labels}>Card number</Text>
                <View style={styles.InputWrapperEdit}>
                  <CreditCardIcon color="#00BFF3" size={17} />
                  <TextInput
                    maxLength={16}
                    style={styles.TextInputEdit}
                    placeholder="2221005746802089"
                    value={cardNumber?.toString()}
                    placeholderTextColor={'#c0c0c0'}
                    editable={updateInfo ? true : false}
                    keyboardType="numeric"
                    onChangeText={setCardNumber}
                  />
                </View>

                {updateInfo && (
                  <>
                    <Text style={styles.Labels}>Security Code</Text>
                    <View style={styles.InputWrapperEdit}>
                      <LockClosedIcon color="#00BFF3" size={17} />
                      <TextInput
                        placeholder="000"
                        keyboardType="numeric"
                        editable={updateInfo ? true : false}
                        style={styles.TextInputEdit}
                        value={securityCode?.toString()}
                        placeholderTextColor={'#c0c0c0'}
                        maxLength={cardType == 'A' ? 4 : 3}
                        onChangeText={setSecurityCode}
                      />
                    </View>
                  </>
                )}

                <Text style={styles.Labels}>Valid Thru</Text>
                <View style={styles.InputWrapperEdit}>
                  <CalendarIcon color="#00BFF3" size={17} />
                  <TextInput
                    style={styles.TextInputEdit}
                    placeholder="MM/YY"
                    editable={updateInfo ? true : false}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholderTextColor={'#c0c0c0'}
                    value={valid}
                    onChangeText={setValid}
                  />
                </View>

                {/* <Text style={styles.Labels}>Phone</Text>
              <View style={styles.InputWrapperEdit}>
                <PhoneIcon color="#00BFF3" size={17} />
                <TextInput
                  style={styles.TextInputEdit}
                  placeholder="XXXXXXXXXX"
                  maxLength={11}
                  editable={updateInfo ? true : false}
                  value={phone?.toString()}
                  placeholderTextColor={"#c0c0c0"}
                  keyboardType="phone-pad"
                  onChangeText={setPhone}
                />
              </View> */}

                <Text style={styles.Labels}>Address</Text>
                <View style={styles.InputWrapperEdit}>
                  <MapPinIcon color="#00BFF3" size={17} />
                  <TextInput
                    style={styles.TextInputEdit}
                    placeholder="132, My Street, Kingston, New York 12401"
                    value={address}
                    placeholderTextColor={'#c0c0c0'}
                    editable={updateInfo ? true : false}
                    onChangeText={setAddress}
                  />
                </View>

                <Text style={styles.Labels}>City</Text>
                <View style={styles.InputWrapperEdit}>
                  <GlobeAmericasIcon color="#00BFF3" size={17} />
                  <TextInput
                    style={styles.TextInputEdit}
                    placeholder="Los Angeles"
                    editable={updateInfo ? true : false}
                    value={city}
                    placeholderTextColor={'#c0c0c0'}
                    onChangeText={setCity}
                  />
                </View>

                <Text style={styles.Labels}>State</Text>
                <View style={styles.InputWrapperEdit}>
                  <GlobeAmericasIcon color="#00BFF3" size={17} />
                  <TextInput
                    style={styles.TextInputEdit}
                    placeholder="LA"
                    editable={updateInfo ? true : false}
                    maxLength={2}
                    value={state}
                    placeholderTextColor={'#c0c0c0'}
                    onChangeText={setState}
                  />
                </View>

                <Text style={styles.Labels}>Zip Code</Text>
                <View style={styles.InputWrapperEdit}>
                  <BuildingLibraryIcon color="#00BFF3" size={17} />
                  <TextInput
                    style={styles.TextInputEdit}
                    placeholder="75056"
                    editable={updateInfo ? true : false}
                    maxLength={5}
                    value={zip?.toString()}
                    placeholderTextColor={'#c0c0c0'}
                    onChangeText={setZip}
                  />
                </View>

              </View>

              {/* Finish Booking button */}
              {updateInfo ? (
                <TouchableOpacity
                  onPress={UpdateCardInfo}
                  style={styles.finishBookingButton}>
                  <Text style={styles.finishBookingButtonText}>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setUpdateInfo(true)}
                  style={styles.finishBookingButton}>
                  <Text style={styles.finishBookingButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
              {paymentData?.ADDRESS && (
                <TouchableOpacity
                  onPress={() => {
                    if (rideDetails.JOB_DEST) {
                      popAndNavigate(navigation, 'RideDetails');
                    } else {
                      navigation.navigate('Home');
                    }
                  }}
                  style={styles.finishBookingButton}>
                  <Text style={styles.finishBookingButtonText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <AddPaymentInfoComponent
              setUpdateInfo={setUpdateInfo}
              paymentData={paymentData}
              setHavePaymentInfo={setHavePaymentInfo}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: '100%',
    // height: 50,
    marginBottom: 10,

    backgroundColor: 'white',
    // borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 12,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  InputWrapperEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  TextInputEdit: {
    flex: 1,
    height: 40,
    padding: 10,
    color: '#424242',
  },
  PickerStyle: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  TextClass: {
    color: 'black',
    fontSize: 13,
  },

  TopButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginTop: 20,
  },
  MidContainer: {},
  HeadingText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  HeadingBlueText: {
    color: '#00BFF3',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  InputContainer: {},
  LineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#00BFF3',
    paddingBottom: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  InnerContainer: {
    flexDirection: 'row',
  },
  InputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: 'gray',
    shadowOpacity: 0.5,
  },
  TextInput: {
    flex: 1,
    alignItems: 'flex-start',
    height: 60,
    padding: 10,
  },
  finishBookingButton: {
    backgroundColor: '#00BFF3',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  finishBookingButtonText: {
    color: 'white',
    fontSize: 18,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: -30,
  },
  image: {
    width: screenWidth * 0.8,
    height: 300,
  },
  Labels: {
    color: 'black',
    fontSize: 12,
    paddingLeft: 3,
    marginBottom: 5,
  },
});
