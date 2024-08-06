import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import MoveBackButton from '../components/MoveBackButton';
// import MapView from 'react-native-maps';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ArrowSmallLeftIcon,
  PencilIcon,
  StarIcon,
} from 'react-native-heroicons/outline';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';

export default function SelectVehicle({navigation}: any) {
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  const handleDonePress = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {/* ----Top Return Icon---- */}
      {/* <View style={{width:screenWidth*0.8,display:"flex",flex:1,justifyContent:"center"}}> */}

      {/* <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      /> */}
      {/* <MoveBackButton margin={true} navigation={navigation}/> */}

      {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  reviewContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  reviewText: {
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
  },
  imageContainer: {
    alignItems: 'center',
    // marginTop: 10,
  },
  image: {
    width: 250,
    height: 250,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  rateServiceContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  rateServiceHeading: {
    fontSize: 22,
    marginBottom: 10,
    color: 'black',
    marginTop: 30,
    fontWeight: 'bold',
  },
  starRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#00BFF3',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  InputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
  TextInput: {
    flex: 1,
    height: 80,
    padding: 10,
  },
});
