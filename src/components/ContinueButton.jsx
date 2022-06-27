import React, { Component } from 'react';
import {
  Dimensions, StyleSheet, TouchableOpacity, View, Text, Platform, Keyboard,
} from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

class ContinueButton extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  callMethod = async (props) => {
    const { navigation } = props;
    navigation.navigate('SignIn');
  }

  render() {
    const {
      buttonPress, disabled, textInside, bgWhite, style, smallBtn, textStyle
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          bgWhite
            ? { borderColor: '#6853C8', backgroundColor: '#FFFFFF00' }
            : { borderColor: disabled ? '#CFDCDF' : '#6853C8', backgroundColor: disabled ? '#CFDCDF' : '#6853C8' },
          style,
        ]}
        onPress={() => {
          Keyboard.dismiss();
          buttonPress();
        }}
        disabled={disabled}
      >
        <View style={[styles.rect, smallBtn ? { height: 32, maxWidth: 196 } : null]}>
          <Text
            style={[
              styles.writing,
              { color: bgWhite ? '#6853C8' : '#FFFFFF' },
              smallBtn
                ? {
                  fontSize: 12,
                  padding: 8,
                  lineHeight: 12,
                }
                : null,
              textStyle,
            ]}
          >
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
    borderWidth: 3,
    borderRadius: 24,
  },
  rect: {
    flexDirection: 'column',
    maxWidth: 394,
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: '#000000',
    // backgroundColor: Colors.bgGray50,
    // backgroundColor: '#FFFFFF',
  },
  writing: {
    flex: 1,
    padding: 15,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    color: '#FFFFFF',
    // opacity: 0.75,
    fontSize: 14,
    fontFamily: 'Rubik-Bold',
    lineHeight: 14,
    letterSpacing: 0,
  },
});

export default ContinueButton;
