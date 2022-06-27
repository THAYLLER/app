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
  FlatList,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import Images from '../constants/Images';
import MenuButton from '../components/MenuButtonComponent';
import ProductComponent from '../components/ProductComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import LoadingModalComponent from '../components/LoadingModalComponent';
import { CiclooService } from '../services';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

class FavoritesScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      favorites: [],
      categ: {},
      footerLoading: false,
      page: 1,
      noMoreProducts: false,
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    // const favoritos = await CiclooService.GetFavorites(1);
    console.log('favoritos categ :>> ');
    // this.setState({
    //   favorites: favoritos[0].offers,
    //   loading: false,
    // });
    await this.getFavoritesOffers(1);
  }

  getFavoritesOffers = async (page) => {
    const {
      favorites, footerLoading, noMoreProducts,
    } = this.state;
    // if (noMoreProducts) {
    //   return Alert.alert('Fim da lista');
    // }
    if (footerLoading) return null;
    this.setState({ footerLoading: true });
    const ofertas = await CiclooService.GetFavorites(page);
    console.log('ofertas categ :>> ', ofertas);
    if (ofertas.length === 0) {
      return this.setState({
        loading: false,
        footerLoading: false,
        noMoreProducts: true,
      });
    }
    if (page === 1) {
      return this.setState({
        favorites: ofertas,
        loading: false,
        footerLoading: false,
      });
    }
    const joinOffers = [...favorites, ...ofertas];
    return this.setState({
      favorites: joinOffers,
      loading: false,
      footerLoading: false,
    });
  }

  handleFavoriteItem = async (index, itemId) => {
    console.log('index', index);
    const { favorites } = this.state;
    const modFav = [...favorites];
    modFav.splice(index, 1);
    // modFav[index].isFavorite = !favorites[index].isFavorite;
    this.setState({
      favorites: modFav,
    });
    await CiclooService.RemoveFromFavorites(itemId);
  }

  renderMore = async () => {
    const { page, noMoreProducts } = this.state;
    if (noMoreProducts) {
      return;
    }
    this.setState({ page: page + 1 });
    await this.getFavoritesOffers(page + 1);
  }

  renderItem = ({ item, index }) => (
    <ProductComponent
      index={index}
      style={{
        alignSelf: 'center', marginVertical: 6, marginLeft: 6, marginRight: 6,
      }}
      key={item.offerId}
      productImage={item.picture || null}
      coinsQuantity={item.amount || 0}
      description={item.description || ''}
      // isFavorite
      chooseItem={() => this.handleFavoriteItem(index, item.offerId)}
      doubleCoins={item.attributes.find(item => (item.key == 'highlight' && item.value == "true"))}
      isDoubled={item.eligibleParticipationAuthorization?.hasAuthorization}
    />
  );

  renderFooter = () => {
    const { footerLoading, noMoreProducts } = this.state;
    if (!footerLoading || noMoreProducts) return null;

    return (
      <View style={styles.loading}>
        <ActivityIndicator style={{ alignSelf: 'center' }} />
      </View>
    );
  }

  render() {
    const { favorites, loading } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <NavigationEvents
          onWillFocus={async () => {
            this.setState({ noMoreProducts: false });
            await this.getFavoritesOffers(1);
          }}
        />
        <StatusBar barStyle="light-content" />
        <SubHeaderComponent title="Favoritos" />
        {favorites.length === 0 && !loading ? (
          <Text style={{ alignSelf: 'center', marginTop: 50 }}>
            Nenhuma oferta foi favoritada.
          </Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, paddingTop: 20, paddingHorizontal: 10 }}
            contentContainerStyle={styles.list}
            data={favorites}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
            onEndReached={this.renderMore}
            onEndReachedThreshold={1}
            ListFooterComponent={this.renderFooter}
            numColumns={2}
          />
        )}
        {loading && (
          <LoadingModalComponent visible={loading} />
        )}
      </SafeAreaView>
    );
  }
}

FavoritesScreen.navigationOptions = ({ navigation }) => ({
  title: 'FAVORITOS',
  headerLeft: () => (
    <MenuButton nav={navigation} />
  ),
  headerBackTitle: ' ',
  headerTintColor: '#FFFFFF',
  headerBackTitleStyle: {
    color: '#FFFFFF',
    fontFamily: 'AvenirNextLTPro-Demi',
    fontSize: 14,
    lineHeight: 14,
    marginTop: 6,
    marginLeft: 16,
  },
  headerTitleAlign: 'center',
  headerTitle: (<FastImage resizeMode={FastImage.resizeMode.contain}
    source={Images.logo}
    style={{
      width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
    }}
  />),
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
    justifyContent: 'space-between',
    paddingBottom: 40,
    marginLeft: 5,
  },
  loading: {
    width: width - 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default FavoritesScreen;
