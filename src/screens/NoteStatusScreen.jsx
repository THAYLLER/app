import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

import Images from '../constants/Images';
import ContinueButton from '../components/ContinueButton';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class NoteStatusScreen extends Component {
  static navigationOptions = () => ({
    header: null,
    headerMode: 'none',
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  async componentDidMount() {
    StatusBar.setBarStyle('dark-content', true);
    // this.loadFaqs();
  }

  goToCoupons = () => {
    const { navigation } = this.props;
    const resetAction = StackActions.popToTop({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: 'LinksScreen' }),
      ],
    });
    navigation.dispatch(resetAction);
    navigation.navigate('ExtractCoupon');
  }

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={{ flex: 1 }}
          // contentContainerStyle={{
          //   paddingBottom: 40,
          //   // justifyContent: 'space-between',
          //   // height: height - 152,
          //   flex: 1,
          // }}
        >
          <FastImage resizeMode={FastImage.resizeMode.contain}
            source={Images.logoPurple}
            style={{
              width: 75, height: 17.5, alignSelf: 'center', marginTop: 30,
            }}
          />
          <FastImage resizeMode={FastImage.resizeMode.contain}
            source={Images.sentNote}
            style={{
              width, height: width, marginTop: 20, marginBottom: 30, resizeMode: 'contain',
            }}
          />
          <Text style={{
            fontFamily: 'Rubik-Bold', fontSize: 25, lineHeight: 30, color: '#6853C8', alignSelf: 'center', textAlign: 'center',
          }}
          >
            {'Obrigado\npor participar!'}
          </Text>
          <Text style={{
            fontFamily: 'Rubik-Regular', fontSize: 15, lineHeight: 16, color: '#2D2D2D', alignSelf: 'center', textAlign: 'center', marginTop: 12, marginBottom: 36, width: width * 0.86,
          }}
          >
            {'Aguarde a validação do seu cupom fiscal para\nreceber suas '}
            
          <Text style={{
            fontFamily: 'Rubik-Regular', fontSize: 15, lineHeight: 16, color: '#2D2D2D', fontWeight: 'bold'
          }}
          >moedas</Text>
            {'. Com elas, você pode\nresgatar descontos e doações.'}
          </Text>
          <View style={{ paddingBottom: 30, bottom: 0 }}>
            <ContinueButton
              buttonPress={this.goToCoupons}
              textInside="Acompanhar cupons fiscais"
              style={{
                marginBottom: 10,
                width: width * 0.9,
                backgroundColor: '#FFF',
                borderColor: '#6853C8',
                alignSelf: 'center',
              }}
              bgWhite
            />
            <ContinueButton
              buttonPress={() => navigation.navigate('LinksScreen')}
              textInside="Voltar para tela inicial"
              style={{
                width: width * 0.9,
                alignSelf: 'center',
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

NoteStatusScreen.navigationOptions = {
  headerTitle: () => (
    <FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />
  ),
  headerBackTitle: 'Voltar',
  headerStyle: {
    backgroundColor: '#6853C8',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: {
        elevation: 5,
      },
    }),
    borderBottomWidth: 0,
  },
  headerTintColor: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
});

export default NoteStatusScreen;
