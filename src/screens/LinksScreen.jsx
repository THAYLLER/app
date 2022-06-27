import React, {Component, Fragment} from 'react';
import {
  View,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
  LayoutAnimation,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  CameraRoll,
  Alert,
  Clipboard,
  StatusBar,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import axios from 'axios';
import metrics from '../styles/metrics';
import colors from '../styles/colors';
import BalloonView from '../components/BalloonView';
import ContinueButton from '../components/ContinueButton';
import LoadingModalComponent from '../components/LoadingModalComponent';
import {QrCodeIcon, NotQrCodeIcon} from '../components/svgs';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import CiclooService from '../services/CiclooService';
import Main from '../utils/Main';
import AcceptCheckBox from '../components/AcceptCheckBoxComponent';
import FastImage from 'react-native-fast-image';
import EncryptedStorage from 'react-native-encrypted-storage';
import BehaviorService from '../services/BehaviorService';
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';
// import { useHeaderHeight } from '@react-navigation/stack';
// const headerHeight = useHeaderHeight();

const headerHeight = 40;

const {width, height} = Dimensions.get('window');

class LinksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      type: RNCamera.Constants.Type.back,
      cameraFocus: RNCamera.Constants.AutoFocus,
      photo: null,
      loading: false,
      scanned: false,
      showQrInstructions: true,
      hideQrAlways: false,
      showCamInstructions: true,
      hideCamAlways: false,
      isQrcodeScanner: true,
      notShowIcon: 'check-box-outline-blank',
      notShowAgain: false,
      notShowAgainCheckbox: false,
      loadingNotShow: false,
      rotated: false,
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    // this.getCameraPermissionAsync(); // MUDANÇAAAAAAAAAAAA
    Orientation.lockToPortrait();
    navigation.navigate('CaptureModal', {comingFrom: 'Links'});
    const hideQrStr = await EncryptedStorage.getItem('qrAlways');
    const hideCamStr = await EncryptedStorage.getItem('camAlways');
    const notShowAgain = await EncryptedStorage.getItem('notShowAgainScanTip');

    // limpar chave para exibir dica (refresh 2x)
    // if(notShowAgain) await EncryptedStorage.removeItem('notShowAgainScanTip');
    console.log({rotated: this.state.rotated});
    this.setState({
      hideQrAlways: JSON.parse(hideQrStr),
      hideCamAlways: JSON.parse(hideCamStr),
      notShowAgain: notShowAgain ? JSON.parse(notShowAgain) : false,
      rotated: false,
    });
  }

  getCameraPermissionAsync = async () => {
    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    this.setState({hasCameraPermission: status === 'granted'});
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
    }
  };

  snap = async () => {
    const {navigation} = this.props;
    navigation.navigate('InsertCode');
    await analytics().logEvent('note_has_no_qrcode');
  };

  photo = async () => {
    try {
      const {uri} = await this.camera.takePictureAsync({
        quality: 0.5,
        forceUpOrientation: true,
        fixOrientation: true,
        skipProcessing: true,
      });
      console.log('uri', uri);
      this.sendImage(uri);
    } catch (error) {
      Alert.alert('Erro', 'Houve um erro ao tirar a foto.');
    }
  };

  sendImage = async photo => {
    const {navigation} = this.props;
    this.setState({loading: true});
    try {
      const responseApi = await CiclooService.SendReceiptPhoto(photo);
      console.log('responseApi', responseApi);

      if (responseApi.success) {
        this.setState({loading: false});
        // Main.logScanCoupon();
        navigation.navigate('NoteStatus');
      }

      if (!responseApi.success) {
        return Alert.alert(
          'Tente novamente',
          responseApi.data,
          [{text: 'OK', onPress: () => this.setState({loading: false})}],
          {cancelable: false},
        );
      }
    } catch (error) {
      this.setState({loading: false});
      console.log('error', error);
      Alert.alert('Tente novamente', error);
    }
  };

  back = async () => {
    const {navigation} = this.props;
    console.log('back', navigation);
    await analytics().logEvent('leave_camera');
    navigation.navigate('Home');
  };

  willFocus = payload => {
    const {navigation} = this.props;
    // navigation.navigationOptions;
    // console.log('will focus will focus will focus', payload);
    if (payload.action.type === 'Navigation/NAVIGATE') {
      LayoutAnimation.easeInEaseOut();
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      // console.log('Navigation/NAVIGATE', payload.action.type);
      setTimeout(
        () => navigation.navigate('CaptureModal', {comingFrom: 'Links'}),
        500,
      );
    }
    if (
      payload.action.type === 'Navigation/BACK' ||
      payload.action.type === 'Navigation/POP_TO_TOP'
    ) {
      this.getCameraPermissionAsync();
      // this.getRollPermissionAsync();
      // console.log('Navigation/BACK || Navigation/POP_TO_TOP', payload.action.type);
    }
  };

  handleBarCodeScanned = async ({type, data, rawData}) => {
    console.log({type, data, rawData});
    const {navigation} = this.props;
    this.setState({scanned: true, loading: true});
    console.log('Qrcode bruto > ', data);

    if (
      type !== 'QR_CODE' &&
      type !== 'org.iso.QRCode' &&
      type !== 'CODE_128'
    ) {
      await BehaviorService.setQrFailure();
      this.rotate();
      Alert.alert(
        'QR code ilegível',
        'Por favor digite o código do cupom fiscal.',
      );
      this.setState({scanned: false, loading: false});
      this.snap();
      return;
    }

    if (data === null || data === undefined) {
      await BehaviorService.setQrFailure();
      Alert.alert(
        'Tente Novamente',
        'Não reconhecemos esta nota, tente enviar outra nota.',
      );
      this.setState({scanned: false, loading: false});
      return;
    }

    try {
      const responseApi = await CiclooService.SendReceiptCode(
        data,
        type == 'CODE_128' ? '2' : '1',
      );

      if (!responseApi.success) {
        console.log({responseApi});
        await BehaviorService.setQrFailure();
        Alert.alert(
          'Tente novamente',
          responseApi.data,
          [
            {
              text: 'OK',
              onPress: () => this.setState({scanned: false, loading: false}),
            },
          ],
          {cancelable: false},
        );
        return;
      }

      Main.logScanCoupon();
      await BehaviorService.setQrSuccess();
      this.setState({
        scanned: false,
        loading: false,
      });
      navigation.navigate('NoteStatus');
    } catch (error) {
      await BehaviorService.setQrFailure();
      this.setState({loading: false});
      Alert.alert('Tente novamente', error);
      console.log('error handleBarCodeScanned:>> ', error);
      this.setState({scanned: false});
    }
  };

  setNotShowAgain = () => {
    let {notShowAgainCheckbox} = this.state;
    this.setState({
      notShowIcon: notShowAgainCheckbox
        ? 'check-box-outline-blank'
        : 'check-box',
      notShowAgainCheckbox: !notShowAgainCheckbox,
      loadingNotShow: false,
    });
  };

  saveNotShowAgain = async () => {
    let {notShowAgain, notShowAgainCheckbox} = this.state;
    if (notShowAgainCheckbox) {
      await EncryptedStorage.setItem(
        'notShowAgainScanTip',
        JSON.stringify(true),
      );
    }
    this.setState({
      notShowAgain: true,
      // loadingNotShow: false,
    });
  };

  rotate = () => {
    // Orientation.unlockAllOrientations()
    let rotated = !this.state.rotated;
    this.setState({rotated});
    return rotated
      ? Orientation.lockToLandscapeLeft()
      : Orientation.lockToPortrait();
  };

  renderBottomContent = () => {
    const {rotated, notShowIcon, notShowAgain, loadingNotShow} = this.state;
    const triangleFactor = 20;
    return rotated ? (
      <View
        style={{
          // flexDirection: 'row',
          justifyContent: 'space-around',
          // position: 'absolute',
          // bottom: 0,
          // left: 0,
          // right: 0,
          flexDirection: 'row',
          position: 'absolute',
          // alignItems: '',
          flex: 1,
          bottom: 10,
          left: 0,
          right: 0,
          paddingHorizontal: 10,
          paddingBottom: 20,
          // height: 200,
          zIndex: 9999999,
          width: height,
          backgroundColor: 'transparent',
          // backgroundColor: '#f00',
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            width: width * 0.8,
            backgroundColor: '#FFF',
            borderColor: '#fcfdb1',
            borderWidth: 3,
            alignSelf: 'center',
            backgroundColor: 'transparent',
            height: 48,
            borderWidth: 3,
            borderRadius: 24,
          }}
          onPress={this.rotate}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              margin: 3,
              borderRadius: 20,
              // backgroundColor: '#fcfdb1'
            }}>
            <Icon name="qr-code-scanner" size={25} color="#fcfdb1" />
            <Text
              style={{
                color: '#fcfdb1',
                flex: 1,
                textAlign: 'center',
                marginLeft: 5,
                fontWeight: 'bold',
              }}>
              QR CODE
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              margin: 3,
              borderRadius: 20,
              backgroundColor: '#fcfdb1',
            }}>
            <Icon
              name="format-align-justify"
              size={25}
              style={{transform: [{rotate: '90deg'}]}}
              color="#000"
            />
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                marginLeft: 5,
                fontWeight: 'bold',
              }}>
              CÓD. BARRAS
            </Text>
          </View>
        </TouchableOpacity>
        {/* <ContinueButton
            buttonPress={this.rotate}
            textInside={(rotated) ? 'Cód. de Barras' : 'QR Code'}
            disabled={!notShowAgain}
            style={{
              marginBottom: 20,
              width: height * .45,
              backgroundColor: '#FFF',
              borderColor: '#fcfdb1',
              borderWidth: 3,
              alignSelf: 'center',
              backgroundColor: 'transparent',
            }}
            // textStyle={{color: '#fcfdb1'}}
            // bgWhite
          /> */}
        <ContinueButton
          buttonPress={this.snap}
          textInside="Digite o código do seu cupom"
          style={{
            // marginBottom: 20,
            width: height * 0.45,
            // backgroundColor: '#FFF',
            // borderColor: '#FFF',
            borderWidth: 0,
            alignSelf: 'center',
            backgroundColor: 'transparent',
          }}
          textStyle={{color: '#fcfdb1'}}
          // bgWhite
        />
      </View>
    ) : (
      <>
        <View
          style={{
            zIndex: 99999999,
            backgroundColor: '#FF7A61',
            height: 3,
            width,
            top: height * 0.5 - width * 0.1,
            position: 'absolute',
            shadowColor: '#FF7A61',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.8,
            shadowRadius: 3,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            alignSelf: 'center',
          }}>
          {!notShowAgain && (
            <View>
              <View
                style={{
                  // height: height/2,
                  width: width * 0.9,
                  backgroundColor: '#fff',
                  // backgroundColor: 'transparent',
                  padding: 20,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    // padding: 10,
                    // flex: 1,
                    // textAlign: 'center',
                    color: '#6853C8',
                  }}>
                  Importante:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    // padding: 10,
                    paddingVertical: 10,
                  }}>
                  Você tem
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    2 formas{' '}
                  </Text>
                  para registrar suas compras:
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    código de barras{' '}
                  </Text>
                  ou
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    QR Code.
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    // padding: 10,
                  }}>
                  Alterne aqui para escolher um deles.
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({loadingNotShow: true}, this.setNotShowAgain)
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // marginBottom: 10,
                    marginVertical: 20,
                  }}>
                  {loadingNotShow ? (
                    <ActivityIndicator
                      size={20}
                      style={{marginRight: 10}}
                      color="#6853C8"
                    />
                  ) : (
                    <View
                      style={{
                        height: 20,
                        aspectRatio: 1,
                        marginRight: 10,
                      }}>
                      <Icon name={notShowIcon} size={20} color="#6853C8" />
                    </View>
                  )}
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    Não exibir novamente.
                  </Text>
                </TouchableOpacity>
                <ContinueButton
                  buttonPress={this.saveNotShowAgain}
                  textInside="Ok, entendi."
                  style={{
                    marginBottom: 10,
                    width: width * 0.8,
                    backgroundColor: '#FFF',
                    borderColor: '#6853C8',
                    alignSelf: 'center',
                  }}
                  bgWhite
                />
              </View>
              <View
                style={{
                  height: triangleFactor,
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    width: triangleFactor,
                    height: triangleFactor,
                    position: 'absolute',
                    top: -1,
                    // left:20,
                    borderLeftWidth: triangleFactor,
                    borderLeftColor: 'transparent',
                    borderRightWidth: triangleFactor,
                    borderRightColor: 'transparent',
                    borderTopWidth: triangleFactor,
                    borderTopColor: '#fff',
                  }}
                />
              </View>
            </View>
          )}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              width: width * 0.8,
              backgroundColor: '#FFF',
              borderColor: '#fcfdb1',
              borderWidth: 3,
              alignSelf: 'center',
              backgroundColor: 'transparent',
              height: 48,
              borderWidth: 3,
              borderRadius: 24,
            }}
            disabled={!notShowAgain}
            onPress={this.rotate}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                margin: 3,
                borderRadius: 20,
                backgroundColor: '#fcfdb1',
              }}>
              <Icon name="qr-code-scanner" size={25} color="#000" />
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  marginLeft: 5,
                  fontWeight: 'bold',
                }}>
                QR CODE
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                margin: 3,
                borderRadius: 20,
                // backgroundColor: '#fcfdb1'
              }}>
              <Icon
                name="format-align-justify"
                size={25}
                style={{transform: [{rotate: '90deg'}]}}
                color="#fcfdb1"
              />
              <Text
                style={{
                  color: '#fcfdb1',
                  flex: 1,
                  textAlign: 'center',
                  marginLeft: 5,
                  fontWeight: 'bold',
                }}>
                CÓD. BARRAS
              </Text>
            </View>
          </TouchableOpacity>
          <ContinueButton
            buttonPress={this.snap}
            textInside="Digite o código do seu cupom"
            style={{
              // marginBottom: 20,
              width: width * 0.8,
              // backgroundColor: '#FFF',
              // borderColor: '#FFF',
              borderWidth: 0,
              alignSelf: 'center',
              backgroundColor: 'transparent',
            }}
            textStyle={{color: '#fcfdb1'}}
            // bgWhite
          />
        </View>
      </>
    );
  };

  renderCustomMarker = rotated =>
    rotated ? (
      <View
        style={[
          {
            backgroundColor: 'transparent',
            position: 'absolute',
            alignSelf: 'center',
            // width: width-(width - 180),// (width*2.5),
            // height: width-(width - 180),// (width*2.5),
            minHeight: 150,
            minWidth: 150,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            // borderRightWidth: ((height-(width - 180))/2)+5,
            // borderLeftWidth: ((height-(width - 180))/2)+5,
            borderTopWidth: (width - (width - 180)) / 2 + 5,
            borderBottomWidth: (width - (width - 180)) / 2 + 65,
            // borderRadius: width*1.02,
            borderColor: 'rgba(0, 0, 0, 0.5)',
          },
        ]}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: '#f00',
            maxHeight: 3,
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        />
        {/* <FastImage resizeMode={FastImage.resizeMode.contain}
          source={Images.qrcodeMarker}
          style={{
            height: width - 180,
            width: width - 180,
            minHeight: 200,
            minWidth: 200,
            marginTop: -5,
            marginLeft: -5,
          }}
        /> */}
      </View>
    ) : (
      <View
        style={[
          {
            backgroundColor: 'transparent',
            position: 'absolute',
            alignSelf: 'center',
            // width: width-(width - 180),// (width*2.5),
            // height: width-(width - 180),// (width*2.5),
            minHeight: 200,
            minWidth: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            borderRightWidth: (width - (width - 180)) / 2 + 5,
            borderLeftWidth: (width - (width - 180)) / 2 + 5,
            borderTopWidth: (height - (width - 180)) / 2 + 5,
            borderBottomWidth: (height - (width - 180)) / 2 + 5,
            // borderRadius: width*1.02,
            borderColor: 'rgba(0, 0, 0, 0.5)',
          },
          rotated
            ? {
                borderRightWidth: (height - (width - 180)) / 2 + 5,
                borderLeftWidth: (height - (width - 180)) / 2 + 5,
                borderTopWidth: (width - (width - 180)) / 2 + 5,
                borderBottomWidth: (width - (width - 180)) / 2 + 5,
              }
            : {},
        ]}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={Images.qrcodeMarker}
          style={{
            height: width - 180,
            width: width - 180,
            minHeight: 200,
            minWidth: 200,
            marginTop: -5,
            marginLeft: -5,
          }}
        />
      </View>
    );

  render() {
    const {
      hasCameraPermission,
      loading,
      // hasCameraRollPermission,
      type,
      photo,
      scanned,
      showQrInstructions,
      showCamInstructions,
      hideQrAlways,
      hideCamAlways,
      notShowIcon,
      notShowAgain,
      notShowAgainCheckbox,
      loadingNotShow,
      rotated,
    } = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView
        style={[
          styles.container,
          rotated
            ? {
                width: height,
              }
            : {},
        ]}>
        {/* <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={false} hidden={false} /> */}
        {/* {Platform.OS === 'ios' ? <StatusBar barStyle="light-content" /> : <StatusBar hidden={false} animated translucent backgroundColor="#6853C800" />} */}

        <NavigationEvents
          onDidFocus={payload => {
            console.log('onDidFocus, payload');
          }}
          onWillFocus={payload => {
            this.willFocus(payload);
            this.scanner.reactivate();
            console.log({rotated: this.state.rotated});
            if (this.state.rotated) {
              this.rotate();
            }
            console.log('onWillFocus, payload');
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            alignItems: 'flex-start',
            top: 0,
            left: 0,
            right: 0,
            // height: 200,
            zIndex: 9999999,
            // width,
            backgroundColor: 'transparent',
            // backgroundColor: '#f00',
            paddingTop: rotated ? 0 : 60,
          }}>
          <View
            style={{
              width: width * 0.1,
              marginLeft: 10,
              // backgroundColor: '#f0f',
            }}>
            <TouchableOpacity
              style={{
                width: width * 0.1,
                aspectRatio: 1,
                // alignItems: 'center',
                // justifyContent: 'center',
                // backgroundColor: '#0f0',
              }}
              onPress={() => navigation.navigate('Home')}
              // onPress={() => navigation.navigate('NoteStatus')}
            >
              <Icon name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              flex: 1,
              textAlign: 'center',
              color: '#fff',
            }}>
            {rotated
              ? 'Escaneie o QR Code ou código de barras de sua nota fiscal'
              : 'Escaneie o QR Code\nou código de barras\nde sua nota fiscal'}
          </Text>
          <View
            style={{
              width: width * 0.1,
              marginRight: 10,
              // backgroundColor: '#f0f',
            }}
          />
        </View>
        <QRCodeScanner
          containerStyle={{
            height: rotated ? width : height,
            width: rotated ? height : width,
            alignSelf: 'center',
            borderRadius: 4,
            overflow: 'visible',
            backgroundColor: 'transparent',
          }}
          cameraStyle={{
            height: rotated ? width : height,
            width: rotated ? height : width,
          }}
          cameraProps={{ratio: '1:1'}}
          vibrate={false}
          onRead={scanned ? undefined : this.handleBarCodeScanned}
          reactivate
          ref={node => {
            this.scanner = node;
          }}
          showMarker
          reactivateTimeout={1000}
          customMarker={this.renderCustomMarker(rotated)}
          // flashMode={RNCamera.Constants.FlashMode.torch}
          buttonPositive="Ok"
          permissionDialogTitle="Liberar Camera"
          permissionDialogMessage="Precisamos da permissão da camera"
          // topContent={(
          //   <View style={{
          //     backgroundColor: '#6853C8',
          //     // backgroundColor: '#f00',
          //     width,
          //     height: 40,
          //     position: 'absolute',
          //   }}
          //   >
          //     <FastImage resizeMode={FastImage.resizeMode.contain}
          //       source={Images.logo}
          //       style={{
          //         width: 60, height: 120, resizeMode: 'contain', alignSelf: 'center', marginTop: Platform.OS === 'android' ? -30 : 40, position: 'absolute', zIndex: 999999, top: 30,
          //       }}
          //     />
          //   </View>
          // )}
          bottomContent={this.renderBottomContent()}
        />
        {loading && (
          <LoadingModalComponent rotated={rotated} visible={loading} />
        )}
        {/* <Modal animationType="slide" transparent visible={loading}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.9)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator style={{}} />
            <Text
              style={{
                fontFamily: 'NunitoSans-SemiBold',
                fontSize: metrics.tenWidth * 1.8,
                color: colors.dark,
              }}
            >
              Enviando cupom, aguarde um momento...
            </Text>
          </View>
        </Modal> */}
      </SafeAreaView>
    );
  }
  componentWillUnmount() {
    if (this.state.rotated) {
      this.rotate();
    }
    // this.setState({rotated: false}, () => Orientation.lockToPortrait())
  }
  component;
}

LinksScreen.navigationOptions = ({navigation}) => ({
  // headerLeft: (<BackButton back={navigation} />),
  // headerStyle: {
  //   backgroundColor: 'transparent',
  //   borderBottomWidth: 0,
  //   borderBottomColor: 'transparent',
  // },
  headerBackTitle: ' ',
  headerMode: 'none',
  header: null,
  mode: 'modal',
  tabBarVisible: false,
  gesturesEnabled: true,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: headerHeight,
    // marginTop: -Constants.statusBarHeight,
    backgroundColor: 'transparent',
    position: 'absolute',
    // bottom: -84,
    // height,
    // marginTop: -84,
    zIndex: 99,

    // height,
    // width,
  },
  touch: {
    width: 60,
    height: 60,
    // lineHeight: 60,
    // marginLeft: -60,
    // marginRight: 0,
    // marginRight: -60,
    // alignSelf: 'flex-start',
  },
  text: {
    color: '#22222280',
    lineHeight: 16,
    fontSize: 14,
    letterSpacing: -0.125,
    // fontFamily: 'sfdisplay-regular',
    alignSelf: 'center',
    marginLeft: 0,
  },
});

export default LinksScreen;
