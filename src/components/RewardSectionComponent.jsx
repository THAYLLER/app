import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import FastImage from 'react-native-fast-image';

import RewardItemComponent from './RewardItemComponent';

const { width, height } = Dimensions.get('window');

class RewardSectionComponent extends React.PureComponent {
  render() {
    const {
      list,
      stampsQuantity,
      handleSelect,
      locked,
      isCompleteRegister,
      campaignRedeemed,
      completeRegisterSelection,
    } = this.props;
    return (
      <View>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 16, width: width * 0.95, justifyContent: 'space-between',
        }}
        >
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginLeft: 24,
          }}
          >
            <View style={{
              padding: 6,
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: locked ? '#FF7A61' : '#00d182',
            }}
            >
              <Icon name={locked ? 'lock' : 'lock-open-variant'} color="#FFF" size={12} />
            </View>
            <Text style={{
              color: '#8EA7AB', fontFamily: 'Rubik-Regular', letterSpacing: -0.5, fontSize: 16, marginLeft: 12,
            }}
            >
              {locked ? 'Desbloqueie com' : 'Recompensas de'}
              <Text style={{
                color: '#8EA7AB', fontFamily: 'Rubik-Bold', letterSpacing: -0.5, fontSize: 16,
              }}
              >
                {` ${stampsQuantity} `}
                <FastImage resizeMode={FastImage.resizeMode.contain}
                  source={Images.coin}
                  style={{
                    width: 13, height: 13, resizeMode: 'contain' , marginLeft: 3// , alignSelf: 'center'
                  }}
                />
              </Text>
            </Text>
          </View>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{
            width, height: 'auto', paddingHorizontal: 20, zIndex: 9,
          }}
          contentContainerStyle={{ paddingRight: 40, zIndex: 9 }}
        >
          {list.map((item, index, arr) => (
            <RewardItemComponent key={index} data={item} index={index} listSize={arr.length} completeRegisterSelection={completeRegisterSelection} handleRewardSelect={() => handleSelect(index)} locked={locked} isCompleteRegister={isCompleteRegister} style={{ zIndex: 9 }} campaignRedeemed={campaignRedeemed} />
          ))}
        </ScrollView>
        {
          // campaignRedeemed && (
          //   <View style={{
          //     position: 'absolute', zIndex: 99999999, bottom: -20,
          //   }}
          //   >
          //   {
          //     //<FastImage resizeMode={FastImage.resizeMode.contain} source={Images.redeemed} style={{ width, height: width * 0.25 }} />
          //   }
          //   </View>
          // )
        }
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
  icon: {
    marginLeft: 4,
    alignSelf: 'center',
    // width: 16,
    // height: 32,
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

export default RewardSectionComponent;
