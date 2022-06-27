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
  FlatList,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import NotificationButton from '../components/NotificationButtonComponent';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import CiclooService from '../services/CiclooService';
import Images from '../constants/Images';
import Formatters from '../utils/Formatters';
import Main from '../utils/Main';
import 'moment/locale/pt-br';
import MenuButton from '../components/MenuButtonComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import ProblemModalComponent from '../components/ProblemModalComponent';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class ExtractCouponScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#000000',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      collapsed: 1000,
      receipts: [],
      page: 1,
      endReached: false,
      modalVisible: false,
    };
  }

  async componentWillMount() {
    this.setState({
      loading: true,
    });
  }
  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    await this.loadReceipts();
  }

  loadReceipts = async () => {
    try {
      let {receipts, page} = this.state
      console.log({receipts})
      let data = {
        pageNumber: page,
        pageSize: 100
      }
console.log(data)
      const items = await CiclooService.GetReceipts(data);
      console.log({items})
      let append = items.data
      receipts = receipts.concat(append)
      console.log({receipts})
      this.setState({
        receipts,
        loading: false,
        page: (append.length == 0) ? page : page+1,
        endReached: append.length == 0
      });
      console.log('receipts :>>>', (this.state.receipts));
    } catch {
      Alert.alert('Por favor, tente novamente mais tarde.', 'A solicitação demorou mais tempo para responder do que o previsto. Por favor, tente novamente mais tarde.')
    }
  }
  
  // loadReceipts = async () => {
  //   const recibos = await CiclooService.GetReceipts();
    
  //   console.log('recibos :>>>', JSON.stringify(recibos));
  //   this.setState({
  //     receipts: recibos.data,
  //     loading: false,
  //   });
  // }

  showStatusName = (authorizationStatus, readingStatus) => {
    let statusName = ''
    if(authorizationStatus == 0 && readingStatus == 4) return 'Reprovada'
    switch(authorizationStatus){
      case 0:
      case '0':
      case 1:
      case '1':
      case 3:
      case '3':
        statusName = 'Aguardando'
        break
      case 2:
      case '2':
        statusName = 'Aprovada'
        break
      case 4:
      case '4':
        statusName = 'Reprovada'
        break
      default:
        statusName = 'Aguardando'
        break
    }
    return statusName
  }

    
  toggleExpanded = (ind) => {
    const { collapsed } = this.state;
    if (ind === collapsed) {
      return this.setState({ collapsed: 1000 });
    }
    this.setState({ collapsed: ind });
  };

  render() {
    const { navigation } = this.props;
    const { collapsed, receipts, modalVisible, loading, endReached } = this.state;
    
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <NavigationEvents
          onWillFocus={async () => {
            await this.loadReceipts();
          }}
        />
        <StatusBar barStyle="light-content" backgroundColor="#6853C8" />
        <SubHeaderComponent title="Cupons fiscais" />
        <FlatList 
          style={{flex: 1, backgroundColor: '#EDF1F2'}}
          data={receipts}
          renderItem={({item, index}) => {
            console.log("receipts-merchant:", item.merchant)
            return (
              <View key={index}>
                <TouchableOpacity onPress={() => this.toggleExpanded(index)}>
                  <View style={{
                    backgroundColor: '#FFF', padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopColor: '#B2B2BFBB', borderBottomColor: '#B2B2BFBB', borderTopWidth: 1, borderBottomWidth: 1, marginTop: -1,
                  }}
                  >
                    <View style={{
                      width: width * 0.8, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center',
                    }}
                    >
                      <Text numberOfLines={1} style={styles.headerText}>
                        {item.merchant !== undefined ? item.merchant.name : `Nota ${receipts.length - index}`}
                      </Text>
                      <View style={{
                        backgroundColor: this.showStatusName(item.authorization.status, item.reading.status) === 'Aprovada' ? '#94FED6' : this.showStatusName(item.authorization.status, item.reading.status) === 'Aguardando' ? '#FCFDB1' : this.showStatusName(item.authorization.status, item.reading.status) === 'Reprovada' ? '#fe9494' :'#FEB87A', alignItems: 'center', marginLeft: 8, borderRadius: 7, height: 14,
                      }}
                      >
                        <Text style={{
                          paddingHorizontal: 8, fontFamily: 'Rubik-Bold', fontSize: 10, color: '#2D2D2D', alignSelf: 'center', lineHeight: 14,
                        }}
                        >
                          {this.showStatusName(item.authorization.status, item.reading.status).toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Icon name={collapsed !== index ? 'chevron-right' : 'chevron-down'} style={{ color: '#2D2D2D' }} size={22} />
                  </View>
                </TouchableOpacity>
                <Collapsible collapsed={collapsed !== index} align="center">
                  <View style={styles.content}>
                    <View style={{ marginBottom: 12 }}>
                      {this.showStatusName(item.authorization.status, item.reading.status) === 'Aguardando' && (
                        <View style={{
                          flexDirection: 'column', padding: 10, justifyContent: 'space-between', marginBottom: 4, alignSelf: 'center',
                        }}
                        >
                          <Text style={{ fontFamily: 'Rubik-Regular', textAlign: 'center', marginBottom: 10 }}>
                            Cupom fiscal aguardando leitura.
                          </Text>
                          <Text style={{ fontFamily: 'Rubik-Bold', textAlign: 'center' }}>
                            A validação pode demorar até 5 dias.
                          </Text>
                        </View>
                      )}
                      {this.showStatusName(item.authorization.status, item.reading.status) === '35' && (
                        <Text style={{
                          fontFamily: 'Rubik-Regular', color: '#FF7A61', textAlign: 'center', width: width * 0.67, alignSelf: 'center',
                        }}
                        >
                          Este cupom fiscal já foi registrado em nosso sistema.
                        </Text>
                      )}
                      {this.showStatusName(item.authorization.status, item.reading.status) === 'Reprovado' && (
                        <View>
                          <Text style={{ fontFamily: 'Rubik-Regular' }}>
                            Infelizmente o seu cupom fiscal foi reprovado.
                          </Text>
                          <Text style={{ fontFamily: 'Rubik-Bold' }}>
                            Confira os possíveis motivos:
                          </Text>
                          <Text style={{
                            fontFamily: 'Rubik-Bold', color: '#FF7A61', lineHeight: 18, marginTop: 6, marginBottom: 10,
                          }}
                          >
                            {'Ele já foi cadastrado no nosso sistema.\nSua compra foi fora do período da promoção.\nO cupom não tem produtos da promoção.'}
                          </Text>
                        </View>
                      )}
                      {this.showStatusName(item.authorization.status, item.reading.status) === 'Aprovada' && (
                        <Text style={{
                          fontFamily: 'Rubik-Regular', color: '#2D2D2D', marginTop: 18, marginBottom: 12, width: width * 0.70,
                        }}
                        >
                          {'Cupom fiscal aprovado.\nVocê ganhou'}
                          <Text style={{ fontFamily: 'Rubik-Bold' }}>
                            {` ${item.authorization.result.benefits[0].stamp.amount} moedas `}
                          </Text>
                          por esta compra.
                        </Text>
                      )}
                      <View style={{
                        borderColor: '#CFDCDF', borderWidth: 1, backgroundColor: '#FFF', padding: 10,
                      }}
                      >
                        {this.showStatusName(item.authorization.status, item.reading.status) !== 'Aguardando' && (
                        <View style={{
                          flexDirection: 'row', padding: 10, justifyContent: 'space-between', marginBottom: 4,
                        }}
                        >
                          <Text style={{ fontFamily: 'Rubik-Regular' }}>
                            {'Envio efetuado em\n'}
                            <Text style={{ fontFamily: 'Rubik-Bold' }}>
                              {`${moment(item.createdDate).format('lll').split(' às ')[0]}`}
                            </Text>
                          </Text>
                          {/* <Text style={{ fontFamily: 'Rubik-Bold' }}>
                            {`${item.items.length === 1 ? '1 item' : `${item.items.length} itens`}` }
                          </Text> */}
                        </View>
                        )}
                        {this.showStatusName(item.authorization.status, item.reading.status) !== 'Aguardando' && item.items && item.items.map((unit) => (
                          <View
                            style={{
                              flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between', marginBottom: 4,
                            }}
                            key={index}
                          >
                            <Text numberOfLines={1} style={{ color: '#8EA7AB', width: width * 0.65 }}>
                              {unit.description}
                            </Text>
                            <Text style={{ color: '#8EA7AB', width: width * 0.25 }}>
                              {`${Formatters.Currency(unit.unitaryValue)}`}
                            </Text>
                          </View>
                        ))}
                        <Text style={{
                          fontFamily: 'Rubik-Regular', color: '#8EA7AB', alignSelf: 'center', marginTop: 12,
                        }}
                        >
                          {`ID: ${item.id}`}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity
                        style={{
                          ...styles.openButton, backgroundColor: '#EDF1F2', borderColor: '#6853C8', borderWidth: 3, width: width - 50, marginTop: 8,
                        }}
                        onPress={() => {
                          Main.logReportProblem();
                          this.setState({
                            modalVisible: true,
                          });
                        }}
                      >
                        <Text style={[styles.textStyle, {
                          color: '#6853C8', fontFamily: 'Rubik-Bold', fontSize: 15, lineHeight: 18, marginTop: -1,
                        }]}
                        >
                          DÚVIDAS FREQUENTES
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Collapsible>
              </View>
            )
          }}
          onEndReachedThreshold={0.5}
          onEndReached={(loading || endReached) ? undefined : this.loadReceipts}
          // ListFooterComponent={(loading
          //   ? <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size='small' color='#6853C8' /></View>
          //   : <View style={{height: 40, backgroundColor: '#EDF1F2'}}/>
          // )}
          ListEmptyComponent={(loading
            ? (
              <View
                style={{
                  alignSelf: 'center',
                  backgroundColor: '#FFFFFF',
                  height,
                  width,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator
                  size="small"
                  style={{ alignSelf: 'center', marginTop: -60 }}
                  animating
                  color="#000000"
                />
              </View>
            )
            : <Text style={{ alignSelf: 'center', marginTop: 50 }}>
              Nenhum cupom fiscal foi enviado.
            </Text>
          )}
        />
        {modalVisible && (
          <ProblemModalComponent
            navigation={navigation}
            modalVisible={modalVisible}
            buttonFunction={(path) => {
              this.setState({
                modalVisible: false,
              });
              navigation.navigate(path);
            }}
            closeModal={() => this.setState({ modalVisible: false })}
          />
        )}
      </SafeAreaView>
    );
  }
}

ExtractCouponScreen.navigationOptions = ({ navigation }) => ({
  headerRight: () => (
    <NotificationButton
      nav={navigation}
      style={{
        alignSelf: 'flex-end',
        width: 60,
      }}
    />
  ),
  headerLeft: () => (
    <MenuButton nav={navigation} />
  ),
  headerTintColor: '#FFFFFF',
  headerTitleAlign: 'center',
  headerTitle: (<FastImage resizeMode={FastImage.resizeMode.contain}
    source={Images.logo}
    style={{
      width: 60, height: 16, resizeMode: 'contain',
    }}
  />),
  headerTitleStyle: { alignSelf: 'center' },
  headerBackTitleStyle: {
    color: '#FFFFFF',
    fontFamily: 'Rubik-Medium',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 6,
  },
  headerBackTitle: ' ',
  headerStyle: {
    backgroundColor: '#6853C8',
    ...Platform.select({
      ios: {
        shadowColor: '#00000000',
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  headerText: {
    flex: 1,
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    color: '#2D2D2D',
  },
  content: {
    padding: 20,
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

export default ExtractCouponScreen;
