import * as React from 'react';
import Svg, { G, Path, Circle, Ellipse } from 'react-native-svg';

export default function MenuCoinHistoryIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G>
        <Ellipse ry="3" rx="3" cy="6" cx="9" stroke="#fcfdb1" strokeWidth='2' fill="#ffffff00"/>
        <Ellipse ry="3" rx="3" cy="14" cx="18" stroke="#fcfdb1" strokeWidth='2' fill="#ffffff00"/>
        <Ellipse ry="3" rx="3" cy="22" cx="9" stroke="#fcfdb1" strokeWidth='2' fill="#ffffff00"/>
      </G>
    </Svg>
    
  );
}

// w15 h18
