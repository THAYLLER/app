import React from 'react';
import {
  View, SafeAreaView, Dimensions, StatusBar, Platform, SectionList, Alert, Text, StyleSheet, ScrollView, TouchableOpacity, WebView, ImageBackground, Image, ActivityIndicator,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import CiclooService from '../services/CiclooService';
import ModalWebView from '../components/ModalWebView';
import MenuOptionComponent from '../components/MenuOptionComponent';
import LoadingModalComponent from '../components/LoadingModalComponent';
import Images from '../constants/Images';
import Authentication from '../utils/Authentication';
import Main from '../utils/Main';
import Constants from '../constants/Constants';
import FastImage from 'react-native-fast-image';
import EncryptedStorage from 'react-native-encrypted-storage';

const { width, height } = Dimensions.get('window');

const menuItems = [
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
    iconName: 'how',
    text: 'Como funciona',
    path: 'HowItWorks',
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
];

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: null,
      showModal: false,
      participantData: null,
      loading: false,
      showLoading: false,
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    await this.checkEventData();
  }

  async componentWillUnmount() {
    StatusBar.setBarStyle('light-content', true);
  }

  checkEventData = async () => {
    const { balance } = await CiclooService.GetBalance();
    const participantData = await CiclooService.GetParticipantData();
    console.log('balance', balance);
    console.log('participantData', participantData);
    this.setState({
      balance,
      participantData,
      loading: false,
      showLoading: false,
    });
  }

  handleMenuPress = (path, isEdit) => {
    console.log('path', path);
    const { navigation } = this.props;
    const { participantData, loading } = this.state;
    if (isEdit) {
      if (loading) {
        return this.setState({ showLoading: true });
      }
      return navigation.navigate(path, { participantData });
    }
    return navigation.navigate(path);
  }

  render() {
    const {
      balance,
      participantData,
      showLoading,
    } = this.state;
    const { navigation } = this.props;
    StatusBar.setBarStyle('light-content', true);
    return (
      <View style={{ flex: 1, backgroundColor: '#6853C8' }}>
        <NavigationEvents
          onWillFocus={async () => {
            this.setState({ loading: true });
            await this.checkEventData();
          }}
        />
        <StatusBar backgroundColor="#6853C8" barStyle="light-content" translucent={false} hidden={false} />
        <ScrollView style={[styles.container]}>
          <ImageBackground
            source={Images.menuBg}
            style={{
              width, height: width, resizeMode: 'contain', alignItems: 'center', justifyContent: 'flex-end', marginTop: Platform.OS === 'ios' ? 40 : 20,
            }}
          >
            {participantData ? (
              <View style={{
                height: 128, width: 'auto', alignItems: 'center', justifyContent: 'center',
              }}
              >
                <View style={{
                  borderRadius: 64, borderWidth: 4, borderColor: '#FF7A61', marginTop: -(width * 0.4),
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
                  <Text style={{
                    color: '#FFF', fontFamily: 'Rubik-Regular', fontSize: 15, marginTop: 16,
                  }}
                  >
                    Olá,
                    {' '}
                    <Text style={{
                      color: '#FCFDB1', fontFamily: 'Rubik-Bold', fontSize: 15, marginTop: 16,
                    }}
                    >
                      {participantData.firstName}
                    </Text>
                  </Text>
                  <Text style={{
                    color: '#FFF', fontFamily: 'Rubik-Regular', fontSize: 15, marginTop: 4,
                  }}
                  >
                    Você tem
                    {' '}
                    <Text style={{
                      color: '#FCFDB1', fontFamily: 'Rubik-Bold', fontSize: 15, marginTop: 16,
                    }}
                    >
                      {balance && balance > 0 ? ` ${balance} moedas` : '0 moeda' }
                    </Text>
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{
                width, height: 128, justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'center',
              }}
              >
                <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: -30 }} />
              </View>
            )}
          </ImageBackground>
          {menuItems.map((item, index) => (
            <MenuOptionComponent key={() => index.toString()} iconName={item.iconName} text={item.text} onHandle={() => this.handleMenuPress(item.path, item.isEdit)} />
          ))}
          <Text style={{
            color: '#CCCCCC', alignSelf: 'center', fontFamily: 'Rubik-Light', marginVertical: 40, fontSize: 12, letterSpacing: 1,
          }}
          >
            {Constants.appVersion}
          </Text>
          <TouchableOpacity onPress={() => {
            Main.logEventLogout();
            Authentication.onSignOut().then(() => navigation.navigate('Welcome'));
          }}
          >
            <View style={{
              backgroundColor: '#6853C8', width: width + 4, height: 50, marginTop: 0, marginBottom: 80, justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF40', alignSelf: 'center',
            }}
            >
              <Text style={{
                color: '#FFFFFFBB', alignSelf: 'center', fontFamily: 'Rubik-Medium', letterSpacing: 1, fontSize: 11,
              }}
              >
                {'Encerrar sessão'.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        {showLoading && (
          <LoadingModalComponent visible={showLoading} />
        )}
      </View>
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'MENU',
  header: null,
  headerMode: 'none',
  headerBackTitle: ' ',
  headerTitleStyle: {
    color: '#FFF',
    fontFamily: 'Rubik-Bold',
  },
  headerStyle: {
    // height: 102,
    backgroundColor: '#6853C8',
    ...Platform.select({
      ios: {
        shadowColor: '#2e2e2e',
        shadowOffset: { height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
};

const styles = StyleSheet.create({
  ItemContainer: {
    justifyContent: 'center',
    paddingTop: 40,
    // flex: 1,
    // paddingTop: (Platform.OS === 'ios' ? 20 : 0),
    // height: 'auto',
    // marginVertical: 8,
  },
  HeaderContainer: {
    justifyContent: 'flex-end',
    // flex: 1,
    // borderBottomColor: '#999999',
    // borderBottomWidth: 2,
    // paddingTop: (Platform.OS === 'ios' ? 2 : 0),
    // height: 'auto',
    // marginVertical: 8,
  },
  rowViewContainer: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  header_style: {
    width: '100%',
    height: 45,
    backgroundColor: '#E91E63',
  },
});

export default SettingsScreen;
