import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowSmallLeftIcon } from 'react-native-heroicons/outline';
import MoveBackButton from '../components/MoveBackButton';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import { getGeocode } from '../functions/apiFunctions/common/location';
import { useSelector } from 'react-redux';

export interface RideState {
  data: RideDetails;
}

interface RideDetails {
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
}

export interface RootState {
  rideDetails: RideState;
}

export default function RequestDone({ navigation }: any) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const rideDetails = useSelector((state: RootState) => state.rideDetails.data);

  const gotoMyBookings = async () => {
    const pickup = await getGeocode(rideDetails.JOB_DIR);
    const dropoff = await getGeocode(rideDetails.JOB_DEST);
    // console.log("rideDetails.STOP_ADDRESS", rideDetails.STOP_ADDRESS);
    const midStop = !rideDetails.STOP_ADDRESS ? null : await getGeocode(rideDetails.STOP_ADDRESS);
    console.log('both location fetched');
    navigation.navigate('BookingDetails', { pickup, dropoff, midStop });
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {/* ----Top Return Icon---- */}
      <View
        style={{
          width: screenWidth * 0.8,
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
        }}>
        {/* <MoveBackButton margin={true} navigation={navigation} /> */}

        {/* Centered Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/request-done.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.text}>Booking request is done</Text>
        </View>

        {/* Bottom Button */}
        <TouchableOpacity onPress={gotoMyBookings} style={styles.button}>
          <Text style={styles.buttonText}>See My Booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 250,
    height: 250,
  },
  text: {
    marginTop: 5,
    fontSize: 20,
    color: 'black',
  },
  button: {
    backgroundColor: '#00BFF3',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
