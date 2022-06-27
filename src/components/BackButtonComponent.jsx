import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';

class BackButton extends React.PureComponent {
  render() {
    const {
      back,
      bgWhite,
      screen,
    } = this.props;
    return (
      <TouchableOpacity onPress={() => {
        if (screen === 'forgot') return back.navigate('Welcome');
        return back.goBack(null);
      }}
      >
        <View style={styles.container}>
          <Icon name="close" size={22} style={styles.icon} color={bgWhite ? Colors.white : Colors.black} />
          {/* <Text style={styles.text}>
            VOLTAR
          </Text> */}
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

export default BackButton;
