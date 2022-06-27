import * as React from 'react';
import Svg, { G, Path, Circle } from 'react-native-svg';

export default function MenuHowItWorksIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G transform="translate(-241.768 -172.201)">
        <G transform="translate(242.768 173.201)">
          <Path d="M250.041,189.2s5.818-5.091,5.818-9.455a6.546,6.546,0,1,0-13.091,0c0,4.364,5.818,9.455,5.818,9.455Z" transform="translate(-242.768 -173.201)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        </G>
        <Circle cx="2.909" cy="2.909" r="2.909" transform="translate(245.185 179.747) rotate(-45)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
      </G>
    </Svg>
  );
}

// w15 h18
