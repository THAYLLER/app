import React, { Component } from 'react';
import {
  View, Image, TouchableWithoutFeedback, Platform, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const MenuButton = (props) => (
  <View>
    <TouchableWithoutFeedback
      onPress={() => { props.navigation.openDrawer(); }}
      hitSlop={{
        top: 50, bottom: 50, left: 50, right: 50,
      }}
    >
      <Icon
        name="star"
        size={24}
        color="#CFDCDF"
        style={[{
          marginBottom: 0, marginTop: 4,
        }]}
      />
    </TouchableWithoutFeedback>
  </View>
);

const styles = StyleSheet.create({
  imageStyle: {
    paddingLeft: 0,
    alignItems: 'center',
    width: 30,
    height: 22,
    left: 10,
    bottom: 0,
    resizeMode: 'contain',
    right: 0,
    marginRight: 20,
  },
});

export default MenuButton;
