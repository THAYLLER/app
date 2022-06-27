import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StatusBar,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Alert,
} from 'react-native';
import { StackActions, NavigationEvents } from 'react-navigation';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CiclooService from '../services/CiclooService';

import FloatingLabelInput from '../components/FloatingLabelInput';
import ContinueButton from '../components/ContinueButton';
import LoadingModalComponent from '../components/LoadingModalComponent';
import DismissKeyboardView from '../components/DismissKeyboardView';

import 'moment/locale/pt-br';

const { width, height } = Dimensions.get('window');

class EditProfileScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      username: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      birthDate: '',
      city: '',
      uf: '',
      loading: false,
      validCPF: false,
      socialMediaData: {},
      participantData: {},
      participantId: '',
      tokenFace: '',
      rawValue: '',
      confirmationCode: '',
      password: '',
      // loading: true,
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('dark-content');
    // await this.loadProfileData();
  }

  onChangeText(key, value) {
    const numbers = '1234567890';
    if (key === 'username' && !numbers.indexOf(value[value.length - 1]) < 0) {
      // console.log('numbers.indexOf(value) < 0');
      return;
    }
    this.setState({
      [key]: value,
    });
  }

  loadProfileData = async () => {
    const { navigation } = this.props;
    // const participantData = navigation.getParam('participantData', {});
    // console.log('loadProfileData-edit-participantData', participantData);
    const participantData = await CiclooService.GetParticipantData();
    this.setState({
      participantData,
      firstName: participantData.firstName,
      username: participantData.cpf,
      lastName: participantData.lastName,
      phoneNumber: participantData.cellPhone,
      email: participantData.email,
      birthDate: moment(participantData.birthDate).format('DD/MM/YYYY'),
      city: participantData.city ? participantData.city : '',
      uf: participantData.state ? participantData.state : '',
      loading: false,
    });
  }

  getBack = () => {
    const { navigation } = this.props;
    const resetAction = StackActions.popToTop();
    setTimeout(() => {
      navigation.dispatch(resetAction);
    }, 100);
  }

  deleteMyAccount = async () => {
    const { navigation } = this.props;
    await AsyncStorage.setItem('@subject', "deleteMyAccount");
    await AsyncStorage.setItem('@message', "Quero solicitar a exclusão da minha conta.");
    await AsyncStorage.setItem('@options', "Quero solicitar a exclusão da minha conta.");
    return navigation.navigate('Contact');
  }
  
  goForward = () => {
    const { navigation } = this.props;
    setTimeout(() => {
      navigation.navigate('SignInStack');
    }, 500);
  }

  editParticipant() {
    Keyboard.dismiss();
    this.setState({
      loading: true,
    });
    this.validate();
  }

  async validate() {
    const { navigation } = this.props;
    const {
      firstName,
      lastName,
      phoneNumber,
      birthDate,
      city,
      uf,
      socialMediaData,
      participantData,
    } = this.state;
    const body = {
      ...participantData,
    };

    if (city === '' || uf === '' || phoneNumber === '' || firstName === '' || lastName === '') {
      this.setState({
        loading: false,
      });
      return Alert.alert('Verifique os dados informados', 'Neccesário preencher todos os dados');
    }

    if (birthDate) {
      const validateYear0000crashed = birthDate.split('/');

      if (validateYear0000crashed[2] >= '0000' && validateYear0000crashed[2] <= '0010') {
        this.setState({
          loading: false,
        });
        return Alert.alert('Verifique os dados informados', 'Informe uma data válida.');
      }
    }

    const diff = moment().diff(birthDate, 'years');
    console.log('moment().diff(birthDate, years)', diff);
    if (phoneNumber[5] !== '9') {
      this.setState({
        loading: false,
      });
      return Alert.alert('Verifique os dados informados', 'O celular informado é inválido.');
    }
    if (diff < 17) {
      this.setState({
        loading: false,
      });
      return Alert.alert('Verifique os dados informados', 'Idade inferior à 18 anos.');
    }
    if (diff > 120) {
      this.setState({
        loading: false,
      });
      return Alert.alert('Verifique os dados informados', 'Informe uma data válida.');
    }
    body.firstName = firstName;
    body.lastName = lastName;
    body.cellPhone = phoneNumber;
    body.birthDate = moment(birthDate, 'DD/MM/YYYY').format();
    body.city = city;
    body.state = uf;
    delete(body.password)
    delete(body.confirmPassword)
    delete(body.passwordHash)

    const resp = await CiclooService.editProfile(body);
    // console.log('resp', JSON.stringify(resp));
    if (resp.success) {
      return Alert.alert(
        'Alteração realizada!',
        `Dados alterados com sucesso!`,
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({
                loading: false,
              });
              navigation.goBack(null);
            },
          },
        ],
        { cancelable: false },
      );
    }
    this.setState({
      loading: false,
    });
    return Alert.alert(
      'Tente novamente',
      resp,
    );
  }

  render() {
    const {
      username,
      email,
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      city,
      uf,
      loading,
      participantData,
    } = this.state;
    const { navigation: { goBack, navigate } } = this.props;

    return (
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === 'android' ? 40 : 0 },
        ]}
      >
        <NavigationEvents
          onWillFocus={async () => {
            this.setState({ loading: false });
            await this.loadProfileData();
          }}
        />
        <DismissKeyboardView>
          <ScrollView style={{ paddingTop: 40 }}>
            <View style={{ width }}>
              <TouchableOpacity
                onPress={() => {
                  goBack(null);
                }}
                style={{
                  top: height * 0.06 + 9,
                  left: 32,
                  position: 'absolute',
                  zIndex: 9999,
                }}
              >
                <View>
                  <Icon
                    name="close"
                    color="#2e2e2e"
                    size={24}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{'Preencha todos os campos\nabaixo para fazer seu cadastro.'}</Text>
            </View>
            <FloatingLabelInput
              label="CPF*"
              value={username}
              onChange={(value, isOK) => {
                this.onChangeText('username', value);
              }}
              keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              clearButtonMode="while-editing"
              placeholder="Digite seu CPF*"
              autoCompleteType="username"
              textContentType="username"
              autoCorrect={false}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="number-pad"
              editable={false}
              style={{ color: '#AAA' }}
              blur={(raw, isOK) => { this.setState({ rawValue: raw, validCPF: isOK }); }}
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
              autoCapitalize="none"
              // keyboardType="email-address"
              editable={false}
              style={{ color: '#AAA', marginBottom: height * 0.15 }}
            />
            <FloatingLabelInput
              label="Nome"
              value={firstName}
              onChange={(value) => {
                if (/[0-9]/.test(value[value.length - 1])) return;
                this.onChangeText('firstName', value);
              }}
              keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              clearButtonMode="while-editing"
              placeholder="Qual seu nome?"
              textContentType="givenName"
              autoCorrect={false}
              returnKeyType="done"
              keyboardType="default"
              style={{ marginBottom: height * 0.15 }}
            />
            <FloatingLabelInput
              label="Sobrenome"
              value={lastName}
              onChange={(value) => {
                if (/[0-9]/.test(value[value.length - 1])) return;
                this.onChangeText('lastName', value);
              }}
              keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              clearButtonMode="while-editing"
              placeholder="E o seu sobrenome?"
              textContentType="middleName"
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
                // console.log('onBlur data de nascimento', isOK, birthDate);
                // console.log('blur nascimento', isOK, bdayValue);
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
              label="Cidade"
              value={city}
              onChange={(value) => {
                if (/[0-9]/.test(value[value.length - 1])) return;
                this.onChangeText('city', value);
              }}
              keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              clearButtonMode="while-editing"
              placeholder="Qual cidade você mora?"
              textContentType="addressCity"
              autoCorrect={false}
              returnKeyType="done"
              keyboardType="default"
              style={{ marginBottom: height * 0.15 }}
            />
            <FloatingLabelInput
              label="Estado"
              value={uf}
              onChange={(value) => {
                if (/[0-9]/.test(value[value.length - 1])) return;
                this.onChangeText('uf', value);
              }}
              keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              clearButtonMode="while-editing"
              placeholder="Qual estado você mora?"
              textContentType="addressState"
              autoCorrect={false}
              returnKeyType="done"
              keyboardType="default"
              style={{ marginBottom: height * 0.15 }}
              maxLength={2}
              autoCapitalize="characters"
            />
            {
              Platform.OS === 'ios' && (
                <TouchableOpacity onPress={this.deleteMyAccount}>
                  <Text style={styles.textDelet}>Excluir Minha Conta</Text>
                </TouchableOpacity>
              )
            }
            <ContinueButton
              buttonPress={() => this.editParticipant()}
              textInside="Alterar dados"
              style={{ marginTop: height * 0.05, marginBottom: height * 0.3 }}
            />
            {loading && (
              <LoadingModalComponent visible={loading} />
            )}
          </ScrollView>
        </DismissKeyboardView>
      </View>
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
    justifyContent: 'center',
    color: '#000000',
    // opacity: 0.75,
    // fontWeight: '900',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Rubik-Regular',
    lineHeight: 18,
    marginTop: height * 0.06,
    marginBottom: height * 0.1,
  },
  textDelet: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#FF0000',
    // opacity: 0.75,
    // fontWeight: '900',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Rubik-Regular',
    marginTop: height * 0.06,
  },
  floatingLabel: {
    width: width - 50,
    height: 50,
  },
  terms: {
    // letterSpacing: 4,
    color: '#2D2D2D',
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    lineHeight: 18,
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

export default EditProfileScreen;
