import React, { Component, useEffect } from 'react';
import {
  AppRegistry,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Text,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationEvents } from 'react-navigation';
import analytics from '@react-native-firebase/analytics';
import Authentication from '../utils/Authentication';
import FastImage from 'react-native-fast-image';
import EncryptedStorage from 'react-native-encrypted-storage'
import { result } from 'underscore';
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import SliderEntry from '../components/SliderEntry';
// import { connect } from 'react-redux';

//Push Notification, Background Fetch e Async Storage
import BackgroundFetch from "react-native-background-fetch";
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Configure } from '../pushnotification/Notificationhandler'
import {initBackgroundFetch} from '../pushnotification/codeMatheusbase/code'

//Componentes padrões que vieram projeto
import Images from '../constants/Images';
import SubHeaderComponent from '../components/SubHeaderComponent';
import MenuButton from '../components/MenuButtonComponent';
import NotificationButton from '../components/NotificationButtonComponent';
import SearchButtonComponent from '../components/SearchButtonComponent';
import ProductSectionComponent from '../components/ProductSectionComponent';
import LoadingModalComponent from '../components/LoadingModalComponent';
import { CiclooService } from '../services';
import Main from '../utils/Main';
import BehaviorService from '../services/BehaviorService';
//Styled Components 
import {
  ContainerLogo,
  ContainerMenu,
  Template,
  Rowmarcas,
  Gridmarcas,
  Header,
} from '../components/Marcas/style'

//TrackingTransparency
import { request, RESULTS, PERMISSIONS } from 'react-native-permissions'

export const requestPermissionTransparency = async () => {
  return await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
}

//Largura
const { width, height } = Dimensions.get('window');

class HomeScreen extends Component {

  useEffect= (async ()=> {
    const result = await requestPermissionTransparency()
      if (result === RESULTS.GRANTED) {
        await firebase.analytics().setAnalyticsCollectionEnabled(true)
        console.log('Firebase Analytics: Carregando')
      }
    }, []);

