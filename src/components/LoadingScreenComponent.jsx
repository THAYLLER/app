import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ActivityIndicator, ImageBackground, StatusBar,
} from 'react-native';
import Images from '../constants/Images';

const { width, height } = Dimensions.get('window');

class LoadingScreenComponent extends PureComponent {
  render() {
    return (
      <View>
        <StatusBar barStyle="dark-content" />
        <ImageBackground
          source={Images.splash}
          style={{
            flex: 1,
            resizeMode: 'contain',
            width,
            height,
          }}
        >
          <View
            style={{
              flex: 1,
              top: height * 0.7,
              flexDirection: 'row',
              position: 'absolute',
              zIndex: 9999,
              alignSelf: 'center',
              justifyContent: 'space-between',
              height: 32,
            }}
          >
            <Text
              style={{
                color: '#000000',
                alignSelf: 'center',
                fontSize: 24,
                lineHeight: 30,
                marginRight: 10,
              }}
            >
                CARREGANDO
            </Text>
            <ActivityIndicator color="#000000" size="small" style={{ height: 32, width: 32, marginTop: 0 }} />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    height,
    width,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    alignSelf: 'center',
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 20,
    marginTop: -60,
  },
  indicator: {
    alignSelf: 'center',
    marginTop: -60,
  },
});

export default LoadingScreenComponent;
