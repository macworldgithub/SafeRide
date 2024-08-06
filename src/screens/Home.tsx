import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Bars4Icon,
  ClockIcon,
  ExclamationCircleIcon,
} from 'react-native-heroicons/outline';
import {UserIcon, CalendarIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {primaryColor} from '../GlobalConfig/Colors';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import {ChooseService} from '../components/Home/ChooseService';
import {
  getGeocode,
  getLocations,
} from '../functions/apiFunctions/common/location';
import {LocationSugessionList} from '../components/Home/LocationSugessionList';
import DatePicker from 'react-native-date-picker';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {UserState} from '../reduxSlices/user/userSlice';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {clearRideData ,RideDetails, setRideData} from '../reduxSlices/ride/rideSlice';
import {StopDropDown} from '../components/Home/StopDropDown';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Loader} from '../components/common/Loader';

type NavigationProps = NavigationProp<ParamListBase>;

interface Address {
  address: string;
  fulladdress: string;
}

type Props = {
  navigation: NavigationProps;
};

export interface PersistState {
  rehydrated: boolean;
  version: number;
}

const origin = {latitude: 40.7128, longitude: -74.006};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export default function HomeScreen({navigation}: Props) {
  const [pickupLocation, setPickupLocation] = useState({
    value: '',
    selected: false,
  });
  const [loading, setLoading] = useState(false);
  const [dropOffLocation, setDropOffLocation] = useState({
    value: '',
    selected: false,
  });
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const [passengerCount, setPassengerCount] = useState('');
  const [date, setDate] = useState({
    value: new Date(),
    selected: false,
  });
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [openReturnTime, setOpeReturnTime] = useState<boolean>(false);
  // const [time, setTime] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<Address[]>([]);
  const [dropOffSuggestions, setDropOffSuggestions] = useState<Address[]>([]);
  const [stopSuggestions, setStopSuggestions] = useState<Address[]>([]);
  const [selectedService, setSelectedService] = useState('R');
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  const [error, setError] = useState<string | null>(null);
  const [hours, setHours] = useState('');
  const userData = useSelector((state: {user: UserState}) => state.user.data);
  const rideDetails = useSelector((state: {rideDetails: RideDetails}) => state.rideDetails.data);
  const [stop, setStop] = useState({
    value: '',
    selected: false,
  });
  const [stopExist, setStopExist] = useState({
    selected: false,
    value: 'Any stops ?(Optional)',
  });
  const [passengerToolTipVisible, setPassengerToolTipVisible] = useState(false);
  const [hourToolTipVisible, setHourToolTipVisible] = useState(false);
  const [returnTime, setReturnTime] = useState({
    value: new Date(),
    selected: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("rideDetails", rideDetails);
  }, []);
  

  useEffect(() => {
    if (
      (parseInt(passengerCount) > 55 || isNaN(parseInt(passengerCount))) &&
      passengerCount !== ''
    ) {
      setPassengerToolTipVisible(true);
    }
  }, [passengerCount]);

  useEffect(() => {
    if ((parseInt(hours) > 55 || isNaN(parseInt(hours))) && hours !== '') {
      setHourToolTipVisible(true);
    }
  }, [hours]);

  const resetAllValue = () => {
    setPickupLocation({
      value: '',
      selected: false,
    });
    setDropOffLocation({
      value: '',
      selected: false,
    });
    setPassengerCount('');
    setPickupSuggestions([]);
    setDropOffSuggestions([]);
    setDate({
      value: new Date(),
      selected: false,
    });
    setReturnTime({
      value: new Date(),
      selected: false,
    });
    setStop({
      selected: false,
      value: '',
    });
    setHours('');
    setStopExist({
      selected: false,
      value: 'Any stops ?(Optional)',
    });
  };

  function isDateAhead(date: Date) {
    const currentDate = new Date();
    const dateToCompare = new Date(date);

    const fifteenMinAhead = new Date(
      currentDate.getTime() + 0.25 * 60 * 60 * 1000,
    );

    // Compare the given date with the calculated date
    return dateToCompare >= fifteenMinAhead;
  }

  const createFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  const finishBooking = async () => {
    if (
      !pickupLocation.selected ||
      (selectedService !== 'H' && !dropOffLocation.selected) ||
      passengerCount === '' ||
      !date.selected ||
      isNaN(parseInt(passengerCount)) ||
      (!stopExist.selected && stop.value !== '')
    ) {
      Dialog.show({
        type: ALERT_TYPE.INFO,
        title: 'Oops',
        textBody: 'Please select service type and all required fields',
        button: 'Close',
      });
      return;
    }
    if (selectedService === 'H' && isNaN(parseInt(hours))) {
      Dialog.show({
        type: ALERT_TYPE.INFO,
        title: 'Oops',
        textBody: 'Kindly add valid hours 😊',
        button: 'Close',
      });
      return;
    }
    if (!isDateAhead(date.value)) {
      Dialog.show({
        type: ALERT_TYPE.INFO,
        title: 'Oops',
        textBody: 'Kindly select a valid date time 😣',
        button: 'Close',
      });
      return;
    }
    if (selectedService === 'R' && !returnTime.selected) {
      Dialog.show({
        type: ALERT_TYPE.INFO,
        title: 'Oops',
        textBody: 'Kindly select a valid return time 😣',
        button: 'Close',
      });
      return;
    }
    setLoading(true);
    try {
      const pickup = await getGeocode(pickupLocation.value);
      const dropoff = dropOffLocation.value
        ? await getGeocode(dropOffLocation.value)
        : await getGeocode(pickupLocation.value);
      const midStop = stop.value ? await getGeocode(stop.value) : undefined;
      date.value.setSeconds(0);
      const rideData = {
        APP_TYPE: 'A',
        JOB_TYPE: selectedService,
        JOB_DATE: createFormattedDate(date.value),
        JOB_START: date.value.toLocaleTimeString([], options),
        JOB_DIR: pickupLocation.value,
        JOB_CITY: pickup.cityCode,
        JOB_STATE: pickup.stateCode,
        JOB_ZIP: '',
        JOB_DEST: dropOffLocation.value ? dropOffLocation.value : pickupLocation.value,
        JOB_HOURS: hours,
        JOB_INSTR: '',
        STOP_ADDRESS: stop.value,
        STOP_CITY: midStop?.cityCode,
        STOP_STATE: midStop?.stateCode,
        STOP_RETURN: stopExist.value === "Stop Both Ways" ? 'Yes' : 'No',
        DEST_CITY: dropoff?.cityCode,
        DEST_STATE: dropoff?.stateCode,
        DEST_ZIP: '',
        RETURN: returnTime.value.toLocaleTimeString([], options),
        PEOPLE: passengerCount,
        VEH_ID: '',
        VEH_RATE: '',
      };
      dispatch(setRideData(rideData));
      // Log the state after dispatching
      setError(null);
      navigation.navigate('MapScreen', {pickup, dropoff, midStop});
      setLoading(false);
      resetAllValue();
    } catch (error) {
      setLoading(false);
      setError('Failed to get locations. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedService !== '') {
      resetAllValue();
    }
  }, [selectedService]);

  //pickup location value change
  useEffect(() => {
    const getLocation = async () => {
      const locationList = await getLocations(pickupLocation.value, origin);
      // console.log('Locations found', locationList);
      setPickupSuggestions(locationList);
    };
    getLocation();
  }, [pickupLocation.value]);

  //dropoff location value change
  useEffect(() => {
    const getLocation = async () => {
      const locationList = await getLocations(dropOffLocation.value, origin);
      setDropOffSuggestions(locationList);
    };
    getLocation();
  }, [dropOffLocation.value]);

  //stop location value change
  useEffect(() => {
    const getLocation = async () => {
      const locationList = await getLocations(stop.value, origin);
      setStopSuggestions(locationList);
    };
    getLocation();
  }, [stop.value]);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          style={{width: screenWidth * 0.8}}
          showsVerticalScrollIndicator={false}>
          {/* ---Top Three---- */}
          <View style={styles.TopButtonContainer}>
            {/* @ts-ignore */}
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Bars4Icon color={'black'} />
            </TouchableOpacity>
            <View>
              <Text style={{color: '#4E4E4E'}}>Have a cool day!</Text>
              <Text style={styles.HeadingText}>
                {userData.FNAME ? userData.FNAME : 'Guest'}
              </Text>
            </View>
            <View>
              <Text style={{color: '#151515'}}>
                {new Date().getDate() > 9 ? '' : '0'}
                {new Date().getDate()}
              </Text>
              <Text style={styles.HeadingText}>
                {months[new Date().getMonth()]}
              </Text>
            </View>
          </View>

          {/* ----Bus Container---- */}
          <View style={styles.BusContainer}>
            <View style={styles.LeftContent}>
              <Text
                style={[
                  styles.HeadingText,
                  {color: 'white', fontSize: 18, marginBottom: 3},
                ]}>
                Safe<Text style={{color: '#00BFF3'}}>Rides</Text>
                .org
              </Text>
              <Text style={{color: 'white', fontSize: 12}}>
                Experience quick, easy and convenient transportation in a
                luxury vehicle
              </Text>
            </View>
            <View style={styles.RightContent}>
              <Image
                source={require('../assets/images/home-car.png')}
                style={{width: 120, height: 80}}
              />
            </View>
          </View>

          {/* ----Choose Service---- */}
          <View style={styles.ServiceContainer}>
            <Text style={styles.ServiceHeading}>Choose Service</Text>
            <ChooseService
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          </View>

          {/* ----Inputs---- */}
          <View style={styles.InputContainer}>
            <View style={styles.InputWrapper}>
              <MapPinIcon color="#00BFF3" />
              <TextInput
                style={styles.TextInput}
                placeholder="Pickup Location"
                placeholderTextColor={'#4E4E4E'}
                value={pickupLocation.value}
                onChangeText={value =>
                  setPickupLocation({
                    ...pickupLocation,
                    value,
                  })
                }
              />
            </View>
            <LocationSugessionList
              value={pickupLocation}
              setValue={setPickupLocation}
              addressList={pickupSuggestions}
            />
            {selectedService !== "H" && <>
              <View style={styles.InputWrapper}>
                <MapPinIcon color="#00BFF3" />
                <TextInput
                  style={styles.TextInput}
                  placeholder="Drop-off Location"
                  placeholderTextColor={'#4E4E4E'}
                  value={dropOffLocation.value}
                  onChangeText={value =>
                    setDropOffLocation({
                      ...dropOffLocation,
                      value,
                    })
                  }
                />
              </View>
              <LocationSugessionList
                value={dropOffLocation}
                setValue={setDropOffLocation}
                addressList={dropOffSuggestions}
              />
            </>}
            <View
              style={[
                styles.InputWrapper,
                {
                  borderColor:
                    (isNaN(parseInt(passengerCount)) ||
                      0 > parseInt(hours) ||
                      parseInt(passengerCount) > 55) &&
                    passengerCount !== ''
                      ? 'red'
                      : 'transparent',
                  borderWidth: 1,
                },
              ]}>
              <UserIcon color="#00BFF3" />
              <Tooltip
                isVisible={passengerToolTipVisible}
                content={
                  <Text>
                    Value must be a number and can not be greater then 55.
                  </Text>
                }
                placement="top"
                onClose={() => setPassengerToolTipVisible(false)}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Number of Passengers"
                  placeholderTextColor={'#4E4E4E'}
                  value={passengerCount}
                  maxLength={2}
                  onChangeText={setPassengerCount}
                  keyboardType="number-pad"
                  returnKeyType="done"
                />
              </Tooltip>
            </View>
            <TouchableOpacity
              style={[styles.InputWrapper, {height: 50}]}
              onPress={() => setOpenDate(true)}>
              <CalendarIcon color="#00BFF3" />
              <DatePicker
                modal
                open={openDate}
                date={date.value}
                onConfirm={date => {
                  setOpenDate(false);
                  setDate({
                    value: date,
                    selected: true,
                  });
                }}
                mode="datetime"
                onCancel={() => {
                  setOpenDate(false);
                }}
                // onCancel={() => console.log("first")}
              />
              <Text
                style={{
                  marginHorizontal: 10,
                  color: '#4E4E4E',
                }}>
                {!date.selected
                  ? 'Select date time(Example 8:30pm)'
                  : date.value.toDateString() +
                    ' ' +
                    date.value.toLocaleTimeString([], options)}
              </Text>
            </TouchableOpacity>
            {selectedService === 'R' && (
              <TouchableOpacity
                style={[styles.InputWrapper, {height: 50}]}
                onPress={() => setOpeReturnTime(true)}>
                <ClockIcon color="#00BFF3" />
                <DatePicker
                  modal
                  open={openReturnTime}
                  date={returnTime.value}
                  onConfirm={date => {
                    setOpeReturnTime(false);
                    setReturnTime({
                      value: date,
                      selected: true,
                    });
                  }}
                  mode="time"
                  onCancel={() => {
                    setOpeReturnTime(false);
                  }}
                  // onCancel={() => console.log("first")}
                />
                <Text
                  style={{
                    marginHorizontal: 10,
                    color: '#4E4E4E',
                  }}>
                  {!returnTime.selected
                    ? 'Select return time(Example 8:30pm)'
                    : returnTime.value.toLocaleTimeString([], options)}
                </Text>
              </TouchableOpacity>
            )}
            {selectedService === 'H' && (
              <View
                style={[
                  styles.InputWrapper,
                  {
                    borderWidth: 2,
                    borderColor:
                      (isNaN(parseInt(hours)) ||
                        0 > parseInt(hours) ||
                        parseInt(hours) > 55) &&
                      hours !== ''
                        ? 'red'
                        : 'transparent',
                  },
                ]}>
                <ClockIcon color="#00BFF3" />
                <Tooltip
                  isVisible={hourToolTipVisible}
                  content={
                    <Text>
                      Value must be a number and can not be greater then 55.
                    </Text>
                  }
                  placement="top"
                  onClose={() => setHourToolTipVisible(false)}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Number of Hours"
                    placeholderTextColor={'#4E4E4E'}
                    value={hours ? hours : ''}
                    onChangeText={setHours}
                    keyboardType="number-pad"
                    returnKeyType="done"
                  />
                </Tooltip>
              </View>
            )}
            {selectedService !== 'H' && (
              <View style={styles.InputWrapper}>
                <ExclamationCircleIcon color="#00BFF3" />
                <StopDropDown
                  returnType={stopExist}
                  setReturnValue={setStopExist}
                  serviceType={selectedService}
                />
              </View>
            )}
            {(selectedService === 'R' || selectedService === 'W') &&
              stopExist.value !== 'Any stops ?(Optional)' && (
                <>
                  <View style={styles.InputWrapper}>
                    <MapPinIcon color="#00BFF3" />
                    <TextInput
                      style={styles.TextInput}
                      placeholder="Stop Location"
                      placeholderTextColor={'#4E4E4E'}
                      value={stop.value}
                      onChangeText={text =>
                        setStop({
                          ...stop,
                          value: text,
                        })
                      }
                    />
                  </View>
                  <LocationSugessionList
                    value={stop}
                    setValue={setStop}
                    addressList={stopSuggestions}
                  />
                </>
              )}
          </View>
          {/* Finish Booking button */}
          <TouchableOpacity
            onPress={finishBooking}
            style={styles.finishBookingButton}>
            <Text style={styles.finishBookingButtonText}>Continue</Text>
          </TouchableOpacity>
          <Loader color={primaryColor} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  TopButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 12,
    marginVertical: 10,
    marginTop: 20,
  },
  HamBurger: {
    width: 39,
    // borderRadius: 50,
  },
  MidContainer: {},
  HeadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#151515',
  },
  BusContainer: {
    backgroundColor: '#000',
    height: 130,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 10,
    marginTop: 20,
  },
  LeftContent: {
    flex: 1,
  },
  RightContent: {
    marginLeft: 20,
  },
  ServiceContainer: {
    marginTop: 20,
  },
  ServiceHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#151515',
  },
  MiniContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Options: {
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    width: '30%',
    height: 70,
  },
  SelectedService: {
    borderColor: '#00BFF3',
    borderWidth: 2,
  },
  InputContainer: {
    marginTop: 20,
  },
  InputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    paddingLeft: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 1,
      height: 5,
    },
  },
  TextInput: {
    flex: 1,
    height: 40,
    padding: 10,
    color: '#151515',
  },
  finishBookingButton: {
    backgroundColor: primaryColor,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  finishBookingButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
