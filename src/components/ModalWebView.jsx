import React, { PureComponent, Fragment } from 'react';
import {
  View, Modal, Alert, StyleSheet, Dimensions, SafeAreaView, Platform, ActivityIndicator, Text, TouchableOpacity, StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

class ModalWebView extends PureComponent {
  componentWillMount() {
    const {
      itemName,
    } = this.props;
    console.log(itemName);
  }

  refresh() {
    this._wv.reload();
  }

  render() {
    const {
      isVisible, close, url, itemName,
    } = this.props;
    console.log(url);
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={() => close()}
        style={styles.modalContainer}
      >
        <SafeAreaView style={{ backgroundColor: '#000000', flex: 0 }} />
        <View style={{ backgroundColor: '#000000', flex: 1, overflow: 'hidden' }}>
          <StatusBar hidden={false} animated backgroundColor="#000000" />
          <View style={{
            marginTop: 6,
            marginBottom: -22,
            width: 250,
            height: 16,
          }}
          >
            <Text style={{
              color: '#FFFFFF',
              fontSize: 14,
              lineHeight: 16,
              left: width * 0.5 - 125,
              fontFamily: 'NunitoSans-Bold',
              textAlign: 'center',
            }}
            >
              {itemName.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.touch, {
              alignSelf: 'flex-end', right: 4, top: -4, zIndex: 9999,
            }]}
            onPress={() => close()}
          >
            <View
              style={[
                styles.containerIcon,
                {
                  height: 32, width: 32, alignSelf: 'center', marginTop: 0, marginBottom: 0,
                },
              ]}
            >
              <Icon
                name="close"
                size={32}
                style={[styles.icon, {}]}
                color="#FFFFFF"
              />
            </View>
            {/* <Text>
                FECHAR
              </Text> */}
          </TouchableOpacity>
          <WebView
            source={{ uri: url }}
            style={[styles.webviewContainer, { marginTop: 0, zIndex: 1 }]}
            bounces={false}
            ref={(component) => (this._wv = component)}
            renderLoading={() => (
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: height * 0.6,
                }}
              >
                <ActivityIndicator color="#000000" size="small" />
                <Text
                  style={{
                    marginTop: height * 0.025,
                    color: '#000000',
                    fontWeight: '600',
                    fontSize: 13,
                    alignSelf: 'center',
                  }}
                >
                  {'Carregando...'.toLowerCase()}
                </Text>
              </View>
            )}
            startInLoadingState
            originWhitelist={['*']}
            mixedContentMode="compatibility"
            renderError={() => (
              <View style={{ top: height * 0.4 }}>
                <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                  Você está sem internet.
                  {'\n'}
                  Tente novamente mais tarde.
                </Text>
                <TouchableOpacity onPress={() => this.refresh()}>
                  <View style={{ marginTop: 30 }}>
                    <Text style={{ textAlign: 'center', color: '#FFFFFF', fontWeight: '900' }}>
                      ATUALIZAR
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 30,
  },
  webviewContainer: {
    height,
    width,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    // borderBottomEndRadius: 16,
    // borderBottomStartRadius: 16,
    // overflow: 'hidden',
    // borderColor: '#f0f',
    // borderWidth: 3,
  },
});

export default ModalWebView;
