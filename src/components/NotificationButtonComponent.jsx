import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation-drawer';
import Colors from '../constants/Colors';
import {connect} from 'react-redux'

import {
	setNotifications
} from '../redux/app/actions'
import { CiclooService } from '../services';
import { NavigationEvents } from 'react-navigation';

const mapStateToProps = state => ({
	notifications: state.AppReducer.notifications,
})
const mapActionsToProps = {
	setNotifications
}

class NotificationButton extends React.PureComponent {
  constructor(){
    super()
    this.state = {
      unread: 0
    }
  }
  componentDidMount(){
    console.log('notif mount')
    this.checkNotifications()
    this.checkNotificationsInterval = setInterval(this.checkNotifications, 5*60*1000)
    // setTimeout(() => {console.log({notifications: this.props.notifications});}, 10000)
  }

  componentWillUnmount(){
    console.log('notif unmount')
    clearInterval(this.checkNotificationsInterval)
  }

  checkNotifications = async () => {
    console.log('checking notifications...')
    //cheque as notificações aqui
    let unread = await CiclooService.checkNotifications()
    this.setState({unread})
  }

  render() {
    const {
      nav
    } = this.props;
    return (
      <TouchableOpacity onPress={() => {nav.navigate('Notifications')}}>
        <NavigationEvents
          onDidFocus={async () => {
            await this.checkNotifications()
          }}
        />
        <View style={styles.container}>
          <Icon name="messenger-outline" size={22} style={styles.icon} color={Colors.white} />
          {this.state.unread > 0 &&
            <View style={styles.badge} />
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    marginTop: 1,
    marginRight: 8,
  },
  badge: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6853C8',
    backgroundColor: '#00d6fe',
    position: 'absolute',
    top: 0,
    right: 3,
  },
  icon: {
    marginRight: 4,
    alignSelf: 'center',
    // width: 16,
    // height: 32,
  },
  text: {
    color: '#22222280',
    lineHeight: 16,
    fontSize: 14,
    letterSpacing: -0.125,
    // fontFamily: 'sfdisplay-regular',
    alignSelf: 'center',
    marginLeft: 0,
  },
});

export default connect(mapStateToProps, mapActionsToProps)(NotificationButton);
