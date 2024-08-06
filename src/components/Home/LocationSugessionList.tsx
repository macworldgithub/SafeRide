import React from 'react';
import {FlatList, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface Address {
  address: string;
  fulladdress: string;
}

interface ValueStruct {
  value: string;
  selected: boolean;
}

interface Props {
  addressList: Address[];
  setValue: (value: ValueStruct) => void;
  value: ValueStruct;
}

export const LocationSugessionList: React.FC<Props> = ({
  addressList,
  setValue,
  value,
}) => {

  const handleLocationClick = (value: string) => {
    setValue({
        value,
        selected: true
    })
  }

  return (
    <View style={styles.container}>
      {!value.selected && (
        <FlatList
          scrollEnabled={false}
          data={addressList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity style={styles.itemContainer} onPress={() => handleLocationClick(item.fulladdress)}>
                <Text style={styles.text}>{item.address}</Text>
                <Text style={styles.text2}>{item.fulladdress}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    color: '#000',
  },
  text2: {
    fontSize: 9,
    color:'#4E4E4E'
  },
});
