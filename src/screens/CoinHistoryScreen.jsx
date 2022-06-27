import React, { Component, StatusBar } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SectionList,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import MenuButton from '../components/MenuButtonComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import Images from '../constants/Images';
import Accordian from '../components/Accordian'
import CiclooService from '../services/CiclooService';
import { times } from 'underscore';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

class CoinHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      history: [],
      page: 1,
      endReached: false,
      filterType: null,
      startDate: null,
      endDate: null,
      startDateInput: new Date(),
      endDateInput: new Date(),
      balance: 0,
      next_expiration: new Date().toLocaleDateString('pt-BR'),
      modalVisible: false,
      showDatePicker: false,
      date: new Date(),
      dateToSet: '',
    };
  }

  async componentDidMount() {
    // let user = await CiclooService.GetParticipantData()
    await this.loadHistory();
  }

  loadHistory = async () => {
    let { balance } = await CiclooService.GetBalance();
    let {history, page} = this.state
    console.log({history})
    let data = {
      pageNumber: page,
      pageSize: 10
    }
    const items = await CiclooService.getCoinHistory(data);
    console.log({items})
    let append = []
    items.map(item => {
      let i = {}
      i.title = item.group
      i.data = item.items
      append.push(i)
    })
    history = history.concat(append)
    console.log({history})
    this.setState({
      history,
      loading: false,
      page: (append.length == 0) ? page : page+1,
      endReached: append.length == 0,
      balance,
    });
    console.log('history :>>>', (this.state.history));
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
      <MenuButton nav={navigation} />
    ),
    headerTintColor: '#FFFFFF',
    headerTitleAlign: 'center',
    headerTitle: (<FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />),
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
    headerBackTitleStyle: {
      color: '#FFFFFF',
      fontFamily: 'Rubik-Medium',
      fontSize: 11,
      lineHeight: 14,
      marginTop: 6,
    },
    headerBackImage: () => (
      <Icon
        name="chevron-left"
        size={12}
        style={{
          marginLeft: 16,
        }}
      />
    ),
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
    headerTitleStyle: {
      fontFamily: 'Rubik-Bold',
      alignSelf: 'center',
    },
  });

  selectColor = type => (
    type == 1
      ? '#05d284'
      :type == 2
        ? '#5252a0'
        : '#fe7d64'
  )

  selectName = type => (
    type == 1
      ? 'Crédito'
      :type == 2
        ? 'Débito'
        : 'Expiração'
  )

  loadCategory = filterType => this.setState({
    loading: true,
    history: [],
    page: 1,
    endReached: false,
    filterType,
  }, this.loadHistory)

  renderItem = ({item, index}) => (
    <View
      style={{
        padding: 15, 
        // marginVertical: 5, 
        backgroundColor: '#fff', 
        borderLeftColor: this.selectColor(item.type),
        borderLeftWidth: 5,
      }}
    >
        <Text style={{fontSize: 14, fontWeight: 'bold', color: this.selectColor(item.type)}}>{this.selectName(item.type)}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>{item.eventName}</Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: this.selectColor(item.type)}}>{`${item.type != 1 ? '' : '+'}${item.coins} `}
            <FastImage resizeMode={FastImage.resizeMode.contain}
              source={Images.coin}
              style={{
                width: 17, height: 17, resizeMode: 'contain' , marginTop: 2// , alignSelf: 'center'
              }}
            />
          </Text>
        </View>
    </View>
  )

  render() {
    const { navigation } = this.props;
    const { 
      history,
      loading,
      endReached,
      filterType,
      balance,
      next_expiration,
      modalVisible,
      startDateInput,
      endDateInput,
      showDatePicker,
      dateToSet,
      date,
    } = this.state;
    return(
      <SafeAreaView style={{ backgroundColor: '#6853C8', flex: 1 }}>
        <NavigationEvents
          // onWillFocus={async () => {
          //   console.log({'willFocus': true})
          //   this.setState({loading: true})
          //   await this.loadHistory();
          // }}
          onDidFocus={async () => {
            console.log({'didFocus': true})
            let user = await CiclooService.GetParticipantData()
            this.setState({loading: true})
            await this.loadHistory();
          }}
          onWillBlur={async () => {
            console.log({'willBlur': true})
            this.setState({
              page: 1,
              endReached: false,
              history: []
            })
          }}
        />
        <View style={{ height: 60, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack(null);
            }}
            style={{
              top: 16,
              left: 18,
              position: 'absolute',
            }}
          >
            <View>
              <Icon
                name="md-chevron-back-sharp"
                color="#fff"
                size={24}
              />
            </View>
          </TouchableOpacity>
          <View style={{
            width: width - 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
          }}
          >
            <Text style={{
              // width: 60, 
              color: '#FFF',
              fontSize: 18,
              // lineHeight: 16,
              fontFamily: 'Rubik-Bold',
              alignSelf: 'center',
              // marginLeft: -60,
            }}
            >
              Extrato
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.setState({modalVisible: true});
            }}
            style={{
              top: 16,
              right: 18,
              position: 'absolute',
            }}
          >
            <View>
              <FeatherIcon
                name="calendar"
                color="#fff"
                size={24}
              />
            </View>
          </TouchableOpacity>
          {/* <SubHeaderComponent title="Notificações" noForceUpperCase /> */}
        </View>
        <View
          style={{height: 50, width, backgroundColor: '#6853C8', flexDirection: 'row'}}
        >
          <TouchableOpacity
            onPress={() => this.loadCategory(null)}
            style={[styles.categoryStyle, {
              borderBottomColor: (filterType == null) ? '#fe7d64' : '#fff',
            }]}
          >
            <Text style={{color: '#fff'}}>Tudo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.loadCategory(1)}
            style={[styles.categoryStyle, {
              borderBottomColor: (filterType == 1) ? '#fe7d64' : '#fff',
            }]}
          >
            <Text style={{color: '#fff'}}>Crédito</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.loadCategory(2)}
            style={[styles.categoryStyle, {
              borderBottomColor: (filterType == 2) ? '#fe7d64' : '#fff',
            }]}
          >
            <Text style={{color: '#fff'}}>Débito</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.loadCategory(3)}
            style={[styles.categoryStyle, {
              borderBottomColor: (filterType == 3) ? '#fe7d64' : '#fff',
            }]}
          >
            <Text style={{color: '#fff'}}>Expiração</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: width*.07,
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{fontSize: 16 }}>Saldo atual:</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{`${balance} `}
              <FastImage resizeMode={FastImage.resizeMode.contain}
                source={Images.coin}
                style={{
                  width: 19, height: 19, resizeMode: 'contain' , marginTop: 2// , alignSelf: 'center'
                }}
              />
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{fontSize: 14}}>Próxima expiração</Text>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>{`${balance} moedas`}
                <Text style={{fontWeight: 'normal'}}> em </Text>
                <Text>{`${next_expiration}`}</Text>
              </Text>
            </View>
          </View>
        </View>
        <SectionList 
          style={{flex: 1, paddingHorizontal: width*.07, backgroundColor: '#eee'}}
          sections={history}
          data
          renderSectionHeader={({section}) => (
            <View style={{marginVertical: 20}}>
                <Text style={{fontSize: 18}}>{section.title}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{height: 15}} />}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={(loading || endReached) ? undefined : this.loadHistory}
          ListFooterComponent={(loading
            ? <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size='small' color='#6853C8' /></View>
            : <View style={{height: 40, backgroundColor: '#6853C8'}}/>
          )}
        />
        {modalVisible && (
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            this.setState({modalVisible: false})
          }}
        >
          <View style={[styles.centeredView, { alignItems: 'center' }]}>
            <View style={[styles.modalView, { width: width - 50 }]}>
              <Text style={styles.modalText}>{'Escolha um período'.toUpperCase()}</Text>
              <View style={{
                width: width - 50, 
                marginTop: 10, 
                alignItems: 'center',
              }}
              >
                <TouchableOpacity
                  style={styles.inputStyle}
                  onPress={() => this.setState({
                    showDatePicker: true,
                    dateToSet: 'startDateInput',
                    date: startDateInput,
                  })}
                >
                  <Text style={styles.greyText}>INÍCIO</Text>
                  <Text>{startDateInput.toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.inputStyle}
                  onPress={() => this.setState({
                    showDatePicker: true,
                    dateToSet: 'endDateInput',
                    date: endDateInput,
                  })}
                >
                  <Text style={styles.greyText}>TÉRMINO</Text>
                  <Text>{endDateInput.toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  ...styles.openButton, backgroundColor: '#6853C8', width: width - 100, marginTop: 8,
                }}
                onPress={() => this.setState({
                  startDate: startDateInput,
                  endDate: endDateInput,
                  modalVisible: false,
                }, () => this.loadCategory(filterType))}
              >
                <Text style={[styles.textStyle, {
                  color: '#FFF', fontFamily: 'Rubik-Bold', fontSize: 15, lineHeight: 20,
                }]}
                >
                  APLICAR
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.openButton, backgroundColor: '#FFF', borderColor: '#6853C8', borderWidth: 3, width: width - 100, marginTop: 10,
                }}
                onPress={() => {
                  this.setState({ modalVisible: !modalVisible });
                }}
              >
                <Text style={[styles.textStyle, {
                  color: '#6853C8', fontFamily: 'Rubik-Bold', fontSize: 15, lineHeight: 16,
                }]}
                >
                  CANCELAR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        )}
        {showDatePicker && (
          <DateTimePicker
            // testID="dateTimePicker"
            value={date}
            mode='date'
            is24Hour={true}
            display="calendar"
            minimumDate={(dateToSet == 'startDateInput') ? undefined : startDateInput}
            maximumDate={(dateToSet == 'startDateInput') ? endDateInput : new Date()}
            onChange={(event, selectedDate) => {
              if(selectedDate){
                let newDate = {showDatePicker: false}
                newDate[dateToSet] = selectedDate
                // console.log({selectedDate})
                this.setState(newDate)
              }
            }}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#333b'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    // marginBottom: 15,
    fontSize: 15,
    lineHeight: 18,
    color: '#6853C8',
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
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
  categoryStyle: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 5,
    borderBottomWidth: 3,
  },
  greyText: {
    // padding: 20,
    // width: width - 50,
    // alignSelf: 'center',
    // textAlign: 'center',
    color: '#8EA7AB',
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  inputStyle: {
    // height: 40,
    paddingVertical: 5,
    width: width-100,
    borderBottomColor: '#6853C8',
    borderBottomWidth: 3,
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
});

export default CoinHistoryScreen;