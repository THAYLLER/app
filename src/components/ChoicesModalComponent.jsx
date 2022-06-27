import * as React from 'react';
import {
  View, Modal, Text, Dimensions,
} from 'react-native';
import AcceptCheckBox from './AcceptCheckBoxComponent';

const { width, height } = Dimensions.get('window');

export default function ChoicesModalComponent(props) {
  const { visible, selectedChoice, accept } = props;
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
          backgroundColor: '#00000080', flex: 1, height, width, alignItems: 'center', alignContent: 'center', alignSelf: 'center', justifyContent: 'center',
        }}
      >
        <View style={{
          alignItems: 'flex-start', backgroundColor: '#ffffff', height: 'auto', width: width - 90, alignSelf: 'center', justifyContent: 'center', borderRadius: 10, zIndex: 9999, paddingVertical: 20, paddingHorizontal: 30,
        }}
        >
          <Text style={{
            fontFamily: 'Rubik-Bold', color: '#6853C8', fontSize: 18, lineHeight: 22,
          }}
          >
            MOTIVO DO CONTATO
          </Text>
          <View style={{ marginLeft: -16, marginTop: 10 }}>
            <AcceptCheckBox accept={accept === 1} onPress={() => selectedChoice(1, 'Notas duplicadas')} acceptText="Notas duplicadas" style={{ marginBottom: 10 }} />
            <AcceptCheckBox accept={accept === 2} onPress={() => selectedChoice(2, 'Notas sem produtos da promoção')} acceptText={'Notas sem produtos\nda promoção'} style={{ marginBottom: 10 }} />
            <AcceptCheckBox accept={accept === 3} onPress={() => selectedChoice(3, 'Notas fora do período da promoção')} acceptText={'Notas fora do período\nda promoção'} style={{ marginBottom: 10 }} />
            <AcceptCheckBox accept={accept === 4} onPress={() => selectedChoice(4, 'Outros')} acceptText="Outros" style={{ marginBottom: 10 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
