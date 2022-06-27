import React from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import api from './ApiService';
import inovaApi from './InovaApiService';

import { FileBaseUrlDev, FileBaseUrlPrd } from '../constants/InovaEnvironment';

class CiclooService {
  static fileUrl = FileBaseUrlDev
  // static fileUrl = FileBaseUrlPrd
  static async  signUp(body) { // overwrite / created
    console.log('body signUp:>> ', body);
    try {
      const resp = await inovaApi.post('users', body);
      console.log({resp})
      const response = resp.data.data.resultValue;

      console.log('resp :>> ', response);
      console.log('token :>> ', response.token);
      console.log('resp.data :>> ', resp.data);

      inovaApi.defaults.headers.Authorization = `bearer ${response.token}`;
      return resp.data;
    } catch (error) {
      console.log({error})
      return error.response.data
      return Alert.alert('Criação falhou', "", //error.response.data,
        [
          {
            text: 'Ok',
            onPress: () => false//this.setState({ loading: false }),
          },
        ],
        { cancelable: false });
    }
    // try {
    //   const resp = await api.post('users/create', body, {
    //     headers: { 'Content-Type': 'application/json', Accept: '*/*' },
    //   });
    //   const response = resp.data.data.resultValue;

    //   console.log('resp :>> ', response);
    //   console.log('token :>> ', response.token);
    //   console.log('resp.data :>> ', resp.data);

    //   api.defaults.headers.Authorization = `bearer ${response.token}`;
    //   return resp.data;
    // } catch (error) {
    //   console.log('error.response.data', error.response.data);
    //   return Alert.alert('Criação falhou', error.response.data,
    //     [
    //       {
    //         text: 'Ok',
    //         onPress: () => this.setState({ loading: false }),
    //       },
    //     ],
    //     { cancelable: false });
    // }
  }

  static async signIn(body) {
    console.log('body :>> ', body);
    try {
      // const response = await api.post('users/auth', body);
      // console.log('response :>> ', response);
      // console.log('response.data. :>> ', response.data);
      // const { token } = response.data.data;
      // api.defaults.headers.Authorization = `bearer ${token}`;
      // console.log('response DevPartner: ', response.data)
      let inovaResponse = await inovaApi.post('users/login', body)
      inovaApi.defaults.headers.Authorization = `bearer ${inovaResponse.data.data.token}`;
      console.log('response Inova: ', inovaResponse.data)
      // inovaResponse.data = inovaResponse.data.data.token
      console.log({inovaResponse});
      // throw new Error('generic')
      // return response.data;
      inovaResponse.data.token = inovaResponse.data.data.token;
      return inovaResponse.data;
    } catch (error) {
      console.log({error});
      // console.log('error.response.data', error.response.data);
      return error.response.data;
    }
  }

  static async forgotPassword(raw) { // overwrite / created
    const body = {
      cpf: raw,
    };
    try {
      const response = await inovaApi.post('users/recover/password', body);
      console.log('forgotPassword(response) :>> ', response);

      return response.data;
    } catch (error) {
      console.log('errorss', error.response.data);
      return error.response.data;
    }
  }

  static async socialAuth(data, social) { // overwrite / create
    const body = {
      ...data,
      socialNetworkType: social,
    };
    console.log('socialAuth(body) :>> ', body);
    // return {success: true}
    try {
      const response = await inovaApi.post('users/auth/social', body);
      console.log('socialAuth(response.data) :>> ', response.data);
      console.log('socialAuth(response.data.data.token) :>> ', response.data.data.token);
      inovaApi.defaults.headers.Authorization = `bearer ${response.data.data.token}`;

      return response.data;
    } catch (error) {
      console.log({error});
      console.log('error.response', (error.response));
      return error.response.data.errors[0];
    }
    // try {
    //   const response = await api.post('users/auth/social', body);
    //   console.log('socialAuth(response.data) :>> ', response.data);
    //   console.log('socialAuth(response.data.data.token) :>> ', response.data.data.token);
    //   api.defaults.headers.Authorization = `bearer ${response.data.data.token}`;

    //   return response.data;
    // } catch (error) {
    //   console.log('error', JSON.stringify(error));
    //   console.log('error.response', JSON.stringify(error.response));
    //   return error.response.data.errors[0];
    // }
  }

  static async editProfile(body) {
    console.log('body', body);
    try {
      const response = await inovaApi.put(`users/update`, body);
      console.log('editProfile(response) :>> ', response);

      return response.data;
    } catch (error) {
      console.log({error})
      console.log({error});
      return error;
    }
    // console.log('body', body);
    // try {
    //   const response = await api.put(`users/update/${body.id}`, body);
    //   console.log('editProfile(response) :>> ', response);

    //   return response.data;
    // } catch (error) {
    //   console.log({error});
    //   return error;
    // }
  }

