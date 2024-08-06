import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/outline';
import MoveBackButton from '../components/MoveBackButton';
import GlobalStyles from '../GlobalConfig/GlobalStylesheet';

interface Section {
  key: string;
  title?: string;
  content?: string | string[];
}

interface AboutUsProps {
  navigation: any;
}

const AboutUs: React.FC<AboutUsProps> = ({ navigation }) => {
  const [container1Open, setContainer1Open] = useState(true);
  const [container2Open, setContainer2Open] = useState(false);
  const [container3Open, setContainer3Open] = useState(false);
  const [container4Open, setContainer4Open] = useState(false);
  const [container5Open, setContainer5Open] = useState(false);
  const [container6Open, setContainer6Open] = useState(false);

  const toggleContainer1 = () => {
    setContainer1Open(!container1Open);
  };

  const toggleContainer2 = () => {
    setContainer2Open(!container2Open);
  };

  const toggleContainer3 = () => {
    setContainer3Open(!container3Open);
  };

  const toggleContainer4 = () => {
    setContainer4Open(!container4Open);
  };

  const toggleContainer5 = () => {
    setContainer5Open(!container5Open);
  };

  const toggleContainer6 = () => {
    setContainer6Open(!container6Open);
  };

  const termsOfUse = [
    "No Drugs, No Weapons are allowed in the vehicle. In case of violation of this rule the trip will be aborted and no refund will be given.",
    "No Fighting, No Vandalism. Please have a good time, but do not get out of control. If there is damage to vehicle, we will provide you with the repair estimate that has to be paid in full. Clean up charges of $150 have to be paid right away to the driver.",
    "Everyone in the group certifies their age and are responsible if they misrepresent their information. By strict regulations of the law no one under the age of 21 is to consume alcohol. SafeRides or its affiliated transport companies do not supply any alcohol. No Kegs are allowed.",
    "Failure to follow these simple rules will result in cancellation of the trip at SafeRides discretion.",
  ];

  const aboutUs = [
    "Safe Rides Unlimited, also known as SafeRides, the leading non-profit organization dedicated to reducing the risks of drunk, distracted, and tired driving. As a 501(c)(3) charity (EIN: 20-1536261), our mission is to provide safe and reliable transportation options while promoting responsible decision-making.",
    "Through our partnerships with reputable local transportation companies, we have secured exclusive discounted rates to offer our customers safe, luxurious, and enjoyable rides at affordable prices. By booking through SafeRides.org, you can save up to 50% compared to hiring the same limo company directly. ",
    "Since 2003, we have been pioneering realistic and effective alternatives to drinking and driving. Our round-trip transportation solutions ensure the safe arrival and departure of individuals from parties and events. We offer a diverse range of vehicles, including Party Buses, Stretch SUVs, Stretch Limos, Vans, and Charter Buses, to cater to your specific needs. ",
    "Our journey began with a focus on providing safe rides to campus students across New Jersey. Today, we are proud to offer our trusted and reliable transportation services nationwide. ",
    "Choose SafeRides.org and let us be your partner in promoting a safer and more responsible approach to transportation."
  ];
  
  const Trips= [
    "ROUND TRIP: The Most Popular Choice. Our round-trip service, also known as pickup/drop off service, is a favorite among our customers. A stunning luxury vehicle will be waiting at your doorstep to transport your group of friends to your destination. After the event, your ride will be ready at a prearranged time to ensure a safe and comfortable journey back home. Rest assured that tolls are already included in the rate for all rides, making your experience hassle-free",
    "ONE-WAY: Affordable and Convenient. If you're looking for a cost-effective solution to reach your destination, our one-way service is the way to go. It's a convenient option not only for getting to your destination but also for your return trip if you arrived using other means of transportation. Enjoy the convenience and reliability of Safe Rides Unlimited for a smooth journey. ",
    "HOURLY: Flexibility to Explore Multiple Venues. For those who want the freedom to explore different venues and locations throughout the night, our hourly service is the perfect choice. With this option, the vehicle and driver remain at your disposal for the duration of your chosen timeframe. This flexibility allows you to make the most of your night, moving from one place to another without any worries."
  ];

  const Resp = [
    "SafeRides is not a limousine/taxi company but a platform to connect customers with service providers at a discounted rate.",
    "SafeRides is not responsible for vehicle being late due to traffic delays.",
    "SafeRides is not responsible for vehicle mechanical failures. If the assigned vehicle breaks, our partners will do their best to get a replacement vehicle as soon as possible.",
    "All passengers are covered through the insurance provided by the actual transportation company. SafeRides provider's responsibility ends once the passenger has been delivered to their designated locations.",
    "Passenger forfeits all rights to hold the safe ride provider or the venue responsible for any occurrences outside the venue or safe ride vehicle",
    "SafeRides and or Venue are not responsible for any items left in the vehicle or venue. With Roundtrip, there is a chance that a different vehicle of the same kind may do the return ride. Passengers must take responsibility for their own personal items.",
    "The passengers are responsible for maintaining designated pick up and return pickup times. Driver will wait 15 minutes as courtesy. There will be an additional charge for waiting time over 15 minutes.",
    "Trip Balance must be paid before the vehicle departs from the pickup location."
  ];

  const Policy = [
    "The deposit paid with credit card is non refundable once the reservation has been confirmed.",
    "All cancellations within 4 days of the trip will be subject to a 50% charge of the remaining balance.",
    "All cancellations within 2 days of the trip will be subject to a 100% charge of the remaining balance.",
    "Cancellations cannot be made by email or voicemail and must be called in to customer service."
  ];

  const SMS = [
    "Saferides offers an option to receive ride confirmation and ride reminders by the SMS/Text message.",
    "Those are one-time message related to specific rides books to the customer.",
    "Carriers are not liable for delayed or undelivered messages. Message and data rates may apply."
  ]

  const data: Section[] = [
    { key: 'header' },
    { key: 'aboutUs', title: 'About us', content: aboutUs },
    { key: 'rideTypes', title: 'Flexible and Convenient Ride Types', content: Trips },
    { key: 'termsOfUse', title: 'Terms of Use', content: termsOfUse },
    { key: 'responsibilities', title: 'Customer, SafeRides and Rider Responsibilities', content: Resp },
    {key: 'cancellationPolicy', title: 'Cancellation Policy', content: Policy},
    {key: 'smsTerms', title: 'SMS Terms and Conditions', content: SMS}
  ];

  const renderItem = ({ item }: { item: Section }) => {
    if (item.key === 'header') {
      return (
        <>
          <View style={{ marginHorizontal: 20 }}>
            <MoveBackButton navigation={navigation} margin={true} />
          </View>
          <View style={styles.CenterImage}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/images/saferidelogo_b.jpg')}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={styles.HeadingText}>Version 1.0 released</Text>
          <Text style={styles.HeadingText}>22.04.2024</Text>
          <Text style={styles.HeadingText}>build 1.1.2 </Text>
        </>
      );
    }

    return (
      <>
        <TouchableOpacity
          style={styles.containerButton}
          onPress={
            item.key === 'aboutUs'
              ? toggleContainer1
              : item.key === 'rideTypes'
              ? toggleContainer2
              : item.key==='termsOfUse'
              ? toggleContainer3
              : item.key === 'responsibilities'
              ? toggleContainer4
             : item.key === 'cancellationPolicy'
             ? toggleContainer5
             : toggleContainer6
          }>
          <Text style={styles.containerText}>{item.title}</Text>
          <ChevronDownIcon color="black" size={20} />
        </TouchableOpacity>
        {((item.key === 'aboutUs' && container1Open) ||
          (item.key === 'rideTypes' && container2Open) ||
          (item.key === 'responsibilities' && container4Open) ||
          (item.key === 'cancellationPolicy' && container5Open) ||
          (item.key === 'smsTerms' && container6Open) ||
          (item.key === 'termsOfUse' && container3Open)) && (
          <View style={styles.additionalText}>
              <FlatList
                data={item.content as string[]}
                renderItem={({ item }) => (
                  <Text style={styles.listItem}>{`\u2022 ${item}`}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  TopBack: {
    marginTop: 25,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    width: '13%',
    height: 40,
    marginHorizontal: 15,
  },
  TopButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginTop: 20,
    marginHorizontal: 15,
  },
  HeadingText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 140,
  },

  image: {
    width: 170,
    height: 140,
  },
  CenterImage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    marginHorizontal: 15,
    marginTop: 15,
  },
  containerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  additionalText: {
    padding: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    marginHorizontal: 15,
  },
  listItem: {    
    fontSize: 14,
    marginBottom: 5,
    color:'black'
  },
});
