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

import Icon from 'react-native-vector-icons/MaterialIcons';
import Images from '../constants/Images';
import ContinueButton from '../components/ContinueButton';
import SubHeaderComponent from '../components/SubHeaderComponent';
import LoadingModalComponent from '../components/LoadingModalComponent';
import FloatingLabelInput from '../components/FloatingLabelInput';
import BackButton from '../components/BackButtonComponent';
import CiclooService from '../services/CiclooService';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class HelpCodeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    // header: null,
    headerRight: (<BackButton back={navigation} />),
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
    header: ({ goBack }) => ({
      left: (<Icon name="chevron-left" onPress={() => { goBack(); }} />),
    }),
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      code: '',
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    // this.setState({
    //   loading: true,
    // });
  }

  render() {
    const {
      code,
      loading,
    } = this.state;
    const { navigation } = this.props;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#6853C8' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <StatusBar barStyle="light-content" />
          <SubHeaderComponent title="Cadastrar cupom fiscal" />
          <ScrollView style={{
            flex: 1, height, width, padding: 24, backgroundColor: '#FFF',
          }}
          >
            <Text style={{
              fontFamily: 'Rubik-Regular', fontSize: 15, lineHeight: 18, textAlign: 'center', marginTop: 20,
            }}
            >
              Identifique o modelo de seu cupom fiscal abaixo e verifique a localização do código.
            </Text>
            <FastImage resizeMode={FastImage.resizeMode.contain}
              source={Images.cupons}
              style={{
                height: 713, width: 310, alignSelf: 'center', marginVertical: 60,
              }}
            />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

HelpCodeScreen.navigationOptions = {
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
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: {
        elevation: 0,
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

export default HelpCodeScreen;
