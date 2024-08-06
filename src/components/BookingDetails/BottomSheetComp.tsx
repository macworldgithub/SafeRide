import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CalendarIcon} from 'react-native-heroicons/solid';
import {showRideType} from '../../functions/common/useful';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface Props {
  handleContinueClick: () => void;
  username: string;
  carname: string;
  totalamount: string;
  donation:string;
  baseRate: string;
  pickuplocation: string;
  dropofflocation: string;
  pickupTime: string;
  dropoffTime: string;
  people: string;
  date: string;
  rideType: string;
}

export const BottomSheetComp: React.FC<Props> = ({
  handleContinueClick,
  username,
  carname,
  dropofflocation,
  pickuplocation,
  totalamount,
  pickupTime,
  dropoffTime,
  people,
  date,
  rideType,
  baseRate,
  donation
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[screenHeight / 2.0, screenHeight / 2.0]}
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
        <ScrollView>
          <Text style={{color: '#000', textAlign: 'center'}}>
            Hi {username} following is your booking detail
          </Text>

          <View>
            <View style={styles.grayBoxes}>
              <View>
                <Image
                  source={require('../../assets/images/bookingdetails/vaadin_taxi.png')}
                  style={{height: 30, width: 30}}
                />
              </View>
              <View
                style={{
                  marginLeft: 20,
                }}>
                <Text
                  style={{
                    color: '#424242',
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  {'Car Name: ' + carname}
                </Text>
                <Text
                  style={{
                    color: '#424242',
                    fontStyle: 'normal',
                    fontSize: 11,
                  }}>
                  {'Base Rate: $' + baseRate}
                </Text>
                <Text
                  style={{
                    color: '#424242',
                    fontStyle: 'normal',
                    fontSize: 11,
                  }}>
                  {'Donation: $' + donation}
                </Text>
                <Text
                  style={{
                    color: '#424242',
                    fontStyle: 'normal',
                    fontSize: 11,
                  }}>
                  {'Grand Total: $' + totalamount}
                </Text>

                <Text
                  style={{
                    color: '#424242',
                    fontStyle: 'normal',
                    fontSize: 11,
                  }}>
                  {'Party of: ' + people + ' persons'}
                </Text>
                <Text
                  style={{
                    color: '#424242',
                    fontStyle: 'normal',
                    fontSize: 11,
                  }}>
                  {'Date: ' + date}
                </Text>
                <Text
                  style={{
                    color: '#424242',
                    fontStyle: 'normal',
                    fontSize: 11,
                  }}>
                  {'Ride Type: ' + showRideType(rideType)}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.grayBoxes,
                {marginTop: 5, flexDirection: 'column'},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                <View>
                  <Image
                    source={require('../../assets/images/bookingdetails/pickup.png')}
                    style={{height: 35, width: 35}}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // width: '80%',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 0.7,
                    }}>
                    <Text
                      style={{
                        color: '#424242',
                        fontStyle: 'normal',
                        fontSize: 11,
                      }}>
                      Pickup
                    </Text>
                    <Text
                      style={{
                        color: '#424242',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>
                      {pickuplocation}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.3,
                    }}>
                    <Text
                      style={{
                        color: '#424242',
                        fontStyle: 'normal',
                        fontSize: 11,
                        textAlign: 'center',
                      }}>
                      {pickupTime}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: 'black',
                  height: 1,
                  width: '90%',
                  marginLeft: 10,
                  marginVertical: 10,
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                <View>
                  <Image
                    source={require('../../assets/images/bookingdetails/dropoff.png')}
                    style={{height: 35, width: 35}}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '80%',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 0.7,
                    }}>
                    <Text
                      style={{
                        color: '#424242',
                        fontStyle: 'normal',
                        fontSize: 11,
                      }}>
                      Dropoff
                    </Text>
                    <Text
                      style={{
                        color: '#424242',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>
                      {dropofflocation}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.3,
                    }}>
                    <Text
                      style={{
                        color: '#424242',
                        fontStyle: 'normal',
                        fontSize: 11,
                        textAlign: 'center',
                      }}>
                      {dropoffTime}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{bottom: 0, position: 'absolute', height: 100}}>
          <TouchableOpacity
            onPress={handleContinueClick}
            style={{
              paddingVertical: 10,
              width: screenWidth / 1.3,
              backgroundColor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              marginTop: 45,
            }}>
            <Text style={{color: 'white'}}>Done</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  grayBoxes: {
    width: screenWidth / 1.1,
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 5,
    alignItems: 'center',
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
