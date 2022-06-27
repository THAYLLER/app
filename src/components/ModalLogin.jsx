import React, { Component, Fragment } from 'react';
import {
  View, Modal, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, SafeAreaView, Image, Platform, Animated, TextInput, Button, Keyboard, StatusBar, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useHeaderHeight } from '@react-navigation/stack';
// import { TextInputMask } from 'react-native-masked-text';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FloatingLabelInput from './FloatingLabelInput';
import ContinueButton from './ContinueButton';
import DismissKeyboardView from './DismissKeyboardView';

import Images from '../constants/Images';

const { width, height } = Dimensions.get('window');
// const headerHeight = useHeaderHeight();
const headerHeight = 40;

class ModalLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmationCode: '',
      newPwd: '',
      confirmNewPwd: '',
    };
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true);
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value,
    });
  }

  shutModal = () => {
    const { navigation, closeModal, isVisible } = this.props;
    const { text, isPhone } = this.state;
    isVisible = false;
  };

  sendCode() {
    const {
      onButtonPress, newPassword, resetPassword,
    } = this.props;
    const {
      confirmationCode, newPwd, confirmNewPwd,
    } = this.state;
    if (newPwd !== confirmNewPwd) {
      return Alert.alert(
        'Senhas não coincidem',
        'O campo senha e confirmar senha devem ser iguais',
        [
          { text: 'OK', onPress: () => '' },
        ],
        { cancelable: false },
      );
    }
    Keyboard.dismiss();
    let values;
    if (newPassword) {
      values = {
        code: confirmationCode,
        password: newPwd,
      };
    } else if (resetPassword) {
      values = newPwd;
    } else {
      values = confirmationCode;
    }
    // const values = newPassword ? {
    //   code: confirmationCode,
    //   password: newPwd,
    // } : confirmationCode;
    return onButtonPress(values);
  }

  render() {
    const {
      isVisible, close, attributes, newPassword, resetPassword,
    } = this.props;
    const {
      confirmationCode, newPwd, confirmNewPwd,
    } = this.state;

    const keyboardVerticalOffset = Platform.OS === 'ios' ? headerHeight - 10 : 0;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={() => close()}
        style={styles.modalContainer}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <DismissKeyboardView>
              <KeyboardAvoidingView
                behavior="padding"
                contentContainerStyle={{ marginTop: 0 }}
                keyboardVerticalOffset={keyboardVerticalOffset}
              >
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => close()} style={{ marginTop: 0, left: 20 }}>
                    <Icon name="close" color="#000000" size={24} />
                  </TouchableOpacity>
                  {/* </View>
              <View style={styles.label}> */}
                  <Text style={styles.labelFixed}>
                    {resetPassword
                      ? 'Insira uma nova senha'
                      : `${'Insira o código\n enviado por'.toUpperCase()}${
                        attributes ? ' SMS' : ' E-MAIL'
                      }`}
                    {/* {`${'Insira o código\n enviado por'.toUpperCase()}${ attributes ? ' SMS' : ' E-MAIL' }`} */}
                  </Text>
                </View>
                {/* <View style={styles.scrollContent}> */}
                {(newPassword || resetPassword) && (
                <View>
                  <FloatingLabelInput
                    label="Senha"
                    value={newPwd}
                    onChange={(value) => {
                      this.onChangeText('newPwd', value);
                    }}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    clearButtonMode="while-editing"
                    placeholder="Insira sua senha"
                    autoCompleteType="password"
                    textContentType="password"
                    autoCorrect={false}
                    secureTextEntry
                    returnKeyType="next"
                    enablesReturnKeyAutomatically
                  />
                  <FloatingLabelInput
                    label="Confirmar Senha"
                    value={confirmNewPwd}
                    onChange={(value) => {
                      this.onChangeText('confirmNewPwd', value);
                    }}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    clearButtonMode="while-editing"
                    placeholder="Confirmar senha"
                    autoCompleteType="password"
                    textContentType="password"
                    autoCorrect={false}
                    secureTextEntry
                    returnKeyType="next"
                    enablesReturnKeyAutomatically
                  />
                </View>
                )}
                {!resetPassword && (
                <FloatingLabelInput
                  label="Código de Confirmação"
                  value={confirmationCode}
                  onChange={(value) => {
                    this.onChangeText('confirmationCode', value);
                  }}
                  keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                  clearButtonMode="while-editing"
                  placeholder="Digite o código recebido"
                  autoCorrect={false}
                  returnKeyType="done"
                  enablesReturnKeyAutomatically
                  autoCapitalize="none"
                  keyboardType="number-pad"
                />
                )}
                <View style={{ height: 80, backgroundColor: 'transparent' }} />
                <ContinueButton
                  style={{ marginBottom: height * 0.2 }}
                  buttonPress={() => this.sendCode()}
                  textInside="Continuar"
                />
                {/* </View> */}
              </KeyboardAvoidingView>
            </DismissKeyboardView>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    backgroundColor: '#f0f',
    height,
    // paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    // paddingHorizontal: 20,
    paddingTop: 0,
    // marginRight: 15,
    marginTop: 94,
    marginBottom: height * 0.1,
    marginHorizontal: 0,
    // zIndex: 9,
    width,
    justifyContent: 'space-between',
  },
  scrollContent: {
    zIndex: 99,
  },
  content: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    height: height - 76,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
    marginTop: -54,
    marginBottom: 0,
    paddingBottom: 30,
  },
  labelFixed: {
    fontSize: 14,
    lineHeight: 24,
    color: '#000000',
    fontFamily: 'NunitoSans-Bold',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    right: (width - 200) * 0.5,
  },
  input: {
    marginVertical: 16,
    marginHorizontal: 8,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 4,
    // borderRadius: 4,
    // borderColor: '#ccc',
    color: '#888888',
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomEndRadius: 2,
    borderBottomStartRadius: 2,
    fontSize: 16,
    fontWeight: '700',
    // padding: 5,
    paddingTop: 10,
    paddingBottom: 3,
  },
  inputText: {
    color: '#f1f1f1',
    // marginTop: height * 0.1,
    marginBottom: 10,
  },
  inputArea: {
    marginTop: height * 0.05,
    marginBottom: height * 0.09,
  },
});

export default ModalLogin;
