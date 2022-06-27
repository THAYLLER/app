import React, { PureComponent } from 'react';
import {
  View, Text, Dimensions, TouchableOpacity, TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import analytics from '@react-native-firebase/analytics';

const { width } = Dimensions.get('window');

class SearchButtonComponent extends PureComponent {
  render() {
    const {
      navigateTo,
      searchInput,
      onChange,
      search,
    } = this.props;
    return (
      <TouchableOpacity disabled={searchInput} onPress={() => navigateTo()}>
        <View style={{
          alignSelf: 'center', flexDirection: 'row', marginTop: 20, marginBottom: 30,
        }}
        >
          <Icon
            name="search"
            size={24}
            style={{
              marginLeft: 2,
              color: '#6853C8',
              // marginBottom: 4,
              marginTop: -2,
              position: 'absolute',
              zIndex: 9999,
            }}
          />
          {searchInput ? (
            <TextInput
              placeholderTextColor="#8EA7AB"
              placeholder="Busque um produto pelo nome"
              onChangeText={async (val) => {
                onChange(val);
                await analytics().logEvent('search_product', {
                  searchPerformed: val
                });
              }}
              style={{
                height: 32,
                width: width * 0.84,
                paddingTop: 0,
                paddingBottom: 2,
                marginBottom: -2,
                // marginLeft: -32,
                fontSize: 15,
                letterSpacing: -0.2,
                // color: '#8EA7AB',
                letterSpacing: 0,
                borderBottomWidth: 2,
                borderBottomColor: '#6853C8',
                paddingLeft: 32,
                fontFamily: 'Rubik-Light',
              }}
              autoFocus
              clearButtonMode="always"
              onBlur={() => search()}
              onKeyPress={async (e) => {
                if (e.nativeEvent.key === 'Enter') {
                  search();
                }
              }}
              returnKeyType="search"
            />
          ) : (
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  height: 32,
                  width: width * 0.84,
                  paddingTop: 0,
                  paddingBottom: 2,
                  marginTop: 3,
                  marginBottom: -4,
                  // marginLeft: -32,
                  fontSize: 14,
                  letterSpacing: -0.2,
                  color: '#8EA7AB',
                  // borderBottomWidth: 2,
                  // borderBottomColor: '#6853C8',
                  paddingLeft: 32,
                  fontFamily: 'Rubik-Light',
                }}
              >
                Busque um produto pelo nome
              </Text>
              <View style={{
                height: 2, backgroundColor: '#6853C8', width: width * 0.84, borderRadius: 2,
              }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

export default SearchButtonComponent;
