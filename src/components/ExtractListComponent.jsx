import React, { Component } from 'react';
import {
  View, StyleSheet, Text, FlatList, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Colors from '../constants/Colors';
import Formatters from '../utils/Formatters';
import 'moment/locale/pt-br';

const { width, height } = Dimensions.get('window');

class ExtractListComponent extends React.PureComponent {
  render() {
    const {
      data,
    } = this.props;

    console.log('ExtractListComponent', data);

    return (
      <View style={{
        height: 76, width, flexDirection: 'row', marginTop: -3,
      }}
      >
        <View style={{
          // height: '100%', width: 1, backgroundColor: '#000000', marginHorizontal: 10,
          width: 36, flexDirection: 'column', height: 36, alignSelf: 'center', alignItems: 'center', alignContent: 'center', marginHorizontal: 10, marginTop: -2,
        }}
        >
          <View style={{
            height: 20, width: 0.5, backgroundColor: '#00000060', marginTop: -18,
          }}
          />
          <View style={{
            height: 38, width: 38, backgroundColor: '#FFFFFF', borderRadius: 19, borderWidth: 1, borderColor: '#000000',
          }}
          >
            <Icon name={data.type === 'DEBIT' ? 'minus' : 'plus'} size={18} color="#000000" style={{ marginLeft: 9, marginTop: 9 }} />
          </View>
          <View style={{
            height: 20, width: 0.5, backgroundColor: '#00000060',
          }}
          />
        </View>
        <View style={{
          marginTop: 4, alignSelf: 'center', width: width - 130,
        }}
        >
          <Text style={{ fontWeight: '900', fontSize: 14 }}>
            {moment(data.date).format('lll')}
          </Text>
          <Text style={{ fontWeight: '200', fontSize: 12 }}>
            {data.description}
          </Text>
        </View>
        <View style={{
          width: 80, alignSelf: 'center', flex: 1, marginLeft: -30,
        }}
        >
          <Text style={{
            textAlign: 'right', alignSelf: 'flex-end', color: data.type === 'DEBIT' ? '#888888' : '#000000', marginRight: 10, fontFamily: 'AvenirNextLTPro-DemiCn', fontSize: 18,
          }}
          >
            {`${Formatters.NumberFormatter(data.valuePoints)}pts`}
          </Text>
        </View>
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

export default ExtractListComponent;
