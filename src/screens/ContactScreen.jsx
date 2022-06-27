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
  TextInput,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Images from '../constants/Images';
import ContinueButton from '../components/ContinueButton';
import SubHeaderComponent from '../components/SubHeaderComponent';
import LoadingModalComponent from '../components/LoadingModalComponent';
import BackButton from '../components/BackButtonComponent';
import ChoicesModal from '../components/ChoicesModalComponent';
import ChooseNoteModal from '../components/ChooseNoteModalComponent';
import CiclooService from '../services/CiclooService';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');


class ContactScreen extends Component {
  static navigationOptions = () => ({
    // header: null,
    headerBackTitle: ' ',
    tintColor: '#FFFFFF',
  });

  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      loading: false,
      faqItems: [],
      receipts: [],
      showChoices: false,
      ChooseNote: false,
      chosenOption: null,
      ChooseNoteOption: null,
      messageValue: null,
      documentSelected: null,
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    // this.show = setInterval(() => this.showBody(), 5000)
    // this.loadFaqs();

    if(await AsyncStorage.getItem('@subject') === "deleteMyAccount") {
      let text = await AsyncStorage.getItem('@message');

      this.setState({ messageValue: text });

      
    }
    //, "deleteMyAccount");
    await this.loadReceipts();
  }

  loadReceipts = async () => {
    const items = await CiclooService.GetReceipts();
    console.log('loadReceipts', items.data)
    this.setState({
      receipts : items.data
    });
  }

  loadFaqs = async () => {
    const faqItems = await CiclooService.GetFaqs();
    this.setState({
      faqItems,
    });
    console.log('faqItems :>> ', faqItems);
  }

  handleOpenDocuments = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        "handleOpenDocuments",
        res[0].size
      );
      this.setState({
        documentSelected: {
          name: res[0].name,
          type: res[0].type,
          uri: res[0].uri,
        },
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  showBody = () => {
    const { chosenOption,ChooseNoteOption, messageValue, documentSelected } = this.state;
    const body = {
      subject: chosenOption,
      message: messageValue,
      documentSelected: documentSelected || null,
    };
    console.log({body})
  }

  handleSendMessage = async () => {
    const { chosenOption, ChooseNoteOption,messageValue, documentSelected } = this.state;
    if (!chosenOption || !messageValue) {
      return Alert.alert('Campos vazios', 'Preencha o motivo do contato e escreva sua mensagem');
    }
    this.setState({ loading: true });
    const body = {
      subject: chosenOption,
      message: messageValue,
      documentSelected: documentSelected || null,
    };
    const response = await CiclooService.SendMessage(body);

    if (response.success) {
      this.setState({
        loading: false,
        chosenOption: null,
        ChooseNoteOption: null,
        messageValue: null,
        documentSelected: null,
        optionText: null,
        optionNote: null,
      });
      // Main.logScanCoupon();
      // navigation.navigate('NoteStatus');
      return Alert.alert('Mensagem enviada');
    }

    if (!response.success) {
      return Alert.alert('Tente novamente', response.data,
        [
          { text: 'OK', onPress: () => this.setState({ loading: false }) },
        ],
        { cancelable: false });
    }
  }

  render() {
    const {
      documentSelected, messageValue, showChoices, ChooseNote , chosenOption, ChooseNoteOption, optionText, optionNote, loading,receipts
    } = this.state;
    const { navigation } = this.props;
    console.log("optionText4:", this.state);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="light-content" />
        <SubHeaderComponent title="Fale conosco" />
        <ScrollView>
          <View style={{ padding: 24 }}>
            <Text style={{
              fontFamily: 'Rubik-Regular', fontSize: 15, lineHeight: 18, color: '#000000', marginBottom: 24, textAlign: 'center', width: width - 96, alignSelf: 'center',
            }}
            >
              Se você já leu as dúvidas frequentes e ainda
              não encontrou uma solução, entre em
              contato e ficaremos satisfeitos em ajudar.
            </Text>
            <TouchableOpacity onPress={() => this.setState({ showChoices: true })}>
              <View style={{ width: width - 50, borderBottomWidth: 2, borderBottomColor: '#6853C8' }}>
                <Text style={{ fontFamily: 'Rubik-Regular', color: '#8EA7AB', fontSize: 11 }}>
                  Motivo do contato
                </Text>
                <Text style={{
                  fontFamily: 'Rubik-Regular', color: '#000000', fontSize: 15, marginTop: 5, marginBottom: 7,
                }}
                >
                  {optionText || 'Selecione o motivo do contato'}
                </Text>
              </View>
            </TouchableOpacity>
            {/*<TouchableOpacity onPress={() => this.setState({ ChooseNote: true })} style={{ marginTop: 20 }}>
              <View style={{ width: width - 50, borderBottomWidth: 2, borderBottomColor: '#6853C8' }}>
                <Text style={{ fontFamily: 'Rubik-Regular', color: '#8EA7AB', fontSize: 11 }}>
                  Cupom Fiscal
                </Text>
                <Text style={{
                  fontFamily: 'Rubik-Regular', color: '#000000', fontSize: 15, marginTop: 5, marginBottom: 7,
                }}
                >
                  {optionNote || 'Selecione o cupom fiscal'}
                </Text>
              </View>
              </TouchableOpacity>*/}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: 'Rubik-Regular', color: '#8EA7AB', fontSize: 11 }}>
                Escreva a sua mensagem
              </Text>
              <TextInput
                multiline
                numberOfLines={8}
                maxLength={300}
                style={{
                  width: width - 50, borderBottomWidth: 2, borderBottomColor: '#6853C8', marginTop: 0, fontFamily: 'Rubik-Regular', fontSize: 20, paddingBottom: 10,
                }}
                onChangeText={(text) => this.setState({ messageValue: text })}
                value={messageValue}
              />
            </View>
            <TouchableOpacity onPress={this.handleOpenDocuments}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
                <Icon name="attachment" size={32} style={{ alignSelf: 'center', marginRight: 10 }} color="#6853C8" />
                <Text style={{
                  fontFamily: 'Rubik-Bold', fontSize: 15, lineHeight: 18, color: '#6853C8', textAlign: 'left',
                }}
                >
                  Anexar um arquivo
                </Text>
              </View>
            </TouchableOpacity>
            {documentSelected?.name && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
              <Icon name="file-upload" size={24} style={{ alignSelf: 'center', marginRight: 4 }} color="#6853C8" />
              <Text style={{
                fontFamily: 'Rubik-Bold', fontSize: 13, lineHeight: 15, color: '#6853C8', textAlign: 'left',
              }}
              >
                {documentSelected.name}
              </Text>
            </View>
            )}
          </View>
          <ContinueButton
            buttonPress={this.handleSendMessage}
            textInside="ENVIAR"
            style={{
              width: width - 48,
              alignSelf: 'center',
              marginBottom: height * 0.3,
            }}
          />
          {showChoices && (
            <ChoicesModal visible={showChoices} accept={chosenOption} selectedChoice={(ind, text) => this.setState({ chosenOption: ind, showChoices: false, optionText: text })} />
          )}
          {ChooseNote && (
            <ChooseNoteModal data={receipts} visible={ChooseNote} accept={ChooseNoteOption} selectedChooseNote={(ind, note) => this.setState({ ChooseNoteOption: ind, ChooseNote: false, optionNote: note })} />
          )}
          {loading && (
          <LoadingModalComponent visible={loading} />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
  componentWillUnmount(){
    // clearInterval(this.show)
  }
}

ContactScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <FastImage resizeMode={FastImage.resizeMode.contain}
      source={Images.logo}
      style={{
        width: 60, height: 16, resizeMode: 'contain', marginTop: 6,
      }}
    />
  ),
  headerTitleAlign: 'center',
  headerBackTitle: 'Voltar',
  headerStyle: {
    backgroundColor: '#6853C8',
    borderBottomWidth: 0,
    shadowOpacity: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  headerTintColor: '#FFFFFF',
  headerLeft: (<BackButton back={navigation} bgWhite />),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignSelf: 'center',
  },

});

export default ContactScreen;
