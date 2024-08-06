import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import GlobalStyles from '../../GlobalConfig/GlobalStylesheet';
import { primaryColor } from '../../GlobalConfig/Colors';

const PasswordModal = ({modalVisible,setModalVisible,password,setPassword,onUpdateClick}:any) => {

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Conform Your Password</Text>
            <View style={[GlobalStyles.InputFieldConatiner,{width:200,marginVertical:15}]}>

            <TextInput style={GlobalStyles.InputField}
            //   underlineColorAndroid="transparent"
            secureTextEntry={true}
            value={password}
            onChangeText={val => setPassword(val)}
            placeholderTextColor={'#4E4E4E'} placeholder='Enter Password'/>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onUpdateClick}>
              <Text style={styles.textStyle}>Update</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 7,
    paddingBottom: 7,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: primaryColor,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontWeight:"bold",
    fontSize:18,
    textAlign: 'center',
  },
});

export default PasswordModal;