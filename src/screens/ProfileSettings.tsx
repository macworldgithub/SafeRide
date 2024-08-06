import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Dimensions,
  } from "react-native";
  import React, { useState } from "react";
  import { ArrowSmallLeftIcon } from "react-native-heroicons/outline";
  import { EnvelopeIcon, PhoneIcon, UserCircleIcon } from "react-native-heroicons/solid";
  import { useNavigation } from "@react-navigation/native";
import MoveBackButton from "../components/MoveBackButton";
import GlobalStyles from "../GlobalConfig/GlobalStylesheet";
import { useDispatch, useSelector } from 'react-redux';
import { UserState, setUserData } from '../reduxSlices/user/userSlice';
import { primaryColor } from "../GlobalConfig/Colors";
import PasswordModal from "../components/PasswordModal";
import {
  ALERT_TYPE,
  Dialog,
} from 'react-native-alert-notification';
import { UpdateAccountInfo } from "../functions/apiFunctions/appaccess/updateAccountInfo";
import { getAccountDetails } from "../functions/apiFunctions/appaccess/getAccountDetails";
  
  export default function ProfileSettings({navigation} : any) {
    const userData = useSelector((state: { user: UserState }) => state.user.data);
  const dispatch = useDispatch();
    
    const [email, setEmail] = useState(userData.EMAIL || "");
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  const [mobile, setMobile] = useState(userData.MPHONE || "");
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const openModal=()=>{
  if(!email){
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Updation Failed',
      textBody: "Email is Missing or Invalid",
      button: 'Close',
    });}
    else if(!mobile){
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Updation Failed',
        textBody: "Mobile Number is Missing or Invalid",
        button: 'Close',
      });}else{
        setModalVisible(true)
      }
}
const onUpdateClick=async()=>{
  setModalVisible(!modalVisible)
  if(!password||password.length<8){
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Updation Failed',
      textBody: "Password is Invalid",
      button: 'Close',
    });
  }else{

  const response = await UpdateAccountInfo(email,mobile, password,userData.CUST_ID,userData.TOKEN);
  if (response.ResponseCode === 200) {
    // dispatch(setUserData(response));
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Update Successfully',
      textBody: response.ResponseText,
      button: 'Close',
      onHide: async () => {
        const accountDetails = await getAccountDetails(
          userData.CUST_ID,
          userData.TOKEN,
        );
        if (accountDetails.ResponseCode === 200) {
          dispatch(setUserData(accountDetails));
          navigation.navigate('Home');
          // Handle error fetching account details
        } else {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: accountDetails.ResponseText,
            button: 'Close',
          });
        }
      },
    });
  } else {
    // Show alert notification for wrong password
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Update Failed',
      textBody: response.ResponseText,
      button: 'Close',
    });
  }

  }
}
    
    return (
      <SafeAreaView
        style={GlobalStyles.container}
      >
        <ScrollView  style={{width:screenWidth*0.8}}>
          {/* ----Top Return Icon---- */}
          <View >

      
<MoveBackButton navigation={navigation} margin={true} />
</View>
  
          {/* ----image container---- */}
          <View style={styles.CenterImage}>
           <UserCircleIcon color={primaryColor} size={100}/>
          </View>
  
          <Text style={styles.HeadingText}>{userData.FNAME? userData.FNAME : ""}</Text>
  
          {/* ----Inputs---- */}
          <View style={styles.InputContainer}>
            <Text style={styles.Labels}>Email</Text>
            <View style={styles.InputWrapperEdit}>
              <EnvelopeIcon color="#00BFF3" size={17} />
              <TextInput
             textContentType="emailAddress"
                style={styles.TextInputEdit}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <Text style={styles.Labels}>Mobile Number</Text>
            <View style={styles.InputWrapperEdit}>
              <PhoneIcon color="#00BFF3" size={17} />
              <TextInput
                style={styles.TextInputEdit}
                value={mobile}
                onChangeText={setMobile}
              />
            </View>
          </View>
  
          {/* Finish Booking button */}
          <TouchableOpacity onPress={openModal} style={styles.finishBookingButton}>
            <Text style={styles.finishBookingButtonText}>Update</Text>
          </TouchableOpacity>
        <PasswordModal modalVisible={modalVisible} onUpdateClick={onUpdateClick} setModalVisible={setModalVisible} password={password} setPassword={setPassword}/>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    InputWrapperEdit: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      backgroundColor: "white",
      padding: 10,
      borderRadius: 10,
      elevation: 2,
      shadowColor: "gray",
      shadowOpacity: 0.5,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    TextInputEdit: {
      flex: 1,
      height: 40,
      padding: 10,
    },
    TextClass: {
      color: "black",
      fontSize: 13,
    },
  
    TopButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
      marginTop: 20,
    },
    HeadingText: {
      color: "black",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 30,
    },
  
    InputContainer: {
      // paddingHorizontal: 20,
    },
    finishBookingButton: {
      backgroundColor: "#00BFF3",
      paddingVertical: 12,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 15,
      shadowColor: "gray",
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    finishBookingButtonText: {
      color: "white",
      fontSize: 18,
    },
  
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: "auto",
      marginBottom: "auto",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "#ededed",
    },
  
    image: {
      width: 80,
      height: 80,
    },
    Labels: {
      color: "black",
      fontSize: 12,
      paddingLeft: 3,
      marginBottom: 5,
    },
    CenterImage: {
      alignItems: "center",
    },
  });