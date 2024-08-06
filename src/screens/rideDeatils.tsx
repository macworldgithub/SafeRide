import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Linking,
  Modal
} from 'react-native';
import CryptoJS from 'crypto-js';
import {XMLParser} from 'fast-xml-parser';
import React, {useState} from 'react';
import {
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ChevronDownIcon,
  XMarkIcon
} from 'react-native-heroicons/solid';
import ModalSelector from 'react-native-modal-selector';
import MoveBackButton from '../components/MoveBackButton';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import {useSelector} from 'react-redux';
import {saveReservation} from '../functions/apiFunctions/appaccess/saveReservation';
import {UserState} from '../reduxSlices/user/userSlice';
import {completeReservation} from '../functions/apiFunctions/appaccess/completeReservation';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {CommonActions} from '@react-navigation/native';
import {getReservation} from '../functions/apiFunctions/reservation/getSingleReservation';
import {formatNumbersWithCommas, showRideType} from '../functions/common/useful';
import {WebView} from 'react-native-webview';

export interface PersistState {
  rehydrated: boolean;
  version: number;
}

interface RideDetails {
  data: {
    APP_TYPE: string;
    JOB_TYPE: string;
    JOB_DATE: string;
    JOB_START: string;
    JOB_DIR: string;
    JOB_CITY: string;
    JOB_STATE: string;
    JOB_ZIP: string;
    STOP_ADDRESS: string;
    STOP_CITY: string;
    STOP_STATE: string;
    STOP_RETURN: string;
    JOB_DEST: string;
    DEST_CITY: string;
    DEST_STATE: string;
    DEST_ZIP: string;
    RETURN: string;
    JOB_HOURS: string;
    JOB_INSTR: string;
    PEOPLE: string;
    VEH_ID: string;
    VEH_RATE: string;
    TOTAL: string;
    DONATION: string;
  };
}

export interface RootState {
  _persist: PersistState;
  rideDetails: RideDetails;
}

