import React, { PureComponent, Fragment } from 'react';
import {
  View, Alert, StyleSheet, Dimensions, SafeAreaView, Platform, ScrollView, Text, TouchableOpacity, StatusBar,
} from 'react-native';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';

const { height } = Dimensions.get('window');

class ModalEndApp extends PureComponent {

  constructor(props) {
    super(props);
    const {
      isVisible,
    } = props;

    this.state = {
      isvisible: isVisible,
      
    };
  }
  
  close() {
    return !isVisible;
  }

  render() {
    return (
        <Modal isVisible={this.state.isvisible}>
          <View style={styles.modalView} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={[styles.touch, {
                  alignSelf: 'flex-end', zIndex: 9999,
                }]}
                onPress={() => this.setState({ isvisible: !this.state.isvisible })}
              >
                <View
                  style={[
                    styles.containerIcon,
                  ]}
                >
                  <Icon
                    name="close"
                    size={32}
                    style={[styles.icon, {}]}
                    color="#6853C8"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.title}>
                INFORMAÇÃO IMPORTANTE
              </Text>
              <IconEntypo 
                name="warning"
                size={100}
                color="#FED32A"
                style={styles.marginIcon}
              />
              <View style={styles.modalContent}>
                <Text style={styles.text}>
                  Informamos que o aplicativo Cicloo irá encerrar as 
                  atividades a partir de 20/08/2022! ☹
                </Text>
                <Text style={styles.text}>
                  Fique atento às <Text style={styles.textFocus}>datas limites</Text> de cadastros de cupons e 
                  resgate de vouchers abaixo:
                </Text>
                <Text style={styles.text}>
                  Os cupons e notas fiscais de produtos participantes poderão ser cadastrados no aplicativo 
                  até <Text style={styles.textFocus}>19/07/2022</Text> e as moedas acumuladas até esta data permanecerão válidas e disponíveis para 
                  troca de vouchers e recompensas até <Text style={styles.textFocus}>20/08/2022</Text>.
                </Text>
                <Text style={styles.text}>
                  Para mais informações, acesse o <Text style={styles.textFocus}>Regulamento</Text>.
                </Text>
              </View>
            </View>
          </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    width: "100%",
    height: 35,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalBody: {
    width: "100%",
    alignItems: 'center',
  },
  modalContent: {
    width: "100%",
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30
  },
  containerIcon: {
    height: 32, 
    width: 32, 
    alignSelf: 'center', 
    marginTop: 0, 
    marginBottom: 0,
  },
  marginIcon: {
    marginBottom: 12
  },
  title: {
    fontFamily: 'Rubik-Bold',
    fontSize: 17,
    color: '#6853C8',
    textAlign: 'center',
    marginBottom: 22
  },
  text: {
    fontFamily: 'Rubik-Medium',
    fontSize: 17,
    color: '#000',
    textAlign: 'center',
    marginBottom: 15
  },
  textFocus: {
    fontFamily: 'Rubik-Medium',
    fontSize: 17,
    color: '#6853C8',
    textAlign: 'center',
  }
});

export default ModalEndApp;
