import { Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import { STORAGE_TOKEN_NAME } from '../constants/Environment';

export default class Authentication {
  static async getToken() {
    try {
      console.log("getting token...")
      return await EncryptedStorage.getItem(STORAGE_TOKEN_NAME);
    } catch (error) {
      console.log({error})
      return null
      // return Alert.alert(`Ocorreu um erro ao receber o token: ${error}`);
    }
  }

  static onSignin(token) {
    try {
      console.log({"tokenSignedIn": token})
      return EncryptedStorage.setItem(STORAGE_TOKEN_NAME, token);
    } catch (error) {
      console.log({error})
      return null
      // return Alert.alert(`Ocorreu um erro no efetuar o login: ${error}`);
    }
  }

  static async onSignOut() {
    try {
      return await EncryptedStorage.clear();
      // return await EncryptedStorage.removeItem(STORAGE_TOKEN_NAME);
    } catch (error) {
      console.log({error})
      return null
      // return Alert.alert(`Ocorreu um erro no desconectar da sua conta: ${error}`);
    }
  }
}
