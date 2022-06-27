import React, { useState, } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Platform,
} from 'react-native';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const SlidesInfo = ({ title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>
      {title.toUpperCase()}
    </Text>
    <Text style={styles.subtitle}>
      {subtitle}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Black',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#FFFFFFcc',
    fontFamily: 'NunitoSans-SemiBold',
    letterSpacing: 0.5,
    lineHeight: 20,
    marginLeft: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

export default SlidesInfo;
