import React from 'react';
import {
  View, Platform, Text, LayoutAnimation, SafeAreaView, Image, StatusBar, Dimensions,
} from 'react-native';
import {
  createStackNavigator,
} from 'react-navigation-stack';
import {
  createMaterialTopTabNavigator, createBottomTabNavigator, MaterialTopTabBar,
} from 'react-navigation-tabs';
import FastImage from 'react-native-fast-image';

import * as Animatable from 'react-native-animatable';

// import * as Haptics from 'expo-haptics';

import DrawerNavigator from './DrawerNavigator';
import TabBarIcon from '../components/TabBarIcon';
import MenuButton from '../components/MenuButtonComponent';
import NotificationButton from '../components/NotificationButtonComponent';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import RedemptionScreen from '../screens/RedemptionScreen';
import ExtractCouponScreen from '../screens/ExtractCouponScreen';
import ExtractRedemptionScreen from '../screens/ExtractRedemptionScreen';
import ExtractScreen from '../screens/ExtractScreen';
import StoresScreen from '../screens/StoresScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import LinksScreen from '../screens/LinksScreen';
import CaptureModalScreen from '../screens/CaptureModalScreen';
import NoteStatusScreen from '../screens/NoteStatusScreen';
import InsertCodeScreen from '../screens/InsertCodeScreen';
import HelpCodeScreen from '../screens/HelpCodeScreen';
import FindCodeScreen from '../screens/FindCodeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditPasswordScreen from '../screens/EditPasswordScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import FaqScreen from '../screens/FaqScreen';
import InstitutionsScreen from '../screens/InstitutionsScreen';
import ContactScreen from '../screens/ContactScreen';
import TermosScreen from '../screens/TermosScreen';
import RegisteringScreen from '../screens/RegisteringScreen';
import Main from '../utils/Main';
import analytics from '@react-native-firebase/analytics';
import Images from '../constants/Images';
import {
  OffersIcon, RewardsIcon, QrCodeIcon, ExtractIcon, MenuIcon, HeartIcon, VoucherNewIcon,
} from '../components/svgs';

const { width, height } = Dimensions.get('screen');

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

function visible(nav) {
  let tabBarVisible = false;
  // if (nav.state.index === 0 && nav.state.routeName !== 'Links') {
  if (nav.state.index === 0 && nav.state.routeName !== 'LinksScreen') {
    tabBarVisible = true;
  }
  return tabBarVisible;
}

function SafeAreaMaterialTopTabBar(props) {
  const { title, navigation } = props;
  return (
    <SafeAreaView style={{ backgroundColor: '#6853C8' }}>
      <StatusBar barStyle="light-content" />
      <View style={{
        // alignItems: 'center',
        marginTop: 20, marginBottom: -30, flexDirection: 'row', justifyContent: 'space-between',
      }}
      >
        <MenuButton
          nav={navigation}
          style={{
            alignSelf: 'flex-start',
            width: 60,
          }}
        />
        {!title ? (
          <View style={{
            width: width - 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
          }}
          >
            <FastImage resizeMode={FastImage.resizeMode.contain}
              source={Images.logo}
              style={{
                width: 60, height: 16, resizeMode: 'contain', alignSelf: 'center', marginLeft: -60,
              }}
            />
          </View>
        ) : (
          <View style={{
            width: width - 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
          }}
          >
            <Text style={{
              width: 60, color: '#FFF', fontSize: 15, lineHeight: 16, fontFamily: 'Rubik-Bold', alignSelf: 'center', marginLeft: -60,
            }}
            >
              {title}
            </Text>
          </View>
        )}
        <NotificationButton
          nav={navigation}
          style={{
            alignSelf: 'flex-end',
            width: 60,
          }}
        />
      </View>
      {/* <View style={{ alignItems: 'center', marginTop: 80, marginBottom: -30 }}>
        <Text style={{ fontWeight: '900', color: '#FFF', fontSize: 16 }}>
          {'ofertas'.toUpperCase()}
        </Text>
      </View> */}
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  );
}

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      tabBarVisible: false,
    },
  },
  Stores: {
    screen: StoresScreen,
    navigationOptions: {
      mode: 'modal',
      tabBarVisible: false,
    },
  },
}, {
  mode: 'card',
  tintColor: '#6853C8',
  color: '#6853C8',
});