  static navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
      <MenuButton nav={navigation} />
    ),
    headerTintColor: '#FFFFFF',
    headerTitleAlign: 'center',
    headerTitle: () => (
      <View style={{
        width: width - 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
      }}
      >
        <Text style={{
          // width: 60, 
          color: '#FFF',
          fontSize: 18,
          // lineHeight: 16,
          fontFamily: 'Rubik-Bold',
          alignSelf: 'center',
          // marginLeft: -60,
        }}
        >
          Produtos participantes
        </Text>
      </View>
    // <FastImage resizeMode={FastImage.resizeMode.contain}
    //   source={Images.logo}
    //   style={{
    //     width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
    //   }}
    // />
    ),
    headerRight: () => (
      <NotificationButton
        nav={navigation}
        style={{
          alignSelf: 'flex-end',
          width: 60,
        }}
      />
    ),
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
    headerBackTitleStyle: {
      color: '#FFFFFF',
      fontFamily: 'Rubik-Medium',
      fontSize: 11,
      lineHeight: 14,
      marginTop: 6,
    },
    headerBackImage: () => (
      <Icon
        name="chevron-left"
        size={12}
        style={{
          marginLeft: 16,
        }}
      />
    ),
    headerStyle: {
      backgroundColor: '#6853C8',
      ...Platform.select({
        ios: {
          shadowColor: '#00000000',
          shadowOffset: { height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        android: {
          elevation: 0,
        },
      }),
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: 'Rubik-Bold',
      alignSelf: 'center',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      offers: [],
      imageLoading: true,
      selectedIndex: 0,
      events: [],
      receipts: [],
      activeIndex:0,
      banners: [],
      marcas: [
        require('../../assets/images/logos/omo.png'),
        require('../../assets/images/logos/dove.png'),
        require('../../assets/images/logos/rexona.png'),
        require('../../assets/images/logos/confort.png'),
        require('../../assets/images/logos/hellmanns.png'),
        require('../../assets/images/logos/kibon.png'),
        require('../../assets/images/logos/brilhante.png'),
        require('../../assets/images/logos/clear.png'),
        // require('../../assets/images/logos/knorr.png'),
        // require('../../assets/images/logos/lux.png'),
        // require('../../assets/images/logos/bens.png'),
        // require('../../assets/images/logos/cif.png'),
        // require('../../assets/images/logos/seda.png'),
        // require('../../assets/images/logos/suave.png'),
        // require('../../assets/images/logos/terra.png'),
        // require('../../assets/images/logos/arisco.png'),
        // require('../../assets/images/logos/axe.png'),
        // require('../../assets/images/logos/maizena.png'),
      ],
    };
    this.localNotify = null
  }
  
  async componentDidMount() {
    console.log('started!')
    // EncryptedStorage.getAllKeys((error, keys) => console.log({keys}))
    // this.notify("teste", "notif")
    this.setState({
      loading: true,
    });
    await BehaviorService.setSignedIn()
    let banners = await CiclooService.GetBanners();
    console.log('banners:', banners)
    let receipts = await CiclooService.GetReceipts();
    await EncryptedStorage.setItem('receipts', JSON.stringify(receipts))
    // this.interval = setInterval(() => this.addEvent('fetch'), 1*60*1000)
    analytics().logScreenView({ screen_class: 'Home', screen_name: 'Home' });
    StatusBar.setBarStyle('light-content', true);
    this.setState({banners})
    console.log({banners})
    await this.loadOffers();
    // if(Platform.OS== 'ios'){
    //   this.actionNullRegister(true)
    // }
  }
  
  //Em caso de voltar o antigo código do Matheus
  //Ele vai aqui
  
  //fim parte do Matheus 

  

  //Background Fetch Regra 4
  
  actionNullRegister = () => {
      this.localNotify.showNotification(
        2,
        "App Cicloo informa:",
        'Envie seus cupons fiscais com produtos das marcas participantes e aproveite os prêmios disponíveis no CICLOO',
        {},
        {}
      )
  }
  //Fim parte envio Push regra 4
  loadOffers = async () => {
    const { navigation } = this.props;
    this.setState({
      loading: true,
    });
    try {
      const ofertas = await CiclooService.GetOffers([], 1);
      console.log({ofertas});
      if(ofertas.length > 0)
        await ofertas.sort((a, b) => a.highlight ? -1 : 1)
      console.log({"ofertasPosSort": ofertas});
      this.setState({
        offers: ofertas,
        loading: false,
      });
    } catch (error) {
      Authentication.onSignOut().then(() => navigation.navigate('Auth'));
    }
  }

  handleFavoriteItem = async (categoryIndex, item, itemId, baseId) => {
    // console.log({'categoryIndex, item, itemId, baseId': [categoryIndex, item, itemId, baseId]});

    const {
      offers,
    } = this.state;
    const isFav = offers[categoryIndex].offers[item].eligibleParticipationAuthorization?.hasAuthorization;
    console.log({'isFav': isFav});
    console.log({offers: offers[categoryIndex].offers[item]});
    console.log({item: offers[categoryIndex].offers[item]});

    let allOffers = [...offers];
    allOffers[categoryIndex].offers[item].isDouble = !isFav;
    allOffers[categoryIndex].offers[item].eligibleParticipationAuthorization.hasAuthorization = !isFav;
    console.log({allOffers})
    this.setState({
      offers: allOffers,
    });

    const body = {
      authorizationBaseId: baseId,
      saleId: itemId,
    };
    let coinVal = this.state.offers[categoryIndex].offers[item].benefit.voucher.amount
    if (!isFav) {
      const params = {
        category: allOffers[categoryIndex].categoryName,
        id: itemId,
        name: allOffers[categoryIndex].offers[item].name,
        coinValue: Number(allOffers[categoryIndex].offers[item].benefit.voucher.amount),
      };
      console.log({'params': params});
      Main.addToWishlist(params);
      console.log({'body DoubleThis': body});
      await CiclooService.DoubleThis(body);
    }
    if (isFav) {
      await CiclooService.DontDoubleThis(body);
    }
    // offers[categoryIndex].offers[item].isDouble = !isFav
    // console.log({offers})
    // this.setState({isFavorite: !isFav})
    return !isFav

    // await this.loadOffers();
  }

  _renderItem = ({ item, index }, parallaxProps) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity key={index} onPress={() => navigation.navigate('Search', {bannerData: item})}>
        <SafeAreaView style={styles.item}>
          <ParallaxImage
            source={{ uri: `${CiclooService.fileUrl}${item.url}` }}
            containerStyle={styles.imageContainer}
            style={styles.image}
            {...parallaxProps}
          />
        </SafeAreaView>
      </TouchableOpacity>
    );
  }

  _renderPaging = ({ data, activeSlide }) => {
    // console.log({data})
    return <Pagination 
      dotsLength={data.length}
      // dotsLength={3}
      activeDotIndex={activeSlide}
      containerStyle={styles.dotContainer}
      dotStyle={styles.dotStyle}
      inactiveDotStyle={styles.inactiveDotStyle}
      // dotContainerStyle={{margin: 20}}
      // inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
    />
  }

  formatCategoryName = name => {
    let fragments = name.split(' ')
    return (fragments.length == 1)
      ? fragments[0].charAt(0).toUpperCase() + fragments[0].slice(1).toLowerCase()
      : fragments.map(frag => frag.length > 3 
        ? frag.charAt(0).toUpperCase() + frag.slice(1).toLowerCase()
        : frag.toLowerCase()).join(' ')
  }

  render() {  
    const { navigation } = this.props;
    const {
      offers, loading, imageLoading, selectedIndex, banners, activeIndex, marcas
    } = this.state;
    let {buttonClick} = styles;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <NavigationEvents
          onWillFocus={async () => {
            await this.loadOffers();
          }}
        />
        <StatusBar barStyle="light-content" backgroundColor="#6853C8" hidden={false} />
        {/* <SubHeaderComponent title="Ofertas" /> */}
        <ScrollView
          horizontal
          style={{
            backgroundColor: '#6853C8',
            minHeight: 40,
            paddingVertical: 10,
          }}
          showsHorizontalScrollIndicator={false}
        >
          {offers && offers.length ? offers?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                // paddingVertical: 10,
                marginTop: -12,
              }}
              onPress={async () => {
                await analytics().logEvent('focus_step_press', {
                  step: item.categoryName
                });
                this.scroll.scrollTo({ x: 0, y: index * 430 + 64, animated: true });
                this.setState({
                  selectedIndex: index,
                });
              }}
            >
              <Text style={{
                alignSelf: 'center',
                color: '#FFF',
                fontSize: 15,
                lineHeight: 24,
                marginLeft: index === 0 ? 20 : 8,
                marginRight: 12,
                // marginTop: -1,
                // marginBottom: 12,
                fontFamily: 'Rubik-Regular',
                opacity: selectedIndex === index ? 1 : 0.4,
                height: 30,
                paddingVertical: 6,
              }}
              >
                {this.formatCategoryName(item.categoryName)}
              </Text>
            </TouchableOpacity>
          )) : null}
        </ScrollView>
        <ScrollView
          style={{ height: 1000, width }}
          contentContainerStyle={{ paddingBottom: 40 }}
          ref={(ref) => {
            this.scroll = ref;
          }}
          scrollEventThrottle={8}
          onScrollEndDrag={(e) => {
            this.setState({
              selectedIndex: Math.floor((e.nativeEvent.contentOffset.y + 150) / 430),
            });
          }}
          bounces={false}
        >
          <SearchButtonComponent navigateTo={() => navigation.navigate('Search', {bannerData: null})} />
          {
          // banners.length > 0 && 
          // <Carousel
          //   sliderWidth={width}
          //   sliderHeight={width*.8}
          //   itemWidth= {width - 50}
          //   data={banners}
          //   renderItem={this._renderItem}
          //   hasParallaxImages={true}
          //   inactiveSlideScale={0.94}
          //   inactiveSlideOpacity={0.7}
          //   loop={true}
          //   loopClonesPerSide={2}
          //   autoplay={true}
          //   autoplayDelay={500}
          //   autoplayInterval={5000}
          //   onSnapToItem = { index => this.setState({activeIndex:index}) }
          // />
          console.log('b>>',banners)
          }
          {/* {banners.length > 0 && this._renderPaging({data: banners, activeSlide: activeIndex})} */}
          {offers.length > 0 &&
            <View style={{ marginBottom: 0 }}>
              <View style={{
                flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 16, width: width * 0.95, justifyContent: 'space-between',
              }}
              >
                <Text style={{
                  color: '#6853C8', fontWeight: '900', letterSpacing: -0.5, fontSize: width > 380 ? 16 : 14, lineHeight: width > 380 ? 18 : 16, marginLeft: 24,
                }}
                >
                  {"Marcas participantes".toUpperCase()}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Marcas')} style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#2D2D2D', alignSelf: 'center' }}>
                    Todas
                  </Text>
                  <Icon name="chevron-right" color="#2D2D2D" size={24} />
                </TouchableOpacity>
              </View>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ backgroundColor: '#fff' }}>
                <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
                  {
                    marcas.map((item, index) => (
                      <View key={index} style={{
                        borderWidth: 1,
                        borderColor: '#CFDCDF',
                        borderRadius: 6,
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginHorizontal: 4,
                      }}>
                        <FastImage 
                          resizeMode={FastImage.resizeMode.contain}
                          style={{ width: width*.2, aspectRatio: 1 }} 
                          source={item} />
                      </View>
                    ))
                  }
                  
                </View>
              </ScrollView>
            </View>
          }
          {offers && offers.length ? offers.map((item, index) => (
            <ProductSectionComponent
              key={index}
              sectionTitle={item.categoryName}
              list={item.offers}
              navigateTo={() => {
                Main.selectContentCategory({
                  categoryId: item.categoryId, categoryName: item.categoryName,
                });
                navigation.navigate('Stores', { category: { categoryId: item.categoryId, categoryName: item.categoryName } });
              }}
              doubleCoins={item.categoryName === 'MOEDAS EM DOBRO'}
              key={item.categoryId}
              markAsFavorite={(ind, itemId, baseId) => this.handleFavoriteItem(index, ind, itemId, baseId)}
              imageLoading={imageLoading}
              stopLoading={() => {
                setTimeout(() => {
                  this.setState({ imageLoading: false });
                }, 4000);
              }}
              isLast={offers.length === index + 1}
            />
          )) : null}
        </ScrollView>
        {loading && (
          <LoadingModalComponent visible={loading} />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  buttonClick: {
    alignItems: 'center',
    backgroundColor: '#eee'
  },
  container: {
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
  },
  item: {
    width: '100%',
    aspectRatio: 1.8,
    // height: width * 0.5,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    marginBottom: Platform.select({ ios: 0, android: 1 }), //handle rendering bug.
  },
  image: {
    // ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  dotContainer: {
    paddingTop: 20,
    paddingBottom: 30
    // backgroundColor: 'rgb(230,0,0)',
    // maxHeight: 20,
  },
  dotStyle: {
    width: 30,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6853C8',
  },
  inactiveDotStyle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#6853C8',
    backgroundColor: '#fff',
    // backgroundColor: 'rgb(255,230,230)',
  },
});

export default HomeScreen;
