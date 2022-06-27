import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Feather';
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
import { NavigationActions, StackActions } from 'react-navigation';
import Colors from '../constants/Colors';

import CiclooService from '../services/CiclooService';

import FloatingLabelInput from '../components/FloatingLabelInput';
import ContinueButton from '../components/ContinueButton';
import ModalLogin from '../components/ModalLogin';
import LoadingModalComponent from '../components/LoadingModalComponent';
import DismissKeyboardView from '../components/DismissKeyboardView';
import Authentication from '../utils/Authentication';

const { width, height } = Dimensions.get('window');

class EditPasswordScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      loading: false,
      hasNumber: false,
      hasLetter: false,
      hasUpperCase: false,
      equalPasswords: false,
      hasEight: false,
      passwordStrength: 0,
      participantData: {},
      oldPasswordHidden: true,
      oldPasswordFocused: false,
      newPasswordHidden: true,
      newPasswordFocused: false,
      confirmPasswordHidden: true,
      confirmPasswordFocused: false,
    };
    this._oldPasswordIsFocused = new Animated.Value(0)
    this._newPasswordIsFocused = new Animated.Value(0)
    this._confirmPasswordIsFocused = new Animated.Value(0)
  }

  async componentDidMount() {
    const { navigation } = this.props;
    StatusBar.setBarStyle('dark-content');
    const profData = await this.loadProfileData();
    console.log('profData', profData);
    console.log('profData.socialNetworkUser.length > 0', profData.socialNetworkUser.length > 0);
    if (profData.isSocialNetwork) {
      Alert.alert(
        'Não é possível alterar sua senha',
        'Você entrou utilizando alguma rede social',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack(null);
            },
          },
        ],
        { cancelable: false },
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { props, state: { 
      oldPasswordFocused, 
      newPasswordFocused, 
      confirmPasswordFocused, 
      oldPassword, 
      newPassword,
      confirmPassword,
    } } = this;
    // if (prevProps !== props) {
    // if (props.label === 'Gênero') console.log('this._animatedIsFocused', this._animatedIsFocused);
    Animated.timing(this._oldPasswordIsFocused, {
      toValue: oldPasswordFocused || oldPassword != '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(this._newPasswordIsFocused, {
      toValue: newPasswordFocused || newPassword != '' ? 1 : 0,
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

  onChangeText(key, value) {
    // const numbers = '1234567890';
    // if (key === 'username' && !numbers.indexOf(value[value.length - 1]) < 0) {
    //   console.log('numbers.indexOf(value) < 0');
    //   return;
    // }
    let equalTo = ''
    if(key == 'confirmPassword')
      equalTo = 'newPassword'
    if(key == 'newPassword')
      equalTo = 'confirmPassword'
       

      /* 
         Another way he found to solve it was just added: (key === 'newPassword' || key == 'confirmPassword') in the conditional, but the visible result of the application was not what was expected.
      */
    if (key === 'newPassword') {
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
      // if(equalPasswords) {
      //   passwordStrength += 1;
      // }
      this.setState({
        hasNumber,
        hasLetter,
        hasUpperCase,
        hasEight,
        //equalPasswords,
        passwordStrength,
      });
    }
    this.setState({
      [key]: value,
      equalPasswords: (value == this.state[equalTo])
    });
  }

  loadProfileData = async () => {
    const { navigation } = this.props;
    const participantData = await CiclooService.GetParticipantData();
    // const participantData = navigation.getParam('participantData', {});
    console.log('participantData', participantData);
    this.setState({
      participantData,
    });
    return participantData;
  }

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
      navigation.navigate('SignInStack');
    }, 500);
  }

  editPwd() {
    Keyboard.dismiss();
    this.setState({
      loading: true,
    });
    return this.validate();
  }

  async validate() {
    const { navigation } = this.props;
    const {
      participantData, oldPassword, newPassword, confirmPassword,
    } = this.state;
    const body = {
      // id: participantData.id,
      oldPassword,
      newPassword,
      confirmPassword,
    };
    console.log('body validate', body);
    const resp = await CiclooService.editPassword(body);
    console.log('resp', JSON.stringify(resp));
    this.setState({
      loading: false,
    });
    if (resp.success) {
      return Alert.alert(
        'Alteração realizada!',
        `Sua senha foi alterada com sucesso!`,
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
    return Alert.alert(
      'Tente novamente',
      resp.message,
    );
  }

  toggleVisible = field => {
    let newState = {}
    newState[field] = !this.state[field]
    this.setState(newState)
  }

  render() {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
      loading,
      hasNumber,
      hasLetter,
      hasUpperCase,
      hasEight,
      equalPasswords,
      passwordStrength,
      oldPasswordHidden,
      oldPasswordFocused,
      newPasswordHidden,
      newPasswordFocused,
      confirmPasswordHidden,
      confirmPasswordFocused,
    } = this.state;
    const { navigation: { goBack, navigate } } = this.props;
    const labelOldPasswordStyle = {
      position: 'absolute',
      left: 4,
      fontFamily: 'Rubik-Regular',
      top: this._oldPasswordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._oldPasswordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._oldPasswordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#66666600', '#8EA7AB'],
      }),
    };
    const labelNewPasswordStyle = {
      position: 'absolute',
      left: 4,
      fontFamily: 'Rubik-Regular',
      top: this._newPasswordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._newPasswordIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._newPasswordIsFocused.interpolate({
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
        ]}
      >
        <View style={{ height: 60, minHeight: 60, justifyContent: 'center', backgroundColor: '#6853C8' }}>
          <View style={{
            width: width - 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
          }}
          >
            <Text style={{
              // width: 60, 
              color: '#FFF',
              fontSize: 18,
              // lineHeight: 16,
              fontFamily: 'Rubik-Bold',
              alignSelf: 'center',
              // marginLeft: -60,
            }}
            >
              Alterar senha
            </Text>
          </View>
          {/* <SubHeaderComponent title="Notificações" noForceUpperCase /> */}
        </View>
        <View style={{ height: 60, minHeight: 60, justifyContent: 'center', backgroundColor: '#6853C8' }}>
          <TouchableOpacity
            onPress={() => {
              goBack(null);
            }}
            style={{
              top: 16,
              left: 18,
              position: 'absolute',
            }}
          >
            <View>
              <Icon
                name="chevron-left"
                color="#fff"
                size={24}
              />
            </View>
          </TouchableOpacity>
          <View style={{
            width: width - 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
          }}
          >
            <Text style={{
              // width: 60, 
              color: '#FFF',
              fontSize: 18,
              // lineHeight: 16,
              fontFamily: 'Rubik-Bold',
              alignSelf: 'center',
              // marginLeft: -60,
            }}
            >
              Alterar senha
            </Text>
          </View>
          {/* <SubHeaderComponent title="Notificações" noForceUpperCase /> */}
        </View>
        <DismissKeyboardView>
          <ScrollView
            style={{ paddingTop: 40 }}
            contentContainerStyle={{flex: 1}}
          >
            <View style={{flex: 1}}
            >
              <View style={styles.floatingLabelInput}
              >
                <View style={styles.floatingLabel}>
                  <Animated.Text style={[labelOldPasswordStyle]}>
                    {'Senha atual'}
                  </Animated.Text>
                  <TextInput
                    contextMenuHidden
                    label="Senha atual"
                    value={oldPassword}
                    onChangeText={(value) => {
                      this.onChangeText('oldPassword', value);
                    }}
                    ref='oldPassword'
                    style={styles.inputStyle}
                    validator={(valid) => { console.log(valid); }}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    secureTextEntry={oldPasswordHidden}
                    clearButtonMode="while-editing"
                    placeholder="Senha atual"
                    autoCompleteType="password"
                    textContentType="password"
                    autoCorrect={false}
                    returnKeyType="next"
                    autoCapitalize="none"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => {
                      this.setState({ oldPasswordFocused: true });
                    }}
                    onBlur={() => {
                      this.setState({ oldPasswordFocused: false });
                    }}
                    onSubmitEditing={() => this.refs.newPassword.focus()}
                  />
                </View>
                {/* <TouchableOpacity
                onPress={() => this.toggleVisible('oldPasswordHidden')}
                >
                  <Icon name={(oldPasswordHidden) ? 'eye-off' : 'eye'} size={20} color='#000' style={styles.iconStyle} />
                </TouchableOpacity> */}
              </View>
              <View style={styles.floatingLabelInput}
              >
                <View style={styles.floatingLabel}>
                  <Animated.Text style={[labelNewPasswordStyle]}>
                    {'Nova senha'}
                  </Animated.Text>
                  <TextInput
                    contextMenuHidden
                    label="Nova senha"
                    value={newPassword}
                    onChangeText={(value) => {
                      this.onChangeText('newPassword', value);
                    }}
                    ref='newPassword'
                    style={styles.inputStyle}
                    validator={(valid) => { console.log(valid); }}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                    secureTextEntry={newPasswordHidden}
                    clearButtonMode="while-editing"
                    placeholder="Nova senha"
                    autoCompleteType="password"
                    textContentType="password"
                    autoCorrect={false}
                    returnKeyType="next"
                    autoCapitalize="none"
                    placeholderTextColor="#8EA7AB"
                    onFocus={() => {
                      this.setState({ newPasswordFocused: true });
                    }}
                    onBlur={() => {
                      this.setState({ newPasswordFocused: false });
                    }}
                    onSubmitEditing={() => this.refs.confirmPassword.focus()}
                  />
                </View>
                <TouchableOpacity
                onPress={() => this.toggleVisible('newPasswordHidden')}
                >
                  <Icon name={(newPasswordHidden) ? 'eye-off' : 'eye'} size={20} color='#000' style={styles.iconStyle} />
                </TouchableOpacity>
              </View>
              <View style={styles.floatingLabelInput}
              >
                <View style={styles.floatingLabel}>
                  <Animated.Text style={[labelConfirmPasswordStyle]}>
                    {'Nova senha'}
                  </Animated.Text>
                  <TextInput
                    contextMenuHidden
                    label="Confirme sua nova senha"
                    value={confirmPassword}
                    onChangeText={(value) => {
                      this.onChangeText('confirmPassword', value);
                    }}
                    ref='confirmPassword'
                    style={styles.inputStyle}
                    validator={(valid) => { console.log(valid); }}
                    keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
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
                      this.setState({ confirmPasswordFocused: true });
                    }}
                    onBlur={() => {
                      this.setState({ confirmPasswordFocused: false });
                    }}
                  //   onSubmitEditing={() => (passwordStrength >=5) ? this.editPwd() : false}
                  // Check Password If Strong and Equals Confirm Password
                    onSubmitEditing={() => (passwordStrength >= 4 && equalPasswords) ? this.editPwd() : false}
                  />
                </View>
                <TouchableOpacity
                onPress={() => this.toggleVisible('confirmPasswordHidden')}
                >
                  <Icon name={(confirmPasswordHidden) ? 'eye-off' : 'eye'} size={20} color='#000' style={styles.iconStyle} />
                </TouchableOpacity>
              </View>
              <Text style={{
                marginLeft: 24, marginBottom: 20, fontFamily: 'Rubik-Regular', fontSize: 15,
              }}
              >
                Força da senha
              </Text>
              <View style={{
                flexDirection: 'row', width, paddingHorizontal: 24, justifyContent: 'space-between', marginBottom: 16,
              }}
              >
                <View style={{
                  height: 6, borderRadius: 3, width: (width - 76) * 0.20, backgroundColor: passwordStrength >= 1 ? '#94FED6' : '#CFDCDF',
                }}
                />
                <View style={{
                  height: 6, borderRadius: 3, width: (width - 76) * 0.20, backgroundColor: passwordStrength >= 2 ? '#94FED6' : '#CFDCDF',
                }}
                />
                <View style={{
                  height: 6, borderRadius: 3, width: (width - 76) * 0.20, backgroundColor: passwordStrength >= 3 ? '#94FED6' : '#CFDCDF',
                }}
                />
                <View style={{
                  height: 6, borderRadius: 3, width: (width - 76) * 0.20, backgroundColor: passwordStrength >= 4 ? '#94FED6' : '#CFDCDF',
                }}
                />
                <View style={{
                  height: 6, borderRadius: 3, width: (width - 76) * 0.20, backgroundColor: passwordStrength >= 5 ? '#94FED6' : '#CFDCDF',
                }}
                />
              </View>

              <View style={{
                width, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', marginTop: 16,
              }}
              >
                <View style={{
                  height: 8, width: 8, borderRadius: 4, backgroundColor: hasEight ? '#94FED6' : '#FF7A61', marginRight: 16,
                }}
                />
                <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 15 }}>
                  Conter no mínimo 8 caracteres
                </Text>
              </View>
              <View style={{
                width, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', marginTop: 6,
              }}
              >
                <View style={{
                  height: 8, width: 8, borderRadius: 4, backgroundColor: hasNumber ? '#94FED6' : '#FF7A61', marginRight: 16,
                }}
                />
                <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 15 }}>
                  Conter números
                </Text>
              </View>
              <View style={{
                width, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', marginTop: 6,
              }}
              >
                <View style={{
                  height: 8, width: 8, borderRadius: 4, backgroundColor: hasLetter ? '#94FED6' : '#FF7A61', marginRight: 16,
                }}
                />
                <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 15 }}>
                  Conter letra minúscula
                </Text>
              </View>
              <View style={{
                width, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', marginTop: 6,
              }}
              >
                <View style={{
                  height: 8, width: 8, borderRadius: 4, backgroundColor: hasUpperCase ? '#94FED6' : '#FF7A61', marginRight: 16,
                }}
                />
                <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 15 }}>
                  Conter letra maiúscula
                </Text>
              </View>
              <View style={{
                width, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', marginTop: 6,
              }}
              >
                <View style={{
                  height: 8, width: 8, borderRadius: 4, backgroundColor: equalPasswords ? '#94FED6' : '#FF7A61', marginRight: 16,
                }}
                />
                <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 15 }}>
                  Nova senha e confirmação iguais
                </Text>
              </View>
            </View>
            <ContinueButton
              buttonPress={() => this.editPwd()}
              textInside="SALVAR"
              // Check if password is strong and equal to confirm password
              disabled={passwordStrength < 4 || !equalPasswords}
              // style={{ marginTop: height * 0.1, marginBottom: height * 0.3 }}
              style={{marginBottom: 10}}
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
    // paddingTop: height * 0.05,
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

export default EditPasswordScreen;
