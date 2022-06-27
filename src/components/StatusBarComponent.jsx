import React, { Component } from 'react';
import {
  Dimensions, StyleSheet, TouchableOpacity, View, Text, Platform, Keyboard,
} from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

class StatusBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const {
      buttonPress, textInside, bgWhite, style,
    } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container, bgWhite ? { borderColor: '#000000', backgroundColor: '#FFFFFF' } : { borderColor: '#000000', backgroundColor: '#000000' }, style]}
        onPress={() => {
          Keyboard.dismiss(); buttonPress();
        }}
      >
        <View style={[styles.rect]}>
          <Text style={[styles.writing, { color: bgWhite ? '#000000' : '#FFFFFF' }]}>
            {textInside.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000000',
    //     shadowOffset: { width: 0, height: 0 },
    //     shadowOpacity: 0.75,
    //     shadowRadius: 4,
    //   },
    //   android: {
    //     elevation: 10,
    //   },
    // }),
    // width: width - 50,
    alignSelf: 'center',
    height: 48,
    width: width - 50,
    borderWidth: 1.5,
    borderRadius: 0,
  },
  rect: {
    flex: 1,
    maxWidth: 394,
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: '#000000',
    // backgroundColor: Colors.bgGray50,
    // backgroundColor: '#FFFFFF',
  },
  writing: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    color: '#FFFFFF',
    // opacity: 0.75,
    // fontWeight: '900',
    fontSize: 14,
    fontFamily: 'NunitoSans-Black',
    lineHeight: 16,
    letterSpacing: 2.5,
  },
});

export default StatusBarComponent;
