import React, { Component, Fragment } from 'react';
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
// import Timeline from 'react-native-timeline-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';

import moment from 'moment';
import ExtractListComponent from '../components/ExtractListComponent';
// import SnackButtonComponent from '../components/SnackButtonComponent';
import ContinueButton from '../components/ContinueButton';
import 'moment/locale/pt-br';

const { width, height } = Dimensions.get('window');

class ExtractScreen extends Component {
  static navigationOptions = () => ({
    title: 'EXTRATO',
    headerTintColor: '#000000',
    headerBackImage: (
      <Icon
        name="chevron-left"
        size={24}
        style={{
          marginLeft: 16,
        }}
      />
    ),
    headerTitleStyle: {
      color: '#000000',
      fontFamily: 'AvenirNextLTPro-Heavy',
      marginTop: 5,
    },
    headerBackTitleStyle: {
      color: '#000000',
      fontFamily: 'AvenirNextLTPro-Demi',
      fontSize: 14,
      lineHeight: 14,
      marginTop: 5,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      extract: [
        {
          time: '09:00', title: 'Restaurante Fasano 1', description: '24 de novembro de 2019 às 14:13', icon: 'plus', value: '30.000', id: '000',
        },
        {
          time: '10:45', title: 'Restaurante Fasano 2', description: '24 de novembro de 2019 às 14:13', icon: 'plus', value: '30.000', id: '001',
        },
        {
          time: '12:00', title: 'Restaurante Fasano 3', description: '24 de novembro de 2019 às 14:13', icon: 'plus', value: '30.000', id: '002',
        },
        {
          time: '14:00', title: 'Restaurante Fasano 4', description: '24 de novembro de 2019 às 14:13', icon: 'plus', value: '30.000', id: '003',
        },
        {
          time: '16:30', title: 'Restaurante Fasano 5', description: '24 de novembro de 2019 às 14:13', icon: 'plus', value: '30.000', id: '004',
        },
      ],
      filterArr: [
        {
          timeTitle: '7 dias', days: 7,
        },
        {
          timeTitle: '15 dias', days: 15,
        },
        {
          timeTitle: '1 mês', days: 30,
        },
        {
          timeTitle: '3 meses', days: 90,
        },
        {
          timeTitle: '6 meses', days: 180,
        },
        {
          timeTitle: '1 ano', days: 365,
        },
      ],
      selection: 3,
      today: null,
      period: [],
      loadingList: false,
      loading: false,
      refreshing: true,
      page: 0,
      count: 0,
      hideViewMore: false,
    };
  }

  componentWillMount = async () => {
    StatusBar.setBarStyle('light-content', true);
    const today = moment().format('YYYY-MM-DD');
    this.setState({
      today,
    });
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    await this.filterSelected(3);
  }

  async componentWillUnmount() {
    StatusBar.setBarStyle('light-content', true);
  }

  filterSelected = async (sel) => {
    const { filterArr, today } = this.state;
    console.log(sel);
    this.setState({
      selection: sel,
      period: [],
      refreshing: true,
      hideViewMore: false,
    });
    const pag = 1;
    const tMinusDay = moment(today).subtract(filterArr[sel].days, 'd').format('YYYY-MM-DD');
    this.setState({
      fromDate: tMinusDay,
    });
    console.log('records', records);
    return this.setState({
      period: records,
      refreshing: false,
      page: pag,
      hideViewMore: records.length < 10,
    });
  }

  // discoverQty = async (tMinusDay, today) => {
  //   const { count } = await this.apiCall(tMinusDay, today, 1, 1);
  //   console.log('countrecords', count);
  //   return this.setState({
  //     count,
  //   });
  // }

  moreItems = async () => {
    const {
      fromDate, today, page, period, count,
    } = this.state;
    console.log('recordscount', count);
    const pag = page + 1;
    console.log('recordspag', pag);
    this.setState({
      loading: true,
    });
    const records = await this.apiCall(fromDate, today, 10, pag);
    return this.setState({
      page: pag,
      period: [...period, ...records],
      loading: false,
      hideViewMore: records.length < 10,
    });
  }

  render() {
    const {
      extract, filterArr, selection, period, loadingList, refreshing, loading, hideViewMore,
    } = this.state;

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
        <StatusBar backgroundColor="#000000" barStyle="dark-content" />
        <View style={{ flex: 1, backgroundColor: '#00000000', height: height + 100 }}>
          <View style={{
            height: 50, backgroundColor: '#FFFFFF', overflow: 'visible', marginTop: 14, borderBottomWidth: 0.5, borderBottomColor: '#000000',
          }}
          >
            <ScrollView
              horizontal
              bounces={false}
              style={{
                maxHeight: 90, flexDirection: 'row', width: 'auto', paddingTop: 0, backgroundColor: '#FFFFFF', overflow: 'hidden', marginTop: -6, marginBottom: 0,
              }}
            >
              {/* {filterArr.map((item, index) => (
                <SnackButtonComponent filter={item} select={async (sel) => { await this.filterSelected(sel); }} ind={index} selected={selection} key={() => index.toString()} />
              ))} */}
            </ScrollView>
            <View style={{
              height: 0.5, width, backgroundColor: '#00000060', top: 38.5, position: 'absolute',
            }}
            />
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={async () => { await this.filterSelected(selection); }} />
            }
            style={{ backgroundColor: '#FFFFFF', marginTop: -11 }}
          >
            {!!period && period.length > 0 && (
              <View>
                {period.map((item, index) => (
                  <ExtractListComponent data={item} key={() => index.toString()} />
                ))}
                {loading && (
                  <ActivityIndicator size="large" color="#000000" style={{ marginTop: 30, marginBottom: 0 }} />
                )}
                {!hideViewMore && false && (
                  <ContinueButton
                    textInside="VER MAIS"
                    bgWhite
                    smallBtn
                    style={{
                      width: width * 0.3, height: 32, marginTop: 30, marginBottom: 80,
                    }}
                    buttonPress={async () => this.moreItems()}
                  />
                )}
              </View>
            )}
            {(!period || period.length === 0) && !refreshing && (
              <Text style={{ alignSelf: 'center', marginTop: height * 0.4, fontFamily: 'AvenirNextLTPro-Bold' }}>
                Sem transações neste período
              </Text>
            )}
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  welcomeImage: {
    width: 0.5 * width,
    height: 32,
    maxWidth: 323,
    maxHeight: 135,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    opacity: 1,
    // marginLeft: -10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF00',
    // padding: 12,
    // marginTop: 20,
  },
  homeView: {
    // borderWidth: 0.5,
    flex: 1,
    marginTop: Platform.OS === 'android' ? -10 : -10,
    // paddingTop: 30,
    // position: 'absolute',
    zIndex: 99,
    alignSelf: 'center',
  },
  balanceContainer: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
    padding: 10,
    paddingTop: 30,
    backgroundColor: '#FFFFFF',
    borderColor: '#979797',
    borderWidth: 0,
    borderRadius: 1,
    // borderWidth: 0.5,
    height: 260,
    width: width - 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  redeemButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  redeemView: {
    padding: 18,
    height: 60,
    width: width - 40,
    backgroundColor: '#FFFFFF',
    borderColor: '#dddddd',
    borderWidth: 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  redeemTxt: {
    textAlign: 'center',
    letterSpacing: 0,
    fontSize: 24,
    lineHeight: 24,
    fontFamily: 'AvenirNextLTPro-Heavy',
    color: '#000000',
    alignSelf: 'center',
    justifyContent: 'center',
    letterSpacing: 4,
    marginTop: 3,
  },
  balanceTitle: {
    textAlign: 'center',
    // letterSpacing: -1,
    fontSize: 24,
    fontFamily: 'AvenirNextLTPro-UltLtCn',
  },
  totalBalance: {
    textAlign: 'center',
    letterSpacing: 1,
    fontSize: 36,
    lineHeight: 38,
    fontFamily: 'AvenirNextLTPro-HeavyCn',
    marginTop: 12,
    // marginBottom: -8,
    color: '#000',
  },
  pointsTxt: {
    marginTop: -8,
    textAlign: 'center',
    letterSpacing: 0,
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'AvenirNextLTPro-Demi',
    color: '#5E5E5E',
    // marginTop: 30,
  },
  underlinedButton: {
    textAlign: 'center',
    letterSpacing: 0,
    fontSize: 15,
    fontFamily: 'AvenirNextLTPro-Cn',
    color: '#888888',
    textDecorationLine: 'underline',
    // marginTop: 30,
  },
  bgContainer: {
    // marginTop: 30,
    // paddingTop: 30,
    backgroundColor: '#000000',
    height: 200,
    width,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },

});

export default ExtractScreen;
