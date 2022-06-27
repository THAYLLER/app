import * as React from 'react';
import {
  View, Modal, Dimensions, Image, Text,
} from 'react-native';
import Images from '../constants/Images';
import ContinueButton from './ContinueButton';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

export default function CoinsMaxModalComponent(props) {
  const { visible, closeModal } = props;
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
          alignItems: 'center', backgroundColor: '#ffffff', width: width - 40, height: 'auto', alignSelf: 'center', borderRadius: 10, zIndex: 9999, paddingVertical: 26,
        }}
        >
          <Text style={{
            fontFamily: 'Rubik-Bold', color: '#6853C8', fontSize: 15, lineHeight: 18, marginBottom: 32,
          }}
          >
            LIMITE DE MOEDAS ATINGIDO
          </Text>
          <FastImage resizeMode={FastImage.resizeMode.contain} source={Images.maxCoins} style={{ width: width - 40, height: width - 40 }} />
          <Text style={{
            fontFamily: 'Rubik-Regular', color: '#8EA7AB', fontSize: 15, lineHeight: 16, textAlign: 'center', width: width - 170, marginTop: -90, marginBottom: 40,
          }}
          >
            Você juntou o máximo de moedas deste Cicloo. Agora use suas moedas para resgatar recompensas!
          </Text>
          <ContinueButton
            buttonPress={() => closeModal()}
            textInside="VER RECOMPENSAS"
            style={{
              width: width - 88,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
