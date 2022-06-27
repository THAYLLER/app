import * as React from 'react';
import {
  View, Modal, ActivityIndicator, Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingModalComponent(props) {
  const { visible, rotated } = props;
  return (
    <Modal
      transparent
      visible={visible}
      style={{
        flex: 1, // backgroundColor: '#f0f', height, width, alignItems: 'center', alignContent: 'center', alignSelf: 'center', justifyContent: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: '#00000080',
          flex: 1,
          height: (rotated) ? width : height,
          width: (rotated) ? height : width,
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{
          alignItems: 'center', backgroundColor: '#ffffff', height: 120, width: 120, alignSelf: 'center', justifyContent: 'center', borderRadius: 10, zIndex: 9999,
        }}
        >
          <ActivityIndicator size="small" style={{ zIndex: 99999 }} color="#4a4a4a" />
        </View>
      </View>
    </Modal>
  );
}
