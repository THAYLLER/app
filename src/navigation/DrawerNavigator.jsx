import React from 'react';
import {
  Dimensions, View, ScrollView, SafeAreaView, TouchableOpacity
} from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CoinHistoryScreen from '../screens/CoinHistoryScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditPasswordScreen from '../screens/EditPasswordScreen';
// import ExtractRedemptionScreen from '../screens/ExtractRedemptionScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import FaqScreen from '../screens/FaqScreen';
import InstitutionsScreen from '../screens/InstitutionsScreen';
import ContactScreen from '../screens/ContactScreen';
import TermosScreen from '../screens/TermosScreen';
import Marcas from '../screens/Marcas';
import DrawerComponent from '../components/DrawerComponent';

import MainTabNavigator from './MainTabNavigator';

const { height, width } = Dimensions.get('screen');

const editProfileStack = createStackNavigator({
  EditProfileModal: {
    screen: EditProfileScreen,
    navigationOptions: {
      mode: 'modal',
      headerMode: 'none',
    },
  },
});

const editPasswordStack = createStackNavigator({
  EditPasswordModal: {
    screen: EditPasswordScreen,
    navigationOptions: {
      mode: 'modal',
      headerMode: 'none',
    },
  },
});

// const extractRedemptionStack = createStackNavigator({
//   ExtractRedemptionModal: {
//     screen: ExtractRedemptionScreen,
//     navigationOptions: {
//       mode: 'modal',
//       headerMode: 'none',
//     },
//   },
// });

const faqStack = createStackNavigator({
  FaqModal: {
    screen: FaqScreen,
    navigationOptions: {
      mode: 'modal',
      headerMode: 'none',
    },
  },
});

const contactStack = createStackNavigator({
  ContactModal: {
    screen: ContactScreen,
    navigationOptions: {
      mode: 'modal',
      headerMode: 'none',
    },
  },
});

const institutionsStack = createStackNavigator({
  InstitutionsModal: {
    screen: InstitutionsScreen,
    navigationOptions: {
      mode: 'modal',
      headerMode: 'none',
    },
  },
});

const drawerNavigator = createDrawerNavigator({
  Main: {
    screen: MainTabNavigator,
    navigationOptions: {
      drawerLabel: 'Ofertas',
    },
  },
  EditProfile: {
    screen: editProfileStack,
    navigationOptions: {
      drawerLabel: 'Altere seu cadastro',
    },
  },
  EditPassword: {
    screen: editPasswordStack,
    navigationOptions: {
      drawerLabel: 'Altere sua senha',
    },
  },
  // ExtractRedemption: {
  //   screen: extractRedemptionStack,
  //   navigationOptions: {
  //     drawerLabel: 'Vouchers resgatados',
  //   },
  // },
  HowItWorks: {
    screen: HowItWorksScreen,
    navigationOptions: {
      drawerLabel: 'Como funciona',
    },
  },
  Marcas: {
    screen: Marcas,
    navigationOptions: {
      drawerLabel: 'Marcas participantes',
    },
  },
  Notifications: {
    screen: NotificationsScreen,
    navigationOptions: {
      drawerLabel: 'Notificações',
    },
  },
  CoinHistory: {
    screen: CoinHistoryScreen,
    navigationOptions: {
      drawerLabel: 'Extrato',
    },
  },
  Institutions: {
    screen: institutionsStack,
    navigationOptions: {
      drawerLabel: 'Veja as instituições ajudadas',
    },
  },
  Faq: {
    screen: faqStack,
    navigationOptions: {
      drawerLabel: 'Dúvidas frequentes',
    },
  },
  Contact: {
    screen: contactStack,
    navigationOptions: {
      drawerLabel: 'Fale conosco',
    },
  },
  Termos: {
    screen: TermosScreen,
    navigationOptions: {
      drawerLabel: 'Termos de uso',
    },
  },
}, {
  mode: 'modal',
  headerMode: 'none',
  contentComponent: (props) => (
    <SafeAreaView style={{flex: 1, flexDirection: 'row'}}>
      <DrawerComponent {...props} />
      <TouchableOpacity
        style={{width: width * 0.15, height, backgroundColor: "transparent"}}
        onLayout={(e) => console.log({layout: e.nativeEvent.layout})}
        onPress={() => {console.log('pressBack');props.navigation.goBack();}}
      />
    </SafeAreaView>
  ),
  drawerWidth: width, // * 0.85,
  drawerBackgroundColor: 'transparent',
  hideStatusBar: true,
  contentOptions: {
    iconContainerStyle: {
      marginHorizontal: 5,
      marginLeft: 16,
    },
    activeBackgroundColor: 'rgba(0,0,0,0.3)',
    inactiveBackgroundColor: '#6853C8',
    inactiveTintColor: '#FFFFFF',
    activeTintColor: '#FFFFFF',
    activeLabelStyle: {
      fontWeight: '800',
      fontSize: 14,
      width: width * 0.4,
      marginLeft: 12,
      marginRight: 0,
      marginTop: height * 0.027,
      marginBottom: height * 0.027,
      // borderBottomWidth: 0.25,
      // borderBottomColor: 'white',
    },
    inactiveLabelStyle: {
      fontWeight: '400',
      opacity: 0.75,
      marginLeft: 12,
      marginTop: height * 0.027,
      // marginBottom: height*0.027,
      // borderBottomWidth: 0.25,
      fontSize: 13,

    },
    style: {
      flex: 1,
      paddingTop: height * 0.05,
      marginLeft: 0,
      paddingLeft: 0,
    },
  },
});
drawerNavigator.path = '';

export default drawerNavigator;
