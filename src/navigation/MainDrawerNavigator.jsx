import React from 'react';
import { SafeAreaView, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';

import HomeScreen from '../screens/HomeScreen';
import StoresScreen from '../screens/StoresScreen';

const { width, height } = Dimensions.get('screen');

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen },
  Stores: { screen: StoresScreen },
}, {
  mode: 'modal',
  navigationOptions: {
    gestureEnabled: false,
  },
});

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{ flex: 1 }}>
    <DrawerItems {...props} />
  </SafeAreaView>
);

const MainDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      drawerLabel: 'MINHA CONTA',
    },
  },
}, {
  initialRouteName: 'Home',
  swipeEnabled: true,
  contentComponent: CustomDrawerComponent,
  drawerWidth: width * 0.6,
  drawerBackgroundColor: '#1474DE',
  contentOptions: {
    iconContainerStyle: {
      marginHorizontal: 5,
      marginLeft: 16,
    },
    activeBackgroundColor: 'rgba(0,0,0,0.3)',
    inactiveBackgroundColor: '#1474DE',
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
    },
    inactiveLabelStyle: {
      fontWeight: '400',
      opacity: 0.75,
      marginLeft: 12,
      marginTop: height * 0.027,
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

export default MainDrawerNavigator;
