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

import Images from '../constants/Images';
import ProductSectionComponent from '../components/ProductSectionComponent';
import { CiclooService } from '../services';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class StoresScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      offers: [],
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    const ofertas = await CiclooService.GetOffers();
    this.setState({
      offers: ofertas,
      loading: false,
    });
  }

  render() {
    const { navigation } = this.props;
    const { offers, loading } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="light-content" />
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <ScrollView style={{ height: 1000, width }} contentContainerStyle={{ paddingBottom: 40 }}>
            {offers.map((item, index) => (
              <ProductSectionComponent sectionTitle={item.categoryName} list={item.data} navigateTo={() => navigation.navigate('Stores', { category: item.categoryId })} doubleCoins={index === 0} key={() => index.toString()} />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

StoresScreen.navigationOptions = {
  title: 'FAVORITOS',
  headerBackTitle: ' ',
  headerTintColor: '#FFFFFF',
  // headerTitleStyle: {
  //   color: '#FFFFFF',
  //   fontFamily: 'Rubik-Bold',
  //   fontSize: 15,
  //   marginTop: 6,
  // },
  headerBackTitleStyle: {
    color: '#FFFFFF',
    fontFamily: 'AvenirNextLTPro-Demi',
    fontSize: 14,
    lineHeight: 14,
    marginTop: 6,
    marginLeft: 16,
  },
  headerTitle: () => (
    <FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />
  ),
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },

});

export default StoresScreen;
