import * as React from 'react';
import Svg, {
  Polygon, Polyline, Line, G, Path,
} from 'react-native-svg';

export default function LogOutIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G id="icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <G id="Artboard-Copy-3" transform="translate(-10.000000, -9.000000)" stroke="#FCFDB1" strokeWidth="2.5">
          <G id="Group" transform="translate(10.298410, 9.565111)">
            <Path d="M18.9970319,1 L18.980515,6.57305193 L18.980515,23.1012592 L1,23.1024953 L1,1 L18.9970319,1 Z" id="Path_1945" />
            <G id="Group_2134" transform="translate(7.026457, 10.992251)">
              <Polyline id="Path_1947" points="4.2365812 6.98119658 0.134017094 6.98119658 0.134017094 2.87863248" />
              <Line x1="0.256410256" y1="6.92307692" x2="6.92307692" y2="0.256410256" id="Line_61" />
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}
