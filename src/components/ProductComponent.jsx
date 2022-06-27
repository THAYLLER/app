import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableHighlightBase,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Images from '../constants/Images';
import FastImage from 'react-native-fast-image';
import { times } from 'underscore';

const { width, height } = Dimensions.get('window');

class ProductComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgLoading: true,
      showImage: false,
      doubleLoading: false,
      isFavorite: props.isDoubled,
      isBanner: props.isBanner,
      sealStyle: {
        position: 'absolute',
        top: (props.doubleCoins) ? 50 : 10,
        right: 10,
        width: ((width - 55) * 0.5 - 24)/3,
        aspectRatio: 1,
        zIndex: 101,
      },
    };
    // validar: moedas em dobro
  }

  render() {
    const {
      index,
      style,
      doubleCoins,
      coinsQuantity,
      productImage,
      description,
      chooseItem,
      // isFavorite,
      storesScreen,
    } = this.props;
    const { imgLoading, showImage, isFavorite, doubleLoading, isBanner } = this.state;
    return (
      <View
        key={() => index.toString()}
        style={{
          width: (width - 55) * 0.5,
          // minWidth: 172,
          height: 'auto',
          borderColor: (isBanner) ? '#6853C8bb' : '#D9D9D9',
          borderWidth: (isBanner) ? 2 : 1,
          borderRadius: 5,
          marginLeft: 4,
          marginRight: 4,
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom: 24,
          backgroundColor: isFavorite ? '#6853C8' : '#FFFFFF',
          ...style,
        }}
      >
        {
          // !isBanner &&
          // <Text style={{
          //   color: doubleCoins && isFavorite ? '#FFFFFF' : '#6853C8', fontSize: 16, letterSpacing: -0.5, fontFamily: 'Rubik-Bold',
          // }}
          // >
          //   {`${ (isFavorite) ? coinsQuantity * 2 : coinsQuantity } ${!isFavorite && coinsQuantity == 1 ? 'MOEDA' : 'MOEDAS'}`} 
          // </Text>
        }
        {doubleCoins && (
        <View style={{
          backgroundColor: '#FCFDB1',
          borderRadius: 16,
          paddingHorizontal: 8,
          marginTop: 8,
          marginBottom: 12,
        }}
        >
          <Text style={{
            fontWeight: '900',
            color: '#2D2D2D',
            letterSpacing: -0.5,
          }}
          >
            MOEDAS EM DOBRO
          </Text>
        </View>
        )}
        <View style={{
          width: (width - 55) * 0.5 - 48, height: (width - 55) * 0.5 - 48, marginTop: doubleCoins ? 12 : 30,
        }}
        >
          {imgLoading && !storesScreen && (!!productImage) && (
            <ActivityIndicator size="small" color="#4a4a4a" style={{ alignSelf: 'center', top: 50, position: 'absolute' }} />
          )}
          {productImage !== null && productImage !== undefined ? (
            <FastImage resizeMode={FastImage.resizeMode.contain}
              source={{ 
                uri: productImage,
                cache: FastImage.cacheControl.immutable,
              }}
              style={{
                width: (width - 55) * 0.5 - 48, height: (width - 55) * 0.5 - 48, resizeMode: 'contain', position: 'absolute', zIndex: 100,
              }}
              onLoadStart={(e) => { 
                // console.log(`onImageLoadStart ${index} (${description}): `, productImage); 
                this.setState({ imgLoading: true });
              }}
              onLoadEnd={(e) => { 
                // console.log(`onImageLoadEnd ${index}: `, productImage); 
                this.setState({ imgLoading: false });
              }}
              onError={(e) => { 
                // console.log(`onError: ${index}`); 
                this.setState({ showImage: true });
              }}
            />
          ) : (
            <FastImage resizeMode={FastImage.resizeMode.contain}
              source={Images.productPlaceholderTransp}
              style={{
                width: (width - 55) * 0.5 - 48, height: (width - 55) * 0.5 - 48, resizeMode: 'contain', position: 'absolute', zIndex: 100,
              }}
              onLoad={(e) => { console.log(`noImage ${index}: `, productImage)}}
            />
          )}

        </View>
        <Text
          style={{
            fontWeight: '500', fontSize: 12, alignSelf: 'center', width: (width - 55) * 0.5 - 16, textAlign: 'center', color: doubleCoins && isFavorite ? '#FFFFFF' : '#8EA7AB', marginVertical: 16, minHeight: 44, fontFamily: 'Rubik-Regular',
          }}
          ellipsizeMode="tail"
          numberOfLines={3}
        >
          {description}
        </Text>
        {doubleCoins && (
        <TouchableOpacity
          onPress={async () => {
            this.setState({doubleLoading: true})
            let isFavorite = await chooseItem();
            console.log(isFavorite)
            this.setState({isFavorite, doubleLoading: false})
            await analytics().logEvent('double_coins', {
              product: description,
              doubleCoins: doubleCoins ? 'yes' : 'no',
              coinsQuantity: coinsQuantity,
              favorite: isFavorite ? 'yes' : 'no',
            });
          }}
          disabled={doubleLoading}
        >
          <View style={{
            width: (width - 55) * 0.5 - 24,
            borderRadius: 24,
            borderWidth: doubleCoins ? 0 : 2,
            // borderColor: '#FF7A61',
            borderColor: doubleCoins ? '#ffffff' : '#FF7A61',
            paddingVertical: 14,
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: isFavorite ? '#ffffff' : '#FF7A61',
          }}
          >
            {/* <Icon name="heart" size={22} style={{ alignSelf: 'center', marginRight: 4 }} color={doubleCoins &&  ? '#FF7A61' : '#ffffff'} /> */}
            {
              (doubleLoading)
              ?<ActivityIndicator size="small" color="#000" /> 
              :<Text style={{ color: isFavorite ? '#FF7A61' : '#ffffff', fontWeight: '600' }}>
                { isFavorite ? 'Moedas dobradas' : 'Quero dobrar'}
              </Text>
            }
          </View>
        </TouchableOpacity>
        )}
        {
          isBanner &&
          <View style={this.state.sealStyle}>
            <FastImage 
              style={{flex: 1}}
              resizeMode="contain"
              source={Images.seloBannerTransp}
            />
          </View>
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

export default ProductComponent;