export default function RideDetails({navigation}: any) {
  const [dropOffLocation, setDropOffLocation] = useState('To ABC Location...');
  const [money, setMoney] = useState('10 USD');
  const [date, setDate] = useState('01/05/2024');
  const [time, setTime] = useState('03:30 PM');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [pickupLocation, setPickupLocation] = useState('To ABC Location...');
  const [isAgree, setIsAgree] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState('One Way');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    'Payment Method By Cash',
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  const rideDetails = useSelector((state: RootState) => state.rideDetails);
  const userData = useSelector((state: {user: UserState}) => state.user.data);

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const today = getFormattedDate();
  const code = CryptoJS.MD5(today).toString();
  console.log(code);

  const handleGoAHead = async () => {
    if (!isAgree) {
      Dialog.show({
        type: ALERT_TYPE.INFO,
        title: 'Oops',
        textBody: 'Kindly agree to terms and conditions first',
        button: 'Close',
      });
      return;
    }
    const response = await saveReservation({
      CODE: '',
      APP_TYPE: rideDetails.data.APP_TYPE,
      JOB_TYPE: rideDetails.data.JOB_TYPE,
      JOB_DATE: rideDetails.data.JOB_DATE,
      JOB_START: rideDetails.data.JOB_START,
      JOB_DIR: rideDetails.data.JOB_DIR,
      JOB_CITY: rideDetails.data.JOB_CITY,
      JOB_STATE: rideDetails.data.JOB_STATE,
      JOB_ZIP: rideDetails.data.JOB_ZIP,
      STOP_ADDRESS: rideDetails.data.STOP_ADDRESS,
      STOP_CITY: rideDetails.data.STOP_CITY,
      STOP_STATE: rideDetails.data.STOP_STATE,
      STOP_RETURN: rideDetails.data.STOP_RETURN,
      JOB_DEST: rideDetails.data.JOB_DEST,
      DEST_CITY: rideDetails.data.DEST_CITY,
      DEST_STATE: rideDetails.data.DEST_STATE,
      DEST_ZIP: rideDetails.data.DEST_ZIP,
      RETURN: rideDetails.data.RETURN,
      JOB_HOURS: rideDetails.data.JOB_HOURS,
      JOB_INSTR: rideDetails.data.JOB_INSTR,
      PEOPLE: rideDetails.data.PEOPLE,
      VEH_ID: rideDetails.data.VEH_ID,
      VEH_RATE: rideDetails.data.VEH_RATE,
      TOKEN: userData.TOKEN,
      CUST_ID: userData.CUST_ID,
    });

    if (response && response.ResponseCode === 200) {
      console.log('Saving was successful', response);
      // Call completeReservation API
      const completeResResponse = await completeReservation({
        APP_TYPE: rideDetails.data.APP_TYPE,
        CUST_ID: userData.CUST_ID,
        TOKEN: userData.TOKEN,
        DRAFT_ID: response.DRAFT_ID ?? '',
        HOW: selectedPaymentMethod === "Payment Method By Cash" ? "CASH" : "CC",
        JOB_INSTR: additionalInformation
      });

      console.log('completeResResponse', completeResResponse);
      if (completeResResponse && completeResResponse.ResponseCode === 200) {
        // if (true) {
        Dialog.show({
          type: ALERT_TYPE.INFO,
          title: 'Success',
          textBody: completeResResponse.ResponseText,
          button: 'Close',
          onHide: () => {
            const reservationResponse = getReservation(
              userData.CUST_ID,
              userData.TOKEN,
              completeResResponse.RES_ID ? completeResResponse.RES_ID : '',
            );
            console.log('reservationResponse', reservationResponse);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'RequestDone'}],
              }),
            );
            // navigation.navigate('RequestDone');
          },
        });
      } else if (completeResResponse.ResponseCode === 500) {
        // Handle error
        Dialog.show({
          type: ALERT_TYPE.INFO,
          title: 'Error completing reservation',
          textBody: `${completeResResponse.ResponseText}`,
          button: 'Close',
          onHide() {
            // console.log('first', navigation);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'Home'}],
              }),
            );
          },
        });
        console.error(
          'Error completing reservation:',
          completeResResponse?.ResponseText,
        );
      }
    } else if (response && response.ResponseCode === 500) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error saving draft',
        textBody: response.ResponseText,
        button: 'Close',
      });
    } else {
      // console.error(
      //   'Error saving reservation:',
      //   response?.ResponseText,
      // );
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error in draft',
        textBody: response?.ResponseText,
        button: 'Close',
      });
    }
  };

  const openURLButton = async () => {
    const url = 'https://saferides.org/terms.aspx';
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView
        style={{width: screenWidth * 0.8}}
        showsVerticalScrollIndicator={false}>
        {/* ----Top Return Icon---- */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MoveBackButton navigation={navigation} margin={true} />
          <Text
            style={{
              color: '#000',
              width: '80%',
              marginTop: 15,
              fontSize: 18,
              textAlign: 'center',
            }}>
            Review and Book
          </Text>
        </View>

        {/* ---Top Three---- */}
        {/* <View style={styles.TopButtonContainer}>
          <Text style={styles.HeadingText}>Ride Details</Text>
          {!isEdit && (
            <TouchableOpacity onPress={() => setIsEdit(!isEdit)}>
              <Text style={styles.HeadingBlueText}>Edit Details</Text>
            </TouchableOpacity>
          )}
        </View> */}

        {/* ----Inputs---- */}
        <View style={styles.InputContainer}>
          {isEdit ? (
            <ModalSelector
              data={[
                {key: 'One Way', label: 'One Way'},
                {key: 'Round Trip', label: 'Round Trip'},
                {key: 'Hourly', label: 'Hourly'},
              ]}
              initValue="Select Payment Method"
              onChange={option => setSelectedRideType(option.key)}>
              <View style={styles.InputWrapperEdit}>
                <TruckIcon color="#00BFF3" />
                <TextInput
                  style={[styles.TextInputEdit, {color: 'black'}]}
                  value={selectedRideType}
                  editable={false}
                />
              </View>
            </ModalSelector>
          ) : (
            <View style={styles.LineContainer}>
              <View style={styles.InnerContainer}>
                <TruckIcon color="#00BFF3" />
                <Text style={[styles.TextClass, {marginLeft: 10}]}>
                  Ride Type
                </Text>
              </View>
              <Text style={styles.TextClass}>
                {showRideType(rideDetails.data.JOB_TYPE)}
              </Text>
            </View>
          )}

          <View style={styles.LineContainer}>
            <View style={styles.InnerContainer}>
              <CalendarIcon color="#00BFF3" />
              <Text style={[styles.TextClass, {marginLeft: 10}]}>
                Pickup Date
              </Text>
            </View>
            {isEdit ? (
              <TextInput
                style={styles.TextInputEdit}
                value={date}
                onChangeText={setDate}
              />
            ) : (
              <Text style={styles.TextClass}>{rideDetails.data.JOB_DATE}</Text>
            )}
          </View>

          <View style={styles.LineContainer}>
            <View style={styles.InnerContainer}>
              <ClockIcon color="#00BFF3" />
              <Text style={[styles.TextClass, {marginLeft: 10}]}>
                Pickup Time
              </Text>
            </View>
            {isEdit ? (
              <TextInput
                style={styles.TextInputEdit}
                value={time}
                onChangeText={setTime}
              />
            ) : (
              <Text style={styles.TextClass}>{rideDetails.data.JOB_START}</Text>
            )}
          </View>

          <View style={styles.LineContainer}>
            <View style={styles.InnerContainer}>
              <MapPinIcon color="#00BFF3" />
              <Text style={[styles.TextClass, {marginLeft: 10}]}>Pickup</Text>
            </View>
            {isEdit ? (
              <TextInput
                style={styles.TextInputEdit}
                value={pickupLocation}
                onChangeText={setPickupLocation}
              />
            ) : (
              <Text
                style={[
                  styles.TextClass,
                  {
                    width: '60%',
                    textAlign: 'right',
                  },
                ]}>
                {rideDetails.data.JOB_DIR}
              </Text>
            )}
          </View>

          <View style={styles.LineContainer}>
            <View style={styles.InnerContainer}>
              <MapPinIcon color="#00BFF3" />
              <Text style={[styles.TextClass, {marginLeft: 10}]}>Dropoff</Text>
            </View>
            {isEdit ? (
              <TextInput
                style={styles.TextInputEdit}
                value={dropOffLocation}
                onChangeText={setDropOffLocation}
              />
            ) : (
              <Text
                style={[
                  styles.TextClass,
                  {
                    width: '60%',
                    textAlign: 'right',
                  },
                ]}>
                {rideDetails.data.JOB_TYPE !== "H" ? rideDetails.data.JOB_DEST : "..."}
              </Text>
            )}
          </View>

          <View style={styles.LineContainer}>
            <View style={styles.InnerContainer}>
              <CurrencyDollarIcon color="#00BFF3" />
              <Text style={[styles.TextClass, {marginLeft: 10}]}>
                Ride Cost
              </Text>
            </View>
            {isEdit ? (
              <TextInput
                style={styles.TextInputEdit}
                value={money}
                onChangeText={setMoney}
              />
            ) : (
              <Text style={styles.TextClass}>
                ${formatNumbersWithCommas(parseInt(rideDetails.data.VEH_RATE))}
              </Text>
            )}
          </View>

          {!isEdit && (
            <>
              <View style={styles.LineContainer}>
                <View style={styles.InnerContainer}>
                  <CurrencyDollarIcon color="#00BFF3" />
                  <Text style={[styles.TextClass, { marginLeft: 10 }]}>
                    Fee/Donation
                  </Text>
                </View>
                <Text style={styles.TextClass}>${rideDetails.data.DONATION}</Text>
              </View>

              {/* <View style={styles.LineContainer}>
                <View style={styles.InnerContainer}>
                  <CalendarIcon color="#00BFF3" />
                  <Text style={[styles.TextClass, { marginLeft: 10 }]}>
                    Card Attached
                  </Text>
                </View>
                <Text style={styles.TextClass}></Text>
              </View> */}
            </>
          )}

          <Text style={{marginVertical: 2, color: '#000'}}>Select Payment Method</Text>

          {isEdit ? (
            <ModalSelector
              data={[
                {
                  key: 'Payment Method By Card',
                  label: 'Payment Method By Card',
                },
                {
                  key: 'Payment Method By Cash',
                  label: 'Payment Method By Cash',
                },
              ]}
              initValue="Select Payment Method"
              onChange={option => setSelectedPaymentMethod(option.key)}>
              <View style={styles.InputWrapperEdit}>
                <CalendarIcon color="#00BFF3" />
                <TextInput
                  style={[styles.TextInputEdit, {color: 'black'}]}
                  value={selectedPaymentMethod}
                  editable={false}
                />
                <ChevronDownIcon color="#00BFF3" />
              </View>
            </ModalSelector>
          ) : (
            <ModalSelector
              data={[
                {
                  key: 'Payment Method By Card',
                  label: 'Payment Method By Card',
                },
                {
                  key: 'Payment Method By Cash',
                  label: 'Payment Method By Cash',
                },
              ]}
              initValue="Select Payment Method To Driver"
              onChange={option => setSelectedPaymentMethod(option.key)}>
              <View style={styles.InputWrapperEdit}>
                <CalendarIcon color="#00BFF3" style={{marginLeft: -10}} />
                <TextInput
                  style={[
                    styles.TextInputEdit,
                    {color: 'black', marginLeft: -3},
                  ]}
                  value={selectedPaymentMethod}
                  editable={false}
                />
                <ChevronDownIcon color="#00BFF3" style={{marginLeft: 20}} />
              </View>
            </ModalSelector>
          )}

          <Text style={{marginVertical: 0, color: '#000'}}>
            * 3.5% fee is added for Credit Card Payments
          </Text>          

          <Text style={{marginVertical: 10}}>Additional Information</Text>

          <View style={styles.InputWrapper}>
            <PencilIcon color="#00BFF3" style={{marginTop: 20}} />
            <TextInput
              style={styles.TextInput}
              value={additionalInformation}
              onChangeText={setAdditionalInformation}
              editable={true}
              placeholder="Additional Information"
              placeholderTextColor={'#242424'}
            />
          </View>
        </View>

        {/* Checkbox for agreeing with terms */}
        {!isEdit && (
          <View style={styles.CheckboxContainer}>
            <TouchableOpacity
              style={[
                styles.CheckboxButton,
                {backgroundColor: isAgree ? '#00BFF3' : 'white'},
              ]}
              onPress={() => setIsAgree(!isAgree)}>
              {isAgree && (
                <CheckIcon color={isAgree ? 'white' : '#00BFF3'} size={15} />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
            <Text style={styles.CheckboxText} onPress={()=>setIsModalVisible(true)}>
              Agree with{' '}
              <Text style={{color: '#00BFF3'}} >
                terms
              </Text>{' '}
              of booking
            </Text>
            </TouchableOpacity>
           
          </View>
        )}

        {/* Finish Booking button */}
        <TouchableOpacity
          style={styles.finishBookingButton}
          onPress={handleGoAHead}>
          <Text style={styles.finishBookingButtonText}>Finish Booking</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
         <View style={styles.ModalContainer}>
          <View style={styles.ModalContent}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.ModalCloseButton}>
              <XMarkIcon size={24} color="#000" />
            </TouchableOpacity>
            <WebView source={{ uri: 'https://saferides.org/terms.aspx' }}/>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  TextClass: {
    color: 'black',
    fontSize: 13,
  },

  TopButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
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

  InputContainer: {
    marginTop: 20,
  },
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
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  TextInput: {
    flex: 1,
    alignItems: 'flex-start',
    height: 60,
    padding: 10,
    color: '#000',
  },
  TextInputEdit: {
    flex: 1,
    alignItems: 'flex-start',
    height: 40,
    padding: 10,
    marginLeft: 10,
  },
  CheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
    marginTop: 10,
  },
  CheckboxButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#00BFF3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 5,
  },
  CheckboxText: {
    fontSize: 16,
    color: 'black',
  },
  finishBookingButton: {
    backgroundColor: '#00BFF3',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  finishBookingButtonText: {
    color: 'white',
    fontSize: 18,
  },
  InputWrapperEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00BFF3',
    justifyContent: 'space-between',
  },

  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ModalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  ModalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  ModalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  }


});
