import React, {Component} from 'react';
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
  Clipboard,
  Linking,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import CiclooService from '../services/CiclooService';

import BackButton from '../components/BackButtonComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import ProblemModalComponent from '../components/ProblemModalComponent';
import Images from '../constants/Images';
import 'moment/locale/pt-br';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

class ExtractRedemptionScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#000000',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      collapsed: 1000,
      vouchers: [],
      modalVisible: false,
    };
  }

  async componentWillMount() {
    this.setState({
      loading: true,
    });
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    await this.loadRedemptions();
  }

  loadRedemptions = async () => {
    const vouchers = await CiclooService.GetVouchers();
    this.setState({
      vouchers,
      loading: false,
    });
  };

  setClipboardContent = content => {
    Clipboard.setString(content);
  };

  toggleExpanded = ind => {
    const {collapsed} = this.state;
    if (ind === collapsed) {
      return this.setState({collapsed: 1000});
    }
    this.setState({collapsed: ind});
  };

  render() {
    const {navigation} = this.props;
    const {collapsed, vouchers, modalVisible, loading} = this.state;

    console.log("vouchers:", vouchers);

    
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <NavigationEvents
          onWillFocus={async () => {
            await this.loadRedemptions();
          }}
        />
        <StatusBar barStyle="light-content" backgroundColor="#6853C8" />
        <SubHeaderComponent title="Vouchers" />
        { loading ? (
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: '#FFFFFF',
              height,
              width,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator
              size="small"
              style={{ alignSelf: 'center', marginTop: -60 }}
              animating
              color="#000000"
            />
          </View>
        ): (
          <ScrollView
            style={{height: 1000, width, backgroundColor: '#EDF1F2'}}
            contentContainerStyle={{paddingBottom: 40}}>
            {vouchers && vouchers.length > 0 ? (
              vouchers.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity onPress={() => this.toggleExpanded(index)}>
                    <View
                      style={{
                        backgroundColor: '#FFF',
                        padding: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTopColor: '#B2B2BFBB',
                        borderBottomColor: '#B2B2BFBB',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        marginTop: -1,
                      }}>
                      <Text style={styles.headerText}>{item.prize}</Text>
                      <Icon
                        name={
                          collapsed !== index ? 'chevron-right' : 'chevron-down'
                        }
                        style={{color: '#2D2D2D'}}
                        size={22}
                      />
                    </View>
                  </TouchableOpacity>
                  <Collapsible collapsed={collapsed !== index} align="center">
                    <View style={styles.content}>
                      {item?.description?.indexOf('doação') === -1 && (
                        <TouchableOpacity
                          onPress={() => {
                            // Clipboard.setString(`${item.code}`)
                            if (item.code.substr(0, 4) === 'http') {
                              return Linking.openURL(item.code);
                            }
                            this.setClipboardContent(item.code);
                            Alert.alert(
                              'Código copiado',
                              'Agora é só colar no aplicativo para fazer a troca',
                              [
                                {
                                  text: 'OK',
                                  onPress: () => console.log(`${item.code}`),
                                },
                              ],
                              {cancelable: false},
                            );
                          }}>
                          <View
                            style={{
                              width: width - 48,
                              backgroundColor: '#CFDCDF',
                              paddingVertical: 12,
                              alignSelf: 'center',
                              marginBottom: 20,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Rubik-Bold',
                                fontSize: 20,
                                lineHeight: 24,
                                color: '#2D2D2D',
                                alignSelf: 'center',
                              }}>
                              {item.code}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ) 
                      // : (
                      //   <View
                      //     style={{
                      //       width: width - 48,
                      //       backgroundColor: '#CFDCDF',
                      //       paddingVertical: 12,
                      //       alignSelf: 'center',
                      //       marginBottom: 20,
                      //     }}>
                      //     <Text
                      //       style={{
                      //         fontFamily: 'Rubik-Bold',
                      //         fontSize: 20,
                      //         lineHeight: 24,
                      //         color: '#2D2D2D',
                      //         alignSelf: 'center',
                      //       }}>
                      //       {item.code}
                      //     </Text>
                      //   </View>
                      // )
                      }
                      <Text style={{textAlign: 'center', fontWeight: '900'}}>
                        Descrição
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginBottom: 12,
                          width: width * 0.7,
                          alignSelf: 'center',
                        }}>
                        {`${
                          item.howToUse
                          //.replaceAll('@', '\n')
                        }`}
                      </Text>
                      <Text style={{textAlign: 'center', fontWeight: '900'}}>
                        Data de expiração
                      </Text>
                      <Text style={{textAlign: 'center'}}>
                        {`${item.expiresIn}`}
                        {/* {`${moment(item.expiresIn).format('LL')}`} */}
                      </Text>
                      <TouchableOpacity
                        style={{
                          ...styles.openButton,
                          backgroundColor: '#FFFFFF00',
                          borderColor: '#6853C8',
                          borderWidth: 3,
                          width: width - 50,
                          marginTop: 20,
                        }}
                        onPress={() => {
                          this.setState({
                            modalVisible: true,
                          });
                        }}>
                        <Text
                          style={[
                            styles.textStyle,
                            {
                              color: '#6853C8',
                              fontFamily: 'Rubik-Bold',
                              fontSize: 15,
                              lineHeight: 20,
                            },
                          ]}>
                          REPORTAR UM PROBLEMA
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Collapsible>
                </View>
              ))
            ) : (
              <Text style={{alignSelf: 'center', marginTop: 50}}>
                Nenhuma recompensa foi resgatada.
              </Text>
            )}
            {modalVisible && (
              <ProblemModalComponent
                navigation={navigation}
                modalVisible={modalVisible}
                buttonFunction={path => {
                  this.setState({
                    modalVisible: false,
                  });
                  navigation.navigate(path);
                }}
                closeModal={() => this.setState({modalVisible: false})}
              />
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

ExtractRedemptionScreen.navigationOptions = ({navigation}) => ({
  // headerLeft: (<BackButton back={navigation} bgWhite />),
  headerTintColor: '#FFFFFF',
  headerTitleAlign: 'center',
  headerTitle: (
    <FastImage
      resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60,
        height: 16,
        resizeMode: 'contain',
      }}
    />
  ),
  headerTitleStyle: {alignSelf: 'center'},
  headerBackTitleStyle: {
    color: '#FFFFFF',
    fontFamily: 'Rubik-Medium',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 6,
  },
  headerBackTitle: ' ',
  headerStyle: {
    backgroundColor: '#6853C8',
    ...Platform.select({
      ios: {
        shadowColor: '#00000000',
        shadowOffset: {height: 0},
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: {
        elevation: 0,
      },
    }),
    borderBottomWidth: 0,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    color: '#2D2D2D',
  },
  content: {
    padding: 20,
    backgroundColor: '#EDF1F2',
  },
  openButton: {
    borderRadius: 30,
    padding: 13,
    elevation: 2,
    height: 48,
    marginTop: 12,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -2,
  },
});

export default ExtractRedemptionScreen;
