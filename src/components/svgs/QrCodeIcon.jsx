import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function QrCodeIcon(props) {
  const { width, height, color } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d="M66.378,78.2H65a.9.9,0,0,0-.9.9v1.376a.9.9,0,0,0,.9.9h1.376a.9.9,0,0,0,.9-.9V79.1A.9.9,0,0,0,66.378,78.2Z" transform="translate(-48.325 -58.481)" fill="#fff" />
      <Path d="M80.478,64.1H79.1a.9.9,0,0,0-.9.9v1.376a.9.9,0,0,0,.9.9h1.376a.9.9,0,0,0,.9-.9V65A.9.9,0,0,0,80.478,64.1Z" transform="translate(-58.481 -48.325)" fill="#fff" />
      <Path d="M29.517,25.744H27.866a1.1,1.1,0,0,1-1.083-1.119V22.919A1.1,1.1,0,0,0,25.7,21.8H24.049a1.1,1.1,0,0,0-1.083,1.119v1.706a1.1,1.1,0,0,1-1.083,1.119H20.232a1.1,1.1,0,0,1-1.083-1.119V22.919A1.1,1.1,0,0,0,18.067,21.8H16.416a1.1,1.1,0,0,0-1.083,1.119v5.65a1.1,1.1,0,0,1-1.083,1.119H8.783A1.1,1.1,0,0,0,7.7,30.806V40.4a1.1,1.1,0,0,0,1.083,1.119h9.284A1.1,1.1,0,0,0,19.15,40.4V38.694a1.1,1.1,0,0,1,1.083-1.119h1.651a1.1,1.1,0,0,0,1.083-1.119V34.75a1.1,1.1,0,0,0-1.083-1.119H20.232a1.1,1.1,0,0,1-1.083-1.119V30.806a1.1,1.1,0,0,1,1.083-1.119h1.651a1.1,1.1,0,0,1,1.083,1.119v1.706a1.1,1.1,0,0,0,1.083,1.119H25.7a1.1,1.1,0,0,0,1.083-1.119V30.806a1.1,1.1,0,0,1,1.083-1.119h1.651A1.1,1.1,0,0,0,30.6,28.569V26.863A1.1,1.1,0,0,0,29.517,25.744ZM16.551,37.687a1.1,1.1,0,0,1-1.083,1.119h-4.06a1.1,1.1,0,0,1-1.083-1.119v-4.2a1.1,1.1,0,0,1,1.083-1.119h4.06a1.1,1.1,0,0,1,1.083,1.119Z" transform="translate(-7.7 -18.62)" fill="#fff" />
      <Path d="M24.847,65.5H24.1a.9.9,0,0,0-.9.9v.744a.9.9,0,0,0,.9.9h.744a.9.9,0,0,0,.9-.9V66.4A.9.9,0,0,0,24.847,65.5Z" transform="translate(-18.897 -49.453)" fill="#fff" />
      <Path d="M80.478,7.7H79.1a.9.9,0,0,0-.9.9V9.978a.9.9,0,0,0,.9.9h1.376a.9.9,0,0,0,.9-.9V8.6A.9.9,0,0,0,80.478,7.7Z" transform="translate(-58.481 -7.7)" fill="#fff" />
      <Path d="M50.9,10.88h1.376a.9.9,0,0,0,.9-.9V8.6a.9.9,0,0,0-.9-.9H50.9a.9.9,0,0,0-.9.9V9.978A.9.9,0,0,0,50.9,10.88Z" transform="translate(-38.169 -7.7)" fill="#fff" />
      <Path d="M8.6,14.061H9.978a.9.9,0,0,0,.9-.9V11.783a.9.9,0,0,1,.9-.9h1.376a.9.9,0,0,0,.9-.9V8.6a.9.9,0,0,0-.9-.9H8.6a.9.9,0,0,0-.9.9v4.556A.9.9,0,0,0,8.6,14.061Z" transform="translate(-7.7 -7.7)" fill="#fff" />
    </Svg>
  );
}
