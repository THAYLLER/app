import * as React from 'react';
import Svg, { G, Line, Circle } from 'react-native-svg';

export default function MenuInstitutionsIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G transform="translate(-3207.835 -590.984)">
        <G transform="translate(3209.249 592.398)">
          <Circle cx="8.547" cy="8.547" r="8.547" transform="translate(0 12.087) rotate(-45)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
          <Circle cx="3.885" cy="3.885" r="3.885" transform="matrix(0.226, -0.974, 0.974, 0.226, 7.425, 14.994)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        </G>
        <Line x2="3.108" y2="3.108" transform="translate(3215.897 598.27)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        <Line x1="3.108" y2="3.108" transform="translate(3223.668 598.27)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        <Line x1="3.108" y1="3.108" transform="translate(3223.668 607.594)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        <Line y1="3.108" x2="3.108" transform="translate(3215.897 607.594)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
      </G>
    </Svg>
  );
}

// w27 h27