// HomeStack.navigationOptions = ({ navigation }) => {
//   const tabBarVisible = visible(navigation);
//   return {
//     mode: 'modal',
//     tabBarVisible,
//   };
// };

HomeStack.navigationOptions = ({ navigation }) => {
  const tabBarVisible = visible(navigation);
  return {
    tabBarVisible: true,
    mode: 'modal',
    tabBarLabel: ({ focused }) => (
      <Text style={{
        color: focused ? '#6853C8' : '#CFDCDF', fontSize: 10, marginTop: 2, marginBottom: 3, fontFamily: 'Rubik-Medium', alignSelf: 'center',
      }}
      >
        Ofertas
      </Text>
    ),
    showLabel: true,
    tabBarIcon: ({ focused }) => (
      <>
        <View style={{
          backgroundColor: focused ? '#6853C8' : '#FFF', height: 3, width: '100%', marginTop: -5, marginLeft: -1, marginBottom: 5,
        }}
        />
        <OffersIcon
          color={focused ? '#6853C8' : '#CFDCDF'}
          width={22}
          height={22}
          style={[{
            marginBottom: 0, marginTop: 4,
          }]}
        />
      </>
    ),
    tabBarOnPress: ({ defaultHandler }) => {
      // setTimeout(() => navigation.navigate('Links'), 300);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      defaultHandler();
    },
  };
};

HomeStack.path = '';

