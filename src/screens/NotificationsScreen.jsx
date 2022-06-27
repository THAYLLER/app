import React, { Component, StatusBar } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import MenuButton from '../components/MenuButtonComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Images from '../constants/Images';
import Accordian from '../components/Accordian'
import CiclooService from '../services/CiclooService';
import { times } from 'underscore';

const { width, height } = Dimensions.get('window');

class NotificationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      notifications: [],
      page: 1,
      endReached: false,
      globalRead: []
    };
    times.notificationReaded = this.notificationReaded.bind(this)
  }

  // async componentDidMount() {
  //   let user = await CiclooService.GetParticipantData()
  //   console.log({user, globalRead: user.globalNotificationsRead})
  //   this.setState({
  //     globalRead: (user.globalNotificationsRead) ? user.globalNotificationsRead : []
  //   })
  //   await this.loadNotifications();
  // }

  loadNotifications = async () => {
    let {notifications, page} = this.state
    console.log({notifications})
    const append = await CiclooService.GetNotifications(page);
    console.log({append})
    notifications = notifications.concat(append)
    console.log({notifications})
    this.setState({
      notifications,
      loading: false,
      page: (append.length == 0) ? page : page+1,
      endReached: append.length == 0
    });
    console.log('notifications :>>>', (this.state.notifications));
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

  notificationReaded = (isGlobal, data) => {
    console.log({isGlobal, data})
    if(isGlobal){
      let globalRead = this.state.globalRead
      globalRead.push(data)
      this.setState({globalRead})
    }
  }

  render() {
    const { navigation } = this.props;
    const { notifications, loading, endReached, globalRead } = this.state;
    return(
      <SafeAreaView style={{ backgroundColor: '#6853C8', flex: 1 }}>
        <NavigationEvents
          // onWillFocus={async () => {
          //   console.log({'willFocus': true})
          //   this.setState({loading: true})
          //   await this.loadNotifications();
          // }}
          onDidFocus={async () => {
            console.log({'didFocus': true})
            let user = await CiclooService.GetParticipantData()
            console.log({user, globalRead: user.globalNotificationsRead})
            this.setState({
              globalRead: (user.globalNotificationsRead) ? user.globalNotificationsRead : []
            })
            this.setState({loading: true})
            await this.loadNotifications();
          }}
          onWillBlur={async () => {
            console.log({'willBlur': true})
            this.setState({
              page: 1,
              endReached: false,
              notifications: []
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
              Notificações
            </Text>
          </View>
          {/* <SubHeaderComponent title="Notificações" noForceUpperCase /> */}
        </View>
        <FlatList 
          style={{flex: 1, backgroundColor: '#fff'}}
          data={notifications}
          renderItem={({item, index}) => (
            <Accordian 
              key={index}
              title = {item.title}
              data = {item.message}
              date = {item.creationDate}
              cpf={item.cpf}
              id={item.id}
              read={(item.cpf == null) ? globalRead.findIndex(i => i == item.id) > -1 : item.read}
              onRead={this.notificationReaded}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={(loading || endReached) ? undefined : this.loadNotifications}
          ListFooterComponent={(loading
            ? <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size='small' color='#6853C8' /></View>
            : <View style={{height: 40, backgroundColor: '#6853C8'}}/>
          )}
        />
      </SafeAreaView>
    );
  }
}

export default NotificationsScreen;