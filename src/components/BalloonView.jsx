import React, { useState } from 'react';
import {
  Text, View, Dimensions,
} from 'react-native';
import ContinueButton from './ContinueButton';
import EncryptedStorage from 'react-native-encrypted-storage';
import AcceptCheckBox from './AcceptCheckBoxComponent';

const { width, height } = Dimensions.get('window');

function BalloonView(props) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [hideBalloon, setHideBalloon] = useState(false);

  const { qrcode, okFunction } = props;
  if (qrcode) {
    return (
      <View style={{
        height: 'auto', width: width - 48, backgroundColor: '#FFFFFF', borderRadius: 10, borderTopRightRadius: 0, padding: 24, alignSelf: 'center', top: 100,
      }}
      >
        <View style={{
          borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FFFFFF', borderLeftWidth: 50, borderRightWidth: 50, borderBottomWidth: 100, height: 20, width: 30, marginTop: -20, backgroundColor: 'transparent', position: 'absolute', alignSelf: 'flex-end', transform: [{ rotate: '-90deg' }],
        }}
        />
        <Text style={{
          fontFamily: 'Rubik-Bold', color: '#6853C8', fontSize: 18, lineHeight: 22,
        }}
        >
          IMPORTANTE:
        </Text>
        <Text style={{
          fontFamily: 'Rubik-Regular', color: '#2D2D2D', fontSize: 15, marginTop: 5, lineHeight: 16, marginBottom: 15,
        }}
        >
          {'Alterne aqui para o escaneamento\nde '}
          <Text style={{ fontFamily: 'Rubik-Bold' }}>
            notas com ou sem QR Code.
          </Text>
        </Text>
        {/* <View style={{ marginLeft: -20, marginBottom: 10 }}>
          <AcceptCheckBox accept={dontShowAgain} onPress={() => setDontShowAgain(!dontShowAgain)} acceptText="Não exibir novamente" />
        </View> */}
        <ContinueButton
          buttonPress={() => { if (dontShowAgain) EncryptedStorage.setItem('qrAlways', JSON.stringify(dontShowAgain)); okFunction(); }}
          textInside="OK, ENTENDI."
          style={{
            marginTop: 16,
            width: width * 0.8,
            backgroundColor: '#FFF',
            borderColor: '#6853C8',
            color: '#6853C8',
            alignSelf: 'center',
          }}
          bgWhite
        />
      </View>
    );
  }
  return (
    <View style={{
      height: 'auto', width: width - 48, backgroundColor: '#FFFFFF', borderRadius: 10, borderTopRightRadius: 0, padding: 24, alignSelf: 'center', top: 100,
    }}
    >
      <View style={{
        borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FFFFFF', borderLeftWidth: 50, borderRightWidth: 50, borderBottomWidth: 100, height: 20, width: 30, marginTop: -20, backgroundColor: 'transparent', position: 'absolute', alignSelf: 'flex-end', transform: [{ rotate: '-90deg' }],
      }}
      />
      <Text style={{
        fontFamily: 'Rubik-Bold', color: '#6853C8', fontSize: 18, lineHeight: 22,
      }}
      >
        CUPONS SEM QR CODE
      </Text>
      <Text style={{
        fontFamily: 'Rubik-Regular', color: '#2D2D2D', fontSize: 15, marginTop: 5, lineHeight: 16, marginBottom: 15,
      }}
      >
        {'Para escanear cupons fiscais sem QR\nCode, siga as instruções abaixo:'}
      </Text>
      <Text style={{
        fontFamily: 'Rubik-Bold', fontSize: 15, marginTop: 5, lineHeight: 16, marginBottom: 15,
      }}
      >
        {'Coloque o cupom em cima de uma\nsuperfície plana.'}
      </Text>
      <Text style={{
        fontFamily: 'Rubik-Bold', fontSize: 15, marginTop: 5, lineHeight: 16, marginBottom: 15,
      }}
      >
        {'Garanta que a iluminação esteja\nadequada.'}
      </Text>
      <Text style={{
        fontFamily: 'Rubik-Bold', fontSize: 15, marginTop: 5, lineHeight: 16, marginBottom: 15,
      }}
      >
        {'Enquadre o seu cupom inteiro dentro\ndas marcações.'}
      </Text>
      {/* <View style={{ marginLeft: -20, marginBottom: 10 }}>
        <AcceptCheckBox accept={dontShowAgain} onPress={() => setDontShowAgain(!dontShowAgain)} acceptText="Não exibir novamente" />
      </View> */}
      <ContinueButton
        buttonPress={() => { if (dontShowAgain) EncryptedStorage.setItem('camAlways', JSON.stringify(dontShowAgain)); okFunction(); }}
        textInside="OK, ENTENDI."
        style={{
          marginTop: 16,
          width: width * 0.8,
          backgroundColor: '#FFF',
          borderColor: '#6853C8',
          color: '#6853C8',
          alignSelf: 'center',
        }}
        bgWhite
      />
    </View>
  );
}

export default BalloonView;
