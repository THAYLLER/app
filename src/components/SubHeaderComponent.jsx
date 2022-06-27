import React, { PureComponent } from 'react';
import {
  View, Text, Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

class SubHeaderComponent extends PureComponent {
  render() {
    const {
      title,
      noForceUpperCase
    } = this.props;
    return (
      <View style={{
        paddingVertical: 20,
        width,
        backgroundColor: '#6853C8',
        alignItems: 'center',
        borderTopWidth: 0,
        borderTopColor: '#ffffff00',
        shadowColor: '#ffffff00',
        shadowOpacity: 0,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      }}
      >
        <Text style={{
          color: '#FFFFFF',
          fontFamily: 'Rubik-Bold',
          fontSize: 15,
          marginTop: 6,
        }}
        >
          {(noForceUpperCase) ? title : title.toUpperCase()}
        </Text>
      </View>
    );
  }
}

export default SubHeaderComponent;
