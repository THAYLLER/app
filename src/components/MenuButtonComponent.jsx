import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation-drawer';
import Colors from '../constants/Colors';

class MenuButton extends React.PureComponent {
  render() {
    const {
      nav,
    } = this.props;
    return (
      <TouchableOpacity onPress={() => nav.dispatch(DrawerActions.openDrawer())}>
        <View style={styles.container}>
          <Icon name="menu" size={22} style={styles.icon} color={Colors.white} />
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
    marginLeft: 8,
  },
  icon: {
    marginLeft: 4,
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

export default MenuButton;
