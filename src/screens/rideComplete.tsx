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

import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ArrowSmallLeftIcon,
  PencilIcon,
  StarIcon,
} from 'react-native-heroicons/outline';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';

// Custom StarRating component
interface StarRatingProps {
  rating: number;
  onStarPress: (selectedRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({rating, onStarPress}) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.starRating}>
      {stars.map(index => (
        <TouchableOpacity key={index} onPress={() => onStarPress(index)}>
          <StarIcon
            color={index <= rating ? '#00BFF3' : '#00BFF3'}
            size={32}
            style={styles.starIcon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function RideComplete({navigation}: any) {
  const [additionalInformation, setadditionalInformation] = useState('');
  const [rating, setRating] = useState<number>(0); // Initial rating state
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };
  const handleDonePress = () => {
    navigation.navigate('Home');
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
        <MoveBackButton margin={true} navigation={navigation} />

        {/* Centered Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/request-done.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.text}>Ride has been successfully completed</Text>
        </View>

        {/* Rate our service */}
        <Text style={styles.rateServiceHeading}>Rate our service</Text>
        <View style={styles.rateServiceContainer}>
          <StarRating rating={rating} onStarPress={handleStarPress} />
        </View>

        {/* -----Write a Review---- */}
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewText}>Write a Review</Text>
          <View style={styles.InputWrapper}>
            <PencilIcon color="#00BFF3" />
            <TextInput
              style={styles.TextInput}
              value={additionalInformation}
              onChangeText={setadditionalInformation}
            />
          </View>
        </View>

        {/* Bottom Button */}
        <TouchableOpacity onPress={handleDonePress} style={styles.button}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
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
