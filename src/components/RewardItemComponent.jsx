import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

class RewardItemComponent extends React.PureComponent {
  render() {
    const {
      data,
      index,
      listSize,
      style,
      handleRewardSelect,
      locked,
      isCompleteRegister,
      completeRegisterSelection,
      campaignRedeemed,
    } = this.props;

    console.log(isCompleteRegister);

    return (
      <View
        key={() => index.toString()}
        style={{
          width: (width - 55) * 0.5,
          height: 'auto',
          borderColor: '#D9D9D9',
          borderWidth: 1,
          borderRadius: 5,
          marginLeft: 4,
          marginRight: 4,
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
          backgroundColor: locked ? '#ECF1F2' : '#FFFFFF',
          ...style,
        }}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri:
              data.images && data.images.length > 0 ? data.images[0].url : null,
          }}
          style={{
            width: (width - 55) * 0.5 - 48,
            height: (width - 55) * 0.5 - 48,
            resizeMode: 'contain',
          }}
        />
        <Text
          style={{
            fontFamily: 'Rubik-Medium',
            fontSize: 12,
            alignSelf: 'center',
            width: (width - 55) * 0.5 - 64,
            textAlign: 'center',
            color: '#8EA7AB',
            marginVertical: 16,
          }}>
          {data.name}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            isCompleteRegister
              ? completeRegisterSelection()
              : handleRewardSelect();
            // await analytics().logEvent('select_reward');
          }}
          disabled={locked}>
          {!locked ? (
            <View
              style={{
                width: (width - 55) * 0.5 - 32,
                borderRadius: 24,
                borderWidth: 0,
                backgroundColor: '#6853C8',
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={{color: '#FFF', fontWeight: '600'}}>
                Escolher esta
              </Text>
            </View>
          ) : (
            <View
              style={{
                width: (width - 55) * 0.5 - 32,
                borderRadius: 24,
                borderWidth: 0,
                backgroundColor: '#8EA7AB',
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={{color: '#FFF', fontWeight: '600'}}>
                Saldo insuficiente!
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 1,
    marginLeft: 8,
  },
  text: {
    color: '#22222280',
    lineHeight: 16,
    fontSize: 14,
    letterSpacing: -0.125,
    // fontFamily: 'sfdisplay-regular',
    alignSelf: 'center',
    marginLeft: 0,
  },
});

export default RewardItemComponent;
