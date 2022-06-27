import React, { Component, Fragment } from 'react';
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
import SearchButtonComponent from '../components/SearchButtonComponent';
import ProductComponent from '../components/ProductComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import DismissKeyboardView from '../components/DismissKeyboardView';
import LoadingModalComponent from '../components/LoadingModalComponent';
import { CiclooService } from '../services';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class SearchScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      offers: [],
      categ: {},
      footerLoading: false,
      page: 1,
      noMoreProducts: false,
      imageLoading: true,
      searchTerm: '',
      noProducts: false,
      bannerData: null,
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    const { navigation } = this.props;
    let bannerData = (navigation.state.params.bannerData) ? navigation.state?.params?.bannerData : null
    if(bannerData){
      this.setState({
        searchTerm: bannerData.searchText,
        bannerData,
        loading: true,
        noProducts: false,
        offers: [],
        noMoreProducts: false,
      }, () => this.getCategoryOffers(null, 1))
    }
    // console.log({bannerData: navigation.state.params.bannerData, props: this.props})
    // const categ = navigation.getParam('category', null);
    // console.log('categ :>> ', categ);
    // this.setState({ categ });
    // this.getCategoryOffers(categ.categoryId, 1);
  }

  getCategoryOffers = async (categId, page) => {
    const {
      categ, offers, footerLoading, noMoreProducts, searchTerm,
    } = this.state;
    if (noMoreProducts) {
      return null;
      // return Alert.alert('Fim da lista');
    }

    if (searchTerm.length === 0) return null;
    if (footerLoading) return null;
    const categoryId = categId ? [categId] : [];
    this.setState({ footerLoading: true });
    console.log('[categoryId], categ, page', categoryId, categ, page);
    const ofertas = await CiclooService.GetOffers(categoryId, page, searchTerm);
    console.log('ofertas categ :>> ', ofertas);
    if (ofertas[0].offers.length === 0) {
      return this.setState({
        loading: false,
        footerLoading: false,
        noMoreProducts: true,
        noProducts: !(offers.length > 0),
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
    const isFav = offers[index].isDouble;
    console.log('isFav', isFav);

    const allOffers = [...offers];
    allOffers[index].isDouble = !isFav;
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
    const { imageLoading, bannerData } = this.state;
    return (
      <ProductComponent
        index={index}
        style={{
          alignSelf: 'center', marginVertical: 6, marginLeft: 6, marginRight: 6,
        }}
        key={item.id}
        isBanner={!!bannerData}
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
    const {
      offers, loading, categ, noProducts, searchTerm, bannerData
    } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="light-content" />
        {/* <SubHeaderComponent title={(bannerData) ? bannerData.title : "PROCURAR PRODUTOS"} noForceUpperCase={true} /> */}
        {
          bannerData == null ? 
          <SearchButtonComponent
            searchInput
            onChange={(value) => this.setState({ searchTerm: value })}
            search={() => {
              this.setState({
                loading: true, noProducts: false, offers: [], noMoreProducts: false,
              }, () => this.getCategoryOffers(null, 1));
              // this.getCategoryOffers(null, 1);
            }}
          />
           :<View style={styles.item}>
             <FastImage resizeMode={FastImage.resizeMode.cover}
               source={{ uri: `${CiclooService.fileUrl}${bannerData.url}` }}
               style={styles.image}
             />
           </View>
        }
        <DismissKeyboardView>
          <>
            {loading && searchTerm != '' && (
            <ActivityIndicator color="#4a4a4a" size="small" style={{ marginTop: 120 }} />
            )}
            {/* {!loading && !noProducts && searchTerm == '' && (
            <Text style={{ top: height * 0.2, alignSelf: 'center' }}>
              {``}
            </Text>
            )} */}
            {noProducts && (
            <Text style={{ top: height * 0.2, alignSelf: 'center' }}>
              {`Não existe produtos com o termo ${searchTerm}`}
            </Text>
            )}
            {!loading && (
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
          </>

          {/* {loading ? (
            <ActivityIndicator color="#4a4a4a" size="small" style={{ marginTop: 120 }} />
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
              ListEmptyComponent={() => (
                <Text>
                  {`Não existe produtos com o termo ${searchTerm}`}
                </Text>
              )}
            />
          )} */}
        </DismissKeyboardView>
      </SafeAreaView>
    );
  }
  componentWillUnmount(){
    this.setState({bannerData: null})
  }
}

SearchScreen.navigationOptions = ({ navigation, screenProps }) => ({
  title: 'Carregando...',
  headerBackTitle: ' ',
  headerTintColor: '#FFFFFF',
  tabBarVisible: false,
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
    <View style={{
      width: width - 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
    }}
    >
      <Text style={{
        // width: 60, 
        color: '#FFF',
        fontSize: 15,
        lineHeight: 16,
        fontFamily: 'Rubik-Bold',
        alignSelf: 'center',
        // marginLeft: -60,
      }}
      >
        {(navigation.state?.params?.bannerData) ? navigation.state.params.bannerData.title : "PROCURAR PRODUTOS" }
      </Text>
    </View>
  // <FastImage resizeMode={FastImage.resizeMode.contain}
  //   source={Images.logo}
  //   style={{
  //     width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
  //   }}
  // />
  ),
  headerStyle: {
    backgroundColor: '#6853C8',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },
  list: {
    alignItems: 'flex-start',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignContent: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
    marginLeft: 5,
  },
  loading: {
    width: width - 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
  item: {
    width: width-40,
    alignSelf: 'center',
    aspectRatio: 1.8,
    marginTop: 20,
    // flex: 1,
    // backgroundColor: 'lightblue',
  },
  image: {
    // ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    flex: 1,
    // resizeMode: 'cover',
  },
});

export default SearchScreen;
