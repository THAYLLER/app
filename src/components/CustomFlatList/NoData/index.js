import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import metrics from '../../../styles/metrics';
import colors from '../../../styles/colors';
import styles from './styles';

export default function NoData({ msg }) {
  const lineRender = [];

  for (let i = 0; i < 5; i += 1) {
    lineRender.push(
      <View
        style={{
          marginHorizontal: metrics.tenWidth * 2,
          height: metrics.tenHeight * 10,
          borderColor: colors.darkTransparent,
          borderBottomWidth: 1,
          justifyContent: 'center',
        }}
      />,
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{msg}</Text>
      {lineRender}
    </View>
  );
}

NoData.propTypes = {
  msg: PropTypes.string,
};

NoData.defaultProps = {
  msg: 'Ainda não há dados para visualizar.\nClique no botão e adicione um novo.',
};
