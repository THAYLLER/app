import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export default function MenuIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G transform="translate(0 0)">
        <G transform="translate(0 0)">
          <Path d="M0,1.111A1.111,1.111,0,0,0,1.111,2.222H18.889a1.111,1.111,0,0,0,0-2.222H1.111A1.111,1.111,0,0,0,0,1.111ZM18.889,7.778H7.778a1.111,1.111,0,0,1,0-2.222H18.889a1.111,1.111,0,0,1,0,2.222ZM4.444,11.111H18.889a1.111,1.111,0,0,1,0,2.222H4.444a1.111,1.111,0,0,1,0-2.222Z" fill={color} fill-rule="evenodd" />
        </G>
      </G>
    </Svg>

  );
}