const homeTopTabNavigator = createMaterialTopTabNavigator({
  HomeMain: {
    screen: HomeStack,
    navigationOptions: {
      title: 'OFERTAS',
      headerTitleStyle: {
        fontFamily: 'Rubik-Bold',
      },
    },
  },
  // Home: { screen: HomeScreen },
  // Stores: { screen: StoresScreen },
  Favorites: { screen: FavoritesScreen },
}, {
  tabBarComponent: (props) => (<SafeAreaMaterialTopTabBar {...props} title={null} />),
  lazy: true,
  swipeEnabled: false,
  tabBarOptions: {
    swipeEnabled: false,
    showLabel: true,
    style: {
      marginTop: 50,
      backgroundColor: '#6853C8',
      elevation: 0,
      shadowColor: '#00000000',
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    activeTintColor: '#FFFFFF',
    headerMode: 'none',
    mode: 'card',
    // labelStyle: {
    // fontWeight: '600',
    // },
    indicatorStyle: {
      backgroundColor: '#FF7A61',
      height: 5,
    },
  },
});

homeTopTabNavigator.navigationOptions = ({ navigation }) => {
  const tabBarVisible = visible(navigation);
  return {
    tabBarVisible: true,
    mode: 'card',
    tabBarLabel: ({ focused }) => (
      <Text style={{
        color: focused ? '#6853C8' : '#CFDCDF', fontSize: 9, marginTop: 2, marginBottom: 3, fontFamily: 'Rubik-Medium', alignSelf: 'center',
      }}
      >
        Ofertas
      </Text>
    ),
    showLabel: true,
    tabBarIcon: ({ focused }) => (
      <>
        <View style={{
          backgroundColor: focused ? '#6853C8' : '#FFF', height: 3, width: '100%', marginTop: -5, marginLeft: -1, marginBottom: 5,
        }}
        />
        <OffersIcon
          color={focused ? '#6853C8' : '#CFDCDF'}
          width={22}
          height={22}
          style={[{
            marginBottom: 0, marginTop: 4,
          }]}
        />
      </>
    ),
    tabBarOnPress: async ({ defaultHandler }) => {
      await analytics().logEvent('handle_tab_focus', {
        tabFocus: 'offers',
      });
      // setTimeout(() => navigation.navigate('Links'), 300);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      defaultHandler();
    },
  };
};

const RedemptionStack = createStackNavigator({
  Redemption: { screen: RedemptionScreen },
}, {
  mode: 'card',
  tintColor: '#6853C8',
  color: '#6853C8',
});

RedemptionStack.navigationOptions = ({ navigation }) => {
  const tabBarVisible = visible(navigation);
  return {
    mode: 'card',
    tabBarVisible,
    tabBarLabel: ({ focused }) => (
      <Text style={{
        color: focused ? '#6853C8' : '#CFDCDF', fontSize: 9, marginTop: 2, marginBottom: 3, fontFamily: 'Rubik-Medium', alignSelf: 'center',
      }}
      >
        Recompensas
      </Text>
    ),
    showLabel: true,
    tabBarIcon: ({ focused }) => (
      <>
        <View style={{
          backgroundColor: focused ? '#6853C8' : '#FFF', height: 3, width: '100%', marginTop: -5.5, marginLeft: 0, marginBottom: 5.5,
        }}
        />
        <RewardsIcon
          color={focused ? '#6853C8' : '#CFDCDF'}
          width={22}
          height={22}
          style={[{
            marginBottom: 0, marginTop: 4,
          }]}
        />
      </>
    ),
    tabBarOnPress: async ({ defaultHandler }) => {
      await analytics().logEvent('handle_tab_focus', {
        tabFocus: `rewards`,
      });
      // setTimeout(() => navigation.navigate('Links'), 300);
      Main.selectContentRewards();
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      defaultHandler();
    },
  };
};

RedemptionStack.path = '';

const redemptionTopTabNavigator = createMaterialTopTabNavigator({
  Redemption: { screen: RedemptionScreen },
}, {
  tabBarComponent: (props) => (<SafeAreaMaterialTopTabBar {...props} title="Recompensas" />),
  tabBarOptions: {
    showLabel: true,
    style: {
      marginTop: 50,
      backgroundColor: '#6853C8',
    },
    activeTintColor: '#FFFFFF',
    headerMode: 'screen',
    mode: 'card',
    // labelStyle: {
    // fontWeight: '600',
    // },
    indicatorStyle: {
      backgroundColor: '#FF7A61',
      height: 5,
    },
  },
});

redemptionTopTabNavigator.navigationOptions = ({ navigation }) => {
  const tabBarVisible = visible(navigation);
  return {
    tabBarVisible: true,
    // tabBarVisible,
    mode: 'modal',
    tabBarLabel: ({ focused }) => (
      <Text style={{
        color: focused ? '#6853C8' : '#CFDCDF', fontSize: 10, marginTop: 2, marginBottom: 3, fontFamily: 'Rubik-Medium', alignSelf: 'center',
      }}
      >
        Recompensas
      </Text>
    ),
    showLabel: true,
    tabBarIcon: ({ focused }) => (
      <>
        <View style={{
          backgroundColor: focused ? '#6853C8' : '#FFF', height: 3, width: '100%', marginTop: -4, marginLeft: 0, marginBottom: 4,
        }}
        />
        <RewardsIcon
          color={focused ? '#6853C8' : '#CFDCDF'}
          width={22}
          height={22}
          style={[{
            marginBottom: 0, marginTop: 4,
          }]}
        />
      </>
    ),
    tabBarOnPress: ({ defaultHandler }) => {
      // setTimeout(() => navigation.navigate('Links'), 300);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      defaultHandler();
    },
  };
};

// const extractTopTabNavigator = createMaterialTopTabNavigator({
//   ExtractCoupon: { screen: ExtractCouponScreen },
//   ExtractRedemption: { screen: ExtractRedemptionScreen },
// }, {
//   tabBarComponent: (props) => (<SafeAreaMaterialTopTabBar {...props} title="Extrato" />),
//   tabBarOptions: {
//     showLabel: true,
//     style: {
//       marginTop: 50,
//       backgroundColor: '#6853C8',
//       elevation: 0,
//       shadowColor: '#00000000',
//       shadowOffset: { height: 0, width: 0 },
//       shadowOpacity: 0,
//       shadowRadius: 0,
//     },
//     activeTintColor: '#FFFFFF',
//     headerMode: 'screen',
//     mode: 'card',
//     // labelStyle: {
//     // fontWeight: '600',
//     // },
//     indicatorStyle: {
//       backgroundColor: '#FF7A61',
//       height: 5,
//     },
//   },
// });

const ExtractStack = createStackNavigator({
  ExtractCoupon: { screen: ExtractCouponScreen },
  // ExtractRedemption: { screen: ExtractRedemptionScreen },
}, {
  mode: 'card',
  tintColor: '#6853C8',
  color: '#6853C8',
});

ExtractStack.navigationOptions = ({ navigation }) => {
  const tabBarVisible = visible(navigation);
  return {
    tabBarVisible,
    // tabBarVisible,
    mode: 'modal',
    tabBarLabel: ({ focused }) => (
      <Text style={{
        color: focused ? '#6853C8' : '#CFDCDF', fontSize: 9, marginTop: 3, marginBottom: 3, fontFamily: 'Rubik-Medium', alignSelf: 'center',
      }}
      >
        Cupons fiscais
      </Text>
    ),
    showLabel: true,
    tabBarIcon: ({ focused }) => (
      <>
        <View style={{
          backgroundColor: focused ? '#6853C8' : '#FFF', height: 3, width: '100%', marginTop: -5, marginRight: 0, marginBottom: 5,
        }}
        />
        <ExtractIcon
          color={focused ? '#6853C8' : '#CFDCDF'}
          width={24}
          height={22}
          style={[{
            marginBottom: 0, marginTop: 4,
          }]}
        />
      </>
    ),
    tabBarOnPress: async ({ defaultHandler }) => {
      await analytics().logEvent('handle_tab_focus', {
        tabFocus: `tax coupons`,
      });
      // setTimeout(() => navigation.navigate('Links'), 300);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      defaultHandler();
    },
  };
};

ExtractStack.path = '';

const LinksStack = createStackNavigator({
  LinksScreen: {
    screen: LinksScreen,
    navigationOptions: {
      headerMode: 'none',
      header: null,
      mode: 'modal',
      gestureEnabled: true,
      animationEnabled: true,
      swipeEnabled: true,
      tabBarOptions: {
        tabBarVisible: false,
        animationEnabled: true,
      },
    },
  },
  CaptureModal: {
    screen: CaptureModalScreen,
    navigationOptions: {
      headerMode: 'none',
      header: null,
      mode: 'modal',
      gestureEnabled: true,
      animationEnabled: true,
      swipeEnabled: true,
      tabBarOptions: {
        showLabel: false,
        tabBarVisible: false,
        animationEnabled: true,
      },
    },
  },
  NoteStatus: {
    screen: NoteStatusScreen,
    navigationOptions: {
      mode: 'modal',
      headerMode: 'none',
      header: null,
    },
  },
  InsertCode: {
    screen: InsertCodeScreen,
    navigationOptions: {
      mode: 'card',
    },
  },
  HelpCode: { screen: HelpCodeScreen },
  FindCode: { screen: FindCodeScreen },
}, {
  // headerMode: 'none',
  // header: null,
  mode: 'modal',
  gestureEnabled: true,
  animationEnabled: true,
  swipeEnabled: true,
});

LinksStack.navigationOptions = ({ navigation }) => {
  const tabBarVisible = visible(navigation);
  return {
    headerMode: 'none',
    header: null,
    mode: 'modal',
    tabBarVisible: false,
    gestureEnabled: true,
    tabBarLabel: ({ focused }) => (
      <Text style={{
        height: 0,
      }}
      />
    ),
    showLabel: false,
    showIcon: true,
    // animationEnabled: true,
    tabBarIcon: ({ focused }) => (
      <View style={{
        backgroundColor: '#6853C8',
        height: '100%',
        width: width * 0.2, // + 40,
        alignSelf: 'center',
        paddingTop: 8,
        alignItems: 'center',
        marginTop: -5,
        // marginTop: 14,
      }}
      >
        {/* <TabBarIcon focused={focused} name="camera" /> */}
        <QrCodeIcon
          color="#FFF"
          width={23}
          height={23}
          style={[{
            marginBottom: 0, alignSelf: 'center', marginTop: 0, color: '#FFF', opacity: 0.85,
          }]}
        />
        <Text style={{
          color: '#FFF', fontSize: 9, marginTop: 5, marginBottom: 1, fontFamily: 'Rubik-Medium', alignSelf: 'center', textAlign: 'center',
        }}
        >
          Enviar Nota
        </Text>
        <View style={{
          backgroundColor: '#6853C8', width: width * 0.2, height: 80, position: 'absolute', zIndex: 9999999, bottom: -80,
        }}
        />
      </View>
    ),
    tabBarOnPress: ({ defaultHandler }) => {
      console.log('navigation', navigation);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      defaultHandler();
    },
  };
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    ExtractRedemption: { screen: ExtractRedemptionScreen },
  }, {
    initialRouteName: 'ExtractRedemption',
    tabBarOptions: {
      showLabel: true,
    },
  },
);

