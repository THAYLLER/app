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
  FlatList,
} from 'react-native';

import Images from '../constants/Images';
import ProductComponent from '../components/ProductComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import { CiclooService } from '../services';
import FastImage from 'react-native-fast-image';

//Push Imports
import BackgroundFetch from "react-native-background-fetch";
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Configure } from '../pushnotification/Notificationhandler'
import {initBackgroundFetch} from '../pushnotification/codeMatheusbase/code'

const { width, height } = Dimensions.get('window');

const productsItems = [
  {
    coinsQuantity: 3,
    doubleCoins: false,
    images: [Images.hellmans],
    description: 'Sabão Líquido Omo Lavagem Perfeita Refil 900 ML',
    id: 1,
  },
  {
    coinsQuantity: 3,
    doubleCoins: false,
    images: [Images.maizena],
    description: 'Sabão Líquido Omo Lavagem Perfeita Refil 900 ML',
    id: 2,
  },
  {
    coinsQuantity: 3,
    doubleCoins: false,
    images: [Images.hellmans],
    description: 'Sabão Líquido Omo Lavagem Perfeita Refil 900 ML',
    id: 3,
  },
  {
    coinsQuantity: 3,
    doubleCoins: false,
    images: [Images.maizena],
    description: 'Sabão Líquido Omo Lavagem Perfeita Refil 900 ML',
    id: 4,
  },
  {
    coinsQuantity: 3,
    doubleCoins: false,
    images: [Images.hellmans],
    description: 'Sabão Líquido Omo Lavagem Perfeita Refil 900 ML',
    id: 5,
  },
];


class StoresScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  constructor(props) {
    super(props);
    this.localNotify = null,
    this.state = {
      loading: true,
      offers: [],
      categ: {},
      footerLoading: false,
      page: 1,
      noMoreProducts: false,
      imageLoading: true,
    };
  }

  async componentWillMount() {
    this.setState({
      loading: true,
    });
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    const { navigation } = this.props;
    const categ = navigation.getParam('category', null);
    console.log('categ :>> ', categ);
    this.setState({ categ });
    this.getCategoryOffers(categ.categoryId, 1);
  }

  getCategoryOffers = async (categId, page) => {
    const {
      categ, offers, footerLoading, noMoreProducts,
    } = this.state;
    if (noMoreProducts) {
      return Alert.alert('Fim da lista');
    }
    if (footerLoading) return null;
    const categoryId = categId || categ.categoryId;
    this.setState({ footerLoading: true });
    console.log('[categoryId], categ, page', [categoryId], categ, page);
    const ofertas = await CiclooService.GetOffers([categoryId], page);
    console.log('ofertas categ :>> ', JSON.stringify(ofertas));
    if (ofertas.length === 0) {
      return this.setState({
        loading: false,
        footerLoading: false,
        noMoreProducts: true,
      });
    }
    const joinOffers = [...offers, ...ofertas[0].offers];
    return this.setState({
      offers: joinOffers,
      loading: false,
      footerLoading: false,
    });
  }

  handleFavoriteItem = async (index, itemId, baseId) => {
    console.log('index, itemId, baseId', index, itemId, baseId);

    const {
      offers,
    } = this.state;
    const isFav = offers[index].eligibleParticipationAuthorization.hasAuthorization;
    console.log('isFav', isFav);

    let allOffers = [...offers];
    allOffers[index].isDouble = !isFav;
    allOffers[index].eligibleParticipationAuthorization.hasAuthorization = !isFav;
    this.setState({
      offers: allOffers,
    });

    const body = {
      authorizationBaseId: baseId,
      saleId: itemId,
    };

    if (!isFav) {
      await CiclooService.DoubleThis(body);
    }
    if (isFav) {
      await CiclooService.DontDoubleThis(body);
    }
    return !isFav;
  }

  renderMore = async () => {
    const { page, noMoreProducts } = this.state;
    if (noMoreProducts) {
      return;
    }
    this.setState({ page: page + 1 });
    await this.getCategoryOffers(null, page + 1);
  }

  renderItem = ({ item, index }) => {
    const { imageLoading } = this.state;
    return (
      <ProductComponent
        index={index}
        style={{
          alignSelf: 'center', marginVertical: 6, marginLeft: 6, marginRight: 6,
        }}
        key={item.id}
        productImage={item.images && item.images.length > 0 ? item.images[0].url : null}
        coinsQuantity={item.benefit.voucher ? item.benefit.voucher.amount : 0}
        description={item.name}
        isFavorite={item.isDouble}
        chooseItem={() => this.handleFavoriteItem(index, item.id, item.eligibleParticipationAuthorization?.baseId)}
        // imageLoading
        // stopLoading={() => this.setState({ imageLoading: false })}
        // doubleCoins={item.category.name === 'MOEDAS EM DOBRO'}
        doubleCoins={item.attributes.find(item => (item.key == 'highlight' && item.value == "true"))}
        isDoubled={item.eligibleParticipationAuthorization?.hasAuthorization}
      />
    );
  };

  renderFooter = () => {
    const { footerLoading, noMoreProducts } = this.state;
    if (!footerLoading || noMoreProducts) return null;

    return (
      <View style={styles.loading}>
        <ActivityIndicator style={{ alignSelf: 'center' }} />
      </View>
    );
  };
 

  

  render() {
    const { navigation } = this.props;
    const { offers, loading, categ } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="light-content" />
        <SubHeaderComponent title={typeof categ.categoryName === 'string' ? categ.categoryName : ''} />
        {loading ? (
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
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, paddingTop: 20, paddingHorizontal: 10 }}
            contentContainerStyle={styles.list}
            data={offers}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
            onEndReached={this.renderMore}
            onEndReachedThreshold={1}
            ListFooterComponent={this.renderFooter}
            numColumns={2}
          />
        )}
      </SafeAreaView>
    );
  }
}

StoresScreen.navigationOptions = {
  // title: 'FAVORITOS',
  headerBackTitle: ' ',
  headerTintColor: '#FFFFFF',
  // headerTitleStyle: {
  //   color: '#FFFFFF',
  //   fontFamily: 'Rubik-Bold',
  //   fontSize: 15,
  //   marginTop: 6,
  // },
  headerTitleAlign: 'center',
  headerBackTitleStyle: {
    color: '#FFFFFF',
    fontFamily: 'Rubik-Bold',
    fontSize: 14,
    lineHeight: 14,
    marginTop: 6,
    marginLeft: 16,
  },
  headerTitle: () => (
    <FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />
  ),
  headerStyle: {
    backgroundColor: '#6853C8',
    borderBottomWidth: 0,
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
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  list: {
    alignItems: 'center',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignContent: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  loading: {
    width: width - 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default StoresScreen;
