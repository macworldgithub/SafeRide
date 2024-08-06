import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ArrowLongRightIcon } from 'react-native-heroicons/solid'
import { primaryColor } from '../../GlobalConfig/Colors'

type Props = {
    paymentData:any
    setHavePaymentInfo: React.Dispatch<React.SetStateAction<boolean>>;
    setUpdateInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddPaymentInfoComponent = (props: Props) => {
  return (
    <View style={{display:"flex",justifyContent:"center",alignItems:"center",flex:1,gap:20,paddingTop:20}}>
          <Text style={{fontSize:18, color:'#424242'}}>
            {props.paymentData.ResponseText}
          </Text>
        <TouchableOpacity onPress={()=>{props.setHavePaymentInfo(true);props.setUpdateInfo(true);}} style={{justifyContent:"center",alignItems:"center",paddingHorizontal:17,paddingVertical:10,flexDirection:"row",gap:10,borderRadius:7,backgroundColor:primaryColor}}>
         <Text style={{color:"white",fontWeight:"bold"}}>
           Add Payment Card
          </Text>
          <ArrowLongRightIcon  color="white"/>
        </TouchableOpacity>
      </View>
  )
}

export default AddPaymentInfoComponent
