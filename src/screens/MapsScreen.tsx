import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import MoveBackButton from '../components/MoveBackButton';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { BottomSheetComp } from '../components/MapsScreen/BottomSheetComp';
import { getRates } from '../functions/apiFunctions/common/rates';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { getTravelTime } from '../functions/apiFunctions/common/location';
import { Loader } from '../components/common/Loader';
import { primaryColor } from '../GlobalConfig/Colors';
import { convertToMinutes } from '../functions/common/useful';
import { clearRideData } from '../reduxSlices/ride/rideSlice';

type NavigationProps = NavigationProp<ParamListBase>;

type Props = {
  navigation: NavigationProps;
  route: any;
};
interface CarCardProps {
  VEH_DESC: string;
  VEH_ID: string;
  VEH_NAME: string;
  VEH_RATE: number;
  MINUTES: number;
  VEH_CAP: number;
  DONATION: number;
}

export interface PersistState {
  rehydrated: boolean;
  version: number;
}

export interface UserData {
  CODE: string;
  CUST_ID: string;
  TOKEN: string;
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
}

interface LocationProps {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface RootState {
  _persist: PersistState;
  user: UserState;
  rideDetails: RideState;
}

const GOOGLE_MAPS_APIKEY = 'AIzaSyCqw1dzXk74gdrqunxHYiuVLSEIHu4fbcM'; //client

const MapsScreen: React.FC<Props> = ({ navigation, route }) => {
  const userData = useSelector((state: RootState) => state.user.data);
  const rideDetails = useSelector((state: RootState) => state.rideDetails.data);
  const [loading, setLoading] = useState(false);
  const [carsData, setCarsData] = useState<CarCardProps[]>([]);
  const { dropoff, pickup, midStop } = route.params;
  const [currentLocation, setCurrentLocation] = useState<LocationProps>();
  const dispatch = useDispatch();
  const [timeCal, setTimeCal] = useState('calculating');
  const region = {
    latitude: (pickup.latitude + dropoff.latitude) / 2,
    longitude: (pickup.longitude + dropoff.longitude) / 2,
    latitudeDelta: Math.max(Math.abs(pickup.latitude - dropoff.latitude) * 1.3, 0.05),
    longitudeDelta: Math.max(Math.abs(pickup.longitude - dropoff.longitude) * 1.2, 0.05),
  };
  
  useEffect(() => {
    fetchCarRates();
  }, []);

  const handleContinueClick = () => {
    console.log('userData', userData);
    if (userData.CUST_ID && userData.TOKEN) {
      navigation.navigate('RideDetails');
    } else {
      navigation.navigate('Login');
    }
  };

  const calculatedTime = async () => {
    const { JOB_DIR, JOB_DEST, STOP_ADDRESS, JOB_TYPE, STOP_RETURN } = rideDetails;
    let time: number = 0;

    if (JOB_TYPE === 'W') {
      if (!STOP_ADDRESS) {
        // OW ride without stops
        time = convertToMinutes(await getTravelTime(JOB_DIR, JOB_DEST));
      } else {
        // OW ride with a stop
        const timeToStop = await getTravelTime(JOB_DIR, STOP_ADDRESS);
        const timeToDestination = await getTravelTime(STOP_ADDRESS, JOB_DEST);
        time = convertToMinutes(timeToStop) + convertToMinutes(timeToDestination);
      }
    } else if (JOB_TYPE === 'R') {
      if (!STOP_ADDRESS) {
        // RT ride without stops
        console.log("RT ride without stops")
        const timeToDestination = await getTravelTime(JOB_DIR, JOB_DEST);
        const timeBack = await getTravelTime(JOB_DEST, JOB_DIR);
        time = (convertToMinutes(timeToDestination) + convertToMinutes(timeBack)) / 2;
      } else if (STOP_ADDRESS && STOP_RETURN === "Yes") {
        console.log("RT ride with a stop both ways");
        // RT ride with a stop both ways
        const pickupToStop = await getTravelTime(JOB_DIR, STOP_ADDRESS);
        const stopToDestination = await getTravelTime(STOP_ADDRESS, JOB_DEST);
        // const timeBackToStop = await getTravelTime(JOB_DEST, STOP_ADDRESS);
        // const timeBackToPickup = await getTravelTime(STOP_ADDRESS, JOB_DIR);
        time = convertToMinutes(pickupToStop) + convertToMinutes(stopToDestination);
      } else if (STOP_ADDRESS) {
        console.log("RT ride with a stop on the way to the destination only", STOP_ADDRESS , STOP_RETURN);
        // RT ride with a stop on the way to the destination only
        const timeToStop = await getTravelTime(JOB_DIR, STOP_ADDRESS);
        // console.log("timeToStop",timeToStop);
        const timeToDestination = await getTravelTime(STOP_ADDRESS, JOB_DEST);
        // console.log("timeToDestination",timeToDestination)
        const timeBack = await getTravelTime(JOB_DEST, JOB_DIR);
        // console.log("timeBack", timeBack)
        time = (convertToMinutes(timeToStop) + convertToMinutes(timeToDestination) + convertToMinutes(timeBack)) / 2;
      }
    }

    console.log('time calculated', Math.ceil(time));
    return Math.floor(time);
  };


  const fetchCarRates = async () => {
    setLoading(true);

    try {
      const time = await calculatedTime();
      const response = await getRates(
        rideDetails.JOB_TYPE,
        rideDetails.JOB_TYPE !== "H" ? Math.floor(time) : parseInt(rideDetails.JOB_HOURS) * 60,
        rideDetails.PEOPLE,
        rideDetails.JOB_CITY,
        rideDetails.JOB_STATE,
        rideDetails.DEST_CITY,
        rideDetails.DEST_STATE
      );

      console.log('response from getRates', response);

      if (response.ResponseCode === 200) {
        setCarsData(response.Rates);
      } else if (response.ResponseCode === 500) {
        Dialog.show({
          type: ALERT_TYPE.INFO,
          title: 'Alert',
          textBody: response.ResponseText + ' 😥',
          button: 'Close',
          onHide() {
            navigation.goBack();
          },
        });
      }
    } catch (error) {
      console.error('Error fetching car rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === 'granted') {
        return true;
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Login Success',
          textBody: 'We cannot use your location.',
          button: 'Close',
        });
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const handleMyLocationClick = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        console.log('res', res);
        Geolocation.getCurrentPosition(
          position => {
            console.log('position', position);
            let obj = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
            // if (currentLocation != null) {
            //   regionofUser(obj);
            // }
            setCurrentLocation(obj);
            // setDestination({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude,
            //   latitudeDelta: 0.005,
            //   longitudeDelta: 0.005,
            // });
          },
          error => {
            // See error code charts below.
            // setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    });
  };

  const moveBack = () => {
    dispatch(clearRideData());
    navigation.goBack();
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={{ width: '90%', position: 'absolute', zIndex: 5, marginTop: 30 }}>
        <MoveBackButton navigation={navigation} margin={true} moveBack={moveBack} />
      </View>
      <MapView
        style={{
          width: '100%',
          flex: 0.53,
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
          coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}
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
              paddingBottom: Platform.OS === 'android' ? 0 : 11,
            }}
          />
        </Marker>
        {rideDetails.JOB_TYPE !== "H" && <Marker
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
        </Marker>}
        {midStop && <Marker
          key={2}
          coordinate={{
            latitude: midStop.latitude,
            longitude: midStop.longitude,
          }}
          title={'Stop point'}
          description={'This will be a stop in our route'} />}
        {currentLocation && <Marker coordinate={currentLocation} />}
      </MapView>
      {/* <View
        style={{
          position: 'relative',
          backgroundColor: 'red',
          width: '90%',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
          }}
          onPress={handleMyLocationClick}>
          <Image
            source={require('../assets/images/map/currentloc.png')}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </View> */}
      {!loading && (
        <BottomSheetComp
          cars={carsData}
          handleContinueClick={handleContinueClick}
        />
      )}
      
      <Loader color={primaryColor} loading={loading} />
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

export default MapsScreen;
