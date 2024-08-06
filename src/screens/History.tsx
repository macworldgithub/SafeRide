import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MoveBackButton from '../components/MoveBackButton';
import {useSelector, useDispatch} from 'react-redux';
import {setRideData} from '../reduxSlices/ride/rideSlice';
import {getReservations} from '../functions/apiFunctions/appaccess/getReservations';
import {getGeocode} from '../functions/apiFunctions/common/location';
import {getReservation} from '../functions/apiFunctions/reservation/getSingleReservation';
import {Loader} from '../components/common/Loader';
import {primaryColor} from '../GlobalConfig/Colors';

interface Reservation {
  RES_ID: string;
  JOB_TYPE: string;
  START_TIME: string;
  JOB_DIR: string;
  JOB_CITY: string;
  JOB_STATE: string;
  JOB_DEST: string;
  DEST_CITY: string;
  DEST_STATE: string;
  PEOPLE: string;
  VEH_ID: string;
  VEH_NAME: string;
}

interface XmlResGetRes {
  COUNT: number;
  RESERVATION: Reservation[];
  RES_TIME: string;
}

const History = ({navigation}: any) => {
  const [rides, setRides] = useState<Reservation[]>([]);
  const [futureRides, setFutureRides] = useState<Reservation[]>([]);
  const userData = useSelector((state: any) => state.user.data);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await getReservations({
        CODE: '',
        TOKEN: userData.TOKEN,
        CUST_ID: userData.CUST_ID,
        RES_TIME: 'PAST',
      });

      if (response.RESERVATIONS) {
        let reservations = response.RESERVATIONS[0].RESERVATION;
        const Count = response.RESERVATIONS[0]?.COUNT;
        if (!Array.isArray(reservations) && Count !== 0) {
          reservations = [reservations];
        }

        setRides(reservations);
      } else {
        console.log('No reservations found');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchFutureReservations = async () => {
    setLoading(true);
    try {
      const response = await getReservations({
        CODE: '',
        TOKEN: userData.TOKEN,
        CUST_ID: userData.CUST_ID,
        RES_TIME: 'FUTURE',
      });

      if (response.RESERVATIONS) {
        console.log('RESERVATION', response.RESERVATIONS);
        const Count = response.RESERVATIONS[0]?.COUNT;
        let reservations = response.RESERVATIONS[0].RESERVATION;
        if (!Array.isArray(reservations) && Count !== 0) {
          reservations = [reservations];
        }
        console.log('Future reservations', reservations);
        setFutureRides(reservations);
      } else {
        setLoading(false);
        console.log('No FUTURE reservations found');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching FUTURE reservations:', error);
    }
  };

  // console.log("data is being set for past?", rides);
  // console.log("data is being set for future?", futureRides);

  useEffect(() => {
    fetchReservations();
    fetchFutureReservations();
  }, []);

  const onClickDispatch = async (ride: any) => {
    console.log('ride details', ride.RES_ID);
    setLoading(true);
    try {
      const response = await getReservation(
        userData.CUST_ID,
        userData.TOKEN,
        ride.RES_ID,
      );
      // console.log("response from ride", response);
      if (response) {
        dispatch(setRideData(response));
        const pickup = await getGeocode(ride.JOB_DIR);
        const dropoff = await getGeocode(ride.JOB_DEST);
        const midStop = response.STOP_ADDRESS
          ? await getGeocode(response.STOP_ADDRESS)
          : undefined;
        navigation.navigate('BookingDetails', {pickup, dropoff, midStop});
      } else {
        console.log('error in navigating to booking details');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const RenderRides = () => {
    return rides.map((ride: Reservation, index: number) => (
      <TouchableOpacity
        key={index}
        style={styles.BusContainer}
        onPress={() => onClickDispatch(ride)}>
        <View style={styles.LeftContent}>
          <Text style={[styles.HeadingText, {color: 'black', fontSize: 15}]}>
            Ride at {ride.START_TIME}
          </Text>
          {/* Add other details as needed */}
        </View>
        <View style={styles.RightContent}>
          <Image
            source={require('../assets/images/whitecarimage.png')}
            style={{width: 80, height: 70}}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  const RenderFutureRides = () => {
    return futureRides.map((ride: Reservation, index: number) => (
      <TouchableOpacity
        key={index}
        style={styles.BusContainer}
        onPress={() => onClickDispatch(ride)}>
        <View style={styles.LeftContent}>
          <Text style={[styles.HeadingText, {color: 'black', fontSize: 15}]}>
            Ride at {ride.START_TIME}
          </Text>
          {/* Add other details as needed */}
        </View>
        <View style={styles.RightContent}>
          <Image
            source={require('../assets/images/whitecarimage.png')}
            style={{width: 80, height: 70}}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView
      style={{paddingHorizontal: 5, backgroundColor: '#fafafa', flex: 1}}>
      <View style={{marginHorizontal: 20, flex: 0.2}}>
        <MoveBackButton navigation={navigation} margin={true} />
      </View>
      <Text style={styles.MainHeading}>My Rides And Order</Text>
      {/* -----PAST RIDES HERE---- */}
      <ScrollView style={{flex: 0.4}}>
        <Text style={styles.SideHeading}>Past Rides</Text>
        {rides?.length > 0 ? (
          <RenderRides />
        ) : (
          <Text
            style={{
              marginLeft: 20,
              color: '#424242',
              fontStyle: 'normal',
              fontSize: 11,
            }}>
            No Past reservations found
          </Text>
        )}
      </ScrollView>
      {/* ------FUFTURE RIDES HERE-------- */}
      <ScrollView style={{flex: 0.4}}>
        <Text style={styles.SideHeading}>Future Rides</Text>
        {futureRides?.length > 0 ? (
          <RenderFutureRides />
        ) : (
          <Text
            style={{
              marginLeft: 20,
              color: '#424242',
              fontStyle: 'normal',
              fontSize: 11,
            }}>
            No Future reservations found
          </Text>
        )}
      </ScrollView>
      <Loader color={primaryColor} loading={loading} />
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  MainHeading: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    marginHorizontal: 15,
    marginTop: 20,
  },
  SideHeading: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    marginHorizontal: 20,
    marginTop: 20,
  },

  HeadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  BusContainer: {
    backgroundColor: '#ffffff',
    height: 90,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    marginTop: 0,
  },
  LeftContent: {
    flex: 1,
  },
  RightContent: {
    marginLeft: 20,
  },
});