  static async editPassword(body) { // overwrite / created
    console.log('body', body);
    try {
      const response = await inovaApi.post(`users/update-pwd`, body);
      console.log('editPassword(response) :>> ', response);

      return response.data;
    } catch (error) {
      console.log({error});
      return error;
    }
  }

  static async GetFaqs() {
    console.log('GetFaqs :>> ');
    const config = {
      headers: {
        accept: 'text/plain',
      },
    };
    return inovaApi.get('faqs', config)
      .then((response) => response)
      .then((response) => {
        console.log('response :>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return ['Tente novamente mais tarde', 'Não foi encontrada nenhuma pergunta'];
      });
    // return api.get('faqs', config)
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response :>>>', response.data);
    //     return response.data;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return ['Tente novamente mais tarde', 'Não foi encontrada nenhuma pergunta'];
    //   });
  }

  static async DoubleThis(body) {
    console.log('DoubleThis :>> ', body);
    return inovaApi.post('doublecoins/add', body)
      .then((response) => response)
      .then((response) => {
        console.log('response DoubleThis:>>?:>', response.data);
        return response.data.data;
      })
      .catch((err) => {
        console.log('err', JSON.stringify(err.response));
        return err.response;
      });
    // return api.post('doublecoins/add', body)
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response DoubleThis:>>?:>', response.data);
    //     return response.data.data;
    //   })
    //   .catch((err) => {
    //     console.log('err', JSON.stringify(err.response));
    //     return err.response;
    //   });
  }

  static async DontDoubleThis(body) {
    console.log('DontDoubleThis :>> ', body);
    return inovaApi.delete('doublecoins/remove', {
      headers: { 'content-type': 'application/json', accept: '*/*' },
      data: body,
    }).then((response) => response)
      .then((response) => {
        console.log('response DontDoubleThis:>>?:>', response.data);
        return response.data.data;
      })
      .catch((err) => {
        console.log('err', JSON.stringify(err.response));
        return err.response;
      });
    // return api.delete('doublecoins/remove', {
    //   headers: { 'content-type': 'application/json', accept: '*/*' },
    //   data: body,
    // }).then((response) => response)
    //   .then((response) => {
    //     console.log('response DontDoubleThis:>>?:>', response.data);
    //     return response.data.data;
    //   })
    //   .catch((err) => {
    //     console.log('err', JSON.stringify(err.response));
    //     return err.response;
    //   });
  }

  // static async GetDoubles(page) {
  //   console.log('GetDoubles :>> ', page);
  //   const body = {
  //     pageSize: 10,
  //     pageNumber: page,
  //   };
  //   return api.post('favorite/list', body)
  //     .then((response) => response)
  //     .then((response) => {
  //       console.log('response :>>?:>', response.data);
  //       return response.data.data;
  //     })
  //     .catch((err) => {
  //       console.log('err', JSON.stringify(err.response));
  //       return err.response;
  //     });
  // }

  static async AddToFavorites(itemId) {
    // console.log('AddToFavorites :>> ', itemId);
    // return api.post(`favorite/add/${itemId}`)
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response AddToFavorites:>>?:>', response.data);
    //     return response.data.data;
    //   })
    //   .catch((err) => {
    //     console.log('err', JSON.stringify(err.response));
    //     return err.response;
    //   });
  }

  static async RemoveFromFavorites(itemId) {
    // console.log('RemoveFromFavorites :>> ', itemId);
    // return api.delete(`favorite/remove/${itemId}`)
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response RemoveFromFavorites:>>?:>', response.data);
    //     return response.data.data;
    //   })
    //   .catch((err) => {
    //     console.log('err', JSON.stringify(err.response));
    //     return err.response;
    //   });
  }

  static async GetFavorites(page) {
    // console.log('GetFavorites :>> ', page);
    // const body = {
    //   pageSize: 10,
    //   pageNumber: page,
    // };
    // return api.post('favorite/list', body)
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response :>>?:>', response.data);
    //     return response.data.data;
    //   })
    //   .catch((err) => {
    //     console.log('err', JSON.stringify(err.response));
    //     return err.response;
    //   });
  }

  static async GetTerms() { // overwrite / created
    console.log('GetTerms :>> ');
    return inovaApi.get('regulations')
      .then((response) => response)
      .then((response) => {
        console.log({response});
        console.log('response :>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log('err', JSON.stringify(err.response));
        return err.response;
      });
  }

  static async CheckUpdate(os,v) { // overwrite / create
    console.log('v', v);
    return inovaApi.get(`settings/ForceUpdate?os=${os}&version=${v}`)
      .then((response) => response)
      .then((response) => {
        console.log('response :>>> CheckUpdate :>> ', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log('err -> CheckUpdate', JSON.stringify(err.response));
        return err.response;
      });
    // return api.get(`users/ForceUpdate/${v}`)
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response :>>> CheckUpdate :>> ', response.data);
    //     return response.data;
    //   })
    //   .catch((err) => {
    //     console.log('err', JSON.stringify(err.response));
    //     return err.response;
    //   });
  }

  static async CheckTermsAccepted () {
    let response = await inovaApi.get('regulations/verify')
    console.log({response});
    // if(result.response?.)
    return ({
      accepted: response.data,
      data: null
    });
      // .catch((err) => {
      //   result = {
      //     accepted: false,
      //     data: err.response
      //   }
      //   console.log({result});
      //   return result;
      // });
  }

  static async AcceptTerms(body) { // overwrite / create
    console.log('AcceptTerms :>> ', body);
    return inovaApi.post('regulations/accepted', body)
      .then((response) => {
        console.log('response :>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return ['Tente novamente mais tarde', err.response];
      });
  }

  static async SendReceiptCode(qrcode, sendType) {
    // api.defaults.headers.contentType = 'application/json';
    console.log('Code :>>>', qrcode);

    const response = await inovaApi.get('users');
    const { cpf } = response.data.data.resultValue;
    console.log({
      code: qrcode, sendType, userCpf: cpf, UrlQrCode: qrcode,
    });

    return inovaApi.post('receipt/qrcode', {
      code: qrcode, sendType, userCpf: cpf, UrlQrCode: qrcode,
    })
      .then((response) => {
        console.log('response :>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log('error', err.response.data);
        return {data: err.response.data.error};
      });
      // api.defaults.headers.contentType = 'application/json';
      // console.log('Code :>>>', qrcode);

      // const response = await api.get('users');
      // const { cpf } = response.data.data.resultValue;
      // console.log({
      //   code: qrcode, sendType, userCpf: cpf, UrlQrCode: qrcode,
      // });
      // return api.post('receipt/qrcode', {
      //   code: qrcode, sendType, userCpf: cpf, UrlQrCode: qrcode,
      // })
      //   .then((response) => response)
      //   .then((response) => {
      //     console.log('response :>>>', response.data);
      //     return response.data;
      //   })
      //   .catch((err) => {
      //     console.log('error', JSON.stringify(err.response.data));
      //     return err.response.data;
      //   });
  }

  static async SendReceiptPhoto(image) {
    // // api.defaults.headers.contentType = 'multipart/form-data';
    // console.log('imaage :>> ', image);
    // // eslint-disable-next-line no-undef
    // const data = new FormData();
    // data.append('file', {
    //   uri: image,
    //   type: 'image/jpg',
    //   name: 'image.jpg',
    // });
    // // data.append('name', 'Image Upload');
    // return api.post('receipt/photo', data, { 'Content-Type': ' multipart/form-data' })
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response :>>>', response.data);
    //     return response.data;
    //   })
    //   .catch((err) => {
    //     console.log('error', JSON.stringify(err));
    //     return err;
    //   });
  }

  static async SendMessage(object) {
    // api.defaults.headers.contentType = 'multipart/form-data';
    console.log('object :>> ', object);
    // eslint-disable-next-line no-undef
    const data = new FormData();
    data.append('subject', object.subject);
    data.append('message', object.message);
    if (object.documentSelected) {
      data.append('attachment', {
        uri: object.documentSelected.uri,
        type: object.documentSelected.type,
        name: object.documentSelected.name,
      });
    }
    // data.append('name', 'Image Upload');
    return inovaApi.post('contactus', data, { 'Content-Type': ' multipart/form-data' })
      .then((response) => response)
      .then((response) => {
        console.log('response :>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log({err});
        return err;
      });
    // return api.post('contactus', data, { 'Content-Type': ' multipart/form-data' })
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response :>>>', response.data);
    //     return response.data;
    //   })
    //   .catch((err) => {
    //     console.log('error', JSON.stringify(err));
    //     return err;
    //   });
  }

  static async GetRewards(id, page) {
    const body = {
      pageSize: 100,
      pageNumber: page,
      id,
    };
    console.log('GetRewards body:>> ', body);
    return inovaApi.post('promotions/rewards', body)
      .then((response) => response)
      .then((response) => {
        console.log('response GetRewards:>>>', response.data);
        return response.data.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
    // return api.post('promotions/rewards', body)
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response GetRewards:>>>', response.data);
    //     return response.data.data;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return err.response.data;
    //   });
  }

  static async PostReward(body) {
    console.log('PostReward :>> ', body);
    return inovaApi.post('benefit/apply', body)
      .then((response) => response.data)
      .catch((err) => {
        console.log({err});
        return err.response.data;
      });
    // return api.post('benefit/apply', body)
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response :>>>', response.data);
    //     return response.data;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return err.response.data;
    //   });
    // return{
    //   success: false,
    //   data: "teste"
    // }
  }

  static async GetOffers(categ, page, term) {
    const body = {
      pageSize: 10,
      pageNumber: page,
      id: categ,
      name: term,
    };
    console.log('GetOffers > >:>> ', body);
    // let inovaOffers = await inovaApi.post('promotions/offers', body)
    return inovaApi.post('promotions/offers', body)
    .then(inovaOffers => {
      console.log({inovaOffers})
      return inovaOffers.data.data;
    })
    // return api.post('promotions/offers', body)
    //   .then((response) => response)
    //   .then((response) => {
    //     // console.log({inovaOffers, devOffers: response.data})
    //     // console.log('response > >:>>>', response.data);
    //     return response.data.data;
    //   });
    // .catch((err) => {
    //   console.log(err);
    //   return err.response.data;
    // });
  }

  static async GetReceipts(data=null) {
    console.log('GetReceipts :>> ');
    return inovaApi.get(
      (data != null)
      ? `receipt/list?page=${data.pageNumber}&size=${data.pageSize}`
      : `receipt/list`)
      .then((response) => response)
      .then((response) => {
        console.log('response :>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log({err});
        return err.response.data;
      });
    console.log('GetReceipts :>> ');
    // return api.get('receipt/list')
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response :>>>', response.data);
    //     return response.data.data.reverse();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return err.response.data;
    //   });
  }

  static async GetBanners() {
    console.log('GetReceipts :>> ');
    return inovaApi.get('banners/active')
      .then((response) => response)
      .then((response) => {
        console.log('banners :>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log({err});
        return err.response.data;
      });
  }

  static async GetVouchers() {
    return inovaApi.get('vouchers')
      .then((response) => response)
      .then((response) => {
        console.log('response GetVouchers():>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
    // return api.get('voucher')
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response GetVouchers():>>>', response.data);
    //     return response.data.data;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return err.response.data;
    //   });
  }

  static async GetBalance() {
    try {
      const response = await inovaApi.get('benefit/balance');
      console.log('GetBalance(response) :>> ', response);

      return response.data.data;
      // const response = await api.get('benefit/balance');
      // console.log('GetBalance(response) :>> ', response);

      // return response.data.data;
    } catch (error) {
      console.log({error});
      return error;
    }
  }

  static async GetParticipantData() {
    try {
      const response = await inovaApi.get('users');
      console.log('GetParticipantData(response) :>> ', response);

      return response.data.data.resultValue;
      // const response = await api.get('users');
      // console.log('GetParticipantData(response) :>> ', response);

      // return response.data.data.resultValue;
    } catch (error) {
      console.log('errorsss', error);
      return error;
    }
  }

  static async GetInstitutions() {
    console.log('GetInstitutions :>> ');
    return inovaApi.get('institutions')
      .then((response) => response)
      .then((response) => {
        console.log('response :>>>', response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
    // return api.get('institutions')
    //   .then((response) => response)
    //   .then((response) => {
    //     console.log('response :>>>', response.data);
    //     return response.data.data;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return err.response.data;
    //   });
  }

  static async signOut() {
    return await inovaApi.get('users/logout')
    .then((response) => {
      console.log('response :>>>', response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
  }
  
  static async GetNotifications(page=1) {
    return inovaApi.get(`notifications/my?page=${page}&size=${10}`)
    .then((response) => {
      console.log({response})
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
  }

  static async MarkNotificationAsRead(id) {
    console.log({id})
    return inovaApi.post(`notifications/read`, {id})
    .then((response) => {
      console.log({response})
      return response.data;
    })
    .catch((err) => {
      console.log({err});
      // return err.response.data;
      return false;
    });
  }

  static async checkNotifications() {
    return inovaApi.get(`notifications/unread`)
    .then((response) => {
      console.log({response})
      return response.data;
    })
    .catch((err) => {
      console.log({err});
      // return err.response.data;
      return 0;
    });
  }

  
  static async getCoinHistory(data) {
    return inovaApi.post(`coins/history`, data)
    .then((response) => {
      console.log({response})
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
  }

  static async checkShowFields() {
    return inovaApi.get(`settings/showFields`)
    .then((response) => {
      console.log({response})
      return response.data;
    })
    .catch((err) => {
      console.log({err});
      // return err.response.data;
      return null;
    });
  }
}

export default CiclooService;
