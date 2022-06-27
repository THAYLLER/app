import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import {
  Animated,
  ActivityIndicator,
  Button,
  Image,
  StatusBar,
  Platform,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  Alert,
  Linking,
} from 'react-native';
import axios from 'axios';
import { NavigationActions, StackActions } from 'react-navigation';
import moment from 'moment';
import Colors from '../constants/Colors';
import analytics from '@react-native-firebase/analytics';

import CiclooService from '../services/CiclooService';

import FloatingLabelInput from '../components/FloatingLabelInput';
import AcceptCheckBox from '../components/AcceptCheckBoxComponent';
import ContinueButton from '../components/ContinueButton';
import ModalLogin from '../components/ModalLogin';
import LoadingModalComponent from '../components/LoadingModalComponent';
import DismissKeyboardView from '../components/DismissKeyboardView';
import Authentication from '../utils/Authentication';
import Main from '../utils/Main';

import 'moment/locale/pt-br';
import BehaviorService from '../services/BehaviorService';
import { TextInputMask } from 'react-native-masked-text';

const { width, height } = Dimensions.get('window');

class SignUpScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      username: '',
      lastName: '',
      password: '',
      phoneNumber: null,
      email: '',
      birthDate: null,
      accept: false,
      acceptNews: false,
      acceptNewsOthers: false,
      city: null,
      uf: null,
      confirmationCode: '',
      loading: false,
      rawValue: '',
      validCPF: false,
      socialMediaData: {},
      participantId: '',
      tokenFace: '',
      social: false,
      editEmail: true,
      isApple: false,

      inputToShow: null,
      inputToHide: null,
      
      firstNameFocused: false,
      usernameFocused: false,
      lastNameFocused: false,
      phoneNumberFocused: false,
      emailFocused: false,
      birthDateFocused: false,
      cityFocused: false,
      ufFocused: false,
    };
    this._firstNameFocused = new Animated.Value(0)
    this._usernameFocused = new Animated.Value(0)
    this._lastNameFocused = new Animated.Value(0)
    this._phoneNumberFocused = new Animated.Value(0)
    this._emailFocused = new Animated.Value(0)
    this._birthDateFocused = new Animated.Value(0)
    this._cityFocused = new Animated.Value(0)
    this._ufFocused = new Animated.Value(0)
    this.inputRefs = {}
    this.registerInputRef = this.registerInputRef.bind(this)
    this.submitEditing = this.submitEditing.bind(this)
  }

  async componentDidMount() {
    const { navigation } = this.props;
    StatusBar.setBarStyle('dark-content');
    // BehaviorService.setOpenedScreens()
    // const participantId = navigation.getParam('id', null);
    // const tokenFace = navigation.getParam('token', null);
    const socialMediaData = navigation.getParam('socialData', null);
    // console.log('participantId', participantId);
    console.log({socialMediaData})
    console.log('socialMediaData', JSON.stringify(socialMediaData));
    console.log('!!socialMediaData', !!socialMediaData);
    // if (socialMediaData && socialMediaData.length > 0) {

    this.setState({
      socialMediaData,
      social: !!socialMediaData,
      editEmail: !socialMediaData,
      isApple: !!(socialMediaData && socialMediaData.socialNetworkUser && socialMediaData.socialNetworkUser[0].socialNetworkType === 3),
      // participantId,
      // tokenFace,
      firstName: socialMediaData ? ((socialMediaData.name) ? socialMediaData.name.split(' ')[0] : socialMediaData.firstName) : '',
      lastName: socialMediaData ? ((socialMediaData.name) ? socialMediaData.name.replace(`${socialMediaData.name.split(' ')[0]} `, '') : socialMediaData.lastName) : '',
      email: (socialMediaData) ? socialMediaData.email : '',
    });
    // }
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { props, state: {inputToShow, inputToHide} } = this;
    if(inputToShow){
      Animated.timing(this['_'+inputToShow+'Focused'], {
        toValue: this.state[inputToShow+'Focused'] || this.state[inputToShow] != '' ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    if(inputToHide){
      Animated.timing(this['_'+inputToHide+'Focused'], {
        toValue: this.state[inputToHide+'Focused'] || this.state[inputToHide] != '' ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }

  onChangeText(key, value) {
    const numbers = '1234567890';
    if (key === 'username' && !numbers.indexOf(value[value.length - 1]) < 0) {
      console.log('numbers.indexOf(value) < 0');
      return;
    }
    this.setState({
      [key]: value,
    });
  }

  alertContent = (content) => Alert.alert(
    'Verifique os dados informados',
    content,
    [
      // {
      //   text: 'Ask me later',
      //   onPress: () => console.log('Ask me later pressed'),
      // },
      // {
      //   text: 'Cancel',
      //   onPress: () => console.log('Cancel Pressed'),
      //   style: 'cancel',
      // },
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );

  validateCpf = () => {
    const {
      username,
      validCPF,
    } = this.state;
    return (!this.username.isValid() || username.length !== 14)
  }

  validateEmail = () => {
    const {
      email,
    } = this.state;
    return (email.indexOf('@') < 1)
  }

  validate = async () => {
    const { navigation } = this.props;
    const {
      firstName,
      username,
      lastName,
      phoneNumber,
      email,
      birthDate,
      accept,
      acceptNews,
      acceptNewsOthers,
      city,
      uf,
      socialMediaData,
      social,
      isApple,
    } = this.state;
    console.log('(isApple && (!firstName || !lastName))', (isApple && (!firstName || !lastName)));

    // let nameFirst = '';
    // let nameLast = '';
    // if (isApple && (!firstName || !lastName)) {
    //   nameFirst = 'Editar';
    //   nameLast = 'Nome';
    //   this.setState({
    //     firstName: 'Editar',
    //     lastName: 'Nome',
    //   });
    // }

    

    
    const diff = moment().diff(birthDate, 'years');
    console.log('moment().diff(birthDate, years)', diff);
    console.log('body', body);
    let message;
    let show = false;

    if(!firstName) {
      show = true;
      message = 'Você precisa informar o nome.';
    }

    if(!lastName) {
      show = true;
      message = 'Você precisa informar o sobrenome.';
    }
    // if (diff > 120) {
    //   show = true;
    //   message = 'Informe uma data válida.';
    // }
    // if (diff < 17) {
    //   show = true;
    //   message = 'Idade inferior à 18 anos.';
    // }
    // if (phoneNumber[5] !== '9') {
    //   show = true;
    //   message = 'O celular informado é inválido.';
    // }

    if (!accept) {
      show = true;
      message = 'Você precisa aceitar os termos para utilizar o aplicativo.';
    }
    if (this.validateEmail()) {
      show = true;
      message = 'O e-mail informado é inválido.';
    }
    if (this.validateCpf()) {
      show = true;
      message = 'O CPF informado é inválido.';
    }
    if (show) {
      this.alertContent(message);
      return false;
    }
    console.log('social', social);

    const body = {
      firstName: firstName || nameFirst,
      lastName: lastName || nameLast,
      cpf: username.replace(/\.|-/g, ''),
      email,
      cellPhone: phoneNumber || null,
      birthDate: birthDate ? moment(birthDate, 'DD/MM/YYYY').format() : null,
      city: city || null,
      state: uf || null,
      acceptRegulation: accept,
      receiveNews: acceptNews,
      receiveNewsOther: acceptNewsOthers,
      // password: '',
      // confirmPassword: '',
    };
    if (social) {
      this.setState({ loading: true });
      body.socialNetworkUser = socialMediaData.socialNetworkUser
      body.isSocialNetwork = true;
      // {
      //   userId: socialMediaData.id,
      //   socialNetworkType: 1,
      // };
      body.picture = socialMediaData.picture;
      const resp = await CiclooService.signUp(body);
      console.log('resp', JSON.stringify(resp));
      this.setState({
        loading: false,
      });

      await analytics().logEvent('signup_app', {
        username: username,
        stage: 'new user registration',
      });
      if (!resp.success) {
        return Alert.alert('Tente novamente', resp.errors[0]);
      }
      if (resp && resp.success && !resp.isError) {
        Authentication.onSignin(resp.data.resultValue.token);
        Main.signup();
        

        
      }
      Alert.alert(
        'Tente novamente',
        resp[0],
      );
      return;
    }
    this.setState({
      loading: false,
    });

    navigation.navigate('CreatePassword', { body });
  }

  signUp() {
    Keyboard.dismiss();
    // this.setState({
    //   loading: true,
    // });
    this.validate();
  }

  registerInputRef = (key, ref) => {
    // let inputRefs = this.state.inputRefs
    // if(!this.inputRefs[key])
    this.inputRefs[key]=ref
    // console.log({inputRefs: this.inputRefs})
    // this.setState(inputRefs)
  }

  // submitEditing = next => {
  //   let message;
  //   let validate;
  //   switch(next){
  //     case 'email':
  //       validate = this.validateCpf()
  //       message = 'O CPF informado é inválido.'
  //       break
  //     case 'name':
  //       validate = this.validateEmail()
  //       message = 'O e-mail informado é inválido.'
  //       break
  //     default:
  //       validate = false
  //       break
  //   }
    
  //   if(validate){
  //     this.alertContent(message)
  //   }else{
  //     console.log({
  //       next, 
  //       ref: this.inputRefs[next],
  //       // type: this.inputRefs[next].constructor.name
  //     }); 
  //     (next) 
  //     ? (
  //       (this.inputRefs[next].constructor.name == "ReactNativeFiberHostComponent")
  //       ? this.inputRefs[next].focus()
  //       : this.inputRefs[next].getElement().focus()
  //     )
  //     : Keyboard.dismiss();
  //   }
  // }

  generateLabelStyle = inputName => ({
    position: 'absolute',
    left: 4,
    marginLeft: (inputName == 'username') ? 0 : 25,
    fontFamily: 'Rubik-Regular',
    top: this['_' + inputName + 'Focused'].interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: this['_' + inputName + 'Focused'].interpolate({
      inputRange: [0, 1],
      outputRange: [20, 14],
    }),
    color: this['_' + inputName + 'Focused'].interpolate({
      inputRange: [0, 1],
      outputRange: ['#66666600', '#8EA7AB'],
    }),
  })
  
  submitEditing = next => {
    let message;
    let validate;
    if(
      (
        next == 'phoneNumber'
        && this.state.isApple
      )
      || next != 'phoneNumber'
    )
      switch(next){
        case 'email':
        case 'phoneNumber':
          validate = this.validateCpf()
          message = 'O CPF informado é inválido.'
          break
        default:
          break
      }
    console.log({validate})
    if(validate){
      this.alertContent(message)
    }else{
      console.log({
        next, 
        ref: (next) ? this[next] : next,
        // type: this.inputRefs[next].constructor.name
      }); 
      if(next) {
        if(next != 'phoneNumber' && next != 'birthDate') return this.refs[next].focus()
        return this.refs[next].getElement().focus()
      }
      // this.signUp();
    }
  }

  validateCpfEdit() {
    let validAndRaw = [];
    validAndRaw = [this.username.isValid(), this.username.getRawValue()];
    return validAndRaw;
  }

  validateBirthDateEdit() {
    let validAndRaw = [];
    validAndRaw = [this.refs.birthDate.isValid(), this.refs.birthDate.getRawValue()];
    return validAndRaw;
  }

  blurBirthDate = (raw, isOK, bdayFormat) => {
    const bdayValue = bdayFormat || raw;
    let {birthDate} = this.state
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
  }

  render() {
    const {
      username,
      email,
      firstName,
      lastName,
      birthDate,
      accept,
      acceptNews,
      acceptNewsOthers,
      phoneNumber,
      city,
      uf,
      loading,
      editEmail,
      isApple,
      inputToShow,
      inputToHide,
    } = this.state;
    const { navigation: { goBack, navigate } } = this.props;

    return (
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === 'android' ? 40 : 0 },
        ]}
      >
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
            
            <View style={styles.floatingLabelInput}
              >
                {/* <Icon name={'person'} size={20} color='#6853C8' style={styles.iconStyle} /> */}
                <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
                  <Animated.Text style={this.generateLabelStyle('username')}>
                    {'CPF'}
                  </Animated.Text>
                  <TextInputMask
                    contextMenuHidden
                    type="cpf"
                    label="CPF"
                    value={username}
                    ref={(ref) => this.username = ref}
                    style={styles.inputStyle}
                    validator={(valid) => { console.log(valid); }}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    clearButtonMode="while-editing"
                    placeholder="Digite seu CPF*"
                    autoCompleteType="username"
                    textContentType="username"
                    autoCorrect={false}
                    returnKeyType="next"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => {
                      this.setState({
                        usernameFocused: true,
                        inputToShow: 'username',
                        inputToHide: inputToShow,
                      });
                      const [isOK, raw] = this.validateCpfEdit();
                    }}
                    onBlur={() => {
                      this.setState({
                        usernameFocused: false,
                        inputToHide: 'username',
                        inputToShow: isApple ? 'phoneNumber' : 'email',
                      });
                      const [isOK, raw] = this.validateCpfEdit();
                      this.setState({ rawValue: raw, validCPF: isOK });
                    }}
                    blurOnSubmit={false}
                    onChangeText={(val) => {
                      console.log(val);
                      this.onChangeText('username', val);
                      const [isOK, raw] = this.validateCpfEdit();
                      this.setState({ rawValue: raw, validCPF: isOK });
                    }}
                    onSubmitEditing={() => this.submitEditing(isApple ? 'phoneNumber' : 'email')}
                  />
                </View>
              </View>
            {/* <FloatingLabelInput
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
              blur={(raw, isOK) => { this.setState({ rawValue: raw, validCPF: isOK }); }}
              refName="cpf"
              nextRef={(isApple) ? "phone" : ((editEmail) ? "email" : "name")}
              registerInputRef={this.registerInputRef}
              submitEditing={this.submitEditing}
            /> */}

            {!isApple ? (
              <View style={styles.floatingLabelSubview}>
                <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
                  <Animated.Text style={[this.generateLabelStyle('email')]}>
                    {'Email'}
                  </Animated.Text>
                  <TextInput
                    // contextMenuHidden
                    ref='email'
                    label="E-mail*"
                    value={email}
                    style={styles.inputNewStyle}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    clearButtonMode="while-editing"
                    placeholder="Informe seu endereço de E-mail*"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    autoCorrect={false}
                    returnKeyType="next"
                    autoCapitalize="none"
                    // keyboardType="email-address"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => this.setState({
                      emailFocused: true,
                      inputToShow: 'email',
                      inputToHide: inputToShow,
                    })}
                    onBlur={() => this.setState({
                      emailFocused: false,
                      inputToShow: false,
                      inputToHide: inputToShow,
                    })}
                    blurOnSubmit={false}
                    onChangeText={(value) => this.onChangeText('email', value)}
                    onSubmitEditing={() => this.submitEditing('firstName')}
                  />
                </View>
                {/* <FloatingLabelInput
                  label="E-mail*"
                  value={email}
                  onChange={(value) => {
                    this.onChangeText('email', value);
                  }}
                  keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                  clearButtonMode="while-editing"
                  placeholder="Informe seu endereço de E-mail*"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  autoCorrect={false}
                  returnKeyType="next"
                  autoCapitalize="none"
                  // keyboardType="email-address"
                  editable={editEmail}
                  style={{ marginBottom: height * 0.15 }}
                  refName="email"
                  nextRef="name"
                  registerInputRef={this.registerInputRef}
                  submitEditing={this.submitEditing}
                /> */}
                <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
                  <Animated.Text style={[this.generateLabelStyle('firstName')]}>
                    {'Nome*'}
                  </Animated.Text>
                  <TextInput
                    // contextMenuHidden
                    ref='firstName'
                    label="Nome*"
                    value={firstName}
                    style={styles.inputNewStyle}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    clearButtonMode="while-editing"
                    placeholder="Qual seu nome?*"
                    textContentType="givenName"
                    autoCorrect={false}
                    returnKeyType="next"
                    keyboardType="default"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => this.setState({
                      firstNameFocused: true,
                      inputToShow: 'firstName',
                      inputToHide: inputToShow,
                    })}
                    onBlur={() => this.setState({
                      firstNameFocused: false,
                      inputToShow: false,
                      inputToHide: inputToShow,
                    })}
                    blurOnSubmit={false}
                    onChangeText={(value) => {
                      if (/[0-9]/.test(value[value.length - 1])) return;
                      this.onChangeText('firstName', value);
                    }}
                    onSubmitEditing={() => this.submitEditing('lastName')}
                  />
                </View>
                {/* <FloatingLabelInput
                  label="Nome*"
                  value={firstName}
                  onChange={(value) => {
                    if (/[0-9]/.test(value[value.length - 1])) return;
                    this.onChangeText('firstName', value);
                  }}
                  keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                  clearButtonMode="while-editing"
                  placeholder="Qual seu nome?*"
                  textContentType="givenName"
                  autoCorrect={false}
                  returnKeyType="next"
                  keyboardType="default"
                  style={{ marginBottom: height * 0.15 }}
                  refName="name"
                  nextRef="surname"
                  registerInputRef={this.registerInputRef}
                  submitEditing={this.submitEditing}
                /> */}
                <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
                  <Animated.Text style={[this.generateLabelStyle('lastName')]}>
                    {'Sobrenome*'}
                  </Animated.Text>
                  <TextInput
                    // contextMenuHidden
                    ref='lastName'
                    label="Sobrenome*"
                    value={lastName}
                    style={styles.inputNewStyle}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    clearButtonMode="while-editing"
                    placeholder="E o seu sobrenome?*"
                    textContentType="middleName"
                    autoCorrect={false}
                    returnKeyType="next"
                    keyboardType="default"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => this.setState({
                      lastNameFocused: true,
                      inputToShow: 'lastName',
                      inputToHide: inputToShow,
                    })}
                    onBlur={() => this.setState({
                      lastNameFocused: false,
                      inputToShow: false,
                      inputToHide: inputToShow,
                    })}
                    blurOnSubmit={false}
                    onChangeText={(value) => {
                      if (/[0-9]/.test(value[value.length - 1])) return;
                      this.onChangeText('lastName', value);
                    }}
                    onSubmitEditing={() => this.submitEditing('phoneNumber')}
                  />
                </View>
                {/* <FloatingLabelInput
                  label="Sobrenome*"
                  value={lastName}
                  onChange={(value) => {
                    if (/[0-9]/.test(value[value.length - 1])) return;
                    this.onChangeText('lastName', value);
                  }}
                  keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                  clearButtonMode="while-editing"
                  placeholder="E o seu sobrenome?*"
                  textContentType="middleName"
                  autoCorrect={false}
                  returnKeyType="next"
                  keyboardType="default"
                  style={{ marginBottom: height * 0.15 }}
                  refName="surname"
                  nextRef="phone"
                  registerInputRef={this.registerInputRef}
                  submitEditing={this.submitEditing}
                /> */}
              </View>
            ) : null }
            <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
              <Animated.Text style={[this.generateLabelStyle('phoneNumber')]}>
                {'Celular'}
              </Animated.Text>
              <TextInputMask
                contextMenuHidden
                ref='phoneNumber'
                label="Celular"
                value={phoneNumber}
                type="cel-phone"
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99) ',
                }}
                style={styles.inputNewStyle}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                placeholderTextColor="#8EA7AB"
                onFocus={() => this.setState({
                  phoneNumberFocused: true,
                  inputToShow: 'phoneNumber',
                  inputToHide: inputToShow,
                })}
                onBlur={() => this.setState({
                  phoneNumberFocused: false,
                  inputToShow: false,
                  inputToHide: inputToShow,
                })}
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
                blurOnSubmit={false}
                onChangeText={(value) => this.onChangeText('phoneNumber', value)}
                onSubmitEditing={() => this.submitEditing('birthDate')}
              />
            </View>
            {/* <FloatingLabelInput
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
              refName="phone"
              nextRef="birthday"
              registerInputRef={this.registerInputRef}
              submitEditing={this.submitEditing}
            /> */}
            <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
              <Animated.Text style={[this.generateLabelStyle('birthDate')]}>
                {'Data de Nascimento'}
              </Animated.Text>
              <TextInputMask
                contextMenuHidden
                label="Data de Nascimento"
                type="datetime"
                options={{
                  format: 'DD/MM/YYYY',
                }}
                // ehVal={() => {
                //   const bdayFormat = moment(this.bdayField.props.value, 'DDMMYYYY').utc().format();
                //   console.log('ehVal funcionando', bdayFormat);
                //   const [isOK, raw] = this.validate('Data de Nascimento');
                //   blur(this.bdayField.props.value, isOK, bdayFormat);
                // }}
                ref='birthDate'
                style={styles.inputNewStyle}
                validator={(valid) => { console.log('validator', valid); }}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                placeholderTextColor="#8EA7AB"
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                clearButtonMode="while-editing"
                placeholder="Data de Nascimento - DD/MM/AAAA"
                autoCorrect={false}
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="number-pad"
                onFocus={() => {
                  this.setState({
                    birthDateFocused: true,
                    inputToShow: 'birthDate',
                    inputToHide: inputToShow,
                  })
                  const [isOK, raw] = this.validateBirthDateEdit();
                }}
                onBlur={() => {
                  this.setState({
                    birthDateFocused: false,
                    inputToShow: false,
                    inputToHide: inputToShow,
                  })
                  const [isOK, raw] = this.validateBirthDateEdit();
                  this.blurBirthDate(raw, isOK, false);
                }}
                blurOnSubmit={false}
                onChangeText={(val) => {
                  console.log(val);
                  this.onChangeText('birthDate', val);
                  const [isOK, raw] = this.validateBirthDateEdit();
                  this.blurBirthDate(raw, isOK, false);
                }}
                validation={(value) => {
                  console.log('validation value', value);
                  const [isOK, raw] = this.validateBirthDateEdit();
                  this.blurBirthDate(raw, isOK, false);
                }}
                onSubmitEditing={() => this.submitEditing('city')}
              />
            </View>
            {/* <FloatingLabelInput
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
              refName="birthday"
              nextRef="city"
              registerInputRef={this.registerInputRef}
              submitEditing={this.submitEditing}
            /> */}
            <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
              <Animated.Text style={[this.generateLabelStyle('city')]}>
                {'Cidade*'}
              </Animated.Text>
              <TextInput
                // contextMenuHidden
                ref='city'
                label="Cidade*"
                value={city}
                style={styles.inputNewStyle}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                clearButtonMode="while-editing"
                placeholder="Qual cidade você mora?"
                textContentType="addressCity"
                autoCorrect={false}
                returnKeyType="next"
                keyboardType="default"
                placeholderTextColor="#8EA7AB"
                onFocus={() => this.setState({
                  cityFocused: true,
                  inputToShow: 'city',
                  inputToHide: inputToShow,
                })}
                onBlur={() => this.setState({
                  cityFocused: false,
                  inputToShow: false,
                  inputToHide: inputToShow,
                })}
                blurOnSubmit={false}
                onChangeText={(value) => {
                  if (/[0-9]/.test(value[value.length - 1])) return;
                  this.onChangeText('city', value);
                }}
                onSubmitEditing={() => this.submitEditing('uf')}
              />
            </View>
            {/* <FloatingLabelInput
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
              returnKeyType="next"
              keyboardType="default"
              style={{ marginBottom: height * 0.15 }}
              refName="city"
              nextRef="uf"
              registerInputRef={this.registerInputRef}
              submitEditing={this.submitEditing}
            /> */}
            <View style={[styles.floatingLabel, { paddingTop: 18 }]}>
              <Animated.Text style={[this.generateLabelStyle('uf')]}>
                {'Estado*'}
              </Animated.Text>
              <TextInput
                // contextMenuHidden
                ref='uf'
                label="Estado*"
                value={uf}
                style={styles.inputNewStyle}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                clearButtonMode="while-editing"
                placeholder="Qual estado você mora?"
                textContentType="addressState"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={2}
                keyboardType="default"
                placeholderTextColor="#8EA7AB"
                onFocus={() => this.setState({
                  ufFocused: true,
                  inputToShow: 'uf',
                  inputToHide: inputToShow,
                })}
                onBlur={() => this.setState({
                  ufFocused: false,
                  inputToShow: false,
                  inputToHide: inputToShow,
                })}
                // blurOnSubmit={false}
                onChangeText={(value) => {
                  if (/[0-9]/.test(value[value.length - 1])) return;
                  this.onChangeText('uf', value);
                }}
                onSubmitEditing={() => this.submitEditing(null)}
              />
            </View>
            {/* <FloatingLabelInput
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
              refName="uf"
              registerInputRef={this.registerInputRef}
              submitEditing={this.submitEditing}
            /> */}
            <AcceptCheckBox accept={accept} onPress={() => this.setState({ accept: !accept })} acceptText="Li e concordo com os " linkTo={() => navigate('Terms')} linkToText="termos de uso" />
            <AcceptCheckBox accept={acceptNews} onPress={() => this.setState({ acceptNews: !acceptNews })} acceptText="Quero receber novidades, promoções e pesquisas personalizadas da Cicloo" />
            <AcceptCheckBox accept={acceptNewsOthers} onPress={() => this.setState({ acceptNewsOthers: !acceptNewsOthers })} acceptText="Também quero receber novidades, promoções e pesquisas personalizadas das empresas participantes do Cicloo" />
            {/* <AcceptCheckBox accept={acceptNewsOthers} onPress={() => this.setState({ acceptNewsOthers: !acceptNewsOthers })} acceptText="Também quero receber novidades, promoções e pesquisas personalizadas de outras marcas cuidadosamente selecionadas pelas empresas participantes do Cicloo e por seus anunciantes" /> */}
            <ContinueButton
              buttonPress={() => this.signUp()}
              textInside="Avançar"
              style={{ marginTop: height * 0.05, marginBottom: 8 }}
            />
            <Text style={{
              fontFamily: 'Rubik-Medium', marginBottom: height * 0.15, fontSize: 11, lineHeight: 15, color: '#676767', alignSelf: 'center', textAlign: 'center', width: width - 70,
            }}
            >
              Confirmo que tenho 18 anos ou mais. Acesse as nossas
              <TouchableOpacity onPress={() => Linking.openURL('https://www.unilevernotices.com/brazil/portuguese/privacy-notice/notice.html')}>
                <Text style={[styles.terms, {
                  fontFamily: 'Rubik-Bold', color: '#6666C8', fontSize: 11, lineHeight: 11, marginBottom: -2.5,
                }]}
                >
                  {' Política de Privacidade '}
                </Text>
              </TouchableOpacity>
              e
              <TouchableOpacity onPress={() => Linking.openURL('https://www.unilevernotices.com/brazil/portuguese/cookie-notice/notice.html')}>
                <Text style={[styles.terms, {
                  fontFamily: 'Rubik-Bold', color: '#6666C8', fontSize: 11, lineHeight: 11, marginBottom: -2.5,
                }]}
                >
                  {'  Política de Cookies '}
                </Text>
              </TouchableOpacity>
              para entender como usamos seus dados pessoais
            </Text>
          </ScrollView>
        </DismissKeyboardView>
        {loading && (
          <LoadingModalComponent visible={loading} />
        )}
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
  // floatingLabel: {
  //   width: width - 50,
  //   height: 50,
  // },
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
  floatingLabelInput: {
    width: width - 50,
    height: 50,
    // marginLeft: 25,
    // justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    borderBottomColor: '#6853C8',
    borderBottomWidth: 2,
    alignItems: 'center'
  },
  floatingLabelSubview: {
    // width: width - 50,
    // height: 50,
    // // marginLeft: 25,
    // // justifyContent: 'center',
    // alignSelf: 'center',
    // marginBottom: 10,
    // flexDirection: 'row',
    // borderBottomColor: '#6853C8',
    // borderBottomWidth: 2,
    // alignItems: 'center'
  },
  floatingLabel: {
    height: 50,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 15,
    marginBottom: 15,
  },
  inputStyle: {
    // height: 32,
    paddingTop: 2,
    marginBottom: -2,
    fontSize: 16,
    color: '#000',
    // borderBottomWidth: 2,
    // borderBottomColor: '#6853C8',
    // paddingLeft: 8,
    fontFamily: 'Rubik-Light',
    // paddingLeft: props.value !== '' ? 18 : 8,
  },
  inputNewStyle: {
    marginHorizontal: width*.06,
    height: 32,
    paddingTop: 2,
    marginBottom: -2,
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#6853C8',
    paddingLeft: 8,
    fontFamily: 'Rubik-Light',
    marginBottom: height * 0.15,
    // paddingLeft: props.value !== '' ? 18 : 8,
  },
  iconStyle: {
    paddingTop: 12,
    paddingBottom: 10,
    paddingRight: 10,
  },
});

export default SignUpScreen;
