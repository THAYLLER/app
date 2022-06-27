import React from 'react';
import { FlatList, View } from 'react-native';
import Item from '../Validations/Item';
import NoData from './NoData';

const CustomFlatList = (props) => {
  const { items } = props;

  const renderItem = ({ item }) => (
    <Item
      ticket={item}
    />
  );

  const keyExtractor = (item) => item.id.toString();

  return (
    <View>
      {false ? (
        <NoData msg="Você ainda não tem cupons cadastrados." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};


export default CustomFlatList;
