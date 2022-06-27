import React, { Component } from 'react';
import {
  View, Dimensions, StyleSheet, Platform, Image,
} from 'react-native';
import {
  ActivityIndicator,
} from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import SlidesInfo from './SlidesInfo';
import Screens from '../utils/Screens';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class PhotoSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
    };
  }

  renderItem = ({ item, index }) => {
    if (item.source && item.source.length) {
      return (
        <FastImage resizeMode={FastImage.resizeMode.contain}
          source={{ uri: item.source.toString() }}
          key={index}
          style={{
            width, height: Screens.hasNotch(height) ? width + 120 : width, resizeMode: 'cover',
          }}
        />
      );
    }
    return (
      <ActivityIndicator size="small" color="#CCCCCC" />
    );
  };

  render() {
    const {
      title, inputValue, isEditable, field, isVisible, inputFocused, close, fromEnd, shif, carouselData, h,
    } = this.props;
    const {
      slides, activeSlide,
    } = this.state;
    
    return (
      <View style={[{ backgroundColor: '#141414', height: Screens.hasNotch(height) ? h + 120 : h, }]}>
        <Carousel
          ref={(c) => { this.carousel = c; }}
          data={carouselData}
          renderItem={this.renderItem}
          sliderWidth={width}
          itemWidth={width}
          loop
          autoplay
          autoplayDelay={4000}
          autoplayInterval={8000}
          onBeforeSnapToItem={(slideIndex) => {
            this.setState({
              activeSlide: slideIndex
            });
          }}
        />
        <View style={[styles.paginationContainer, { marginTop: -(h * 0.65) }]}>
          <View style={[styles.paginationDot, { backgroundColor: activeSlide === 0 ? '#8D8D8D' : '#3C3C3C', bottom: h !== width ? -40 : 0, }]} />
          <View style={[styles.paginationDot, { backgroundColor: activeSlide === 1 ? '#8D8D8D' : '#3C3C3C', bottom: h !== width ? -40 : 0, }]} />
          <View style={[styles.paginationDot, { backgroundColor: activeSlide === 2 ? '#8D8D8D' : '#3C3C3C', bottom: h !== width ? -40 : 0, }]} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    // marginTop: -100,
    marginBottom: 0.07 * height,
    // marginBottom: height * 0.1,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: -1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});

export default PhotoSlides;
