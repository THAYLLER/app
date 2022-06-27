import React from 'react';
// import * as Expo from 'expo';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import {
  createStackNavigator,
} from 'react-navigation-stack';
import {Provider} from 'react-redux'
import {
  createStore,
  // applyMiddleware
} from 'redux'
// import ReduxThunk from 'redux-thunk'

import reducers from '../redux/index'//puxa automaticamente o index.js

import DrawerNavigator from './DrawerNavigator';
import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import TermsScreen from '../screens/TermsScreen';
import TermsUpdateScreen from '../screens/TermsUpdateScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignUpBonusScreen from '../screens/SignUpBonusScreen';
import CreatePasswordScreen from '../screens/CreatePasswordScreen';
import Main from '../utils/Main';
import BehaviorService from '../services/BehaviorService';
import Orientation from 'react-native-orientation-locker'

const getActiveRouteName = function (navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};

const SignInStack = createStackNavigator({
  ForgotPassword: ForgotPasswordScreen,
}, {
  mode: 'modal',
  navigationOptions: {
    header: null,
  },
});
const SignUpStack = createStackNavigator({
  SignUp: SignUpScreen,
  CreatePassword: CreatePasswordScreen,
  Terms: TermsScreen,
  SignUpBonus: SignUpBonusScreen,
}, {
  mode: 'card',
  navigationOptions: {
    header: null,
  },
});

export const AuthStack = createStackNavigator({
  Onboarding: OnboardingScreen,
  Welcome: WelcomeScreen,
  TermsUpdate: TermsUpdateScreen,
  SignInStack,
  SignUpStack,
}, {
  mode: 'modal',
  navigationOptions: {
    gestureEnabled: false,
  },
});

export const AuthLoadingStack = createStackNavigator({
  AuthLoading: AuthLoadingScreen,
  // Terms: TermsScreen,
}, {
  initialRouteName: 'AuthLoading',
  mode: 'modal',
  navigationOptions: {
    gestureEnabled: false,
    headerMode: 'none',
    header: null,
  },
});

const SimpleApp = createAppContainer(createSwitchNavigator({
  AuthLoadingStack,
  // Main: {
  //   screen: MainTabNavigator,
  //   path: 'home/',
  // },
  Auth: AuthStack,
  Drawer: DrawerNavigator,
},
{
  initialRouteName: 'AuthLoadingStack',
}));

// const prefix = Linking.makeUrl('/');
// var oldState = null
const MainApp = () => (
	<Provider store={createStore(
    reducers,
    // {},
    // applyMiddleware(ReduxThunk)
  )}>
    <SimpleApp
      // uriPrefix={prefix}
      
      onNavigationStateChange={async (prevState, currentState) => {
        const currentRouteName = getActiveRouteName(currentState);
        const previousRouteName = getActiveRouteName(prevState);
        if (previousRouteName !== currentRouteName && !(currentRouteName.match('Controller'))) {
          // console.log({
          //   screen: currentRouteName,
          //   prevState,
          //   currentState,
          //   // oldState,
          //   currentRouteName,
          //   previousRouteName,
          //   // oldName: getActiveRouteName(oldState)
          // })
          // if(currentRouteName == 'Onboarding')
            // await BehaviorService.start()
          BehaviorService.setOpenedScreens()
          Orientation.lockToPortrait()
          // .then(response => console.log({response}))
          // .catch(error => console.log({error}))
          Main.logScreen(currentRouteName);
        }
        // oldState = {...prevState}
      }}
    />
  </Provider>
);

export default MainApp;
