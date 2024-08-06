import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';

export const Loader: React.FC<{loading: boolean; color: string}> = ({
  loading,
  color,
}) => {
  return (
    <Modal
      style={{
        flex: 1,
      }}
      animationType="slide"
      transparent={true}
      visible={loading}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          opacity: 0.5,
          position: 'relative',
        }}>
        <ActivityIndicator size="large" color={color} />
      </View>
    </Modal>
  );
};
