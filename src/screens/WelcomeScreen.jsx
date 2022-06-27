import React, { Component } from 'react';
import {
  Animated,
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
  ImageBackground,
  Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  
import analytics from '@react-native-firebase/analytics';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import * as Facebook from 'expo-facebook';
import Screens from '../utils/Screens';
import Images from '../constants/Images';
import FloatingLabelInput from '../components/FloatingLabelInput';
import ContinueButton from '../components/ContinueButton';
import DismissKeyboardView from '../components/DismissKeyboardView';
import SocialMediaButtonLogin from '../components/SocialMediaButtonLogin';
import LoadingModalComponent from '../components/LoadingModalComponent';
import { CiclooService } from '../services/index';
import Authentication from '../utils/Authentication';
import Main from '../utils/Main';

//Push Notification
import BackgroundFetch from "react-native-background-fetch";
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Configure } from '../pushnotification/Notificationhandler'
import {initBackgroundFetch} from '../pushnotification/codeMatheusbase/code'
import BehaviorService from '../services/BehaviorService';


const { width, height } = Dimensions.get('window');

const heig = Platform.OS === 'android' ? height + 50 : height;
const SCREEN_WIDTH = width;

class WelcomeScreen extends Component {
  static navigationOptions = () => ({
    header: null,
    headerBackImage: (
      <Icon
        name="chevron-left"
        size={24}
        style={{
          marginLeft: 16,
        }}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
      imgWidth: new Animated.Value(SCREEN_WIDTH),
      imgHeight: new Animated.Value(SCREEN_WIDTH),
      keyboardOpen: false,
      opacity: new Animated.Value(1),
      rawValue: '',
      validCPF: false,
      cpfFocused: false,
      passwordFocused: false,
      enterColor: '#ccc'
    };
    this.inputRefs = {}
    this._cpfIsFocused = new Animated.Value(0)
    this._passwordIsFocused = new Animated.Value(0)
    this.registerInputRef = this.registerInputRef.bind(this)
    this.submitEditing = this.submitEditing.bind(this)
    this.localNotify = null
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content');
    // BehaviorService.setOpenedScreens()
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
    this.initFacebook();
    let openSignUp = this.props.navigation.getParam('openSignUp', false)
    console.log({openSignUp})
    if(openSignUp){
      this.props.navigation.navigate('SignUp')
    }
    // if(Platform.OS== 'ios'){
    //   this.installApp(true)
    // }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    const { props, state: { cpfFocused, passwordFocused, username, password } } = this;
    // if (prevProps !== props) {
    // if (props.label === 'Gênero') console.log('this._animatedIsFocused', this._animatedIsFocused);
    Animated.timing(this._cpfIsFocused, {
      toValue: cpfFocused || username != '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(this._passwordIsFocused, {
      toValue: passwordFocused || password != '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    // Animated.timing(this._animatedIsFocusedGender, {
    //   toValue: (isFocused || props.value !== 0) ? 1 : 0,
    //   duration: 200,
    // }).start();
    // }
  }

  onChangeText(key, value) {
    const numbers = '1234567890';
    console.log({key, value});
    if (key === 'username' && !numbers.indexOf(value[value.length - 1]) < 0) {
      console.log('numbers.indexOf(value) < 0');
      return;
    }
    this.setState({
      [key]: value,
      enterColor: (this.cpf.isValid() && (key == 'password' ? value : this.state.password) != '') ? '#6853C8' : '#ccc',
    });
  }

  initFacebook = async () => {
    const appId = '286894150089591';
    return Facebook.initializeAsync({ appId });
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

  keyboardDidShow = async () => {
    const {
      opacity,
    } = this.state;
    this.setState({
      keyboardOpen: true,
    });
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: 0.5,
      duration: 200,
    }).start();
    const imgHeight = opacity.interpolate({
      inputRange: [0.5, 1],
      outputRange: [width * 0.4, width],
      extrapolate: 'clamp',
    });
    this.setState({
      imgHeight,
    });
  }

  keyboardDidHide = async () => {
    this.setState({
      keyboardOpen: false,
    });
    const {
      imgWidth,
      opacity,
    } = this.state;
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
    const imgHeight = opacity.interpolate({
      inputRange: [0.5, 1],
      outputRange: [width * 0.4, width],
      extrapolate: 'clamp',
    });
    this.setState({
      imgHeight,
    });
  }

  handleSignIn = async () => {
    const { navigation } = this.props;
    const { username, password } = this.state;
    this.setState({
      loading: true,
    });
    try {
      const body = {
        document: username.replace(/\.|-/g, ''),
        password,
      };
      const resp = await CiclooService.signIn(body);
      console.log(resp)
      if (!resp.success) {
        await analytics().logEvent('common_login', {
          description: 'default login'
        });

        return Alert.alert('Verifique o erro abaixo.', (resp.errors) ? resp.errors[0] : "Ocorreu um erro, por favor tente novamente",
          [
            {
              text: 'Ok',
              onPress: () => this.setState({ loading: false }),
            },
          ],
          { cancelable: false });
      }
      if (resp.success) {

        const { token } = resp.data;
        Authentication.onSignin(token);
        Main.loginType('App');
        

        const result = await CiclooService.CheckTermsAccepted();
        console.log({result})
        this.setState({ loading: false });
        if(!result?.accepted.accepted) {
          console.log("not accepted") 
          if(result?.data && result?.data?.response?.status == 401) return;
            return navigation.navigate('TermsUpdate');
        }
        
        navigation.navigate('AuthLoading');
      }
    } catch (error) {
      console.log('error', error);
      this.setState({
        loading: false,
      });
      if(error?.response?.status != 401)
        Alert.alert('Verifique o erro abaixo', error.response.data.errors[0]);
    }
  }

  handleForgotPassword = () => {
    
    const { navigation } = this.props;
    navigation.navigate('ForgotPassword');
    // navigation.navigate('SignUpBonus');
  }

  handleSocialAuth = async (data, social) => {
    await analytics().logEvent('login_social_media', {
      description: `login done by ${social}`,
    });

    const { navigation } = this.props;
    try {
      const resp = await CiclooService.socialAuth(data, social);
      console.log(resp)
      if (resp.success) {
        console.log({googleToken: resp.data.token})
        if (!resp.data.token) {
          this.setState({
            loading: false,
          });
          return navigation.navigate('SignUp', { socialData: resp.data.resultValue });
        }
        this.setState({
          loading: false,
        });
        Authentication.onSignin(resp.data.token);
        return navigation.navigate('AuthLoading');
      }

      return Alert.alert('Verifique o erro abaixo.', resp,
        [
          {
            text: 'Ok',
            onPress: () => this.setState({ loading: false }),
          },
        ],
        { cancelable: false });
    } catch (error) {
      return Alert.alert('Login falhou', 'Erro ao tentar entrar com login social',
        [
          {
            text: 'Ok',
            onPress: () => this.setState({ loading: false }),
          },
        ],
        { cancelable: false });
    }
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
        validate = this.validatePassword()
        message = 'A senha não pode estar em branco.'
        break
    }
    console.log({validate})
    if(validate){
      this.alertContent(message)
    }else{
      console.log({
        next, 
        ref: this[next],
        // type: this.inputRefs[next].constructor.name
      }); 
      (next) 
      ? (
        // (this[next].constructor.name == "ReactNativeFiberHostComponent")
        this.refs.password.focus()
        // : this[next].getElement().focus()
      )
      : this.handleSignIn();
    }
  }

  validateCpf = () => {
    const {
      username,
      validCPF,
    } = this.state;
    return (!this.cpf.isValid() || username.length !== 14)
  }
  validatePassword = () => {
    const {
      password,
    } = this.state;
    return (password.length == 0)
  }
  
  //Evento Push Notification regra
  installApp = () => {
    this.localNotify.showNotification(
      1,
      "App Cicloo informa:",
        'Envie seus cupons fiscais com produtos das marcas participantes e aproveite os prêmios disponíveis no CICLOO',
      {},
      {}
    )
  }
 
  validate() {
    let validAndRaw = [];
    validAndRaw = [this.cpf.isValid(), this.cpf.getRawValue()];
    return validAndRaw;
  }

  render() {
    const {
      username,
      password,
      loading,
      keyboardOpen,
      imgWidth,
      imgHeight,
      opacity,
      enterColor
    } = this.state;
    const { navigation } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 4,
      fontFamily: 'Rubik-Regular',
      top: this._cpfIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._cpfIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._cpfIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#66666600', '#8EA7AB'],
      }),
    };
    const labelPasswordStyle = {
      position: 'absolute',
      left: 4,
      fontFamily: 'Rubik-Regular',
      top: this._passwordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._passwordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._passwordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#66666600', '#8EA7AB'],
      }),
    };
    return (
      <>
        <SafeAreaView style={{ backgroundColor: '#6853C8' }}>
          <StatusBar barStyle="light-content" hidden={false} animated translucent backgroundColor="#00000000" />
          <Animated.View style={[{
            width, height: keyboardOpen ? 100 : width - 30 , alignSelf: 'center', justifyContent: 'flex-end', marginTop: keyboardOpen ? 0 : -40,
          }, opacity === 0 ? { display: 'none' } : { display: 'flex' }]}
          >
            {keyboardOpen ? (
              <Animated.Image
                source={Images.logo}
                style={{
                  width: width - 160, height: 50, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', opacity: Number(JSON.stringify(opacity)) !== 0.5 ? 1 : 0,
                }}
              />
            ) : (
              <Animated.Image
                source={Images.loginImg}
                style={{
                  width, height: width - 100, resizeMode: 'cover', alignSelf: 'center', justifyContent: 'center',
                }}
              />
            )}

          </Animated.View>
        </SafeAreaView>
        <DismissKeyboardView>
          <ScrollView style={styles.container}>
            <View style={{
              flex: 1,
              // marginTop: 12,
            }}>
            <View style={[{
                flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', // marginBottom: 36, marginTop: -4,
              }]}
              >
                <Text style={styles.terms}>
                  Entre com sua conta social
                </Text>
                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-evenly', marginHorizontal: 20 }}>
                  <SocialMediaButtonLogin
                    type="facebook"
                    style={{ flex: 1 }}
                    handleOnPress={(result) => {
                      this.setState({ loading: true });
                      console.log('result> facebook>>', result);
                      Main.loginType('Facebook');
                      this.handleSocialAuth(result, 1);
                    }}
                  />
                  {Platform.OS === 'ios' && (
                  <SocialMediaButtonLogin
                    type="apple"
                    style={{ flex: 1 }}
                    handleOnPress={(result) => {
                      this.setState({ loading: true });
                      console.log('result> apple>>', result);
                      Main.loginType('Apple');
                      this.handleSocialAuth(result, 3);
                    }}
                  />
                  )}
                  <SocialMediaButtonLogin
                    type="google"
                    style={{ flex: 1 }}
                    handleOnPress={(result) => {
                      this.setState({ loading: true });
                      Main.loginType('Google');
                      console.log('result> google>>', result);
                      this.handleSocialAuth(result, 2);
                    }}
                  />
                </View>
              </View>
              <Text style={styles.termsLogin}>
                Ou com sua conta do Cicloo
              </Text>
                      
              <View style={styles.floatingLabelInput}
              >
                <Icon name={'person'} size={20} color='#6853C8' style={styles.iconStyle} />
                <View style={styles.floatingLabel}>
                  <Animated.Text style={[labelStyle]}>
                    {'CPF'}
                  </Animated.Text>
                  <TextInputMask
                    contextMenuHidden
                    type="cpf"
                    label="CPF"
                    value={username}
                    ref={(ref) => this.cpf = ref}
                    style={styles.inputStyle}
                    validator={(valid) => { console.log(valid); }}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    clearButtonMode="while-editing"
                    placeholder="CPF*"
                    autoCompleteType="username"
                    textContentType="username"
                    autoCorrect={false}
                    returnKeyType="next"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => {
                      this.setState({ cpfFocused: true });
                      const [isOK, raw] = this.validate();
                    }}
                    onBlur={() => {
                      this.setState({ cpfFocused: false });
                      const [isOK, raw] = this.validate();
                      this.setState({ rawValue: raw, validCPF: isOK });
                    }}
                    blurOnSubmit={false}
                    onChangeText={(val) => {
                      console.log(val);
                      this.onChangeText('username', val);
                      const [isOK, raw] = this.validate();
                      this.setState({ rawValue: raw, validCPF: isOK });
                    }}
                    onSubmitEditing={() => this.submitEditing('password')}
                  />
                </View>
              </View>
              <View style={styles.floatingLabelInput}
              >
                <Icon name={'lock'} size={20} color='#6853C8' style={styles.iconStyle} />
                <View style={styles.floatingLabel}>
                  <Animated.Text style={[labelPasswordStyle]}>
                    {'Senha'}
                  </Animated.Text>
                  <TextInput
                    contextMenuHidden
                    label="Senha*"
                    value={password}
                    onChangeText={(value) => {
                      this.onChangeText('password', value);
                    }}
                    ref='password'
                    style={styles.inputStyle}
                    validator={(valid) => { console.log(valid); }}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    secureTextEntry
                    clearButtonMode="while-editing"
                    placeholder="Senha"
                    autoCompleteType="password"
                    textContentType="password"
                    autoCorrect={false}
                    returnKeyType="done"
                    autoCapitalize="none"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => {
                      this.setState({ passwordFocused: true });
                    }}
                    onBlur={() => {
                      this.setState({ passwordFocused: false });
                    }}
                    onSubmitEditing={() => this.handleSignIn()}
                  />
                </View>
              </View>
              <ContinueButton buttonPress={() => this.handleSignIn()} textInside="ENTRAR" style={{ marginBottom: 16, backgroundColor: enterColor, borderColor: enterColor }} />
              <ContinueButton buttonPress={this.handleForgotPassword} textInside="ESQUECEU SUA SENHA?" style={{ marginBottom: 16 }} bgWhite />
              <ContinueButton buttonPress={() => {
                // let body = {
                //   firstName: 'firstName || nameFirst',
                //   lastName: 'lastName || nameLast',
                //   cpf: 'username.replace(/\.|-/g,)',
                //   email: '',
                //   cellPhone: 'phoneNumber || null',
                //   birthDate: 'birthDate',
                //   city: 'city || null',
                //   state: 'uf || null',
                //   acceptRegulation: true,
                //   receiveNews: false,
                //   receiveNewsOther: false,
                //   // password: '',
                //   // confirmPassword: '',
                // };
                // navigation.navigate('CreatePassword', { body });
                navigation.navigate('SignUp')
              }} textInside="É SUA PRIMEIRA VEZ? CADASTRE-SE" style={{ marginBottom: 4 }} />
              
            </View>
            {loading && (
              <LoadingModalComponent visible={loading} />
            )}
          </ScrollView>
        </DismissKeyboardView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171700',
  },
  welcomeImage: {
    width: 0.54 * width,
    height: 50,
    maxWidth: 323,
    maxHeight: 135,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginTop: heig * 0.12,
    marginBottom: heig * 0.16,
    // marginLeft: 20,
    opacity: 1,
    // marginLeft: -10,
  },
  terms: {
    // letterSpacing: 4,
    color: '#2D2D2D',
    fontWeight: 'bold',
    // width: width - 50,
    marginLeft: 25,
    fontSize: 15,
    lineHeight: 18,
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 16,
  },
  termsLogin: {
    // letterSpacing: 4,
    color: '#2D2D2D',
    fontWeight: 'bold',
    // width: width - 50,
    marginLeft: 25,
    fontSize: 15,
    lineHeight: 18,
    alignSelf: 'flex-start',
    marginTop: 40,
    // marginBottom: 10,
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
  floatingLabel: {
    height: 50,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 15,
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
  iconStyle: {
    paddingTop: 12,
    paddingBottom: 10,
    paddingRight: 10,
  },
});

export default WelcomeScreen;
