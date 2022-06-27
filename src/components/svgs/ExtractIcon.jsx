import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export default function ExtractIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d="M39.767,47.836H35.344a.918.918,0,0,0,0,1.835h4.423a.918.918,0,1,0,0-1.835Zm0-3.42H35.344a.918.918,0,0,0,0,1.835h4.423a.918.918,0,1,0,0-1.835Zm11.213-6.4H44.551V33.158a.918.918,0,0,0-.918-.918H31.477a.918.918,0,0,0-.918.918v17.6s0,0,0,.006a3.371,3.371,0,0,0,3.367,3.367H46.082a3.371,3.371,0,0,0,3.367-3.367V45.8h3.98a.918.918,0,0,0,.918-.918v-3.5A3.371,3.371,0,0,0,50.979,38.014ZM33.926,52.3a1.532,1.532,0,0,1-1.531-1.528V34.075H42.716V50.767a3.352,3.352,0,0,0,.372,1.531H33.926ZM47.615,41.368s0,.009,0,.012v9.387a1.531,1.531,0,1,1-3.062,0V39.849h3.434A3.33,3.33,0,0,0,47.615,41.368Zm4.9,2.6H49.448V41.386s0,0,0-.006a1.531,1.531,0,0,1,3.062,0Z" transform="translate(-30.559 -32.24)" fill={color} />
    </Svg>
  );
}

// 24, 22