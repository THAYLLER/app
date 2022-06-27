import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const screenWidth = width < height ? width : height;
const screenHeight = width < height ? height : width;


// pading default = 10
const tenWidth = screenWidth / 41.142857142857144;

// height = 10;
const tenHeight = screenHeight / 73.14285714285714;


export default {
  tenWidth,
  tenHeight,
};
