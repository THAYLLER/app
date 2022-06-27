import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EyeIcon from 'react-native-vector-icons/Feather';
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
} from 'react-native';
import axios from 'axios';
import {NavigationActions, StackActions} from 'react-navigation';
import Colors from '../constants/Colors';

import CiclooService from '../services/CiclooService';

import FloatingLabelInput from '../components/FloatingLabelInput';
import ContinueButton from '../components/ContinueButton';
import ModalLogin from '../components/ModalLogin';
import LoadingModalComponent from '../components/LoadingModalComponent';
import LoadingScreenComponent from '../components/LoadingScreenComponent';
import DismissKeyboardView from '../components/DismissKeyboardView';
import Authentication from '../utils/Authentication';
import analytics from '@react-native-firebase/analytics';
import FastImage from 'react-native-fast-image';
import Images from '../constants/Images';

const {width, height} = Dimensions.get('window');

class CreatePasswordScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      email: '',
      birthDate: '',
      accept: false,
      city: '',
      uf: '',
      confirmationCode: '',
      loading: false,
      rawValue: '',
      validCPF: false,
      hasNumber: false,
      hasLetter: false,
      hasUpperCase: false,
      hasEight: false,
      passwordStrength: 0,
      prevBody: {},
      passwordHidden: true,
      passwordFocused: false,
      confirmPasswordHidden: true,
      confirmPasswordFocused: false,
    };
    this._passwordIsFocused = new Animated.Value(0);
    this._confirmPasswordIsFocused = new Animated.Value(0);
  }

  async componentDidMount() {
    const {navigation} = this.props;
    StatusBar.setBarStyle('dark-content');
    const prevBody = navigation.getParam('body', {});
    this.setState({prevBody});
    console.log('prevBody validate', prevBody);
  }

  onChangeText(key, value) {
    // const numbers = '1234567890';
    // if (key === 'username' && !numbers.indexOf(value[value.length - 1]) < 0) {
    //   console.log('numbers.indexOf(value) < 0');
    //   return;
    // }
    if (key === 'password') {
      const hasNumber = /\d/.test(value);
      const hasLetter = /[a-z]/.test(value);
      const hasUpperCase = /[A-Z]/.test(value);
      const hasEight = value.length >= 8;
      let passwordStrength = 0;
      if (hasNumber) {
        passwordStrength += 1;
      }
      if (hasLetter) {
        passwordStrength += 1;
      }
      if (hasUpperCase) {
        passwordStrength += 1;
      }
      if (hasEight) {
        passwordStrength += 1;
      }
      this.setState({
        hasNumber,
        hasLetter,
        hasUpperCase,
        hasEight,
        passwordStrength,
      });
    }
    this.setState({
      [key]: value
    });
  }

  getBack = () => {
    const {navigation} = this.props;
    const resetAction = StackActions.popToTop();
    setTimeout(() => {
      navigation.dispatch(resetAction);
    }, 100);
  };

  goForward = () => {
    const {navigation} = this.props;
    setTimeout(() => {
      navigation.navigate('SignInStack');
    }, 500);
  };

  reset = async () => {
    // const resetAction = NavigationActions.back({ key: 'Welcome' });
    Promise.all([
      // navigation.dispatch(resetAction),
      // navigation.navigate('SignUpStack'),
      this.getBack(),
      this.goForward(),
    ]);
  };

  signUp() {
    Keyboard.dismiss();
    this.setState({
      loading: true,
    });
    return this.validate();
  }

  async validate() {
    const {navigation} = this.props;
    const {prevBody, password, confirmPassword} = this.state;
    const body = prevBody;
    body.password = password;
    body.confirmPassword = confirmPassword;
    // body.socialNetworkUser = {};
    console.log('body validate', body);
    try {
      const resp = await CiclooService.signUp(body);
      console.log('resp', resp);

      if (!resp.success) {
        return Alert.alert(
          'Erro ao cadastrar',
          `${resp.data.message}`,
          [
            {
              text: 'OK',
              onPress: () => {
                this.setState({
                  loading: false,
                });
              },
            },
          ],
          {cancelable: false},
        );
      }
      // if (resp.data.statusCode === 400) {
      //   return Alert.alert('Tente novamente', resp.data.resultValue, [{
      //     text: 'OK',
      //     onPress: () => {
      //       this.setState({
      //         loading: false,
      //       });
      //       navigation.goBack();
      //     },
      //   }],
      //   { cancelable: false });
      // }
      if (resp && typeof resp !== 'string' && resp.success) {
        await analytics().logEvent('signup_new_password_app', {
          stage: 'new user password registration',
          username: resp.data.resultValue.userName,
        });
        this.setState({
          loading: false,
        });
        Authentication.onSignin(resp.data.resultValue.token);
        // return navigation.navigate('AuthLoading'); // alterei de home => authloading TESTAR!!!
        const termsData = await CiclooService.GetTerms();
        console.log({ regulationId: termsData.id },termsData)
        const respTerms = await CiclooService.AcceptTerms({ regulationId: termsData.id });
        if (respTerms.success) {
          return navigation.navigate('SignUpBonus');
        }
      }
      return Alert.alert('Tente novamente', resp.errors[0]);
    } catch (error) {
      this.setState({
        loading: false,
      });
      return Alert.alert(
        'Tente novamente',
        `${error}`,
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({
                loading: false,
              });
            },
          },
        ],
        {cancelable: false},
      );
    }

    // navigation.navigate('Home');
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      props,
      state: {
        passwordFocused,
        confirmPasswordFocused,
        password,
        confirmPassword,
      },
    } = this;
    // if (prevProps !== props) {
    // if (props.label === 'Gênero') console.log('this._animatedIsFocused', this._animatedIsFocused);
    Animated.timing(this._passwordIsFocused, {
      toValue: passwordFocused || password != '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(this._confirmPasswordIsFocused, {
      toValue: confirmPasswordFocused || confirmPassword != '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    // Animated.timing(this._animatedIsFocusedGender, {
    //   toValue: (isFocused || props.value !== 0) ? 1 : 0,
    //   duration: 200,
    // }).start();
    // }
  }

  toggleVisible = field => {
    let newState = {};
    newState[field] = !this.state[field];
    this.setState(newState);
  };

  render() {
    const {
      password,
      confirmPassword,
      loading,
      hasNumber,
      hasLetter,
      hasUpperCase,
      equalPasswords,
      hasEight,
      passwordStrength,
      passwordHidden,
      passwordFocused,
      confirmPasswordHidden,
      confirmPasswordFocused,
    } = this.state;
    const {
      navigation: {goBack, navigate},
    } = this.props;

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
    const labelConfirmPasswordStyle = {
      position: 'absolute',
      left: 4,
      fontFamily: 'Rubik-Regular',
      top: this._confirmPasswordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._confirmPasswordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._confirmPasswordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#66666600', '#8EA7AB'],
      }),
    };
    return (
      <View
        style={[
          styles.container,
          // { paddingTop: Platform.OS === 'android' ? 40 : 0 },
        ]}>
        <View
          style={{
            height: 60,
            minHeight: 60,
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={Images.logoPurple}
            style={{
              width: 75,
              height: 17.5,
              alignSelf: 'center',
              marginTop: 30,
            }}
          />
        </View>
        <DismissKeyboardView>
          <ScrollView
            style={{paddingTop: 40}}
            contentContainerStyle={{flex: 1, minHeight: height - height * 0.2}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  width,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  marginBottom: height * 0.1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    goBack(null);
                  }}
                  style={
                    {
                      // top: height * 0.06 + 9,
                      // left: 32,
                      // position: 'absolute',
                      // zIndex: 9999,
                    }
                  }>
                  <View>
                    <Icon name="chevron-left" color="#2e2e2e" size={24} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cadastre uma senha.</Text>
                <Icon name="chevron-left" color="#2e2e2e00" size={24} />
              </View>
              <View style={styles.floatingLabelInput}>
                <View style={styles.floatingLabel}>
                  <Animated.Text style={[labelPasswordStyle]}>
                    {'Nova senha'}
                  </Animated.Text>
                  <TextInput
                    contextMenuHidden
                    label="Nova senha"
                    value={password}
                    onChangeText={value => {
                      this.onChangeText('password', value);
                    }}
                    ref="password"
                    style={styles.inputStyle}
                    validator={valid => {
                      console.log(valid);
                    }}
                    keyboardAppearance={
                      Platform.OS === 'ios' ? 'dark' : 'default'
                    }
                    secureTextEntry={passwordHidden}
                    clearButtonMode="while-editing"
                    placeholder="Nova senha"
                    autoCompleteType="password"
                    textContentType="password"
                    autoCorrect={false}
                    returnKeyType="next"
                    autoCapitalize="none"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => {
                      this.setState({passwordFocused: true});
                    }}
                    onBlur={() => {
                      this.setState({passwordFocused: false});
                    }}
                    onSubmitEditing={() => this.refs.confirmPassword.focus()}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => this.toggleVisible('passwordHidden')}>
                  <EyeIcon
                    name={passwordHidden ? 'eye-off' : 'eye'}
                    size={20}
                    color="#000"
                    style={styles.iconStyle}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.floatingLabelInput}>
                <View style={styles.floatingLabel}>
                  <Animated.Text style={[labelConfirmPasswordStyle]}>
                    {'Nova senha'}
                  </Animated.Text>
                  <TextInput
                    contextMenuHidden
                    label="Confirme sua nova senha"
                    value={confirmPassword}
                    onChangeText={value => {
                      this.onChangeText('confirmPassword', value);
                    }}
                    ref="confirmPassword"
                    style={styles.inputStyle}
                    validator={valid => {
                      console.log(valid);
                    }}
                    keyboardAppearance={
                      Platform.OS === 'ios' ? 'dark' : 'default'
                    }
                    secureTextEntry={confirmPasswordHidden}
                    clearButtonMode="while-editing"
                    placeholder="Confirme sua nova senha"
                    autoCompleteType="password"
                    textContentType="password"
                    autoCorrect={false}
                    returnKeyType="done"
                    autoCapitalize="none"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => {
                      this.setState({confirmPasswordFocused: true});
                    }}
                    onBlur={() => {
                      this.setState({confirmPasswordFocused: false});
                    }}
                    onSubmitEditing={() =>
                      passwordStrength >= 5 ? this.editPwd() : false
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => this.toggleVisible('confirmPasswordHidden')}>
                  <EyeIcon
                    name={confirmPasswordHidden ? 'eye-off' : 'eye'}
                    size={20}
                    color="#000"
                    style={styles.iconStyle}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  marginLeft: 24,
                  marginBottom: 20,
                  fontFamily: 'Rubik-Regular',
                  fontSize: 15,
                }}>
                Força da senha
              </Text>
              
              <View
                style={{
                  flexDirection: 'row',
                  width,
                  paddingHorizontal: 24,
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: (width - 76) * 0.2,
                    backgroundColor:
                      passwordStrength >= 1 ? '#94FED6' : '#CFDCDF',
                  }}
                />
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: (width - 76) * 0.2,
                    backgroundColor:
                      passwordStrength >= 2 ? '#94FED6' : '#CFDCDF',
                  }}
                />
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: (width - 76) * 0.2,
                    backgroundColor:
                      passwordStrength >= 3 ? '#94FED6' : '#CFDCDF',
                  }}
                />
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: (width - 76) * 0.2,
                    backgroundColor:
                      passwordStrength >= 4 ? '#94FED6' : '#CFDCDF',
                  }}
                />
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: (width - 76) * 0.2,
                    backgroundColor:
                      password == confirmPassword && password.length > 0 ? '#94FED6' : '#CFDCDF',
                  }}
                />
              </View>

              <View
                style={{
                  width,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    backgroundColor: hasEight ? '#94FED6' : '#FF7A61',
                    marginRight: 16,
                  }}
                />
                <Text style={{fontFamily: 'Rubik-Regular', fontSize: 15}}>
                  Conter no mínimo 8 caracteres
                </Text>
              </View>
              <View
                style={{
                  width,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 6,
                }}>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    backgroundColor: hasNumber ? '#94FED6' : '#FF7A61',
                    marginRight: 16,
                  }}
                />
                <Text style={{fontFamily: 'Rubik-Regular', fontSize: 15}}>
                  Conter números
                </Text>
              </View>
              <View
                style={{
                  width,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 6,
                }}>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    backgroundColor: hasLetter ? '#94FED6' : '#FF7A61',
                    marginRight: 16,
                  }}
                />
                <Text style={{fontFamily: 'Rubik-Regular', fontSize: 15}}>
                  Conter letra minúscula
                </Text>
              </View>
              <View
                style={{
                  width,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 6,
                }}>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    backgroundColor: hasUpperCase ? '#94FED6' : '#FF7A61',
                    marginRight: 16,
                  }}
                />
                <Text style={{fontFamily: 'Rubik-Regular', fontSize: 15}}>
                  Conter letra maiúscula
                </Text>
              </View>
              <View
                style={{
                  width,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 6,
                }}>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    backgroundColor:password == confirmPassword && password.length > 0  ? '#94FED6' : '#FF7A61',
                    marginRight: 16,
                  }}
                />
                <Text style={{fontFamily: 'Rubik-Regular', fontSize: 15}}>
                  Nova senha e confirmação iguais
                </Text>
              </View>
            </View>

            <ContinueButton
              buttonPress={() => this.signUp()}
              textInside="Finalizar cadastro"
              disabled={
                passwordStrength < 4 ||
                password == '' ||
                password != confirmPassword
              }
              // style={{ marginTop: height * 0.1, marginBottom: height * 0.3 }}
              style={{marginBottom: 10}}
            />
            {loading && <LoadingModalComponent visible={loading} />}
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
    // marginTop: height * 0.06,
    // marginBottom: height * 0.1,
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
    alignItems: 'center',
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

export default CreatePasswordScreen;
