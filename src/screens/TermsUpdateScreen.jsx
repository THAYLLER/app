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

class TermsUpdateScreen extends Component {
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
      regulation: '',
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
  
    this.loadTerms();
  }

  loadTerms = async () => {
    try {
      const termsData = await CiclooService.GetTerms();
      console.log('termsData', termsData)
      this.setState({ regulation: termsData.id });
      this.setState({
        termsData,
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  }

  handleUpdateTerms = async (id) => {
    const { navigation } = this.props;

    const resp = await CiclooService.AcceptTerms({ regulationId: id });
    console.log('participantData-return', resp, id);
    if (resp.success) {
      this.setState({ loading: false });
      navigation.navigate('AuthLoading');
    }
    
    this.setState({ loading: false });
  }

  render() {
    const {
      termsData,
      loading,
    } = this.state;
    const { navigation } = this.props;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#6853C8' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <StatusBar barStyle="light-content" />
          <SubHeaderComponent title="Termos de Uso" />
          {/* <ScrollView style={{ flex: 1, padding: 24 }} contentContainerStyle={{ paddingBottom: 40 }}> */}
          <ScrollView style={{ padding: 20 }}>
            <HTMLView value={termsData.description ? termsData.description : 'carregando...'} />
          </ScrollView>
          {/* <WebView
          originWhitelist={['*']}
          source={{ html: `${termsData.description}` }}
          style={{ marginTop: 20, width, height }}
        /> */}
          {/* </ScrollView> */}

          <ContinueButton
            buttonPress={() => this.handleUpdateTerms(termsData.id)}
            textInside='Aceitar'
            style={{ marginTop: 30, bottom: 15 }}
          />
          {loading && (
          <LoadingModalComponent visible={loading} />
          )}
        </SafeAreaView>
      </>
    );
  }
}

TermsUpdateScreen.navigationOptions = {
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

export default TermsUpdateScreen;
