import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import MoveBackButton from '../components/MoveBackButton';
import {CommonActions, NavigationProp, ParamListBase} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {BottomSheetComp} from '../components/BookingDetails/BottomSheetComp';
import {getTravelTime} from '../functions/apiFunctions/common/location';
import { clearRideData } from '../reduxSlices/ride/rideSlice';

type NavigationProps = NavigationProp<ParamListBase>;

type Props = {
  navigation: NavigationProps;
  route: any;
};

export interface PersistState {
  rehydrated: boolean;
  version: number;
}

export interface UserData {
  CODE: string;
  CUST_ID: string;
  TOKEN: string;
  FNAME: string;
  LNAME: string;
  MPHONE: string;
  EMAIL: string;
}

export interface UserState {
  data: UserData;
}

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
  VEH_NAME: string;
  TOTAL: string;
  DONATION: string;
}

export interface RootState {
  _persist: PersistState;
  user: UserState;
  rideDetails: RideState;
}

const GOOGLE_MAPS_APIKEY = 'AIzaSyCqw1dzXk74gdrqunxHYiuVLSEIHu4fbcM'; //client

const BookingDetails: React.FC<Props> = ({navigation, route}) => {
  const [timeCal, setTimeCal] = useState('calculating');
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.data);
  const rideDetails = useSelector((state: RootState) => state.rideDetails.data);
  const [loading, setLoading] = useState(false);
  const {dropoff, pickup, midStop} = route.params;
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  const region = {
    latitude: (pickup.latitude + dropoff.latitude) / 2,
    longitude: (pickup.longitude + dropoff.longitude) / 2,
    latitudeDelta: Math.max(Math.abs(pickup.latitude - dropoff.latitude) * 1.3, 0.04),
    longitudeDelta: Math.max(Math.abs(pickup.longitude - dropoff.longitude) * 1.2, 0.04),
  };

  useEffect(() => {
    calculatedTime();
  }, []);

  useEffect(() => {
    console.log('rideDetails', rideDetails);
  }, []);

  const handleContinueClick = () => {
    // console.log('userData', userData);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Home' },
        ],
      })
    );
    dispatch(clearRideData());
    // navigation.navigate('RideComplete');
  };

  const calculatedTime = async () => {
    const { JOB_DIR, JOB_DEST, STOP_ADDRESS, JOB_TYPE, RETURN } = rideDetails;
    let time: number = 0;

    if (JOB_TYPE === 'W') {
      if (!STOP_ADDRESS) {
        // OW ride without stops
        time = parseInt(await getTravelTime(JOB_DIR, JOB_DEST));
      } else {
        // OW ride with a stop
        const timeToStop = await getTravelTime(JOB_DIR, STOP_ADDRESS);
        const timeToDestination = await getTravelTime(STOP_ADDRESS, JOB_DEST);
        time = parseInt(timeToStop) + parseInt(timeToDestination);
      }
    } else if (JOB_TYPE === 'R') {
      if (!STOP_ADDRESS) {
        // RT ride without stops
        const timeToDestination = await getTravelTime(JOB_DIR, JOB_DEST);
        const timeBack = await getTravelTime(JOB_DEST, JOB_DIR);
        time = (parseInt(timeToDestination) + parseInt(timeBack)) / 2;
      } else if (STOP_ADDRESS && RETURN) {
        // RT ride with a stop on the way to the destination only
        const timeToStop = await getTravelTime(JOB_DIR, STOP_ADDRESS);
        // console.log("timeToStop",timeToStop);
        const timeToDestination = await getTravelTime(STOP_ADDRESS, JOB_DEST);
        // console.log("timeToDestination",timeToDestination)
        const timeBack = await getTravelTime(JOB_DEST, JOB_DIR);
        // console.log("timeBack", timeBack)
        time = ((parseInt(timeToStop) + parseInt(timeToDestination)) + parseInt(timeBack)) / 2;
      } else if (RETURN) {
        // RT ride with a stop both ways
        const timeToStop = await getTravelTime(JOB_DIR, STOP_ADDRESS);
        // console.log("first",timeToStop);
        const timeToDestination = await getTravelTime(STOP_ADDRESS, JOB_DEST);
        // console.log("timeToDestination",timeToDestination)
        const timeBackToStop = await getTravelTime(JOB_DEST, STOP_ADDRESS);
        // console.log("timeBackToStop", timeBackToStop);
        const timeBackToPickup = await getTravelTime(STOP_ADDRESS, JOB_DIR);
        time = (parseInt(timeToStop) + parseInt(timeToDestination) + parseInt(timeBackToStop) + parseInt(timeBackToPickup)) / 2;
      }
    }

    console.log('time calculated', time);
    setTimeCal(time.toString() + " mins");
    return time;
  };

  return (
    <SafeAreaView
      style={[GlobalStyles.container, {backgroundColor: 'lightblue'}]}>
      <View style={{left: 10, top: 35, position: 'absolute', zIndex: 5}}>
        <TouchableOpacity>
          <MoveBackButton margin={true} navigation={navigation} />
        </TouchableOpacity>
      </View>
      <MapView
        style={{
          width: '100%',
          height: screenHeight / 2,
        }}
        region={region}
        // onRegionChange={onRegionChange}
        zoomControlEnabled={true}
        zoomTapEnabled={false}>
        <MapViewDirections
          origin={pickup}
          destination={dropoff}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColors={['#000']}
        />
        <Marker
          key={0}
          coordinate={{latitude: pickup.latitude, longitude: pickup.longitude}}
          title={'Start point'}
          description={'This will be start point'}
          // image={{ height: 20, width: 20 }}
          // icon={{height: 20, width: 20}}
        >
          <Image
            source={require('../assets/images/map/pickuptransparent.png')}
            resizeMode="contain"
            style={{
              height: 35,
              width: 35,
              marginBottom: Platform.OS === 'android' ? 0 : 11,
            }}
          />
        </Marker>
        {rideDetails.JOB_TYPE !== 'H' && (
          <Marker
            key={1}
            coordinate={{
              latitude: dropoff.latitude,
              longitude: dropoff.longitude,
            }}
            title={'End point'}
            description={'This will be end point'}>
            <Image
              source={require('../assets/images/map/destination.png')}
              resizeMode="contain"
              style={{
                height: 30,
                width: 30,
              }}
            />
          </Marker>
        )}
        {midStop && (
          <Marker
            key={2}
            coordinate={{
              latitude: midStop.latitude,
              longitude: midStop.longitude,
            }}
            title={'Stop point'}
            description={'This will be a stop in our route'}
          />
        )}
      </MapView>
      {!loading && (
        <BottomSheetComp
          handleContinueClick={handleContinueClick}
          username={userData.FNAME}
          carname={rideDetails.VEH_NAME}
          dropofflocation={rideDetails.JOB_DEST}
          pickuplocation={rideDetails.JOB_DIR}
          totalamount={rideDetails.TOTAL}
          dropoffTime={rideDetails.JOB_TYPE !== "H" ? timeCal : rideDetails.JOB_HOURS + " Hours"}
          pickupTime={rideDetails.JOB_START}
          people={rideDetails.PEOPLE}
          date={rideDetails.JOB_DATE}
          rideType={rideDetails.JOB_TYPE}
          baseRate={rideDetails.VEH_RATE}
          donation={rideDetails.DONATION}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  carCardsContainer: {
    paddingHorizontal: 10,
  },
  carCard: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
    width: 220,
    height: 250,
  },
  carImage: {
    width: '80%',
    height: 80,
  },
  carDetails: {
    padding: 10,
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  carRate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 8,
  },
  carTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    backgroundColor: '#e2e2e2',
  },
});

export default BookingDetails;
