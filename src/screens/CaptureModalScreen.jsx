import React from 'react';
///
import {
  SafeAreaView, ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Text, Platform, StatusBar, ImageBackground, Image,
} from 'react-native';
import { StackActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContinueButton from '../components/ContinueButton';
import BackButton from '../components/BackButtonComponent';
import Line from '../components/LineComponent';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
// import { useHeaderHeight } from '@react-navigation/stack';
// const headerHeight = useHeaderHeight();
import analytics from '@react-native-firebase/analytics';

import {
  Actions,
  Col,
  Content,
  Containermarcas,
  DescriptionOrange,
  DescriptionPurple,
  LogoTopo,
  Marcas,
  Row,
  Topo,
  Wrap
} from '../components/Content/style'

const headerHeight = 40;

const { width, height } = Dimensions.get('window');

class CaptureModalScreen extends React.Component {
  // navigationOptions = ({ navigation }) => ({
  //   headerLeft: (<BackButton back={navigation} />),
  //   headerStyle: {
  //     backgroundColor: 'transparent',
  //   },
  // })

  componentDidMount() {
    const { navigation } = this.props;
    console.log('didmount called.', navigation);
    StatusBar.setBarStyle('light-content', true);
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    console.log('componentWillUnmount called.', navigation);
    StatusBar.setBarStyle('light-content', true);
  }

  getBack = async () => {
    const { navigation } = this.props;
    const resetAction = StackActions.popToTop();
    await analytics().logEvent('open_scan_qrcode');

    setTimeout(() => {
      navigation.dispatch(resetAction);
    }, 100);
    navigation.goBack(null);
    navigation.navigate('Links', { comingFrom: 'CaptureModal' });
  }

  render() {
    const { navigation } = this.props;
    return (
      <Wrap>
        <Content> 
          <Topo>
            <Row>
              <Col Value="4">
                <TouchableOpacity
                  onPress={() => navigation.goBack(null)}
                  hitSlop={{
                    top: 20, right: 20, bottom: 20, left: 20,
                  }}
                >
                  <Icon name="close" size={24} color="#6853C8" />
                </TouchableOpacity>
              </Col>
              <Col Value="8">
                  <LogoTopo source={Images.logotopo}/>
              </Col>
            </Row>
          </Topo>
          <Actions>
            <Row>
              <Col Value="12">
                <DescriptionPurple> 
                {'Escaneie o QR Code\nda sua nota fiscal'}
                </DescriptionPurple>
                <ContinueButton
                  buttonPress={() => this.getBack()}
                  textInside="ABRIR CÂMERA E ESCANEAR NF"
                  style={{
                    marginBottom: 10, width: width - 50, backgroundColor: '#6853C8',
                  }}
                  bgWhite={false}
                />
              </Col>
            </Row>
          </Actions>
          <Containermarcas>
            <Row>
              <Col Value="12">
                <DescriptionOrange>
                  {'Veja algumas das \nmarcas participantes.'}
                </DescriptionOrange>
              </Col>
            </Row>      
            <Marcas source={Images.marcas}/>
          </Containermarcas>
        </Content>
      </Wrap>
    );
  }
}

CaptureModalScreen.navigationOptions = ({ navigation }) => ({
  // headerLeft: (<BackButton back={navigation} />),
  // headerStyle: {
  //   backgroundColor: 'transparent',
  //   borderBottomWidth: 0,
  //   borderBottomColor: 'transparent',
  // },
  header: null,
  tabBarVisible: false,
});

export default CaptureModalScreen;

