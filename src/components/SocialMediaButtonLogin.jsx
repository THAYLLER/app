import React, { Component } from 'react';
// import * as Facebook from 'expo-facebook';
// import { LoginManager, AccessToken, LoginButton } from 'react-native-fbsdk';
import { LoginManager, AccessToken, Settings } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-community/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
// import * as Google from 'expo-google-app-auth';
// import * as AppleAuthentication from 'expo-apple-authentication';
// import * as Crypto from 'expo-crypto';
import {
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');
Settings.setAppID('286894150089591');

class SocialMediaButtonLogin extends Component {
  constructor(props) {
    super(props);
    let name = ''
    let color = ''
    switch (props.type) {
      case 'facebook':
        name = 'Facebook',
        color = '#4267B2'
        break;
      case 'google':
        name = 'Google'
        color = '#de5246'
        break;
      case 'apple':
        name = 'Apple'
        color = '#999999'
        break;
      default:
        break;
    }
    this.state = {
      name,
      color
    }
    this.loginWithSocialMedia = this.loginWithSocialMedia.bind(this);
  }

  loginWithSocialMedia = async () => {
    const { type } = this.props;
    try {
      switch (type) {
        case 'facebook':
          this.loginWithFacebook();
          break;
        case 'google':
          this.loginWithGoogle();
          break;
        case 'apple':
          this.loginWithApple();
          break;

        default:
          break;
      }
    } catch ({ message }) {
      console.log(`Login Error: ${message}`);
    }
  };

  loginWithFacebook = async () => {
    const { handleOnPress } = this.props;
    try {
      if (Platform.OS === 'android') {
        LoginManager.setLoginBehavior('web_only');
      }
      const loginData = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (loginData.isCancelled) {
        return Alert.alert(
          'Cancelar autenticação',
          'Você deseja fazer a autenticação com o Facebook?',
          [
            {
              text: 'Não',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Sim',
              onPress: async (res) => {
                // console.log({ res });
                await this.loginWithFacebook();
              },
            },
          ],
        );
      }

      const fbToken = await AccessToken.getCurrentAccessToken();
      console.log('loginData', loginData);
      console.log('fbToken', fbToken);
      // const data = await Facebook.logInWithReadPermissionsAsync({
      //   permissions: ['public_profile', 'email'],
      // });
      // if (data.type === 'success') {
      const response = await fetch(`https://graph.facebook.com/me?fields=id%2Cname%2Cemail%2Cpicture.type%28large%29&access_token=${fbToken.accessToken}`);
      const resp = await response.json();
      const resposta = {
        ...resp,
        token: fbToken.accessToken,
      };
      console.log('resposta-loginWithFacebook', resposta);
      // Alert.alert('Dados do facebook', `${name}\n${email}`);
      let data = {
        id: resposta.id,
        name: resposta.name,
        email: resposta.email,
        picture: resposta.picture?.data?.url,
        accessToken: fbToken.accessToken
      }
      return handleOnPress(data);
      // }
      // console.log('type === cancel');
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  }

  loginWithGoogle = async () => {
    const { handleOnPress } = this.props;
    try {
      if (Platform.OS === 'android') {
        GoogleSignin.configure({
          scopes: ['profile', 'email'],
          webClientId: '611234605196-o70c451a71kv01jhrfvo9nmt7nqi1fhs.apps.googleusercontent.com',
          // iosClientId: '611234605196-7l9f4b0sr4fqq4kh8b9t0h45f69hejic.apps.googleusercontent.com',
          androidClientId: '611234605196-99gdu2u8kuj8b02otdipa2v5dv60git9.apps.googleusercontent.com',
          offlineAccess: true,
        });
      } else {
        GoogleSignin.configure({
          scopes: ['profile', 'email'],
          // webClientId: '611234605196-o70c451a71kv01jhrfvo9nmt7nqi1fhs.apps.googleusercontent.com',
          iosClientId: '611234605196-7l9f4b0sr4fqq4kh8b9t0h45f69hejic.apps.googleusercontent.com',
          // androidClientId: '611234605196-99gdu2u8kuj8b02otdipa2v5dv60git9.apps.googleusercontent.com',
          offlineAccess: false,
        });
      }
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log({'userInfo': userInfo});
      // const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      //   headers: { Authorization: `Bearer ${userInfo.idToken}` },
      // });
      // console.log('userInfoResponse', JSON.stringify(userInfoResponse));
      let data = {
        id: userInfo.user.id,
        name: userInfo.user.name,
        email: userInfo.user.email,
        picture: userInfo.user.photo,
        accessToken: userInfo.idToken
      }
      return handleOnPress(data);
    } catch (error) {
      return console.log('error google', error);
    }
  }

  // loginWithGoogle = async () => {
  //   const { handleOnPress } = this.props;
  //   try {
  //     const response = await Google.logInAsync({
  //       clientId: '611234605196-o70c451a71kv01jhrfvo9nmt7nqi1fhs.apps.googleusercontent.com',
  //       iosClientId: '611234605196-7l9f4b0sr4fqq4kh8b9t0h45f69hejic.apps.googleusercontent.com',
  //       androidClientId: '611234605196-99gdu2u8kuj8b02otdipa2v5dv60git9.apps.googleusercontent.com',
  //       iosStandaloneAppClientId: '611234605196-7l9f4b0sr4fqq4kh8b9t0h45f69hejic.apps.googleusercontent.com',
  //       androidStandaloneAppClientId: '611234605196-99gdu2u8kuj8b02otdipa2v5dv60git9.apps.googleusercontent.com',
  //       // clientId: '611234605196-o70c451a71kv01jhrfvo9nmt7nqi1fhs.apps.googleusercontent.com',
  //       // iosClientId: '611234605196-akt2hecrd2v49imo56u3ndk17ogsfo5f.apps.googleusercontent.com',
  //       // androidClientId: '611234605196-smokd35skle94kji0bdng64g27plb5qb.apps.googleusercontent.com',
  //       // iosStandaloneAppClientId: '611234605196-7l9f4b0sr4fqq4kh8b9t0h45f69hejic.apps.googleusercontent.com',
  //       // androidStandaloneAppClientId: '611234605196-99gdu2u8kuj8b02otdipa2v5dv60git9.apps.googleusercontent.com',
  //       scopes: ['profile', 'email'],
  //     });
  //     console.log('result response', JSON.stringify(response));
  //     console.log('result response', response.type);
  //     if (response.type === 'success') return handleOnPress(response);
  //     // console.log('response.type === response.accessToken', response.type, response.accessToken);
  //     if (response.type === 'success') {
  //       const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
  //         headers: { Authorization: `Bearer ${response.accessToken}` },
  //       });
  //       console.log('userInfoResponse', userInfoResponse);
  //       return handleOnPress(userInfoResponse);
  //     }
  //     console.log('response.type === cancel');
  //     if (response.type !== 'success') {
  //       Alert.alert(
  //         'Cancelar autenticação',
  //         'Você deseja fazer a autenticação com Google?',
  //         [
  //           {
  //             text: 'Não',
  //             onPress: () => console.log('Cancel Pressed'),
  //             style: 'cancel',
  //           },
  //           {
  //             text: 'Sim',
  //             onPress: async (res) => {
  //               // console.log({ res });
  //               await this.loginWithGoogle();
  //             },
  //           },
  //         ],
  //       );
  //     }
  //   } catch ({ message }) {
  //     console.log(`Google Login Error: ${message}`);
  //   }
  // };

  // getRandomString = (length) => {
  //   let result = '';
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   const charactersLength = characters.length;
  //   for (let i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   return result;
  // }

  loginWithApple = async () => {
    const { handleOnPress } = this.props;

    try {
      console.log(`entrou`)
      const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      console.log('appleAuthResponse', appleAuthResponse);
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthResponse.user);
      console.log('credentialState', credentialState);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('appleAuthResponse', appleAuthResponse);
        console.log('credentialState', credentialState);
        let data = {
          id: appleAuthResponse.user,
          name: appleAuthResponse.fullName.givenName,
          email: appleAuthResponse.email,
          accessToken: appleAuthResponse.identityToken
        }        

        // let data = {
        //   id: userInfo.user.id,
        //   name: userInfo.user.name,
        //   email: userInfo.user.email,
        //   picture: userInfo.user.photo,
        //   accessToken: userInfo.idToken
        // }
        console.log('appleAuthResponse', appleAuthResponse);
        console.log('data', data);
        handleOnPress(data);
      }
      // handleOnPress(credential);
    } catch (e) {
      console.log('e', e);
      // if (e.code === 'ERR_CANCELED') {
      //   Alert.alert('credential loginWithApple:ERR_CANCELED', JSON.stringify(e));
      //   // handle that the user canceled the sign-in flow
      // } else {
      //   Alert.alert('credential loginWithApple', JSON.stringify(e));
      //   // handle other errors
      // }
    }
  };

  render() {
    const { type, style } = this.props;
    const color = '#FFFFFF';
    return (
      <TouchableOpacity
        style={[this.props.style]}
        onPress={this.loginWithSocialMedia}
      >
        <View style={{
          // width: 48, 
           height: 48, flexDirection: 'row', borderRadius: 24, borderColor: this.state.color, borderWidth: 3, alignItems: 'center', justifyContent: 'flex-start', marginHorizontal: 5,
        }}
        >
          <Icon name={type} size={16} color={this.state.color} style={{paddingHorizontal: Platform.OS === 'ios' ? 10 : 15}} />
          <Text style={{color: this.state.color, fontWeight: 'bold'}}>{this.state.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  touchableView: {
    // position: 'absolute',
    // zIndex: 1,
    // left: 0,
    height: 50,
    // width: Math.floor(width * 0.40),
    width: Platform.OS === 'ios' ? width * 0.275 : width * 0.425,
    borderRadius: 8,
    // overflow: 'hidden',
    alignSelf: 'center',
    padding: 0,
    // paddingVertical: 0,
    // bottom: height * 0.05 + 50,
    backgroundColor: '#4167b2',
    borderWidth: 5,
    borderColor: '#4167b2',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 3, width: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonFacebook: {
    // backgroundColor: '#FFFFFF',
    // alignSelf: 'center',
    // marginBottom: 60,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: -12,
  },
});

export default SocialMediaButtonLogin;
