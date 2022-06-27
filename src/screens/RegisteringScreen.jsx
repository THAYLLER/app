/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  ActivityIndicator,
  StatusBar,
  Platform,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import CiclooService from '../services/CiclooService';

import FloatingLabelInput from '../components/FloatingLabelInput';
import ContinueButton from '../components/ContinueButton';
import ModalLogin from '../components/ModalLogin';
import DismissKeyboardView from '../components/DismissKeyboardView';
import EncryptedStorage from 'react-native-encrypted-storage';

import 'moment/locale/pt-br';

const { width, height } = Dimensions.get('window');

class RegisteringScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      phoneNumber: '',
      email: '',
      name: '',
      birthDate: '',
      participantId: '',
      gender: 3,
      loading: false,
      rawValueBirthDate: '',
      rawValueCPF: '',
      validBirthDate: true,
      accept: false,
      filledBday: false,
      bdayValue: '',
      tokenId: '',
    };
  }

  async componentWillMount() {
    StatusBar.setBarStyle('dark-content', true);
    const { navigation } = this.props;
    const routeName = navigation.getParam('routeName', {});
    const tokenId = navigation.getParam('tokenId', {});
    this.setState({
      routeName,
      tokenId,
      loading: true,
    });
    const particUser = await EncryptedStorage.getItem('@particUser');
    console.log('particUser', JSON.parse(particUser));
    const {
      particId, rawValue, email, name, birthDate, phoneNumber, gender,
    } = JSON.parse(
      particUser,
    );
    // const paramet = navigation.getParam('params', {});
    // const {
    //   particId, rawValue, email, name, birthDate, phoneNumber, gender,
    // } = JSON.parse(paramet);
    console.log(
      'particId, rawValue, email, name, birthDate, phoneNumber, gender',
      particId,
      rawValue,
      email,
      name,
      birthDate,
      phoneNumber,
      gender,
    );
    this.setState({
      filledBday: birthDate.length > 0,
    });
    // const participantInfo = routeName !== 'Settings' ? await CiclooService.GetParticipant()
    //   .then((resp) => {
    //     console.log('await CiclooService.GetParticipant', resp);
    //     return resp;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   }) : null;

    this.setState({
      participantId: particId || '',
      username: rawValue || '',
      email: email || '',
      name: name || '',
      birthDate: birthDate || '',
      // birthDate: participantInfo && participantInfo.birthDate && routeName !== 'Settings' && !birthDate ? participantInfo.birthDate : birthDate,
      phoneNumber: phoneNumber || '',
      // phoneNumber: phoneNumber && routeName !== 'Settings' ? phoneNumber : `${participantInfo.phones[0].areaCode}${participantInfo.phones[0].number}`,
      gender: gender || 3,
      rawValueCPF: rawValue || '',
      // rawValueBirthDate: participantInfo && participantInfo.birthDate && routeName !== 'Settings' ? participantInfo.birthDate : birthDate,
      accept: routeName === 'Settings',
      loading: false,
    });
    // this.setState({
    //   username: rawValue || '',
    //   phoneNumber: participantInfo.phones && participantInfo.phones.length > 0 ? `55${participantInfo.phones[0].ddd}${participantInfo.phones[0].number}` : '',
    //   email: email || '',
    //   rawValueCPF: rawValue || '',
    //   name: participantInfo.name || '',
    //   birthDate: participantInfo.birthDate || '',
    //   participantId: particId,
    //   gender: participantInfo.gender || '',
    // });
  }

  onChangeText(key, value) {
    this.setState({
      [key]: key === 'name' ? value.replace(/[0-9]/g, '') : value,
    });
  }

  getDate(stringDate) {
    if (stringDate.indexOf('/') >= 0) {
      const dataSplit = stringDate.split('/');

      const day = dataSplit[0];
      const month = dataSplit[1];
      const year = dataSplit[2];

      return new Date(year, month - 1, day);
    }

    const day = stringDate.slice(0, 2);
    const month = stringDate.slice(2, 4);
    const year = stringDate.slice(4, 8);

    return new Date(year, month - 1, day);
  }

  signUp = async () => {
    const {
      name,
      phoneNumber,
      birthDate,
      gender,
      accept,
      validBirthDate,
      routeName,
      bdayValue,
      tokenId,
    } = this.state;
    const { navigation } = this.props;

    Keyboard.dismiss();

    let messageError = '';
    if (!accept) {
      messageError = 'Para continuar você deve aceitar nossos termos de uso';
    }
    if (gender === 0 || phoneNumber.length === 0 || birthDate.length === 0 || name.length === 0) {
      messageError = 'Você esqueceu de preencher algum campo';
    }
    if (gender === 0) {
      messageError = 'Informe seu sexo';
    }
    if (this.isLowerAge(birthDate)) {
      messageError = 'Você deve ter mais de 18 anos';
    }

    const newBday = birthDate.replace(/\//g, '');

    if (newBday.length !== 8 || !validBirthDate) {
      messageError = 'Insira uma data de nascimento válida';
    }
    const validDDD = this.checkDDD(phoneNumber);
    const newPhone = phoneNumber.replace(/[ )(-]/g, '');

    if (!validDDD) {
      messageError = 'DDD do telefone não pode conter o dígito 0';
    }

    if (newPhone.length < 10 || (newPhone.length === 11 && newPhone.charAt(2) !== '9')) {
      messageError = 'Você inseriu um celular inválido';
    }
    if (name.length < 4 || name.search(' ') < 2) {
      messageError = 'Insira seu nome completo';
    }
    if (messageError.length > 0) {
      return Alert.alert('Confira seus dados', messageError, [{ text: 'OK', onPress: () => '' }], {
        cancelable: false,
      });
    }
    this.setState({
      loading: true,
    });

    const body = {
      phone: {
        ddd: `${newPhone.substr(0, 2)}`,
        number: `${newPhone.substr(2, 5)}${newPhone.substr(7, 4)}`,
        type: 3,
      },
      name,
      birthDate: this.getDate(birthDate),
      gender,
    };
    const tok = tokenId || null;
    const { success } = await CiclooService.UpdateParticipant(body, tok)
      .then((res) => {
        this.setState({
          loading: false,
        });
        return res.data;
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        return Alert.alert('Erro', JSON.stringify(err), [{ text: 'OK', onPress: () => '' }], {
          cancelable: false,
        });
      });
    this.setState({ loading: false });
    if (success) {
      return Alert.alert(
        'Usuário atualizado',
        routeName === 'Settings'
          ? 'Seus dados cadastrais foram atualizados com sucesso'
          : 'Seja bem-vindo ao nosso programa de pontos',
        [{ text: 'OK', onPress: () => navigation.navigate('AuthLoading') }],
        { cancelable: false },
      );
    }
  };

  getBack = async () => {
    const {
      navigation: { goBack },
    } = this.props;
    return Alert.alert(
      'Você tem certeza?',
      'Ao voltar para a tela anterior seus dados não serão salvos. Você tem certeza que deseja continuar?',
      [
        {
          text: 'Não',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            await EncryptedStorage.clear();
            goBack(null);
          },
        },
      ],
      { cancelable: true },
    );
  };

  checkDDD(phone) {
    return (
      /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/.test(phone)
      || /^[1-9]{2}[0-9]{9}$/.test(phone)
    );
  }

  isLowerAge(birthDate) {
    const now = moment(new Date());
    const past = this.getDate(birthDate);
    const duration = moment.duration(now.diff(past));
    const years = parseInt(duration.asYears(), 10);
    return years < 18;
  }

  render() {
    const {
      username,
      phoneNumber,
      email,
      showModal,
      loading,
      name,
      birthDate,
      gender,
      accept,
      routeName,
    } = this.state;
    const {
      navigation: { goBack, navigate },
    } = this.props;

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

    if (loading) {
      return (
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
            height,
            width,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              color: '#000000',
              fontSize: 16,
              fontWeight: '600',
              marginRight: 20,
              marginTop: -60,
            }}
          >
            Carregando
          </Text>
          <ActivityIndicator
            size="small"
            style={{ alignSelf: 'center', marginTop: -60 }}
            animating
            color="#000000"
          />
        </View>
      );
    }
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 35 : 0 }]}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <ScrollView>
          <DismissKeyboardView>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={height * -0.02}
            >
              <View
                style={{
                  marginTop: height * 0.02,
                  marginBottom: height * 0.05,
                  width,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (routeName === 'Settings') goBack(null);
                    else this.getBack();
                  }}
                  style={{
                    alignSelf: 'center',
                    marginLeft: 16,
                  }}
                >
                  <View>
                    <Icon name="chevron-left" color="#000000" size={24} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                  {`${
                    routeName === 'Settings' ? 'DADOS CADASTRAIS' : 'FINALIZAR CADASTRO'
                  }`.toUpperCase()}
                </Text>
              </View>
              {/* <TouchableOpacity
                onPress={() => {
                  goBack(null);
                  console.log('teste');
                }}
                style={{
                  top: height * 0.1, left: 32, position: 'absolute', zIndex: 9999,
                }}
              >
                <View>
                  <Icon name="chevron-left" color="#000000" size={32} />
                </View>
              </TouchableOpacity> */}
              <FloatingLabelInput
                label="CPF"
                value={username}
                onChange={(value) => {
                  this.onChangeText('username', value);
                }}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                clearButtonMode="while-editing"
                placeholder="Digite seu CPF"
                autoCompleteType="username"
                textContentType="username"
                autoCorrect={false}
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="number-pad"
                editable={false}
                blur={(raw, isOK) => {
                  console.log('onBlur');
                  this.setState({ rawValueCPF: raw, validCPF: isOK });
                }}
                style={{ color: '#666666', opacity: 1, borderBottomColor: '#AAAAAA' }}
              />
              <FloatingLabelInput
                label="E-mail"
                value={email}
                onChange={(value) => {
                  this.onChangeText('email', value);
                }}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                clearButtonMode="while-editing"
                placeholder="Informe seu endereço de E-mail"
                autoCompleteType="email"
                textContentType="emailAddress"
                autoCorrect={false}
                returnKeyType="done"
                // keyboardType="email-address"
                editable={false}
                style={{
                  marginBottom: height * 0.15,
                  color: '#666666',
                  opacity: 1,
                  borderBottomColor: '#AAAAAA',
                }}
              />
              <FloatingLabelInput
                label="Nome completo"
                value={name}
                onChange={(value) => {
                  this.onChangeText('name', value);
                }}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                clearButtonMode="while-editing"
                placeholder="Como você se chama?"
                textContentType="name"
                autoCorrect={false}
                returnKeyType="done"
                keyboardType="default"
                style={{ marginBottom: height * 0.15 }}
              />
              <FloatingLabelInput
                label="Celular"
                value={phoneNumber}
                onChange={(value) => {
                  this.onChangeText('phoneNumber', value);
                }}
                maxLength={15}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                clearButtonMode="while-editing"
                placeholder="Seu número com o DDD"
                autoCompleteType="tel"
                textContentType="telephoneNumber"
                autoCorrect={false}
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="phone-pad"
              />
              <FloatingLabelInput
                label="Data de Nascimento"
                ref={(ref) => (this.bdayField = ref)}
                value={birthDate}
                onChange={(value) => {
                  this.onChangeText('birthDate', value);
                }}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                clearButtonMode="while-editing"
                placeholder="Data de Nascimento - DD/MM/AAAA"
                autoCorrect={false}
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="number-pad"
                blur={(raw, isOK, bdayFormat) => {
                  const bdayValue = bdayFormat || raw;
                  console.log('onBlur data de nascimento', isOK, birthDate);
                  console.log('blur nascimento', isOK, bdayValue);
                  if (JSON.stringify(raw).length === 26 && birthDate.length === 10 && isOK) {
                    const date = JSON.stringify(bdayValue);
                    const year = Number(date.substr(1, 4));
                    if (!isOK || year > 2002 || year < 1900) {
                      this.setState({ dateIsValid: false });
                    } else {
                      this.setState({ dateIsValid: true });
                    }
                    this.setState({ rawValueBirthDate: raw, validBirthDate: isOK, bdayValue });
                  } else {
                    this.setState({ dateIsValid: false, validBirthDate: isOK, bdayValue });
                  }
                }}
                style={{}}
              />
              <FloatingLabelInput
                label="Gênero"
                value={gender}
                onChange={(value) => {
                  this.onChangeText('gender', value);
                }}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              />
              <View
                style={{
                  height: 50,
                  width: width - 50,
                  borderRadius: 0,
                  padding: 4,
                  flexDirection: 'row',
                  alignSelf: 'center',
                  fontSize: 16,
                  color: '#000',
                  paddingLeft: 8,
                  fontFamily: 'NunitoSans-ExtraLight',
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ accept: routeName === 'Settings' ? true : !accept })}
                  style={{
                    marginTop: 0,
                    height: 24,
                    width: 24,
                    marginRight: 16,
                  }}
                  disabled={routeName === 'Settings'}
                >
                  <View
                    style={{
                      height: 24,
                      width: 24,
                      borderRadius: 0,
                      borderColor: '#000000',
                      borderWidth: 1,
                      backgroundColor: '#FFFFFF',
                      padding: 4,
                      opacity: routeName === 'Settings' ? 0.65 : 1,
                    }}
                  >
                    <View
                      style={{
                        height: 14,
                        width: 14,
                        borderRadius: 0,
                        backgroundColor: accept ? '#000000' : '#eeeeee',
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      width: width - 100,
                      flexWrap: 'wrap',
                      alignSelf: 'center',
                      justifyContent: 'flex-start',
                      marginTop: 0,
                      height: 24,
                    },
                  ]}
                >
                  <Text style={[styles.terms, { textAlign: 'left' }]}>
                    Ao entrar você concorda com os
                    <Text style={[styles.terms, { fontWeight: '600' }]}>
                      {' Termos e condições de uso'}
                    </Text>
                    <Text style={[styles.terms]}>{' e a '}</Text>
                    <Text style={[styles.terms, { fontWeight: '600' }]}>
                      política de privacidade da Unilever©
                    </Text>
                  </Text>
                </View>
              </View>
              <ContinueButton
                buttonPress={() => {
                  this.bdayField.bdayField.props.ehVal();
                  this.signUp();
                }}
                textInside="Atualizar"
                style={{ marginTop: height * 0.05, marginBottom: height * 0.055 }}
              />
              {!!showModal && (
                <ModalLogin
                  resetPassword
                  isVisible={showModal}
                  close={() => this.setState({ showModal: false })}
                  onButtonPress={(value) => this.confirmSignUp(value)}
                />
              )}
            </KeyboardAvoidingView>
          </DismissKeyboardView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: height * 0.05,
    // justifyContent: 'center',
  },
  headerTitle: {
    alignSelf: 'center',
    textAlign: 'center',
    width: 200,
    left: -(width * 0.5 - 100),
    // marginLeft: width * 0.5 -100 - 32,
    // marginRight: width * 0.5 - 100 - 32,
    color: '#000000',
    // opacity: 0.75,
    // fontWeight: '900',
    fontSize: 14,
    fontFamily: 'NunitoSans-Black',
    lineHeight: 18,
    letterSpacing: 0.25,
  },
  floatingLabel: {
    width: width - 50,
    height: 50,
  },
  terms: {
    // letterSpacing: 4,
    color: '#000000',
    fontWeight: '300',
    fontSize: 11,
    lineHeight: 12,
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  writing: {
    alignSelf: 'flex-end',
    color: '#000000',
    // opacity: 0.75,
    // fontWeight: '900',
    fontSize: 12,
    fontFamily: 'NunitoSans-Regular',
    lineHeight: 18,
    letterSpacing: 0.25,
    marginRight: 32,
  },
});

export default RegisteringScreen;
