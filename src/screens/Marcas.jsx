import React, { Component } from 'react';
import { 
  RefreshControl,
  ScrollView, 
  StatusBar, 
  Dimensions 
} from 'react-native';
import FastImage from 'react-native-fast-image';

//Components Menu
import Images from '../constants/Images';
import MenuButton from '../components/MenuButtonComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import { NavigationEvents } from 'react-navigation';
import LoadingModalComponent from '../components/LoadingModalComponent';
import Icon from 'react-native-vector-icons/MaterialIcons';
//Styled Components 
import {
  ContainerLogo,
  ContainerMenu,
  Template,
  Rowmarcas,
  Gridmarcas,
  Header,
} from '../components/Marcas/style'

const { width, height } = Dimensions.get('window');
//Render Componente
class Marcas extends Component{
  static navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
      <MenuButton nav={navigation} />
    ),
    headerTintColor: '#FFFFFF',
    headerTitleAlign: 'center',
    headerTitle: (<FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />),
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
  //Props
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      offers: [],
      imageLoading: false,
      selectedIndex: 0,
      events: [],
      receipts: [],
    };
    this.localNotify = null
  }
  //Componente DidMount
  async componentDidMount() {
    // this.notify("teste", "notif")
    this.setState({
      loading: false,
    });
    StatusBar.setBarStyle('light-content', true);
  }

  render() {
    const { navigation } = this.props;
    const {
      offers, loading, imageLoading, selectedIndex,
    } = this.state;
    //Render
    return (
      <Template>
        <Header>
          <ContainerMenu>
            <MenuButton nav={navigation} />
          </ContainerMenu>
          <ContainerLogo>
            <FastImage 
            resizeMode={FastImage.resizeMode.contain}
            style={{ width: 60, height: 40 }} 
            source={require('../../assets/images/logos/logoclean.png')} />
          </ContainerLogo>
        </Header>
        <NavigationEvents
          onWillFocus={async () => {
            await this.loadOffers();
          }}
        />
        <StatusBar barStyle="light-content" backgroundColor="#6853C8" hidden={false} />
        <SubHeaderComponent title="Marcas Participantes" />
        <ScrollView style={{ backgroundColor: '#fff' }}>
          <Rowmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/omo.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/dove.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/rexona.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/confort.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/hellmanns.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/kibon.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/brilhante.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/clear.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/knorr.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/lux.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/bens.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/cif.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/seda.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/suave.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/terra.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/arisco.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/axe.png')} />
            </Gridmarcas>
            <Gridmarcas>
              <FastImage 
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: 90, height: 90 }} 
                source={require('../../assets/images/logos/maizena.png')} />
            </Gridmarcas>
          </Rowmarcas>
        </ScrollView>
        {loading && (
          <LoadingModalComponent visible={loading} />
        )}
      </Template>
    );
  }  
}

export default Marcas