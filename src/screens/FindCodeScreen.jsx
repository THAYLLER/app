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
import { NavigationEvents } from 'react-navigation';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import CiclooService from '../services/CiclooService';
import Images from '../constants/Images';
import Formatters from '../utils/Formatters';
import Main from '../utils/Main';
import 'moment/locale/pt-br';
import BackButton from '../components/BackButtonComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class FindCodeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    // header: null,
    headerLeft: (<BackButton back={navigation} />),
    headerBackTitle: ' ',
    tintColor: '#000000',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      collapsedOne: false,
      collapsedTwo: false,
      receipts: [],
      modalVisible: false,
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
  }

  toggleExpanded = (ind) => {
    const {
      collapsedOne, collapsedTwo,
    } = this.state;
    if (ind === 1) {
      return this.setState({ collapsedOne: !collapsedOne, collapsedTwo: false });
    }
    if (ind === 2) {
      return this.setState({ collapsedOne: false, collapsedTwo: !collapsedTwo });
    }
  };

  render() {
    const { navigation } = this.props;
    const {
      collapsed, collapsedOne, collapsedTwo, modalVisible,
    } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* <NavigationEvents
          onWillFocus={async () => {
            await this.loadReceipts();
          }}
        /> */}
        <StatusBar barStyle="light-content" backgroundColor="#6853C8" />
        <SubHeaderComponent title="ONDE ENCONTRO O CÓDIGO?" />
        <ScrollView style={{ height: 1000, width, backgroundColor: '#EDF1F2' }} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={{
            fontFamily: 'Rubik-Regular', fontSize: 15, textAlign: 'center', alignSelf: 'center', marginVertical: 30,
          }}
          >
            {'Identifique o modelo de seu cupom fiscal\nabaixo e verifique a localização do código.'}
          </Text>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.toggleExpanded(1)}>
              <View style={{
                backgroundColor: '#FFF', padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopColor: '#B2B2BFBB', borderBottomColor: '#B2B2BFBB', borderTopWidth: 1, borderBottomWidth: 1, marginTop: -1,
              }}
              >
                <View style={{
                  width: width * 0.8, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center',
                }}
                >
                  <Text style={styles.headerText}>
                    Cupom fiscal eletrônico - SAT
                  </Text>
                </View>
                <Icon name={collapsedOne ? 'chevron-right' : 'chevron-down'} style={{ color: '#2D2D2D' }} size={22} />
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedOne} align="center">
              <View style={[styles.content, { paddingVertical: 20 }]}>
                <FastImage resizeMode={FastImage.resizeMode.contain}
                  source={Images.cupomSat}
                  style={{
                    width, height: 800, resizeMode: 'contain', alignSelf: 'center',
                  }}
                />
              </View>
            </Collapsible>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.toggleExpanded(2)}>
              <View style={{
                backgroundColor: '#FFF', padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopColor: '#B2B2BFBB', borderBottomColor: '#B2B2BFBB', borderTopWidth: 1, borderBottomWidth: 1, marginTop: -1,
              }}
              >
                <View style={{
                  width: width * 0.8, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center',
                }}
                >
                  <Text style={styles.headerText}>
                    NFC-e
                  </Text>
                </View>
                <Icon name={collapsedTwo ? 'chevron-right' : 'chevron-down'} style={{ color: '#2D2D2D' }} size={22} />
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedTwo} align="center">
              <View style={styles.content}>
                <FastImage resizeMode={FastImage.resizeMode.contain}
                  source={Images.cupomNfce}
                  style={{
                    width: width - 50, height: 800, resizeMode: 'contain', alignSelf: 'center',
                  }}
                />
              </View>
            </Collapsible>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

FindCodeScreen.navigationOptions = {
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
  headerBackTitle: ' ',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  headerText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    color: '#2D2D2D',
  },
  content: {
    backgroundColor: '#EDF1F2',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
  },
  openButton: {
    borderRadius: 30,
    padding: 13,
    elevation: 2,
    height: 48,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

});

export default FindCodeScreen;
