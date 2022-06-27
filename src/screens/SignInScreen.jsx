import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import {
  Animated,
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
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Colors from '../constants/Colors';

import LoadingScreenComponent from '../components/LoadingScreenComponent';
import FloatingLabelInput from '../components/FloatingLabelInput';
import ContinueButton from '../components/ContinueButton';
import ModalLogin from '../components/ModalLogin';
import DismissKeyboardView from '../components/DismissKeyboardView';
import EncryptedStorage from 'react-native-encrypted-storage';
// import { useHeaderHeight } from '@react-navigation/stack';
// const headerHeight = useHeaderHeight();

const headerHeight = 40;

const { width, height } = Dimensions.get('window');

class SignInScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      // confirmationCode: '',
      newPassword: '',
      confirmNewPassword: '',
      user: {},
      value: '',
      showModal: false,
      rawValue: '',
      validCPF: false,
    };
    this.inputRefs = {}
    this.registerInputRef = this.registerInputRef.bind(this)
    this.submitEditing = this.submitEditing.bind(this)
  }

  async componentWillMount() {
    StatusBar.setBarStyle('dark-content');
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

  getBack = () => {
    const { navigation } = this.props;
    const resetAction = StackActions.popToTop();
    setTimeout(() => {
      navigation.dispatch(resetAction);
    }, 100);
  }

  goForward = () => {
    const { navigation } = this.props;
    setTimeout(() => {
      navigation.navigate('SignUpStack');
    }, 500);
  }

  reset = async () => {
    // const resetAction = NavigationActions.back({ key: 'Welcome' });
    Promise.all([
      // navigation.dispatch(resetAction),
      // navigation.navigate('SignUpStack'),
      this.getBack(),
      this.goForward(),
    ]);
  }

  signIn() {
    Keyboard.dismiss();
    this.validate();
  }

  validate = async () => {
    const {
      username, password, rawValueCPF, validCPF,
    } = this.state;
    const { navigation } = this.props;
    console.log('rawValueCPF, validCPF', rawValueCPF, validCPF);
    // if (username.length === 14 && !validCPF) {
    //   return Keyboard.dismiss();
    // }
    if (username.length === 0 || password.length === 0) {
      return Alert.alert(
        'Por favor, confira seus dados',
        'Você esqueceu ou preencheu de maneira incorreta algum campo',
        [
          { text: 'OK', onPress: () => '' },
        ],
        { cancelable: false },
      );
    }
    this.setState({
      loading: true,
    });
  }

  confirmSignIn = async (value) => {
    const { navigation } = this.props;
    const { userInfo } = this.state;
  };

  validateCpf = () => {
    const {
      username,
      validCPF,
    } = this.state;
    return (!this.inputRefs['cpf'].isValid() || username.length !== 14)
  }

  registerInputRef = (key, ref) => {
    this.inputRefs[key]=ref
    // console.log({inputRefs: this.inputRefs})
  }

  submitEditing = next => {
    let message;
    let validate;
    switch(next){
      case 'password':
        validate = this.validateCpf()
        message = 'O CPF informado é inválido.'
        break
      default:
        validate = false
        break
    }
    console.log({validate})
    if(validate){
      this.alertContent(message)
    }else{
      console.log({
        next, 
        ref: this.inputRefs[next],
        // type: this.inputRefs[next].constructor.name
      }); 
      (next) 
      ? (
        (this.inputRefs[next].constructor.name == "ReactNativeFiberHostComponent")
        ? this.inputRefs[next].focus()
        : this.inputRefs[next].getElement().focus()
      )
      : this.signIn();
    }
  }

  render() {
    const {
      username, password, showModal, user, rawValueCPF, loading,
    } = this.state;
    const { navigation: { goBack, navigate } } = this.props;

    if (loading) {
      return (
        <LoadingScreenComponent />
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            goBack(null);
          }}
          style={{
            top: height * 0.04 + headerHeight,
            left: 32,
            position: 'absolute',
            zIndex: 9999,
          }}
        >
          <View>
            <Icon
              name="chevron-down"
              color="#000000"
              size={32}
            />
          </View>
        </TouchableOpacity>
        <DismissKeyboardView>
          <View>
            <Text style={styles.headerTitle}>{'Entrar'.toUpperCase()}</Text>
            <FloatingLabelInput
              label="CPF"
              ref={(ref) => this.usernameField = ref}
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
              blur={(raw, isOK) => { this.setState({ rawValueCPF: raw, validCPF: isOK }); }}
              refName="cpf"
              nextRef="password"
              registerInputRef={this.registerInputRef}
              submitEditing={this.submitEditing}
            />
            <FloatingLabelInput
              label="Senha"
              value={password}
              onChange={(value) => {
                this.onChangeText('password', value);
              }}
              keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              clearButtonMode="while-editing"
              placeholder="Insira sua senha"
              autoCompleteType="password"
              textContentType="password"
              autoCorrect={false}
              secureTextEntry
              returnKeyType="done"
              refName="password"
              registerInputRef={this.registerInputRef}
              submitEditing={this.submitEditing}
            />
            <TouchableOpacity
              onPress={() => navigate('ForgotPassword', { rawValue: rawValueCPF })}
              style={{
                marginBottom: height * 0.1, marginTop: -4, width: 'auto', alignSelf: 'flex-end',
              }}
            >
              <Text style={[styles.writing]}>Esqueci a senha</Text>
            </TouchableOpacity>
            <ContinueButton
              buttonPress={() => this.signIn(this)}
              textInside="Acessar minha conta"
              style={{ marginTop: height * 0.025 }}
            />
            <View
              style={[
                {
                  flexDirection: 'row',
                  width: width - 30,
                  flexWrap: 'wrap',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  marginTop: 8,
                },
              ]}
            >
              <Text style={[styles.terms, { textAlign: 'center' }]}>
                Ao entrar você concorda com os
                <Text style={[styles.terms, { fontWeight: '600' }]}>
                  {' Termos e condições de uso '.toLowerCase()}
                </Text>
                <Text style={[styles.terms]}>{'\n e '}</Text>
                <Text style={[styles.terms, { fontWeight: '600' }]}>
                  política de privacidade da Unilever
                </Text>
                <Text style={[styles.terms]}>.</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.reset()}
              style={{ marginBottom: height * 0.1, marginTop: height * 0.14 }}
            >
              <Text
                style={[
                  styles.writing,
                  {
                    alignSelf: 'center',
                    marginRight: 0,
                    fontSize: 12,
                    fontFamily: 'NunitoSans-ExtraBold',
                  },
                ]}
              >
                {'Não tenho senha'.toUpperCase()}
              </Text>
            </TouchableOpacity>
            {!!showModal && (
              <ModalLogin
                resetPassword
                isVisible={showModal}
                close={() => this.setState({ showModal: false })}
                onButtonPress={(value) => this.confirmSignIn(value)}
              />
            )}
          </View>
        </DismissKeyboardView>
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
    color: '#000000',
    // opacity: 0.75,
    // fontWeight: '900',
    fontSize: 14,
    fontFamily: 'NunitoSans-Black',
    lineHeight: 28,
    letterSpacing: 0.25,
    // top: height * 0.1,
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
    fontWeight: '300',
    fontSize: 11,
    lineHeight: 14,
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
    // width: width * 0.25,
  },
});

export default SignInScreen;
