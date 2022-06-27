import * as React from 'react';
import Svg, { G, Path, Rect } from 'react-native-svg';

export default function MenuLockIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G id="Group_2120" data-name="Group 2120" transform="translate(-252.35 -196.87)">
        <Rect id="Rectangle_2481" data-name="Rectangle 2481" width="14.437" height="10.632" transform="translate(253.35 205.088)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        <Path id="Path_1941" data-name="Path 1941" d="M286.311,203.284v-1.8a3.609,3.609,0,0,0-3.609-3.609h-1.8a3.609,3.609,0,0,0-3.609,3.609v1.8" transform="translate(-21.231)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
        <Path id="Path_1942" data-name="Path 1942" d="M301.226,293.622h1.8v3.609" transform="translate(-42.462 -84.925)" fill="none" stroke="#fcfdb1" strokeMiterlimit="10" strokeWidth="2" />
      </G>
    </Svg>

  );
}

// w16.437 h19.85
