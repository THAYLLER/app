/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */

// import { Asset } from 'expo-asset';
// import * as Font from 'expo-font';
import React, {useEffect, useState} from 'react';
import {
  Platform, StatusBar, StyleSheet, View, Text, LogBox, ActivityIndicator, ImageBackground, Dimensions, AppState
} from 'react-native';
import Icon from 'react-native-vector-icons';
// import * as SplashScreen from 'expo-splash-screen';
import SplashScreen from 'react-native-splash-screen';
import { request, RESULTS, PERMISSIONS } from 'react-native-permissions'
import OneSignal from 'react-native-onesignal';

// import {
//   useFonts,
//   Rubik-Light,
//   Rubik-Regular,
//   Rubik-Medium,
//   Rubik-Bold,
//   Rubik_900Black,
// } from '@expo-google-fonts/rubik';
// import * as Facebook from 'expo-facebook';

import ModalEndApp from './src/components/ModalEndApp';
import firebase from '@react-native-firebase/app';
import appsFlyer from 'react-native-appsflyer';
import PushNotification, {Importance} from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios'

import AppNavigator from './src/navigation/AppNavigator';
import Images from './src/constants/Images';

const { width, height } = Dimensions.get('screen');

// react-native-permissions
import Permissao from './src/components/rn-permissions'
import EncryptedStorage from 'react-native-encrypted-storage';
//Push Notification

// Settings.initializeSDK();
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: "local", // (required)
    channelName: "Local", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("c7bb7220-1907-4935-bf45-c531029f124c" );
//END OneSignal Init Code

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log("Prompt response:", response);
});

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log("notification: ", notification);
  const data = notification.additionalData
  console.log("additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log("OneSignal: notification opened:", notification);
});

