import {View, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/solid';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const MoveBackButton = ({
  navigation,
  margin = false,
  moveBack = () => {
    console.log('tried to go back');
    navigation.goBack();
  },
}: any) => {
  return (
    <View
      style={{
        marginTop: margin ? 20 : 35,
        marginBottom: margin ? 10 : 25,
      }}>
      <TouchableOpacity
        onPress={moveBack}
        style={{
          height: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 49,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 2,
          shadowOffset: {height: 7, width: 3},
          shadowOpacity: 0.3,
        }}>
        <ChevronLeftIcon color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default MoveBackButton;
