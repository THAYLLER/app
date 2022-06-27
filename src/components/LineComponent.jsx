import React, { PureComponent } from 'react';
import {
  View, StyleSheet, Text, Dimensions,
} from 'react-native';
import propTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

class Line extends PureComponent {
  render() {
    const {
      text,
      customStyle,
    } = this.props;
    return (
      <View style={[styles.line, customStyle.line]}>
        <Icon name="checkbox-multiple-marked-circle-outline" size={24} style={[styles.icon, customStyle.icon]} color={Colors.white} />
        <Text style={[styles.text, customStyle.text]}>
          {text}
        </Text>
      </View>
    );
  }
}

Line.defaultProps = {
  customStyle: null,
  text: '',
};

Line.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  customStyle: propTypes.object,
  text: propTypes.string,
};

const styles = StyleSheet.create({
  line: {
    flex: 1,
    flexDirection: 'row',
    // height: 32,
    // justifyContent: 'space-between',
    width,
    marginBottom: 12,
    height: 'auto',
    maxHeight: 50,
  },
  icon: {
    marginLeft: 36,
    marginRight: 16,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    lineHeight: 24,
    height: 24,
    width: 24,
  },
  text: {
    fontFamily: 'AvenirNextLTPro-BoldCn',
    width: 375,
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    textAlign: 'left',
    // lineHeight: 24,
    flexWrap: 'wrap',
    lineHeight: 18,
    flexShrink: 1,
    fontSize: 18,
    marginTop: 3,
    // alignSelf: 'center',
  },
});

export default Line;
