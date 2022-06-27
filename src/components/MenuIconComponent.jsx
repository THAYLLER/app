import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import {
  MenuPersonIcon,
  MenuLockIcon,
  MenuHowItWorksIcon,
  MenuInstitutionsIcon,
  MenuFaqsIcon,
  MenuContactIcon,
  MenuTermsIcon,
  VoucherIcon,
  LogOutIcon,
  Star
} from './svgs';
import MenuCoinHistoryIcon from './svgs/MenuCoinHistoryIcon';
import MenuParticipantBrandsIcon from './svgs/MenuParticipantBrandsIcon';

class MenuIcon extends React.PureComponent {
  icon = (name) => {
    if (name === 'person') {
      return (
        <MenuPersonIcon width={26} height={26} />
      );
    }
    if (name === 'lock') {
      return (
        <MenuLockIcon width={17} height={20} />
      );
    }
    if (name === 'history') {
      return (
        <MenuCoinHistoryIcon width={30} height={30} />
      );
    }
    if (name === 'how') {
      return (
        <MenuHowItWorksIcon width={15} height={18} />
      );
    }
    if (name === 'Marcas') {
      return (
        <Star width={27} height={27} />
      );
    }
    if (name === 'institutions') {
      return (
        <MenuInstitutionsIcon width={27} height={27} />
      );
    }
    if (name === 'faqs') {
      return (
        <MenuFaqsIcon width={21} height={20} />
      );
    }
    if (name === 'contact') {
      return (
        <MenuContactIcon width={22} height={20} />
      );
    }
    if (name === 'terms') {
      return (
        <MenuTermsIcon width={16} height={19} />
      );
    }
    if (name === 'brands') {
      return (
        <MenuParticipantBrandsIcon width={30} height={30} />
      );
    }
    if (name === 'voucher') {
      return (
        <VoucherIcon width={21} height={20} />
      );
    }
    if (name === 'logout') {
      return (
        <LogOutIcon width={20.6} height={24.1} />
      );
    }
  };

  render() {
    const {
      name,
    } = this.props;
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        { this.icon(name) }
      </View>
    );
  }
}

export default MenuIcon;
