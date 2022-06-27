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
import BackButton from '../components/BackButtonComponent';
import CiclooService from '../services/CiclooService';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class FaqScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      faqItems: [],
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    // this.setState({ loading: true });
    await this.loadFaqs();
  }

  loadFaqs = async () => {
    try {
      const faqItems = await CiclooService.GetFaqs();
      this.setState({
        faqItems,
        // loading: false,
      });
      console.log('faqItems :>> ', JSON.stringify(faqItems));
    } catch (error) {
      // this.setState({
      //   loading: false,
      // });
    }
  }

  render() {
    const {
      faqItems,
      loading,
    } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="light-content" />
        <SubHeaderComponent title="Perguntas frequentes" />
        <ScrollView style={{ height: 1000, width, padding: 24 }} contentContainerStyle={{ paddingBottom: 40 }}>
          {faqItems.length > 0 ? faqItems.map((item, index) => (
            <View style={{ marginBottom: 24 }} key={() => index.toString()}>
              <Text style={{
                marginBottom: 8, fontFamily: 'Rubik-Bold', fontSize: 15, lineHeight: 20, color: '#6853C8',
              }}
              >
                {item.description}
              </Text>
              <HTMLView value={item.faqItems[0].description} />
            </View>
          )) : (
            <ActivityIndicator size="small" color="#4a4a4a" style={{ marginTop: 60 }} />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

FaqScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />
  ),
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#6853C8',
    borderBottomWidth: 0,
    shadowOpacity: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  headerTintColor: '#FFFFFF',
  headerLeft: (<BackButton back={navigation} bgWhite />),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },

});

export default FaqScreen;
