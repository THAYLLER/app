import React from 'react';
import {
  SafeAreaView, ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Text, Platform, StatusBar, Animated,
} from 'react-native';
import { StackActions } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import { BlurView } from 'expo-blur';
import * as Icon from '@expo/vector-icons';
import ContinueButton from './ContinueButton';
import BackButton from './BackButtonComponent';
import Line from './LineComponent';
import Colors from '../constants/Colors';


const { width, height } = Dimensions.get('window');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
class AnimatedBlurComponent extends React.Component {
  // navigationOptions = ({ navigation }) => ({
  //   headerLeft: (<BackButton back={navigation} />),
  //   headerStyle: {
  //     backgroundColor: 'transparent',
  //   },
  // })
  constructor(props) {
    super(props);
    this.state = {
      intensity: new Animated.Value(0),
    };
  }

  componentWillMount() {
    const { navigation, intensity } = this.props;
    this.setState({ intensity });
    console.log('didmount called.', navigation);
    StatusBar.setBarStyle('light-content', true);
    this.getBack();
  }

  componentDidMount() {
    const { navigation, intensity } = this.props;
    console.log('didmount called.', navigation);
    StatusBar.setBarStyle('light-content', true);
    this.setState({ intensity });
  }

  // componentWillReceiveProps(nextProps) {
  //   const { intensity } = this.props;
  //   console.log('nextProps.intensity === intensity', nextProps, intensity);
  //   console.log('nextProps.intensity._value !== this.props.intensity._value', nextProps.intensity, this.props.intensity);
  //   if (nextProps.intensity !== this.props.intensity) {
  //     console.log('nextProps.intensity === intensity', nextProps.intensity, intensity);
  //     this.setState({ intensity });
  //   }
  // }


  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.intensity !== this.props.intensity) {
  //     console.log('prevProps.intensity === intensity', prevProps, this.props);
  //     // return true;
  //   }
  // }

  getBack = () => {
    this.setState({ intensity: 100 });
    this.props.intensity = 100;
    // this.props.onPress();
  }

  render() {
    const { navigation, onPress, } = this.props;
    const { intensity, } = this.state;
    return (
      <AnimatedBlurView
        tint="dark"
        intensity={intensity}
        style={[StyleSheet.absoluteFill, styles.blur]}
      >
        <StatusBar backgroundColor="#FFFFFF00" barStyle="light-content" />
        <ScrollView style={styles.container}>
          <View style={{
            marginBottom: 60, alignSelf: 'center', flex: 1, width,
          }}
          >
            <Text style={styles.title}>
              {'Siga estas instruções para sua Nota Fiscal ser validada'.toUpperCase()}
            </Text>
            <Line
              text="Centralize a nota"
              customStyle={{
                line: { },
                text: { alignSelf: 'center', maxWidth: width - 120 },
              }}
            />
            <Line
              text="Verifique se a nota não está amassada"
              customStyle={{
                line: { },
                text: { alignSelf: 'center', maxWidth: width - 120 },
              }}
            />
            <Line
              text="Certifique-se de que todos os dados necessários estão legíveis"
              customStyle={{
                line: { },
                text: { alignSelf: 'center', maxWidth: width - 120 },
              }}
            />
            <Line
              text="A nota fiscal precisa estar no seu nome"
              customStyle={{
                line: { },
                text: { alignSelf: 'center', maxWidth: width - 120 },
              }}
            />
            <Line
              text="Não amasse ou jogue fora sua Nota Fiscal até a análise ser finalizada"
              customStyle={{
                line: { },
                text: { alignSelf: 'center', maxWidth: width - 120 },
              }}
            />
          </View>
          <ContinueButton buttonPress={() => onPress(intensity)} textInside="Entendi" style={{ marginBottom: 60, width: width - 50 }} bgWhite />

        </ScrollView>
      </AnimatedBlurView>
    );
  }
}

AnimatedBlurComponent.navigationOptions = ({ navigation }) => ({
  // headerLeft: (<BackButton back={navigation} />),
  // headerStyle: {
  //   backgroundColor: 'transparent',
  //   borderBottomWidth: 0,
  //   borderBottomColor: 'transparent',
  // },
  header: null,
  tabBarVisible: true,
});

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    zIndex: 99999,
    height: 1000,
    paddingTop: 100,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    fontSize: 32,
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  container: {
    flex: 1,
    paddingTop: height * 0.06,
    backgroundColor: '#00000000',
    height: 'auto',
    alignSelf: 'center',
    width,
  },
  title: {
    fontFamily: 'AvenirNextLTPro-HeavyCn',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: height * 0.08,
    flexWrap: 'wrap',
    flexShrink: 1,
    width: width - 48,
    fontSize: 20,
    lineHeight: 26,
    alignSelf: 'center',
  },
});


export default AnimatedBlurComponent;
