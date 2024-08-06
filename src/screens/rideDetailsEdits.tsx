import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {ArrowSmallLeftIcon} from 'react-native-heroicons/outline';
import {
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TruckIcon,
} from 'react-native-heroicons/solid';
import {Picker} from '@react-native-picker/picker';
import ModalSelector from 'react-native-modal-selector';

export default function RideDetailsEdit() {
  const [pickupLocation, setPickupLocation] = useState('To ABC Location...');
  const [dropOffLocation, setDropOffLocation] = useState(
    'From ABC Location...',
  );
  const [money, setMoney] = useState('10 USD');
  const [date, setDate] = useState('01/05/2024');
  const [time, setTime] = useState('03:30 PM');
  const [additionalInformation, setadditionalInformation] = useState('');
  const [isAgree, setIsAgree] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Option 1');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  return (
    <SafeAreaView style={{paddingHorizontal: 15, backgroundColor: ''}}>
      <ScrollView>
        {/* ----Top Return Icon---- */}
        <TouchableOpacity style={styles.TopBack}>
          <ArrowSmallLeftIcon color="black" size={20} />
        </TouchableOpacity>

        {/* ---Top Three---- */}
        <View style={styles.TopButtonContainer}>
          <Text style={styles.HeadingText}>Ride Details</Text>
        </View>

        {/* ----Inputs---- */}
        <View style={styles.InputContainer}>
          <ModalSelector
            data={[
              {key: 'Payment Method By Card', label: 'Payment Method By Card'},
              {key: 'Payment Methid By Cash', label: 'Payment Methid By Cash'},
            ]}
            initValue="Select Payment Method"
            onChange={option => setSelectedOption(option.key)}>
            <View style={styles.InputWrapperEdit}>
              <CalendarIcon color="#00BFF3" />
              <TextInput
                style={[styles.TextInputEdit, {color: 'black'}]}
                value={selectedOption}
                editable={false}
              />
            </View>
          </ModalSelector>

          <View style={styles.InputWrapperEdit}>
            <CalendarIcon color="#00BFF3" />
            <TextInput
              style={styles.TextInputEdit}
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={styles.InputWrapperEdit}>
            <ClockIcon color="#00BFF3" />
            <TextInput
              style={styles.TextInputEdit}
              value={time}
              onChangeText={setTime}
            />
          </View>

          <View style={styles.InputWrapperEdit}>
            <MapPinIcon color="#00BFF3" />
            <TextInput
              style={styles.TextInputEdit}
              value={dropOffLocation}
              onChangeText={setDropOffLocation}
            />
          </View>

          <View style={styles.InputWrapperEdit}>
            <MapPinIcon color="#00BFF3" />
            <TextInput
              style={styles.TextInputEdit}
              value={pickupLocation}
              onChangeText={setPickupLocation}
            />
          </View>

          <View style={styles.InputWrapperEdit}>
            <CurrencyDollarIcon color="#00BFF3" />
            <TextInput
              style={styles.TextInputEdit}
              value={money}
              onChangeText={setMoney}
            />
          </View>

          {/* Dropdowns */}

          <ModalSelector
            data={[
              {key: 'One Way', label: 'One Way'},
              {key: 'Round Trip', label: 'Round Trip'},
              {key: 'Hourly', label: 'Hourly'},
            ]}
            initValue="Select Payment Method"
            onChange={option => setSelectedCurrency(option.key)}>
            <View style={styles.InputWrapperEdit}>
              <CalendarIcon color="#00BFF3" />
              <TextInput
                style={[styles.TextInputEdit, {color: 'black'}]}
                value={selectedCurrency}
                editable={false}
              />
            </View>
          </ModalSelector>

          <Text style={{marginVertical: 10}}>Additional Information</Text>

          <View style={styles.InputWrapper}>
            <PencilIcon color="#00BFF3" />
            <TextInput
              style={styles.TextInput}
              value={additionalInformation}
              onChangeText={setadditionalInformation}
            />
          </View>
        </View>

        {/* Finish Booking button */}
        <TouchableOpacity style={styles.finishBookingButton}>
          <Text style={styles.finishBookingButtonText}>Save Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  InputWrapperEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
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
  TextInputEdit: {
    flex: 1,
    height: 40,
    padding: 10,
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
  TopBack: {
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    width: '13%',
    height: 40,
    marginHorizontal: 15,
  },
  TopButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    marginVertical: 10,
    marginTop: 20,
    marginHorizontal: 15,
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
    paddingHorizontal: 20,
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
});
