import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/Colors';

import ProductComponent from './ProductComponent';

const { width, height } = Dimensions.get('window');

class ProductSectionComponent extends React.PureComponent {
  render() {
    const {
      list,
      sectionTitle,
      navigateTo,
      doubleCoins,
      markAsFavorite,
      imageLoading,
      stopLoading,
      isLast,
    } = this.props;
    return (
      <View style={{ marginBottom: isLast ? 100 : 0 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 16, width: width * 0.95, justifyContent: 'space-between',
        }}
        >
          <Text style={{
            color: '#6853C8', fontWeight: '900', letterSpacing: -0.5, fontSize: width > 380 ? 16 : 14, lineHeight: width > 380 ? 18 : 16, marginLeft: 24,
          }}
          >
            {sectionTitle.toUpperCase()}
          </Text>
          <TouchableOpacity onPress={() => navigateTo()} style={{ flexDirection: 'row' }}>
            <Text style={{ color: '#2D2D2D', alignSelf: 'center' }}>
              Todos
            </Text>
            <Icon name="chevron-right" color="#2D2D2D" size={24} />
          </TouchableOpacity>
        </View>
        <FlatList
         horizontal
         showsHorizontalScrollIndicator={false}
         style={{ width, height: 'auto', paddingHorizontal: 20 }}
         contentContainerStyle={{ paddingRight: 40 }}
         data={list}
         renderItem={({item, index}) => (
          <ProductComponent
           index={index}
           listSize={list.length}
           style={{ alignSelf: 'center', marginVertical: 6 }}
           key={item.id}
           productImage={item.images && item.images.length > 0 ? item.images[0].url : null}
           coinsQuantity={item.benefit.voucher ? item.benefit.voucher.amount : 1}
           description={item.name}
           chooseItem={() => markAsFavorite(index, item.id, item.eligibleParticipationAuthorization?.baseId)}
           doubleCoins={item.attributes.find(item => (item.key == 'highlight' && item.value == "true"))}
           isDoubled={item.eligibleParticipationAuthorization?.hasAuthorization}
           // imageLoading
           // imageLoading={imageLoading}
           // stopLoading={stopLoading}
          />
         )}
        />
        {/* <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ width, height: 'auto', paddingHorizontal: 20 }} contentContainerStyle={{ paddingRight: 40 }}>
          {list.map((item, index, arr) => (
            <ProductComponent
              index={index}
              listSize={arr.length}
              style={{ alignSelf: 'center', marginVertical: 6 }}
              key={item.id}
              productImage={item.images && item.images.length > 0 ? item.images[0].url : null}
              coinsQuantity={item.benefit.voucher ? item.benefit.voucher.amount : 2}
              description={item.name}
              doubleCoins={doubleCoins}
              chooseItem={() => markAsFavorite(index, item.id, item.eligibleParticipationAuthorization?.baseId)}
              isFavorite={item.isDouble}
              // imageLoading
              // imageLoading={imageLoading}
              // stopLoading={stopLoading}
            />
          ))}
        </ScrollView> */}
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

export default ProductSectionComponent;
