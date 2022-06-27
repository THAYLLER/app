import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Alert, Modal, Dimensions, TouchableWithoutFeedback,
} from 'react-native';
import ContinueButton from './ContinueButton';

const { width, height } = Dimensions.get('screen');

class ProblemModalComponent extends React.PureComponent {
  render() {
    const {
      modalVisible,
      navigation,
      buttonFunction,
      closeModal,
    } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >

        <View style={[styles.centeredView, { alignItems: 'center', zIndex: 999 }]}>
          <View style={[styles.modalView, { width: width - 40 }]}>
            <Text style={styles.modalText}>{'Reportar um problema'.toUpperCase()}</Text>
            <Text style={{
              padding: 20, width: width - 50, alignSelf: 'center', textAlign: 'center', color: '#2d2d2d', fontFamily: 'Rubik-Regular', fontSize: 15, lineHeight: 18, marginBottom: 30,
            }}
            >
              Muitos problemas são resolvidos com uma consulta às dúvidas frequentes. Caso não encontre uma solução por lá, envie uma mensagem através de nossa central de atendimento.
            </Text>
            <View style={{ bottom: 0 }}>
              <ContinueButton
                buttonPress={() => buttonFunction('Faq')}
                textInside="VER DÚVIDAS FREQUENTES"
                style={{ bottom: 0, width: width - 100 }}
                bgWhite
              />
              <ContinueButton
                buttonPress={() => buttonFunction('Contact')}
                textInside="FALE CONOSCO"
                style={{ marginTop: 10, bottom: 0, width: width - 100 }}
              />
            </View>
          </View>
          <ContinueButton
            buttonPress={closeModal}
            textInside="FECHAR"
            style={{
              marginTop: 10,
              bottom: 0,
              backgroundColor: '#000000AA',
              borderColor: '#00000000',
              width: width * 0.3,
            }}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 15,
    lineHeight: 18,
    color: '#6853C8',
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
  },
  openButton: {
    borderRadius: 30,
    padding: 13,
    elevation: 2,
    height: 48,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProblemModalComponent;
