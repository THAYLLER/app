/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  StatusBar,
  Platform,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Keyboard,
  Alert,
} from 'react-native';
import CiclooService from '../services/CiclooService';

import FloatingLabelInput from '../components/FloatingLabelInput';
import ContinueButton from '../components/ContinueButton';
import LoadingModalComponent from '../components/LoadingModalComponent';
import ModalLogin from '../components/ModalLogin';
import DismissKeyboardView from '../components/DismissKeyboardView';
import BackButton from '../components/BackButtonComponent';
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/Octicons';

const { width, height } = Dimensions.get('window');

class ForgotPasswordScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    // header: null,
    title: 'RECUPERAÇÃO DE SENHA',
    headerStyle: {
      backgroundColor: '#6853C8',
      // alignSelf: 'center',
    },
    headerTitleAlign: 'center',
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    headerBackTitleVisible: false,
    // headerLeft: <BackButton back={navigation} screen="forgot" bgWhite />,
  });

  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      username: '',
      password: '',
      // confirmationCode: '',
      user: {},
      value: '',
      showModal: false,
      rawValue: '',
      validCPF: false,
      recoveryType: null,
      items: [
        {
          label: 'Receber nova senha através de e-mail',
          value: '1',
        },
        {
          label: 'Receber nova senha através de SMS',
          value: '2',
        },
      ],
      loading: false,
      success: false,
      // chosenType: '1',
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    StatusBar.setBarStyle('light-content');
    const rawValue = navigation.getParam('rawValue', {});
    this.setState({ rawValue });
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

  handleTextChange = (newText) => this.setState({ value: newText });

  goForward = () => {
    const { navigation } = this.props;
    setTimeout(() => {
      navigation.goBack(null);
    }, 300);
  };

  signIn = () => {
    this.setState({ loading: true });
    Keyboard.dismiss();
    setTimeout(() => {
      this.validate();
    }, 300);
  };

  validate = async () => {
    const { email, rawValue } = this.state;
    const { navigation } = this.props;
    console.log('rawValue', rawValue);
    if (rawValue.length !== 11) {
      return Alert.alert(
        'Confira a informação preenchida',
        'Seu CPF está incorreto',
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({ loading: false });
            },
          },
        ],
        { cancelable: false },
      );
    }
    try {
      const resp = await CiclooService.forgotPassword(rawValue);
      console.log({resp})
      
      if (resp.success) {
        await analytics().logEvent('forgot_password', {
          username: rawValue
        });
        this.setState({
          success: true,
          loading: false
        })
        return setTimeout(() => {
          this.setState({ success: false, loading: false }, () => navigation.goBack(null));
        }, 1500)
        // Alert.alert(
        //   'Confira seu e-mail',
        //   'Verifique no seu e-mail como recuperar sua senha',
        //   [
        //     {
        //       text: 'OK',
        //       onPress: () => {
        //         this.setState({ loading: false });
        //         navigation.goBack(null);
        //       },
        //     },
        //   ],
        //   { cancelable: false },
        // );
      }
      return Alert.alert(
        'Tente novamente',
        resp.error,
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({ loading: false });
            },
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      console.log('error', error);
      // Alert.alert('Tente novamente', error);
    }
  };

  async confirmSignIn(values) {
    const { username, rawValue } = this.state;
    console.log('username, password, values', rawValue, password, values);
    const { code, password } = values;
    if (username.length === 0 || password.length === 0 || code.length === 0) {
      return Alert.alert(
        'Confira seus dados',
        'Você esqueceu de preencher um campo',
        [{ text: 'OK', onPress: () => '' }],
        { cancelable: false },
      );
    }
    console.log(confirmedUser);
    return false;
  }

  render() {
    const {
      username,
      password,
      showModal,
      user,
      recoveryType,
      chosenType,
      email,
      loading,
      success,
    } = this.state;
    const {
      navigation: { goBack, navigate },
    } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <DismissKeyboardView>
          {success
          ? <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: width/4,
                aspectRatio: 1,
                borderRadius: (width/4)/2,
                backgroundColor: '#00d182',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="check" size={(width/4)*.7} color='#fff' />
            </View>
          <Text style={[styles.terms, { textAlign: 'center', marginTop: 15 }]}>{'Uma nova senha será enviada\nnas próximas 48 horas.'}</Text>
          </View>
          : <ScrollView style={{ paddingTop: height * 0.1 }}>
            <View
              style={[
                {
                  width: width * 0.7,
                  // width: width - 50,
                  height: 40,
                  // borderColor: '#6853C8',
                  // borderBottomWidth: '2',
                  // paddingLeft: 8,
                  // flexWrap: 'wrap',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginTop: height * 0.025,
                  marginBottom: height * 0.05,
                },
              ]}
            >
              <Text style={[styles.terms, { textAlign: 'center' }]}>
                Você receberá uma nova senha através do seu e-mail cadastrado.
              </Text>
              {/* <RNPickerSelect
                placeholderTextColor="#8EA7AB"
                placeholder={{
                  label: 'Selecione uma forma de recuperação',
                  value: null,
                }}
                Icon={() => <Icon name="chevron-down" size={24} color="#222" />}
                items={this.state.items}
                onValueChange={(value) => {
                  this.setState({
                    recoveryType: value,
                  });
                }}
                onUpArrow={() => {
                  this.inputRefs.name.focus();
                }}
                onDownArrow={() => {
                  this.inputRefs.picker2.togglePicker();
                }}
                style={{
                  width: width - 50, height: 40, alignSelf: 'center', borderColor: '#6853C8', borderBottomWidth: '1', fontWeight: '500', fontSize: 16, paddingTop: 4,
                }}
                doneText="Selecionar"
                // defaultValue={this.state.chosenType}
                ref={(el) => {
                  this.inputRefs.picker = el;
                }}
                textInputProps={{
                  style: {
                    height: 26,
                    fontSize: 16,
                    color: recoveryType ? '#000' : '#8EA7AB',
                    borderBottomWidth: 2,
                    borderBottomColor: '#6853C8',
                    paddingLeft: 8,
                    // fontFamily: 'NunitoSans-ExtraLight',
                    fontWeight: '500',
                    width: width - 50,
                    alignSelf: 'center',
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 4,
                  },
                  keyboardAppearance: 'dark',
                  placeholderTextColor: '#8EA7AB',
                }}
                useNativeAndroidPickerStyle={false} // android only
                hideIcon
              /> */}
            </View>
            <FloatingLabelInput
              label="CPF*"
              ref={(ref) => (this.usernameField = ref)}
              value={username}
              onChange={(value) => {
                this.onChangeText('username', value);
              }}
              keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              clearButtonMode="while-editing"
              placeholder="Digite o seu CPF*"
              autoCompleteType="username"
              textContentType="username"
              autoCorrect={false}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="number-pad"
              blur={(raw, isOK) => {
                this.setState({ rawValue: raw, validCPF: isOK });
              }}
            />
            {/* <FloatingLabelInput
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
              keyboardType="email-address"
              style={{ marginBottom: height * 0.15 }}
            /> */}
            <ContinueButton
              buttonPress={() => this.signIn(this)}
              textInside="RECUPERAR SENHA"
              style={{ marginTop: height * 0.1 }}
            />
            {loading && <LoadingModalComponent visible={loading} />}
          </ScrollView>
          }
        </DismissKeyboardView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // justifyContent: 'center',
  },
  headerTitle: {
    alignSelf: 'center',
    color: '#000000',
    // opacity: 0.75,
    // fontWeight: '900',
    fontSize: 14,
    fontFamily: 'NunitoSans-Black',
    lineHeight: 28,
    letterSpacing: 0.25,
    marginTop: height * 0.04,
    marginBottom: height * 0.1,
  },
  floatingLabel: {
    width: width - 50,
    height: 50,
  },
  terms: {
    // letterSpacing: 4,
    color: '#000000',
    fontSize: 14,
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

export default ForgotPasswordScreen;
