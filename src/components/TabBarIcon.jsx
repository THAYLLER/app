import React from 'react';
import {
  View, Platform, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class TabBarIcon extends React.PureComponent {
  render() {
    const { name, focused } = this.props;
    if (name === 'camera') {
      return (
        <View style={{
          backgroundColor: '#6853C8',
          height: 48,
          width: 72,
          alignSelf: 'center',
          marginTop: 14,
        }}
        >
          <Icon
            name={name}
            size={42}
            color="#FFF"
            style={[{ marginBottom: 0, alignSelf: 'center' }, name === 'camera' ? { marginTop: 4, color: '#FFF', opacity: 0.85 } : { marginTop: 0 }]}
          />
        </View>
      );
    }

    return (
      <Icon
        name={name}
        size={24}
        color={focused ? '#6853C8' : '#CFDCDF'}
        style={[{
          marginBottom: 0, marginTop: focused ? 6 : 10,
        }]}
      />
    );
  }
}
