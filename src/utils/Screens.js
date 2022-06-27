import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


export default class Screens {
  static hasNotch(h) {
    if (Platform.OS === 'ios' && h > 800) {
      return true;
    }
    return false;
  }
}
