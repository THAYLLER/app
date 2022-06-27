import React, {Component, useEffect} from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  OnHandleSubmitButton,
} from 'react-native';

import Images from '../constants/Images';
import ContinueButton from '../components/ContinueButton';
import SubHeaderComponent from '../components/SubHeaderComponent';
import LoadingModalComponent from '../components/LoadingModalComponent';
import FloatingLabelInput from '../components/FloatingLabelInput';
import BackButton from '../components/BackButtonComponent';
import CiclooService from '../services/CiclooService';
import Main from '../utils/Main';
import FastImage from 'react-native-fast-image';
import BehaviorService from '../services/BehaviorService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

class InsertCodeScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    // headerLeft: () => (
    //   <MenuButton nav={navigation} />
    // ),
    headerTintColor: '#FFFFFF',
    headerTitleAlign: 'center',
    headerTitle: () => (
      <View
        style={{
          width: width - 60,
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            // width: 60,
            color: '#FFF',
            fontSize: 18,
            // lineHeight: 16,
            fontFamily: 'Rubik-Bold',
            alignSelf: 'center',
            // marginLeft: -60,
          }}>
          Cadastrar cupom fiscal
        </Text>
      </View>
      // <FastImage resizeMode={FastImage.resizeMode.contain}
      //   source={Images.logo}
      //   style={{
      //     width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      //   }}
      // />
    ),
    // headerRight: () => (
    //   <NotificationButton
    //     nav={navigation}
    //     style={{
    //       alignSelf: 'flex-end',
    //       width: 60,
    //     }}
    //   />
    // ),
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
    headerBackTitleStyle: {
      color: '#FFFFFF',
      fontFamily: 'Rubik-Medium',
      fontSize: 11,
      lineHeight: 14,
      marginTop: 6,
    },
    headerBackImage: () => (
      <Icon
        name="arrow-back"
        size={25}
        color="#fff"
        style={
          {
            // marginLeft: 16,
          }
        }
      />
    ),
    headerStyle: {
      backgroundColor: '#6853C8',
      ...Platform.select({
        ios: {
          shadowColor: '#00000000',
          shadowOffset: {height: 0},
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        android: {
          elevation: 0,
        },
      }),
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: 'Rubik-Bold',
      alignSelf: 'center',
    },
  });
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      code: '',
    };
    this.sendCode = this.sendCode.bind(this);
  }

  useEffect =
    (async () => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        Alert.alert('ok'),
      );

      return () => backHandler.remove();
    },
    []);

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    // this.setState({
    //   loading: true,
    // });
  }

  async handleSendCode(data) {
    const {navigation} = this.props;
    const qrcode = data.split('|')[0].replace('CFe', '');

    if (qrcode.length != 44) {
      await BehaviorService.setQrFailure();
      this.setState({loading: false});
      return Alert.alert(
        'Código da nota',
        'Insira um código com 44 caracteres',
        [{text: 'OK', onPress: () => this.setState({loading: false})}],
        {cancelable: false},
      );
    }
    console.log('qrcode.length:', qrcode.length);
    try {
      const responseApi = await CiclooService.SendReceiptCode(qrcode, '2');
      console.log('responseApi', responseApi);

      if (responseApi.success) {
        this.setState({loading: false});
        Main.logCouponRegistered();
        await BehaviorService.setQrSuccess();
        return navigation.navigate('NoteStatus');
      } else {
        await BehaviorService.setQrFailure();
        return Alert.alert(
          'Tente novamente',
          responseApi.data,
          [{text: 'OK', onPress: () => this.setState({loading: false})}],
          {cancelable: false},
        );
      }
    } catch (error) {
      await BehaviorService.setQrFailure();
      this.setState({loading: false});
      return Alert.alert('Tente novamente', error);
    }
  }

  sendCode = () => {
    this.setState({loading: true});
    console.log('Cadastrar cupom fiscal', this.state.code);
    this.handleSendCode(this.state.code);
  };

  render() {
    const {code, loading} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#6853C8'}}>
        <StatusBar barStyle="light-content" backgroundColor="#6853C8" />
        {/* <SubHeaderComponent title="Cadastrar cupom fiscal" /> */}
        <View
          style={{
            flex: 1,
            height,
            width,
            padding: 24,
            paddingTop: 0,
            backgroundColor: '#FFF',
            justifyContent: 'flex-start',
          }}>
          <FloatingLabelInput
            label="Cupom fiscal"
            value={code}
            onChange={value => {
              this.setState({
                code: value,
              });
            }}
            // autoFocus
            keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
            clearButtonMode="while-editing"
            placeholder="Digite o código do cupom fiscal"
            // textContentType="addressState"
            autoCorrect={false}
            returnKeyType="done"
            keyboardType="number-pad"
            style={{marginTop: height * 0.05}}
            onSubmitEditing={this.state.code.length !== 44 && null}
            maxLength={44}
            // autoCapitalize="characters"
          />
          <ContinueButton
            buttonPress={() => navigation.navigate('FindCode')}
            textInside="Onde encontro o código"
            style={{marginTop: 30}}
            bgWhite
          />
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <ContinueButton
              buttonPress={() => this.sendCode()}
              textInside="Cadastrar cupom fiscal"
              style={{marginTop: 10, bottom: 0}}
              disabled={code.length < 44}
            />
          </View>
        </View>
        {loading && <LoadingModalComponent visible={loading} />}
      </SafeAreaView>
    );
  }
}

// InsertCodeScreen.navigationOptions = {
//   headerTitle: () => (
//     <FastImage resizeMode={FastImage.resizeMode.contain}
//       source={Images.logo}
//       style={{
//         width: 60, height: 16, resizeMode: 'contain', marginTop: 6, // alignSelf: 'center',
//       }}
//     />
//   ),
//   headerTitleAlign: 'center',
//   headerTitleStyle: { alignSelf: 'center' },
//   headerStyle: {
//     backgroundColor: '#6853C8',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#00000000',
//         shadowOffset: { height: 0 },
//         shadowOpacity: 0,
//         shadowRadius: 0,
//       },
//       android: {
//         elevation: 0,
//       },
//     }),
//     borderBottomWidth: 0,
//   },
//   headerTintColor: '#FFFFFF',
//   headerBackTitle: ' ',
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
});

export default InsertCodeScreen;