SettingsStack.navigationOptions = ({ navigation }) => {
  const tabBarVisible = visible(navigation);
  return {
    tabBarVisible,
    tabBarLabel: ({ focused }) => (
      <Text style={{
        color: focused ? '#6853C8' : '#CFDCDF', fontSize: 9, marginTop: 2, marginBottom: 3, fontFamily: 'Rubik-Medium', alignSelf: 'center',
      }}
      >
        Resgates
      </Text>
    ),
    showLabel: true,
    tabBarIcon: ({ focused }) => (
      <>
        <View style={{
          backgroundColor: focused ? '#6853C8' : '#FFF', height: 3, width: '100%', marginTop: -6, marginLeft: 0, marginBottom: 6,
        }}
        />
        <VoucherNewIcon
          color={focused ? '#6853C8' : '#CFDCDF'}
          width={30}
          height={22}
          style={[{
            marginBottom: 0, marginTop: 0,
          }]}
        />
      </>
    ),
    tabBarOnPress: async ({ defaultHandler }) => {
      await analytics().logEvent('handle_tab_focus', {
        tabFocus: `rescues`,
      });
      // setTimeout(() => navigation.navigate('Links'), 300);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      defaultHandler();
    },
  };
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  Home: { screen: HomeStack, path: '/home' },
  Redemption: { screen: RedemptionStack, path: '/redemption' },
  Links: { screen: LinksStack, path: '/links' },
  Settings: { screen: SettingsStack, path: '/settings' },
  Extract: { screen: ExtractStack, path: '/redemption' },
}, {
  initialRouteName: 'Home',
  swipeEnabled: true,
  navigationOptions: {
    mode: 'modal',
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
    LazyLoading: true,
    tabBarVisible: true,
    lazy: true,
    tabBarOptions: {
      scrollEnabled: true,
      animationEnabled: true,
      backgroundColor: '#f0f',
      showLabel: true,
      showIcon: true,
      labelStyle: {
        fontSize: 11,
        marginTop: 0,
        fotWeight: '400',
        lineHeight: 12,
        height: 12,
      },
      statusBarStyle: 'light-content',
      zIndex: 999999,
      // style: {
      //   borderTopWidth: 2,
      //   borderColor: '#F0f',
      //   elevation: 8,
      //   shadowColor: 'black',
      //   shadowOffset: { height: 0, width: 0 },
      //   shadowOpacity: 0.85,
      //   shadowRadius: 2,
      // },
    },
    tabBarOnPress: ({ defaultHandler }) => {
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      defaultHandler();
    },
  },
});

tabNavigator.path = '';

// tabNavigator.navigationOptions = ({ navigation }) => ({
//   animationEnabled: true,
//   backgroundColor: '#4A4A4A',
//   showLabel: false,
//   labelStyle: {
//     fontSize: 11,
//     marginTop: 0,
//     fontWeight: '400',
//     lineHeight: 12,
//     height: 12,
//   },
//   tabStyle: {
//     height: 0, backgroundColor: 'transparent',
//   },
//   statusBarStyle: 'light-content',
//   zIndex: 999999,
// });

export default tabNavigator;
