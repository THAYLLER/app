import { Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
// import firebase from 'firebase';

import { STORAGE_TOKEN_NAME } from '../constants/Environment';

export default class Authentication {
  static async getToken() {
    try {
      const key = await EncryptedStorage.getItem(STORAGE_TOKEN_NAME);
      console.log('key, STORAGE_TOKEN_NAME :>> ', key, STORAGE_TOKEN_NAME);
      return key;
    } catch (error) {
      console.log('error', error);
      return Alert.alert(`Ocorreu um erro ao receber o token: ${error}`);
    }
  }

  static onSignin(token) {
    try {
      const key = EncryptedStorage.setItem(STORAGE_TOKEN_NAME, token);
      console.log('key, STORAGE_TOKEN_NAME, token :>> ', key, STORAGE_TOKEN_NAME, token);
      return key;
    } catch (error) {
      console.log('error', error);
      return Alert.alert(`Ocorreu um erro no efetuar o login: ${error}`);
    }
  }

  static async onSignOut() {
    try {
      return await EncryptedStorage.clear();
      // return await EncryptedStorage.removeItem(STORAGE_TOKEN_NAME);
    } catch (error) {
      console.log('error', error);
      return Alert.alert(`Ocorreu um erro no desconectar da sua conta: ${error}`);
    }
  }

  static async setAlertReceived(updateContent) {
    try {
      return await EncryptedStorage.setItem('@updateAlert', JSON.stringify(updateContent));
    } catch (error) {
      console.log('error', error);
      return Alert.alert(`Ocorreu um erro no desconectar da sua conta: ${error}`);
    }
  }

  static async getAlertContent() {
    try {
      const alertContent = await EncryptedStorage.getItem('@updateAlert');
      return JSON.stringify(alertContent);
    } catch (error) {
      console.log('error', error);
      return Alert.alert(`Ocorreu um erro ao ver seus dados de atualização: ${error}`);
    }
  }
}
