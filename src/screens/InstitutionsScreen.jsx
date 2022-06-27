import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';

import Images from '../constants/Images';
import SubHeaderComponent from '../components/SubHeaderComponent';
import CiclooService from '../services/CiclooService';
import BackButton from '../components/BackButtonComponent';
import Main from '../utils/Main';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class InstitutionsScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      institutionsItems: [],
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    this.loadInstitutions();
  }

  loadInstitutions = async () => {
    const institutionsItems = await CiclooService.GetInstitutions();
    this.setState({
      institutionsItems,
    });
    console.log('institutionsItems :>> ', institutionsItems);
  }

  render() {
    const {
      institutionsItems,
    } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="light-content" />
        <SubHeaderComponent title="Instituições ajudadas" />
        <ScrollView style={{ height: 1000, width }} contentContainerStyle={{ paddingBottom: 40 }}>
          {institutionsItems.map((item, index) => (
            <View key={() => item.id}>
              <View style={{ padding: 24 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{
                    marginRight: 24, borderWidth: 1, borderColor: '#CFDCDF', padding: 3,
                  }}
                  >
                    <FastImage resizeMode={FastImage.resizeMode.contain} source={{ uri: item.urlImagem }} style={{ width: width * 0.2, height: width * 0.2, resizeMode: 'contain' }} />
                  </View>
                  <View style={{ height: width * 0.2, justifyContent: 'space-between' }}>

                    <Text style={{
                      fontFamily: 'Rubik-Bold', fontSize: 15, lineHeight: 16, color: '#6853C8',
                    }}
                    >
                      {item.title}
                    </Text>
                    <Text style={{
                      fontFamily: 'Rubik-Regular', fontSize: 15, lineHeight: 16, color: '#2D2D2D', marginTop: -15,
                    }}
                    >
                      {item.urlInstitution}
                    </Text>
                    <TouchableOpacity onPress={() => {
                      Main.selectContentInstitutions({
                        institutionName: item.title,
                        institutionId: item.id,
                      });
                      Linking.openURL(item.urlInstitution);
                    }}
                    >
                      <View style={{
                        borderRadius: 100, backgroundColor: '#6853C8', paddingVertical: 10, width: width * 0.8 - 72, height: 32, alignItems: 'center',
                      }}
                      >
                        <Text style={{
                          fontFamily: 'Rubik-Medium', fontSize: 11, lineHeight: 13, color: '#ffffff',
                        }}
                        >
                          Visitar site
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{
                  fontFamily: 'Rubik-Regular', fontSize: 14, lineHeight: 18, color: '#2D2D2D', marginTop: 24,
                }}
                >
                  {item.text}
                </Text>
              </View>
              <View style={{ backgroundColor: '#CFDCDF', width, height: 1 }} />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

InstitutionsScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />
  ),
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#6853C8',
    borderBottomWidth: 0,
    shadowOpacity: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  headerTintColor: '#FFFFFF',
  headerLeft: (<BackButton back={navigation} bgWhite />),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },

});

export default InstitutionsScreen;
