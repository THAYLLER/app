import React from 'react';
import {
  View, Text, Dimensions, SafeAreaView, ScrollView, ImageBackground, ActivityIndicator, Image, Platform, Alert,
} from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import MenuOptionComponent from './MenuOptionComponent';
import Images from '../constants/Images';
import CiclooService from '../services/CiclooService';
import Authentication from '../utils/Authentication';
import Main from '../utils/Main';
import Constants from '../constants/Constants';
import FastImage from 'react-native-fast-image';
import BehaviorService from '../services/BehaviorService';
import analytics from '@react-native-firebase/analytics';

const { width, height } = Dimensions.get('window');

var menuItems = [
  {
    iconName: 'person',
    text: 'Altere seu cadastro',
    path: 'EditProfile',
    isEdit: true,
  },
  {
    iconName: 'lock',
    text: 'Altere sua senha',
    path: 'EditPassword',
    isEdit: true,
  },
  {
    iconName: 'voucher',
    text: 'Vouchers resgatados',
    path: 'ExtractRedemption',
    isEdit: false,
  },
  {
    iconName: 'how',
    text: 'Como funciona',
    path: 'HowItWorks',
    isEdit: false,
  },
  {
    iconName: 'brands',
    text: 'Marcas participantes',
    path: 'Marcas',
    isEdit: false,
  },
  {
    iconName: 'institutions',
    text: 'Veja as instituições ajudadas',
    path: 'Institutions',
    isEdit: false,
  },
  {
    iconName: 'faqs',
    text: 'Dúvidas frequentes',
    path: 'Faq',
    isEdit: false,
  },
  {
    iconName: 'contact',
    text: 'Fale conosco',
    path: 'Contact',
    isEdit: false,
  },
  {
    iconName: 'terms',
    text: 'Termos de uso',
    path: 'Termos',
    isEdit: false,
  },
  {
    iconName: 'logout',
    text: 'Encerrar sessão',
    path: 'logout',
    isEdit: false,
  },
];

class DrawerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: null,
      showModal: false,
      participantData: null,
      loading: false,
      showLoading: false,
      next_expiration: new Date().toLocaleDateString('pt-BR'),
      showFields: null,
    };
  }

  async componentDidMount() {
    await this.checkEventData();
  }

  handleMenuPress = async (path, isEdit) => {
    const { navigation } = this.props;
    const { participantData, loading } = this.state;

    await analytics().logEvent('handle_menu_press', {
      press_path: path,
    });

    if (path === 'logout') {
      Main.logEventLogout();
      BehaviorService.setSignedOut()
      await CiclooService.signOut()
      Authentication.onSignOut().then(() => navigation.navigate('Welcome'));
    }
    console.log(participantData);
    if (!participantData && path === 'EditPassword') {
      return Alert.alert(
        'Carregando informações',
        'Espere suas informações serem carregadas',
        [
          {
            text: 'OK',
            onPress: () => {
              // navigation.goBack(null);
              console.log('Não é possível alterar sua senha');
            },
          },
        ],
        { cancelable: false },
      );
    }
    if (!!participantData && !!participantData.isSocialNetwork && path === 'EditPassword') {
      return Alert.alert(
        'Não é possível alterar sua senha',
        'Você entrou utilizando alguma rede social',
        [
          {
            text: 'OK',
            onPress: () => {
              // navigation.goBack(null);
              console.log('Não é possível alterar sua senha');
            },
          },
        ],
        { cancelable: false },
      );
    }
    // if (isEdit) {
    //   if (loading) {
    //     return this.setState({ showLoading: true });
    //   }
    //   return navigation.navigate(path, { participantData });
    // }
    return navigation.navigate(path);
  }

  checkEventData = async () => {
    const { balance } = await CiclooService.GetBalance();
    const participantData = await CiclooService.GetParticipantData();
    const showFields = await CiclooService.checkShowFields()
    if(showFields?.showExtract)
      menuItems.splice(
        3,
        0,
        {
          iconName: 'history',
          text: 'Extrato de moedas',
          path: 'CoinHistory',
          isEdit: false,
        }
      )
    console.log('balance', balance);
    console.log('participantData', participantData);
    this.setState({
      balance,
      participantData,
      loading: false,
      showLoading: false,
      showFields,
    });
    
    await analytics().logEvent('amount_user_coins', {
      coins: balance
    });
  }

  render() {
    const {
      balance,
      participantData,
      showLoading,
      next_expiration,
      showFields,
    } = this.state;
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, flexDirection: 'row' }}>
        <ScrollView style={{ width: width/** * 0.85 */, backgroundColor: '#6853C8' }} showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={Images.onboarding.bgImpar}
            style={{
              height: width*.75, resizeMode: 'contain', alignItems: 'center', justifyContent: 'flex-end', marginTop: 0,
            }}
          >
            {participantData ? (
              <View style={{
                flex: 1,
                // height: 128,
                width: width*.85,
                alignItems: 'center',
                justifyContent: 'center',
                // marginBottom: 40,
                // backgroundColor: '#f00'
              }}
              >
                <FastImage resizeMode={FastImage.resizeMode.contain}
                  source={Images.logo}
                  style={{
                    width: 75,
                    height: 20,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    position: 'absolute',
                    top: 55,
                    left: -5,
                    transform: [{ rotate: '-90deg' }]
                  }}
                />
                <Text style={{
                  color: '#FFF',
                  fontFamily: 'Rubik-Regular',
                  fontSize: 16,
                  marginBottom: 16,
                }}
                >
                  Olá,
                  {' '}
                  <Text style={{
                    color: '#FCFDB1',
                    fontWeight: 'bold',
                  }}
                  >
                    {participantData.firstName}!
                  </Text>
                </Text>
                <View style={{
                  borderRadius: 64,
                  borderWidth: 4,
                  borderColor: '#FF7A61',
                  // marginTop: -(width * 0.4),
                }}
                >
                  <View style={{ borderRadius: 64, borderWidth: 4, borderColor: '#6853C8' }}>
                    {participantData ? (
                      <FastImage resizeMode={FastImage.resizeMode.contain}
                        source={participantData && participantData.picture ? { uri: participantData.picture } : Images.imgPlaceholder}
                        style={{
                          width: 64, height: 64, borderRadius: 32,
                        }}
                      />
                    ) : (
                      <View style={{
                        width: 64, height: 64, backgroundColor: 'transparent', justifyContent: 'center',
                      }}
                      >
                        <ActivityIndicator size="small" color="#4a4a4a" />
                      </View>
                    )}
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', }}>
                    <Text style={{
                      color: '#FFF', fontFamily: 'Rubik-Regular', fontSize: 30, fontWeight: 'bold'
                    }}
                    >
                      {balance + ' '}
                    </Text>
                    <FastImage resizeMode={FastImage.resizeMode.contain}
                      source={Images.coin}
                      style={{
                        width: 28, height: 28, resizeMode: 'contain',//  marginLeft: 3// , alignSelf: 'center'
                      }}
                    />
                  </View>
                  {(showFields?.showExtract) && 
                  <View>
                    <Text style={{
                      color: '#FFF', fontFamily: 'Rubik-Regular', fontSize: 12, marginTop: 4, textAlign: 'center',
                    }}
                    >
                      Próxima expiração: 
                    </Text>
                    <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FCFDB1', textAlign: 'center',}}>{`${balance} moedas`}
                      <Text style={{fontWeight: 'normal', color: '#fff',}}> em </Text>
                      <Text>{`${next_expiration}`}</Text>
                    </Text>
                  </View>
                  }
                </View>
              </View>
            ) : (
              <View style={{
                width: width * 0.85, height: 128, justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'center',
              }}
              >
                <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: -70 }} />
              </View>
            )}
          </ImageBackground>
          {/* <DrawerItems {...this.props} /> */}
          {menuItems.map((item, index) => (
            <MenuOptionComponent key={item.iconName} iconName={item.iconName} text={item.text} onHandle={() => this.handleMenuPress(item.path, item.isEdit)} last={menuItems.length === index + 1} />
          ))}
          <Text style={{
            color: '#CCCCCC', alignSelf: 'flex-start', fontFamily: 'Rubik-Light', marginVertical: 30, fontSize: 12, letterSpacing: 1, paddingHorizontal: 20,
          }}
          >
            {`versão ${Constants.appVersion}`}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default DrawerComponent;
