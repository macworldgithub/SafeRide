import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RideDetails, setRideData } from '../../reduxSlices/ride/rideSlice';
import { formatNumbersWithCommas } from '../../functions/common/useful';

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

export interface RootState {
  _persist: PersistState;
  rideDetails: RideDetails;
}

interface Props {
  handleContinueClick: () => void;
  cars: CarCardProps[];
}

const COMMON_CAR = require('../../assets/images/vehicle.jpeg');
const SPRINTER_VAN = require('../../assets/images/vehicles/Minibuses.png');
const PARTYBUS = require('../../assets/images/vehicles/vehicle8.png');
const SEDAN = require('../../assets/images/vehicles/Sedans.png');
const SUV = require('../../assets/images/vehicles/SUV.png');
const STRETCH_SUV = require('../../assets/images/vehicles/Stretch_Limos.png');
const MINIBUS = require('../../assets/images/vehicles/Minibuses.png');
const STRETCH_LEMO = require('../../assets/images/vehicles/vehicle4.png');

export const BottomSheetComp: React.FC<Props> = ({
  cars,
  handleContinueClick,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  const [selectedVehicle, setSelectedVehicle] = useState<CarCardProps | null>(null);

  const rideDetails = useSelector((state: {rideDetails : RideDetails}) => state.rideDetails);
  console.log('Updated rideDetails state:', rideDetails.data);

  const CarCard: React.FC<CarCardProps> = ({ VEH_ID, VEH_NAME, VEH_RATE, VEH_CAP, MINUTES, DONATION }) => {
    const handleSelectCar = () => {
      // console.log('Vehicle Selected', `You selected ${VEH_NAME}`, `VEHICLE ID ${VEH_ID}`);
      Dialog.show({
        type: ALERT_TYPE.INFO,
        title: 'Vehicle Selected',
        textBody: `${VEH_NAME} selected😊`,
        button: 'Close',
      });
      const VehicleData = {
        VEH_ID,
        VEH_RATE,
        VEH_NAME,
        TOTAL: VEH_RATE + DONATION,
        DONATION
      };
      setSelectedVehicle({ VEH_DESC: '', VEH_ID, VEH_NAME, VEH_RATE, MINUTES, VEH_CAP, DONATION });
      dispatch(setRideData(VehicleData));
    };

    const getImageSource = (str: string) => {
      if (containsWord(str, "Minibus")) {
        return MINIBUS;
      } 
      else if (containsWord(str, "Stretch SUV")) {
        return STRETCH_SUV;
      } 
      else if (containsWord(str, "Sedan")) {
        return SEDAN;
      } 
      else if (containsWord(str, "SUV")) {
        return SUV;
      }
       else if (containsWord(str, "Van")) {
        return SPRINTER_VAN;
      } 
      else if (containsWord(str, "Limo")) {
        return STRETCH_LEMO;
      } 
      else if (containsWord(str, "Party Bus")) {
        return PARTYBUS;
      } else {
        return COMMON_CAR;
      }
    }

    function containsWord(str: string, word: string) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(str);
    }

    return (
      <TouchableOpacity onPress={handleSelectCar}>
        <View style={styles.carCard}>
          <Image source={getImageSource(VEH_NAME)} style={styles.carImage} />
          <View style={styles.carDetails}>
            <Text style={styles.carName}>{VEH_NAME}</Text>
            <View style={styles.carRate}>
              <Text style={{ color: 'black' }}>Base Rate:</Text>
              <Text style={{ color: '#59cbe9', fontWeight: 'bold' }}>${formatNumbersWithCommas(VEH_RATE)}</Text>
            </View>
            <View style={styles.carRate}>
              <Text style={{ color: 'black' }}>Donation</Text>
              <Text style={{ color: 'black' }}>+ ${formatNumbersWithCommas(DONATION)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.carTotal}>
              <Text style={{ color: 'black' }}>Total:</Text>
              <Text style={{ color: '#59cbe9', fontWeight: 'bold' }}>${formatNumbersWithCommas(VEH_RATE + DONATION)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleContinue = () => {
    if (!selectedVehicle) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'No Vehicle Selected',
        textBody: 'Please select a vehicle before continuing.',
        button: 'Close',
      });
    } else {
      handleContinueClick();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[screenHeight / 2.1, screenHeight / 2.1]}
      enableOverDrag={false}
      enablePanDownToClose={false}
      index={0}
      handleStyle={{
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        backgroundColor: '#f5f5f5',
      }}
      handleIndicatorStyle={{
        width: 70,
        height: 7,
      }}>
      <BottomSheetView style={styles.contentContainer}>
        <Text style={{ color: '#000' }}>Select vehicle for your group of {rideDetails.data.PEOPLE}</Text>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={cars}
            renderItem={({ item }) => <CarCard {...item} />}
            keyExtractor={item => item.VEH_ID.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carCardsContainer}
          />
        </SafeAreaView>
        <View style={{ bottom: 0, position: 'absolute', height: 100 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 20,
              width: screenWidth / 1.3,
              backgroundColor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              marginTop: 15,
            }}
            onPress={handleContinue}>
            <Text style={{ color: 'white' }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
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
    width: '100%',
    height: 80,
  },
  carDetails: {
    padding: 10,
  },
  carName: {
    fontSize: 17,
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
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
