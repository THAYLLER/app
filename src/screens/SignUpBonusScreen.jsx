//aleracao do botao hoje por André
import React, { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
  Linking,
  Animated,
  Modal,
  Keyboard,
  Image,
  SafeAreaView,
} from 'react-native';

import AppIntro from '../components/rn-falcon-app-intro/AppIntro';
import ContinueButton from '../components/ContinueButton';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class SignUpBonusScreen extends Component {
  static navigationOptions = () => ({
    headerShown: false,
    header: null,
  });

  constructor(props) {
    super(props);
    // this.testing = this.testing.bind(this);
    this.state = {
      activeBGcolor: '#665EFF',
      ind: 0,
      onboarding: [
        {
          img: Images.onboarding.two,
          imgBg: Images.rewardCadastro,
          backgroundColor: '#fff',
          nextLabelColor: '#ff3510',
          level: 10,
          title: {
            text: 'Você ganhou ',
            style: {
              color: '#665EFF',
              alignSelf: 'center',
              textAlign: 'center',
              // marginBottom: 16,
            },
          },
          complement: {
            text: '10',
            style: {
              color: '#000',
              alignSelf: 'center',
              textAlign: 'center',
              marginBottom: 16,
            },
          },
        //   subtitle: {
        //     text: 'R$ 1 = 1 moeda.',
        //     style: {
        //       color: '#fff',
        //       alignSelf: 'center',
        //       textAlign: 'center',
        //       marginBottom: 16,
        //     },
        //   },
          description: {
            text: 'Você completou o seu cadastro e\nganhou 10 moedaspara já resgatar sua\nprimeira recompensa.',
            style: {
              color: '#000',
              alignSelf: 'center',
              textAlign: 'center',
            },
          },
        },
      ],
      customStyles: {
        nextButtonText: {
          fontSize: 14,
          // paddingRight: 15
        },
        controllText: {
          fontSize: 14,
          // backgroundColor: '#f00',
          // paddingRight: 15
        },
        viewSkip: {
          // backgroundColor: '#f00',
          flex: 0.45,
          justifyContent: 'center',
          alignItems: 'center',
          height: 50,
          borderRadius: 25,
          borderWidth: 3,
          borderColor: '#fff',
        },
        btnContainer: {
          // backgroundColor: '#f00',
          flex: 0.45,
          justifyContent: 'center',
          alignItems: 'center',
          height: 50,
          // borderRadius: 25,
          borderWidth: 3,
          borderColor: 'transparent',
        },
        viewDoneButton: {
          backgroundColor: '#fff',
          flex: 0.45,
          justifyContent: 'center',
          alignItems: 'center',
          height: 50,
          borderRadius: 25,
          borderWidth: 3,
          borderColor: '#fff',
        },
        // btnSkipContainer: {
        //   flex: 0.45,
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   height: 50
        // },
        // fullSkip: {
        //   // height: 40,
        //   // width: 100,
        //   backgroundColor: '#f00',
        //   flex: 1,
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   borderRadius: 40,
        //   borderWidth: 3,
        // },
        activeDotStyle: {
          width: 30
        },
      },
    };
    this.localNotify = null
    this.handleNextClick = this.handleNextClick.bind(this)
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        console.log({url});
        if(url)
          this.props.navigation.navigate('Welcome', {openSignUp: true})
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }
  
  handleNextClick = index => {console.log({index});return this.setState({ activeBGcolor: this.state.onboarding[index].nextLabelColor, ind: index })}

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  handleOpenURL(event) {
    console.log(event.url);
    const route = e.url.replace(/.*?:\/\//g, '');
    // do something with the url, in our case navigate(route)
    console.log({route})
    if(route)
      this.props.navigation.navigate('Welcome', {openSignUp: true})
  }

  
  render() {
    const {
      onboarding, activeBGcolor, ind,
    } = this.state;
    const { navigation } = this.props;

    return (
      <>
        <StatusBar barStyle="light-content" translucent={Platform.OS === 'android'} backgroundColor="#6853C800" />
        <AppIntro
        //   skipBtnLabel="VOLTAR"
          showSkipButton={false}
          showDoneButton={false}
          showDots={false}
          doneBtnLabel="INICIAR"
          nextBtnLabel="AVANÇAR"
        //   customStyles={this.state.customStyles}
          leftTextColor="#ffff"
          rightTextColor={onboarding[ind].nextLabelColor}
        //   onSlideChange={(index) => (Platform.OS == `android`) ? this.handleNextClick(index) : setTimeout(() => this.handleNextClick(index), 100)}
        //   onDoneBtnClick={() => navigation.navigate('Welcome')}
        >
          {onboarding.map((item, index) => (
            <SafeAreaView style={{ flex: 1, backgroundColor: `${item.backgroundColor}` }} key={() => index.toString()}>
              <View style={{
                paddingBottom: 20, paddingTop: 30,
                width: width - 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
              }}
              >
                <FastImage resizeMode={FastImage.resizeMode.contain}
                  source={Images.logoPurple}
                  style={{
                    width: 60, height: 16, resizeMode: 'contain', alignSelf: 'center'
                  }}
                />
              </View>
              <View level={item.level} style={{
                  // marginTop: height > 800 ? 160 : 80,
                  marginBottom: height > 800 ? height - width - 460 : height - width - 350
              }}>
                {/* <FastImage resizeMode={FastImage.resizeMode.contain}
                  source={item.imgBg}
                  style={{
                    width,
                    height: width,
                  }}
                /> */}
                <View 
                  style={{
                    width,
                    height: width,
                    backgroundColor: '#fff'
                  }}
                />
                <FastImage resizeMode={FastImage.resizeMode.stretch}
                  source={item.imgBg}
                  style={{
                    width,
                    height: width,
                    maxHeight: height * 0.45,
                    // marginTop: 40,
                    position: 'absolute',
                    // resizeMode: 'cover',
                    alignSelf: 'center',
                  }}
                />
              </View>
              <View level={-15}>
                <View level={-15} style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginBottom: 16,}}>
                  <Text style={{ ...item.title.style, fontFamily: 'Rubik-Bold', fontSize: 26, justifyContent: 'flex-end' }}>{item.title.text}
                  {
                    (
                      item.complement 
                      ? <Text style={{ ...item.complement.style, color: '#000', fontWeight: '900', fontFamily: 'Rubik-Bold', fontSize: 26 }}>{item.complement.text}</Text>
                      : null
                    )
                  }
                  </Text>
                  <FastImage resizeMode={FastImage.resizeMode.contain}
                    source={Images.coin}
                    style={{
                      width: 20, height: 20, resizeMode: 'contain' , marginLeft: 3// , alignSelf: 'center'
                    }}
                  />
                </View>
              </View>
              {item.subtitle ? 
              <View level={-15}>
                <Text style={{ ...item.subtitle.style, fontFamily: 'Rubik-Bold', fontSize: 26 }}>{item.subtitle.text}</Text>
              </View>
               : <View level={0}/>
              }
              <View level={8}>
                <Text style={{ ...item.description.style, fontFamily: 'Rubik-Regular', fontSize: 15 }}>{item.description.text}</Text>
              </View>
              <View>
                <ContinueButton buttonPress={() => navigation.navigate('Redemption')} textInside="VER RECOMPENSAS" style={{ marginTop: 16, marginBottom: 5 }} bgWhite />
                <ContinueButton buttonPress={() => navigation.navigate('Home')} textInside="VOLTAR PARA A TELA INICIAL" style={{ marginBottom: 5 }} />
              </View>
            </SafeAreaView>
          ))}
        </AppIntro>
        {/* <TouchableOpacity
          style={styles.full}
          onPress={() => navigation.navigate('Welcome')}
        >
          <View style={{
            backgroundColor: 'transparent', paddingHorizontal: 30,
          }}
          >
            <Text style={[styles.controllText, { color: '#FFF' }]}>
              PULAR
            </Text>
          </View>
        </TouchableOpacity> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
  text: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
  touchableView: {
    top: 0,
    // position: 'absolute',
    // right: 0,
    // zIndex: 1,
    height: 50,
    // width: Math.floor(width * 0.40),
    width: width * 0.9,
    borderRadius: 8,
    // overflow: 'hidden',
    alignSelf: 'center',
    padding: 0,
    // paddingVertical: 0,
    // bottom: height * 0.05 + 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: Colors.backgroundColorCount,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 3, width: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonFacebook: {
    // backgroundColor: '#eee',
    // alignSelf: 'center',
    // marginBottom: 60,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    color: '#665EFF',
    flex: 1,
    fontSize: 13,
    lineHeight: 14,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: -14,
  },
  controllText: {
    // color: '#fff',
    color: '#665EFF',
    fontSize: 14,
    // fontWeight: 'bold',
  },
  full: {
    height: 50,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 48,
    zIndex: 999999,
    borderRadius: 40,
    // borderColor: '#FFF',
    // borderWidth: 3,
  },
});

export default SignUpBonusScreen;
