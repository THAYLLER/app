import React, { PureComponent } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

const { width, height } = Dimensions.get('window');

class AcceptCheckBoxComponent extends PureComponent {
  render() {
    const {
      accept, onPress, acceptText, linkTo, linkToText, style,
    } = this.props;
    return (
      <View
        style={[{
          height: 'auto',
          width: width - 80,
          borderRadius: 0,
          padding: 4,
          flexDirection: 'row',
          alignSelf: 'flex-start',
          alignItems: 'center',
          fontSize: 16,
          paddingLeft: 8,
          marginLeft: 12,
          marginTop: 10,
        }, { ...style }]}
      >
        <TouchableOpacity
          onPress={onPress}
          style={{
            marginTop: 0,
            height: 24,
            width: 24,
            marginRight: 16,
          }}
        >
          <View
            style={{
              height: 26,
              width: 26,
              borderRadius: 6,
              borderColor: '#6853C8',
              borderWidth: 3,
              backgroundColor: '#FFFFFF',
              padding: 3,
            }}
          >
            <View
              style={{
                height: 14,
                width: 14,
                borderRadius: 0,
                backgroundColor: accept ? '#6853C8' : '#eeeeee',
              }}
            />
          </View>
        </TouchableOpacity>
        <Text style={[styles.terms, { textAlign: 'left' }]}>
          {acceptText}
        </Text>
        <TouchableOpacity onPress={linkTo}>
          <Text style={[styles.terms, {
            color: '#6666C8', alignSelf: 'center', fontSize: 15, lineHeight: 18, // fontFamily: 'Rubik-Bold',
          }]}
          >
            {linkToText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  terms: {
    // letterSpacing: 4,
    color: '#2D2D2D',
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    lineHeight: 18,
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
});

export default AcceptCheckBoxComponent;
