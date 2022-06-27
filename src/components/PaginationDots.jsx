import React, { useState, } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const PaginationDots = ({ title, subtitle, index, }) => (
  <View style={styles.paginationContainer}>
    <View style={styles.paginationDot} />
    <View style={styles.paginationDot} />
    <View style={styles.paginationDot} />
  </View>
);

const styles = StyleSheet.create({
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },
});

export default PaginationDots;
