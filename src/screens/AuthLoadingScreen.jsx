import React from 'react';
import {
  Alert,
  StatusBar,
  Text,
  View,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import Images from '../constants/Images';
import Constants from '../constants/Constants';
import CiclooService from '../services/CiclooService';
import Authentication from '../utils/Authentication';
import api from '../services/ApiService';
import inovaApi from '../services/InovaApiService';
import BehaviorService from '../services/BehaviorService';

const { width, height } = Dimensions.get('window');

export default class AuthLoadingScreen extends React.Component {
  static navigationOptions = () => ({
    gestureEnabled: false,
    headerMode: 'none',
    header: null,
  });

  constructor(props) {
    super(props);

    this.navigateToAuthStack = this.navigateToAuthStack.bind(this);
    this.navigateToAppStack = this.navigateToAppStack.bind(this);
    this.state = {
      token: null,
      mounted: true,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    try {
      await BehaviorService.start()
      const token = await Authentication.getToken();
      const { navigation } = this.props;
      
      console.log('token', token);
      // if (!token) {
      //   this.navigateToAuthStack();
      // }
      console.log(`token->`, token)
      if (token) {
        inovaApi.defaults.headers.Authorization = `bearer ${token}`;
      }

      this.setState({ token });

      const result = await CiclooService.CheckTermsAccepted();
      console.log({result})
      if(!result?.accepted.accepted) {
        console.log("not accepted")
        if(result?.data && result?.data?.response?.status == 401) return;
          return navigation.navigate('TermsUpdate');
      }
    } catch (err) {
      if(err?.response?.status != 401)
        Alert.alert(err.message);
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  async componentDidUpdate (prevProps, prevState) {
    const {
      token,
      mounted,
    } = this.state;
    const { navigation } = this.props;
    console.log('componentDidUpdate:', 
    {
      token,
      mounted,
    })
    if (mounted) {
      if (token !== prevState.token) {
        if (token) {
          try {
            console.log('token', token);
            //const update = false;

            let update = await this.checkUpdate();
            update === undefined ? false : update;

            console.log('update :>> ', update);
            if (update) {
              const appUrl = Platform.OS === 'android' ? 'https://play.google.com/store/apps/details?id=br.com.devpartner.unilever' : 'https://apps.apple.com/us/app/cicloo/id1536280871';
              console.log('appUrl:', appUrl);
              return Alert.alert(
                'Atualize o aplicativo',
                'Você precisa atualizar o aplicativo para continuar',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      Linking.openURL(appUrl);
                    },
                  },
                ],
                { cancelable: false },
              );
            }
            this.navigateToAppStack();
          } catch (err) {
            console.log(err);
          }
        } else {
          Authentication.onSignOut().then(() => this.navigateToAuthStack());
        }
      } else {
        Authentication.onSignOut().then(() => this.navigateToAuthStack());
      }
    }
  }

  

  loadTerms = async () => {
    try {
      const termsData = await CiclooService.GetTerms();
      console.log('termsData :>> ', termsData);
      if (termsData.status === 401) {
        return true;
      }
      return termsData.accepted;
    } catch (error) {
      return true;
    }
  }

  checkUpdate = async () => {
    console.log('checkUpdate');
    try {
      const version = Constants.appVersion;
      console.log('version', version);
      console.log('Platform.OS', Platform.OS);
      let forceUpdate = false;
      forceUpdate = await CiclooService.CheckUpdate(Platform.OS, version);
      console.log('checkUpdate- forceUpdate :>> ', forceUpdate);
      
      if (forceUpdate.status === 401) {
        return true;
      }
      return forceUpdate;
    } catch (error) {
      console.log("checkUpdate- forceUpdate :>> error", error)
      return false;
    }
  }

  isAPromise = (v) => typeof v.then === 'function';

  navigateToAuthStack() {
    const { navigation } = this.props;
    navigation.navigate('Auth');
  }

  async navigateToAppStack() {
    const { mounted } = this.state;
    const { navigation } = this.props;
    navigation.navigate('Home');
  }

  render() {
    return (
      <View>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ImageBackground
          source={Images.splash}
          style={{
            flex: 1,
            resizeMode: 'contain',
            width,
            height,
          }}
        >
          <View
            style={{
              flex: 1,
              top: height * 0.7,
              flexDirection: 'row',
              position: 'absolute',
              zIndex: 9999,
              alignSelf: 'center',
              justifyContent: 'space-between',
              height: 32,
            }}
          >
            <Text
              style={{
                color: '#aaaaaa',
                alignSelf: 'center',
                fontSize: 15,
                lineHeight: 18,
                marginRight: 10,
                fontFamily: 'Rubik-Medium',
              }}
            >
              CARREGANDO
            </Text>
            <ActivityIndicator color="#dddddd" size="small" style={{ height: 32, width: 32, marginTop: 0 }} />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

// export default AuthLoadingScreen;