// OneSignal.setLocationShared(false)

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isReady: false,
      // promFinishFirst: false,
      // promFinishSecond: false,
    };
  }

  async componentDidMount() {
    // console.disableYellowBox = true; // NOTE: DISABLE YELLOW WARNINGS
    // LogBox.ignoreAllLogs();
    // SplashScreen.show();

    // const credentials = {
    //   appId: '1:865458366023:android:146dd1f3543feafcc33362',
    //   apiKey: 'AIzaSyAH2W_St5BBbLbjbwOsnioPr5MzEMLPXoo',
    //   databaseURL: 'https://cicloo.firebaseio.com',
    //   storageBucket: 'cicloo.appspot.com',
    //   messagingSenderId: '92970969246',
    //   projectId: 'cicloo',
    // };

    // console.log(`firebase ${firebase.apps.length}`);

    // if (firebase.apps.length <= 1) {
    //   firebase.initializeApp(credentials);
    // }

    // EncryptedStorage.getAllKeys((error, keys) => console.log({keys}))
    // if(! await EncryptedStorage.getItem('clearedLocalStorage')){
    //   await EncryptedStorage.clear()
    //   await EncryptedStorage.setItem('clearedLocalStorage', 'true')
    // }
    firebase.app();

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    if (Platform.OS === 'ios') StatusBar.setBarStyle('light-content');
    
    // this.initFacebook();
    //requestPermissionTransparency

    console.log('requesting transparency')
    const listener = AppState.addEventListener('change', this.requestPermissionsIos);
    if(AppState.currentState == 'active')
    this.requestPermissionsIos('active')
    if(Platform.OS === 'android') {
      console.log('granted android')
      await firebase.analytics().setAnalyticsCollectionEnabled(true);
      this.initAppsFlyer();  
    }
  }
  requestPermissionsIos = async (status) => {
    console.log({status})
    if (Platform.OS === 'ios' && status === 'active') {
      let result = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
      // request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
      //   .then(async (result) => {
      console.log({'result transparency': result})
      if (result === RESULTS.GRANTED) {
        console.log('granted')
        await firebase.analytics().setAnalyticsCollectionEnabled(true);
        this.initAppsFlyer();  
      } else {
        await firebase.analytics().setAnalyticsCollectionEnabled(false)
      }
        // })
        // .catch((error) => console.log(error));
    }
  }
	async store(name, data) {
		try {
			console.log({'storing name': name,'storing data': data})
			return EncryptedStorage.setItem(name, data);
		} catch (error) {
			return Alert.alert(`Ocorreu um erro no efetuar o save: ${error}`);
		}
	}
  initAppsFlyer = () => {
    // const config = {
    //   apiKey: 'AIzaSyAH2W_St5BBbLbjbwOsnioPr5MzEMLPXoo',
    //   authDomain: 'https://cicloo.firebaseio.com',
    //   projectId: 'cicloo',
    //   storageBucket: 'cicloo.appspot.com',
    //   messagingSenderId: '92970969246',
    //   appId: '1:865458366023:android:146dd1f3543feafcc33362',
    // };
    appsFlyer.initSdk(
      {
        devKey: 'E4MJMvQRwpM4ezweqDaThD',
        isDebug: true,
        appId: '1536280871',
        onInstallConversionDataListener: true,
      },
      (result) => {
        console.log(result);
      },
      (error) => {
        console.error(error);
      },
    );
  }

  initFacebook = () => {
    const appId = '286894150089591';
    // const { appId } = Constants.manifest.extra.facebook;
    // return Facebook.initializeAsync({ appId });
  }

  // _loadResourcesAsync = async () => Promise.all([
  //   Asset.loadAsync([
  //     Images.icon,
  //     Images.logo,
  //     Images.logoPurple,
  //     Images.splash,
  //     Images.loadingImg,
  //     Images.loginImg,
  //     Images.onboarding.one,
  //     Images.onboarding.two,
  //     Images.onboarding.three,
  //     Images.onboarding.four,
  //     Images.menuBg,
  //     Images.sentNote,
  //   ]),
  //   Font.loadAsync({
  //     // This is the font that we are using for our tab bar
  //     ...Icon.MaterialCommunityIcons.font,
  //     ...Icon.MaterialIcons.font,
  //     ...Icon.EvilIcons.font,
  //     ...Icon.AntDesign.font,
  //     Rubik-Light,
  //     Rubik-Regular,
  //     Rubik-Medium,
  //     Rubik-Bold,
  //     Rubik_900Black,
  //     'Cormorant-Light': require('./assets/fonts/Cormorant-Light.ttf'),
  //     'Cormorant-Bold': require('./assets/fonts/Cormorant-Bold.ttf'),
  //     'Nunito-Light': require('./assets/fonts/Nunito/Light.ttf'),
  //     'Nunito-ExtraLight': require('./assets/fonts/Nunito/ExtraLight.ttf'),
  //     'Nunito-SemiBold': require('./assets/fonts/Nunito/SemiBold.ttf'),
  //     'Nunito-ExtraBold': require('./assets/fonts/Nunito/ExtraBold.ttf'),
  //     'Nunito-Bold': require('./assets/fonts/Nunito/Bold.ttf'),
  //     'Nunito-Black': require('./assets/fonts/Nunito/Black.ttf'),
  //     'Nunito-Regular': require('./assets/fonts/Nunito/Regular.ttf'),
  //     'NunitoSans-Light': require('./assets/fonts/NunitoSans/Light.ttf'),
  //     'NunitoSans-ExtraLight': require('./assets/fonts/NunitoSans/ExtraLight.ttf'),
  //     'NunitoSans-SemiBold': require('./assets/fonts/NunitoSans/SemiBold.ttf'),
  //     'NunitoSans-ExtraBold': require('./assets/fonts/NunitoSans/ExtraBold.ttf'),
  //     'NunitoSans-Bold': require('./assets/fonts/NunitoSans/Bold.ttf'),
  //     'NunitoSans-Black': require('./assets/fonts/NunitoSans/Black.ttf'),
  //     'NunitoSans-Regular': require('./assets/fonts/NunitoSans/Regular.ttf'),
  //     'AvenirNextLTPro-Bold': require('./assets/fonts/AvenirNextLTPro/Bold.otf'),
  //     'AvenirNextLTPro-BoldCn': require('./assets/fonts/AvenirNextLTPro/BoldCn.otf'),
  //     'AvenirNextLTPro-BoldCnIt': require('./assets/fonts/AvenirNextLTPro/BoldCnIt.otf'),
  //     'AvenirNextLTPro-Cn': require('./assets/fonts/AvenirNextLTPro/Cn.otf'),
  //     'AvenirNextLTPro-CnIt': require('./assets/fonts/AvenirNextLTPro/CnIt.otf'),
  //     'AvenirNextLTPro-Demi': require('./assets/fonts/AvenirNextLTPro/Demi.otf'),
  //     'AvenirNextLTPro-DemiCn': require('./assets/fonts/AvenirNextLTPro/DemiCn.otf'),
  //     'AvenirNextLTPro-DemiCnIt': require('./assets/fonts/AvenirNextLTPro/DemiCnIt.otf'),
  //     'AvenirNextLTPro-DemiIt': require('./assets/fonts/AvenirNextLTPro/DemiIt.otf'),
  //     'AvenirNextLTPro-Heavy': require('./assets/fonts/AvenirNextLTPro/Heavy.otf'),
  //     'AvenirNextLTPro-HeavyCn': require('./assets/fonts/AvenirNextLTPro/HeavyCn.otf'),
  //     'AvenirNextLTPro-HeavyCnIt': require('./assets/fonts/AvenirNextLTPro/HeavyCnIt.otf'),
  //     'AvenirNextLTPro-HeavyIt': require('./assets/fonts/AvenirNextLTPro/HeavyIt.otf'),
  //     'AvenirNextLTPro-It': require('./assets/fonts/AvenirNextLTPro/It.otf'),
  //     'AvenirNextLTPro-MediumCn': require('./assets/fonts/AvenirNextLTPro/MediumCn.otf'),
  //     'AvenirNextLTPro-MediumCnIt': require('./assets/fonts/AvenirNextLTPro/MediumCnIt.otf'),
  //     'AvenirNextLTPro-MediumIt': require('./assets/fonts/AvenirNextLTPro/MediumIt.otf'),
  //     'AvenirNextLTPro-Regular': require('./assets/fonts/AvenirNextLTPro/Regular.otf'),
  //     'AvenirNextLTPro-UltLt': require('./assets/fonts/AvenirNextLTPro/UltLt.otf'),
  //     'AvenirNextLTPro-UltLtCn': require('./assets/fonts/AvenirNextLTPro/UltLtCn.otf'),
  //     'AvenirNextLTPro-UltLtCnIt': require('./assets/fonts/AvenirNextLTPro/UltLtCnIt.otf'),
  //     'AvenirNextLTPro-UltLtIt': require('./assets/fonts/AvenirNextLTPro/UltLtIt.otf'),
  //   }),
  // ]).then((res) => {
  //   const { isLoadingComplete } = this.state;
  //   this.setState({ isLoadingComplete: true });
  //   return isLoadingComplete;
  // });

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    const { isLoadingComplete } = this.state;
    if (isLoadingComplete) {
      this.setState({ isReady: true });
      // SplashScreen.hide();
    }
  };

  render() {
    const { isLoadingComplete, isReady } = this.state;
    // const { skipLoadingScreen, } = this.props;

    // if (!isReady) {
    //   return (
    //     <View>
    //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
    //       <ImageBackground
    //         source={Images.splash}
    //         style={{
    //           flex: 1,
    //           resizeMode: 'contain',
    //           width,
    //           height,
    //         }}
    //         // onLoadStart={this._loadResourcesAsync}
    //         onLoadEnd={() => {
    //           this._handleFinishLoading();
    //         }}
    //       >
    //         <View
    //           style={{
    //             flex: 1,
    //             top: height * 0.7,
    //             flexDirection: 'row',
    //             position: 'absolute',
    //             zIndex: 9999,
    //             alignSelf: 'center',
    //             justifyContent: 'space-between',
    //             height: 32,
    //           }}
    //         >
    //           <Text
    //             style={{
    //               color: '#aaaaaa',
    //               alignSelf: 'center',
    //               fontSize: 15,
    //               lineHeight: 18,
    //               marginRight: 10,
    //               fontFamily: 'Rubik-Medium',
    //             }}
    //           >
    //             CARREGANDO
    //           </Text>
    //           <ActivityIndicator color="#dddddd" size="small" style={{ height: 32, width: 32, marginTop: 0 }} />
    //         </View>
    //       </ImageBackground>
    //     </View>
    //   );
    // }

    //   <AppLoading
    //   startAsync={this._loadResourcesAsync}
    //   onError={this._handleLoadingError}
    //   onFinish={() => {
    //     this._handleFinishLoading();
    //   }}
    //   autoHideSplash={false}
    // />
    return (
      <>
        <ModalEndApp isVisible={true} />
        <View style={styles.container}> 
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          {/* {Platform.OS === 'ios' ? <StatusBar barStyle="light-content" /> : <StatusBar hidden={false} animated translucent backgroundColor="#00000000" />} */}
          <AppNavigator />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
