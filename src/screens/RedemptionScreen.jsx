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
  ImageBackground,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Images from '../constants/Images';
import MenuButton from '../components/MenuButtonComponent';
import SubHeaderComponent from '../components/SubHeaderComponent';
import RewardSectionComponent from '../components/RewardSectionComponent';
import NotificationButton from '../components/NotificationButtonComponent';
import LoadingModalComponent from '../components/LoadingModalComponent';
import CoinsMaxModal from '../components/CoinsMaxModalComponent';
import ContinueButton from '../components/ContinueButton';
import { CiclooService } from '../services';
import Main from '../utils/Main';
import FastImage from 'react-native-fast-image';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

class RedemptionScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#000000',
    headerLeft: () => <MenuButton nav={navigation} />,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible: false,
      modalRegisterVisible: false,
      modalSuccessVisible: false,
      rewards: [],
      balance: 0,
      itemSelected: null,
      progressImage: Images.coinProgress,
      lackPoint: null,
      rewardloading: false,
      lockedRegister: true,
      analyticsParams: {
        name: '',
        value: 0,
      },
      showMaxModal: false,
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
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: () => <MenuButton nav={navigation} />,
    headerTintColor: '#FFFFFF',
    headerTitleAlign: 'center',
    headerTitleStyle: { alignSelf: 'center' },
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
    headerTitle: () => (
      <View
        style={{
          width: width - 60,
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            // width: 60,
            color: '#FFF',
            fontSize: 18,
            // lineHeight: 16,
            fontFamily: 'Rubik-Bold',
            alignSelf: 'center',
            // marginLeft: -60,
          }}>
          Recompensas
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
  });

  async componentWillMount() {
    this.setState({
      loading: true,
    });
  }

  async componentDidMount() {
    const { navigation } = this.props;
    StatusBar.setBarStyle('light-content', true);
    const dataBalance = await CiclooService.GetBalance();
    console.log('dataBalance', dataBalance);

    this.getParticipant();

    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      this.getParticipant();
    });

    this.setState({
      dataBalance,
    });
    if (dataBalance.balance < 10) {
      this.setState({
        progressImage: Images.coinProgress1,
        lackPoint: 10 - dataBalance.balance,
        balance: dataBalance.balance,
      });
    }
    if (dataBalance.balance >= 10 && dataBalance.balance < 20) {
      this.setState({
        progressImage: Images.coinProgress2,
        lackPoint: 20 - dataBalance.balance,
        balance: dataBalance.balance,
      });
    }
    if (dataBalance.balance >= 20 && dataBalance.balance < 30) {
      this.setState({
        progressImage: Images.coinProgress3,
        lackPoint: 30 - dataBalance.balance,
        balance: dataBalance.balance,
      });
    }
    if (dataBalance.balance >= 30) {
      this.setState({
        progressImage: Images.coinProgress4,
        lackPoint: 0,
        balance: dataBalance.balance, // showMaxModal: true,
      });
    }
    this.loadRewards();
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  getParticipant = async () => {
    const participante = await CiclooService.GetParticipantData();
    console.log('teste :>>');
    console.log(participante);

    console.log(this.state.lockedRegister);
    console.log(participante.city);

    if (
      participante.city !== undefined &&
      participante.city !== '' &&
      participante.state !== undefined &&
      participante.state !== '' &&
      participante.birthDate !== null &&
      participante.cellPhone !== undefined &&
      participante.cellPhone !== ''
    ) {
      this.setState({
        lockedRegister: false,
      });
    } else {
      this.setState({
        lockedRegister: true,
      });
    }
  };

  loadRewards = async () => {
    const recompensas = await CiclooService.GetRewards([], 1);
    console.log('recompensas', JSON.stringify(recompensas));
    recompensas.sort((a, b) => a.stampsQuantity - b.stampsQuantity)
    this.setState({
      loading: false,
      rewards: recompensas,
      // balance: balance + 11,
    });
  };

  handleRewardSelection = async item => {
    console.log('handleRewardSelection', item);
    let name = item.attributes.find(item => item.key == 'voucher')?.value
    console.log('handleRewardSelection', item)
    let isDonation = item.attributes.find(item => item.key === 'reward-type')?.value == 'DOAÇÃO'
    console.log({ name })
    await analytics().logEvent('select_reward', {
      id: item.id,
      name,
    });

    const params = {
      id: item.id,
      name,
      value: Number(
        item.activationCondition.thirdLevelCondition.stamp.productsPrice[0]
          .stampsQuantity,
      ),
    };
    console.log('params', params);
    Main.logRewardViewItem(params);
    console.log(item.images[0]);
    console.log({ item });
    this.setState({
      itemSelected: {
        image: item.images[0],
        name,
        description: item.description,
        campaignId: item.campaign.id,
        isDonation,
        // merchantId: item.store.id,
        productCode: item.eligibleProduct.products[0].code,
        productType: item.eligibleProduct.products[0].type,
      },
      analyticsParams: {
        name,
        value: Number(
          item.activationCondition.thirdLevelCondition.stamp.productsPrice[0]
            .stampsQuantity,
        ),
      },
      modalVisible: true,
    }, () => console.log({ itemSelected: this.state.itemSelected }));

  };


  completeRegisterSelection = () => {
    this.setState({ modalRegisterVisible: true });
  };

  getReward = async () => {
    this.setState({ rewardloading: true });
    const {
      itemSelected: {
        campaignId,
        name,
        description,
        // merchantId,
        productCode,
        productType,
      },
      modalVisible,
      analyticsParams,
    } = this.state;
    const body = {
      campaignId,
      name,
      description,
      // merchantId,
      productCode,
      productType,
    };
    // body.puchaseTotalValue
    console.log('body reward', body);
    console.log({ selected: this.state.itemSelected });
    const responseReward = await CiclooService.PostReward(body);
    console.log('responseReward', responseReward);
    console.log('responseReward', responseReward.rescueData.message);

    if (!responseReward.success) {

      return Alert.alert(
        'Tente novamente',
        responseReward.rescueData.message === '' ? 'Ocorreu um erro' : responseReward.rescueData.message,
        [
          {
            text: 'OK',
            onPress: () =>
              this.setState({ rewardloading: false, modalVisible: false, }),
          },
        ],
        { cancelable: false },
      );
    }

    let dataBalance = await CiclooService.GetBalance();
    console.log('dataBalance', dataBalance);

    this.setState({
      dataBalance,
    });
    Main.logVoucherRedeemed(analyticsParams);
    this.setState({
      rewardloading: false,
      modalVisible: false,
      modalSuccessVisible: true,
    });
    await this.loadRewards();
  };

  render() {
    const { navigation } = this.props;
    const {
      modalVisible,
      modalRegisterVisible,
      lockedRegister,
      modalSuccessVisible,
      rewards,
      balance,
      loading,
      itemSelected,
      progressImage,
      lackPoint,
      dataBalance,
      rewardloading,
      showMaxModal,
      marcas,
      analyticsParams,
    } = this.state;

    console.log('modal status', modalSuccessVisible);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="light-content" />
        {/* <SubHeaderComponent title="Recompensas" /> */}
        <ScrollView
          style={{ height: 1000, width }}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingVertical: 20,
              width: '100%',
              backgroundColor: '#6853C8',
              alignItems: 'center',
              borderTopWidth: 0,
              borderTopColor: '#ffffff00',
              shadowColor: '#ffffff00',
              shadowOpacity: 0,
              shadowOffset: {
                width: 0,
                height: 0,
              },
            }}>
            {!dataBalance ||
              dataBalance.length === 0 ||
              !dataBalance.chartUrl ? (
              <ActivityIndicator color="#4a4a4a" size="small" style={{}} />
            ) : (
              <View
                style={{
                  width: '100%',
                  height: 20,
                  backgroundColor: '#6853C8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    color: '#FFFFFF',
                    fontFamily: 'Rubik-Regular',
                    fontSize: 19,
                  }}>
                  Você tem
                  <Text
                    style={{
                      position: 'absolute',
                      // color: '#94FED6',
                      fontFamily: 'Rubik-Bold',
                      fontSize: 19,
                      top: 26,
                    }}>
                    {
                      ` ${dataBalance.balance} `
                      // {dataBalance.balance > 0 ? ` ${dataBalance.balance} MOEDAS.` : ' 0 MOEDA.'}
                    }
                  </Text>
                  <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    source={Images.coin}
                    style={{
                      width: 17,
                      height: 17,
                      resizeMode: 'contain',
                      marginLeft: 3, // , alignSelf: 'center'
                    }}
                  />
                </Text>
                {
                  //   <ImageBackground source={{ uri: `${CiclooService.fileUrl}${dataBalance.chartUrl}` }} style={{ width, height: width * 0.54, resizeMode: 'contain' }}>
                  //   <Text style={{
                  //     position: 'absolute', alignSelf: 'center', color: '#FFFFFF', fontFamily: 'Rubik-Regular', fontSize: 19, top: 24,
                  //   }}
                  //   >
                  //     Você tem
                  //     <Text style={{
                  //       position: 'absolute', color: '#94FED6', fontFamily: 'Rubik-Bold', fontSize: 19, top: 26,
                  //     }}
                  //     >
                  //       {dataBalance.balance > 0 ? ` ${dataBalance.balance} MOEDAS.` : ' 0 MOEDA.'}
                  //     </Text>
                  //   </Text>
                  //   <Text style={{
                  //     position: 'absolute', color: '#FFF', fontFamily: 'Rubik-Regular', fontSize: 10, top: 48, alignSelf: 'center',
                  //   }}
                  //   >
                  //     {'Período de '}
                  //     <Text style={{
                  //       position: 'absolute', alignSelf: 'center', color: '#FFFFFF', fontFamily: 'Rubik-Bold', fontSize: 10, top: 48,
                  //     }}
                  //     >
                  //       {new Date(dataBalance.initialDate).toLocaleDateString('pt-br')}
                  //     </Text>
                  //     {' a '}
                  //     <Text style={{
                  //       position: 'absolute', alignSelf: 'center', color: '#FFFFFF', fontFamily: 'Rubik-Bold', fontSize: 10, top: 48,
                  //     }}
                  //     >
                  //       {new Date(dataBalance.finalDate).toLocaleDateString('pt-br')}
                  //     </Text>
                  //   </Text>
                  //   {/* {dataBalance.nextReward === 0 ? (
                  //     <Text style={{
                  //       position: 'absolute', alignSelf: 'center', color: '#FFFFFF', fontFamily: 'Rubik-Regular', fontSize: 15, bottom: 32,
                  //     }}
                  //     >
                  //       Você atingiu todas as recompensas!
                  //     </Text>
                  //   ) : (
                  //     <Text style={{
                  //       position: 'absolute', alignSelf: 'center', color: '#FFFFFF', fontFamily: 'Rubik-Regular', fontSize: width > 380 ? 15 : 13, bottom: 32,
                  //     }}
                  //     >
                  //       {dataBalance.nextReward === 1 ? 'Falta' : 'Faltam'}
                  //       <Text style={{
                  //         color: '#FEB87A', fontFamily: 'Rubik-Bold',
                  //       }}
                  //       >
                  //         {dataBalance.nextReward === 1 ? ' 1 moeda ' : ` ${dataBalance.nextReward} moedas `}
                  //       </Text>
                  //       pra próxima recompensa.
                  //     </Text>
                  //   )} */}
                  // </ImageBackground>
                }
              </View>
            )}
          </View>
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
            rewards.map((item, index) => (
              <RewardSectionComponent
                key={index}
                list={item.rewards}
                isCompleteRegister={lockedRegister}
                completeRegisterSelection={this.completeRegisterSelection}
                handleSelect={ind =>
                  this.handleRewardSelection(item.rewards[ind])
                }
                locked={item.blocked}
                stampsQuantity={item.stampsQuantity}
                campaignRedeemed={item.campaignRedeemed}
              />
            ))
          )}
          {rewards.length > 0 && (
            <View style={{ marginBottom: 0 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 24,
                  width: width * 0.95,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 24,
                  }}>
                  Quer ganhar mais moedas?
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                  width: width * 0.95,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: '#6853C8',
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginLeft: 24,
                  }}>
                  Confira as marcas participantes.
                </Text>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{ backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                  {marcas.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        borderWidth: 1,
                        borderColor: '#CFDCDF',
                        borderRadius: 6,
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginHorizontal: 4,
                      }}>
                      <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        style={{ width: width * 0.2, aspectRatio: 1 }}
                        source={item}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
              <ContinueButton
                buttonPress={() => navigation.navigate('Marcas')}
                textInside="VER TODAS"
                style={{ marginTop: 24 }}
                bgWhite
              />
              {/* <TouchableOpacity onPress={} style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#2D2D2D', alignSelf: 'center' }}>
                  Todas
                </Text>
                <Icon name="chevron-right" color="#2D2D2D" size={24} />
              </TouchableOpacity> */}
            </View>
          )}
        </ScrollView>
        {modalVisible && (
          <Modal animationType="slide" transparent visible={modalVisible}>
            <View style={[styles.centeredView, { alignItems: 'center' }]}>
              {itemSelected ? (
                <View style={[styles.modalView, { width: width - 40 }]}>
                  <Text style={styles.modalText}>{`CONFIRMAR ${!itemSelected.isDonation ? 'RECOMPENSA' : 'DOAÇÃO'
                    }`}</Text>
                  <View style={{ borderColor: '#EDF1F2', borderWidth: 1 }}>
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      source={{ uri: itemSelected.image?.url }}
                      style={{ width: 120, height: 120, resizeMode: 'contain' }}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: '#ECF1F2',
                      width: width - 40,
                      marginTop: 24,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        padding: 20,
                        width: width - 50,
                        alignSelf: 'center',
                        textAlign: 'center',
                        color: '#8EA7AB',
                        fontFamily: 'Rubik-Regular',
                        fontSize: 15,
                        lineHeight: 16,
                      }}>
                      {itemSelected.description}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      ...styles.openButton,
                      backgroundColor: '#FFF',
                      borderColor: '#FF7A61',
                      borderWidth: 3,
                      width: width - 100,
                      marginTop: 24,
                    }}
                    onPress={() => {
                      this.setState({
                        modalVisible: !modalVisible,
                        itemSelected: null,
                      });
                    }}>
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          color: '#FF7A61',
                          fontFamily: 'Rubik-Bold',
                          fontSize: 15,
                          lineHeight: 16,
                        },
                      ]}>
                      CANCELAR
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.openButton,
                      backgroundColor: '#00D182',
                      width: width - 100,
                      marginTop: 8,
                      flexDirection: 'row',
                      padding: 0,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 100,
                    }}
                    onPress={() => {
                      if (!rewardloading) {
                        this.getReward();
                      }
                    }}>
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          flex: 0,
                          width: 'auto',
                          color: '#FFF',
                          fontFamily: 'Rubik-Bold',
                          fontSize: 15,
                          lineHeight: 20,
                          marginLeft: 20,
                        },
                      ]}>
                      CONFIRMAR
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        maxWidth: (width - 100) / 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#00ba74',
                        borderTopRightRadius: 30,
                        borderBottomRightRadius: 30,
                        // padding: 13,
                        // elevation: 2,
                        height: 48,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'Rubik-Bold',
                          letterSpacing: -0.5,
                          fontSize: 16,
                          zIndex: 99,
                        }}>
                        {` ${analyticsParams.value} `}
                        <FastImage
                          resizeMode={FastImage.resizeMode.contain}
                          source={Images.coin}
                          style={{
                            width: 13,
                            height: 13,
                            resizeMode: 'contain',
                            marginLeft: 8, // , alignSelf: 'center'
                          }}
                        />
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <ActivityIndicator
                  color="#4a4a4a"
                  size="small"
                  style={{ marginTop: 80 }}
                />
              )}
            </View>
            {rewardloading && (
              <LoadingModalComponent
                visible={rewardloading}
                style={{ zIndex: 9999999999 }}
              />
            )}
          </Modal>
        )}
        {modalSuccessVisible && (
          <Modal
            animationType="slide"
            transparent
            visible={modalSuccessVisible}>
            <View style={[styles.centeredView, { alignItems: 'center' }]}>
              <View style={[styles.modalView, { width: width - 40 }]}>
                <Text style={styles.modalText}>{`${!itemSelected.isDonation ? 'RECOMPENSA' : 'DOAÇÃO'
                  } CONFIRMADA`}</Text>
                <Icon name="check-circle" size={128} color="#00D182" />
                <View
                  style={{
                    width: width - 40,
                    marginTop: 24,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      padding: 20,
                      width: width - 50,
                      alignSelf: 'center',
                      textAlign: 'center',
                      color: '#8EA7AB',
                      fontFamily: 'Rubik-Regular',
                      fontSize: 15,
                      lineHeight: 16,
                    }}>
                    {`${!itemSelected.isDonation
                      ? 'Seu resgate foi realizado\ncom sucesso.'
                      : 'Sua doação foi realizada com\nsucesso e ajudou o mundo a ser\num lugar melhor. Obrigado!'
                      }`}
                  </Text>
                  {itemSelected.isDonation ?
                    <Text
                      style={{
                        padding: 20,
                        width: width - 50,
                        alignSelf: 'center',
                        textAlign: 'center',
                        color: '#8EA7AB',
                        fontFamily: 'Rubik-Regular',
                        fontSize: 15,
                        lineHeight: 16,
                        fontWeight: 'bold',
                      }}>
                      {
                        'Continue comprando produtos\ndas marcas participantes para\najudar ainda mais.'
                      }
                    </Text> :
                    <Text
                      style={{
                        padding: 20,
                        width: width - 50,
                        alignSelf: 'center',
                        textAlign: 'center',
                        color: '#8EA7AB',
                        fontFamily: 'Rubik-Regular',
                        fontSize: 15,
                        lineHeight: 16,
                        fontWeight: 'bold',
                      }}>
                      {
                        'Continue comprando produtos\ndas marcas participantes para\nresgatar mais recompensas.'
                      }
                    </Text>
                  }
                </View>
                <View style={{ bottom: 0 }}>
                  <ContinueButton
                    buttonPress={() => {
                      this.setState({ modalSuccessVisible: false });
                      navigation.navigate('ExtractRedemption');
                    }}
                    textInside="VER SEUS RESGATES"
                    style={{ bottom: 0, width: width - 100 }}
                    bgWhite
                  />
                  <ContinueButton
                    buttonPress={() =>
                      this.setState({ modalSuccessVisible: false })
                    }
                    textInside="VOLTAR PARA A TELA INICIAL"
                    style={{ marginTop: 10, bottom: 0, width: width - 100 }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
        {modalRegisterVisible && (
          <Modal
            animationType="slide"
            transparent
            visible={modalRegisterVisible}>
            <View style={[styles.centeredView, { alignItems: 'center' }]}>
              <View style={[styles.modalView, { width: width - 40 }]}>
                <Text style={styles.modalText}>COMPLETE SEU CADASTRO</Text>
                <Icon name="alert-box" size={128} color="#ff0000" />
                <View
                  style={{
                    width: width - 40,
                    marginTop: 24,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      padding: 20,
                      width: width - 50,
                      alignSelf: 'center',
                      textAlign: 'center',
                      color: '#8EA7AB',
                      fontFamily: 'Rubik-Regular',
                      fontSize: 15,
                      lineHeight: 16,
                    }}>
                    Preencha todos os campos do seu cadastro para continuar
                  </Text>
                </View>
                <View style={{ bottom: 0 }}>
                  <ContinueButton
                    buttonPress={() => {
                      this.setState({ modalRegisterVisible: false });
                      navigation.navigate('EditProfile');
                    }}
                    textInside="COMPLETAR CADASTRO"
                    style={{ bottom: 0, width: width - 100 }}
                  />
                  <ContinueButton
                    buttonPress={() =>
                      this.setState({ modalRegisterVisible: false })
                    }
                    textInside="AGORA NÃO"
                    style={{ marginTop: 10, bottom: 0, width: width - 100 }}
                    bgWhite
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
        {showMaxModal && (
          <CoinsMaxModal
            visible={showMaxModal}
            closeModal={() => this.setState({ showMaxModal: false })}
          />
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 15,
    lineHeight: 18,
    color: '#6853C8',
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
  },
  openButton: {
    borderRadius: 30,
    padding: 13,
    elevation: 2,
    height: 48,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RedemptionScreen;
