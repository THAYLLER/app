import * as React from 'react';
import {
  View, Modal, Text, Dimensions,
} from 'react-native';
import AcceptCheckBox from './AcceptCheckBoxComponent';

const { width, height } = Dimensions.get('window');


export default function ChooseNoteModalComponent(props) {
  const { visible, selectedChooseNote, accept, data } = props;
  console.log('ChooseNoteModalComponent', data.length)
  return (
    <Modal
      transparent
      visible={visible}
      style={{
        flex: 1, 
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
            CUPOM FISCAL
          </Text>
          <View style={{ marginLeft: -16, marginTop: 10 }}>
            {
             data?.map((item, index) => (
                <AcceptCheckBox key={index} accept={accept === item.id} onPress={() => selectedChooseNote(item.id, item.merchant != undefined ? item.merchant.name : `Nota ${data.length - index}`)} acceptText={item.merchant != undefined ? item.merchant.name : `Nota ${data.length - index}`} style={{ marginBottom: 10 }} />
              ))
            }
          </View>
        </View>
      </View>
    </Modal>
  );
}
