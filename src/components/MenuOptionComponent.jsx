import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import MenuIcon from './MenuIconComponent';

const { width, height } = Dimensions.get('window');

class MenuOptionComponent extends React.PureComponent {
  render() {
    const {
      iconName,
      text,
      onHandle,
      style,
      last,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={() => onHandle()}
        style={{
          borderBottomWidth: 2, borderTopWidth: 2, borderColor: '#7765CD', marginTop: -2, // marginBottom: last ? 60 : 0,
        }}
      >
        <View style={{
          width: width * 0.85, padding: 15, alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: 'space-between',
        }}
        >
          <View style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 30, height: 'auto' }}>
              <MenuIcon name={iconName} />
              {/* <Icon name={iconName} size={24} color="#FCFDB1" /> */}
            </View>
            <Text style={{ color: '#FFF', fontFamily: 'Rubik-Regular', marginLeft: 24 }}>
              {text}
            </Text>
          </View>
          {/* <Icon name="chevron-right" size={24} color="#FFF" /> */}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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

export default MenuOptionComponent;
