import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ClockIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from 'react-native-heroicons/outline';

interface Props {
  setSelectedService: (service: React.SetStateAction<string>) => void;
  selectedService: string;
}

export const ChooseService: React.FC<Props> = ({
  selectedService,
  setSelectedService,
}) => {
  const handleServiceClick = (service: React.SetStateAction<string>) => {
    setSelectedService(service);
  };
  return (
    <View style={styles.MiniContainer}>
      <TouchableOpacity
        style={[
          styles.Options,
          selectedService === 'R' && styles.SelectedService,
        ]}
        onPress={() => handleServiceClick('R')}>
        <ArrowPathIcon color="#00BFF3" />
        <Text style={{ color: '#151515', textAlign: "center" }} numberOfLines={1}>Round Trip</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.Options,
          selectedService === 'W' && styles.SelectedService,
        ]}
        onPress={() => handleServiceClick('W')}>
        <ArrowRightIcon color="#00BFF3" />
        <Text style={{ color: '#151515' }}>One Way</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.Options,
          selectedService === 'H' && styles.SelectedService,
        ]}
        onPress={() => handleServiceClick('H')}>
        <ClockIcon color="#00BFF3" />

        <Text style={{ color: '#151515' }}>Hourly</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: '31%',
    height: 70,
    
  },
  MiniContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  SelectedService: {
    borderColor: '#00BFF3',
    borderWidth: 2,
  },
});
