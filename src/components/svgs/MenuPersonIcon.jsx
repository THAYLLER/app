import * as React from 'react';
import Svg, { G, Path, Circle } from 'react-native-svg';

export default function MenuPersonIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G transform="translate(-4065.347 -2302.051)">
        <G transform="translate(4066.761 2303.465)">
          <Circle cx="8.105" cy="8.105" r="8.105" transform="translate(0 11.463) rotate(-45)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        </G>
        <Circle cx="2.211" cy="2.211" r="2.211" transform="translate(4075.687 2313.808) rotate(-80.783)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        <Path d="M4143.075,2448.712a4.421,4.421,0,1,1,8.72,0" transform="translate(-69.212 -127.152)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
      </G>
    </Svg>
  );
}
