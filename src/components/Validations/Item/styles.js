import { StyleSheet } from 'react-native';
import metrics from '../../../styles/metrics';
import colors from '../../../styles/colors';

export default StyleSheet.create({
  container: {
    marginHorizontal: metrics.tenWidth * 2,
    height: metrics.tenHeight * 6.5,
    borderColor: colors.darkTransparent,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerContainer: { },
  partnerText: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: metrics.tenWidth * 1.3,
    color: '#777777',
  },
  dateText: {
    fontFamily: 'NunitoSans-ExtraBold',
    fontSize: metrics.tenWidth * 1.6,
    color: '#2B2B2B',
  },
  statusText: { fontFamily: 'NunitoSans-Black', fontSize: metrics.tenWidth * 1.8, color: '#2B2B2B' },
});
