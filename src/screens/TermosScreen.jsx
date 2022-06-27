import React, { Component } from 'react';
import {
  Animated,
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
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import HTMLView from 'react-native-htmlview';
import Images from '../constants/Images';
import SubHeaderComponent from '../components/SubHeaderComponent';
import LoadingModalComponent from '../components/LoadingModalComponent';
import ContinueButton from '../components/ContinueButton';
import CiclooService from '../services/CiclooService';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class TermsScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      termsData: [],
      haveToAccept: false,
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    const { navigation } = this.props;
    const haveToAccept = navigation.getParam('haveToAccept', false);
    console.log('haveToAccept', haveToAccept);
    this.setState({
      haveToAccept,
    });
    this.loadTerms();
  }

  componentWillUnmount() {
  }

  loadTerms = async () => {
    try {
      const termsData = await CiclooService.GetTerms();
      this.setState({
        termsData,
        loading: false,
      });
      console.log('termsData :>> ', termsData);
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  }

  acceptTerms = async () => {
    const { navigation } = this.props;
    const {
      termsData,
      loading,
    } = this.state;
    const body = {
      regulationId: termsData.id,
    };
    const acceptResponse = await CiclooService.AcceptTerms(body);
    console.log('acceptResponse :>> ', acceptResponse);
    if (acceptResponse.success) {
      navigation.navigate('Home');
    }
  }

  render() {
    const {
      termsData,
      loading,
      haveToAccept,
    } = this.state;
    const { navigation } = this.props;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#6853C8' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <StatusBar barStyle="light-content" />
          <SubHeaderComponent title="Termos de Uso" />
          {/* <ScrollView style={{ flex: 1, padding: 24 }} contentContainerStyle={{ paddingBottom: 40 }}> */}
          <ScrollView style={{ padding: 10 }}>
            <HTMLView value={termsData.description ? termsData.description : 'carregando...'} />
          </ScrollView>
          {/* <WebView
          originWhitelist={['*']}
          source={{ html: `${termsData.description}` }}
          style={{ marginTop: 20, width, height }}
        /> */}
          {/* </ScrollView> */}

          <ContinueButton
            buttonPress={() => {
              if (haveToAccept) {
                return this.acceptTerms();
              }
              return navigation.goBack(null);
            }}
            textInside={haveToAccept ? 'Aceitar' : 'Voltar'}
            style={{ marginTop: 30, bottom: 0 }}
          />
          {loading && (
          <LoadingModalComponent visible={loading} />
          )}
        </SafeAreaView>
      </>
    );
  }
}

TermsScreen.navigationOptions = {
  headerTitle: () => (
    <FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />
  ),
  header: null,
  headerMode: 'none',
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

export default TermsScreen;
