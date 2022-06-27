import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import metrics from '../../../styles/metrics';

export default StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: metrics.tenHeight * 3,
  },
  text: {
    fontFamily: 'Nunito-Regular',
    fontSize: metrics.tenWidth * 1.5,
    color: colors.dark,
    textAlign: 'center',
  },
});
