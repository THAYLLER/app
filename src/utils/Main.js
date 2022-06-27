import analytics from '@react-native-firebase/analytics';
//import appsFlyer from 'react-native-appsflyer';

class Main {
  static async logScreen(currentRouteName) {
    console.log('logScreen', currentRouteName);
    analytics().logScreenView({
      screen_name: currentRouteName,
      screen_class: currentRouteName,
    });
  }

  static async loginType(type) {
    await analytics().logEvent('login', {
      method: type,
    });
    const eventName = 'af_login';
    const eventValues = {
      af_login_type: type,
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async signup() {
    await analytics().logSignUp({
      method: 'App',
    });
    const eventName = 'af_complete_registration';
    const eventValues = {
      af_registration_method: 'app',
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async addToWishlist(info) {
    const params = {
      currency: 'BRL',
      items: [{
        item_category: info.category,
        item_id: info.id,
        item_name: info.name,
      }],
      value: info.coinValue,
    };
    await analytics().logAddToWishlist(params);
    const eventName = 'af_add_to_wishlist';
    const eventValues = {
      content_type: info.category,
      af_content: info.name,
      af_price: info.coinValue,
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async selectContentCategory(info) {
    const params = {
      content_type: info.categoryName,
      item_id: info.categoryId,
    };
    await analytics().logSelectContent(params);
    const eventName = 'af_content_view';
    const eventValues = {
      af_content_type: 'Categoria',
      af_content_id: info.categoryId,
      af_content: info.categoryName,
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async searchTerm(info) {
    const params = {
      search_term: info.searchTerm,
    };
    await analytics().logSearch(params);
    const eventName = 'af_search';
    const eventValues = {
      af_search_string: info.searchTerm,
      af_success: info.success,
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async selectContentRewards() {
    const params = {
      content_type: 'Rewards',
      item_id: '', // REVER
    };
    await analytics().logSelectContent(params);
    const eventName = 'af_content_view';
    const eventValues = {
      af_content_type: 'Rewards',
      af_content: 'Rewards',
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async logRewardViewItem(info) {
    const params = {
      items: [{
        item_category: 'Rewards',
        item_id: info.id,
        item_name: info.name,
      }],
    };
    await analytics().logViewItem(params);
    const eventName = 'af_reward_view';
    const eventValues = {
      af_reward_name: info.name,
      af_reward_price: info.value,
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async logVoucherRedeemed(info) {
    await analytics().logEvent('VoucherRedeemed', {
      eventName: 'af_vouncher_redeemed',
      af_reward_name: info.name,
      af_reward_price: info.value,
    });

    const eventName = 'af_vouncher_redeemed';
    const eventValues = {
      af_reward_name: info.name,
      af_reward_price: info.value,
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async logScanCoupon() {
    const eventName = 'af_coupom_scan';
    const eventValues = null;
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async logCouponRegistered() {
    const eventName = 'af_coupom_registration';
    const eventValues = null;
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async logReportProblem() {
    await analytics().logEvent('ReportProblem');
  }

  static async selectContentInstitutions(info) {
    const params = {
      content_type: `Instituição - ${info.institutionName}`,
      item_id: info.institutionId,
    };
    await analytics().logSelectContent(params);
    const eventName = 'af_content_view';
    const eventValues = {
      af_content_type: 'Institutions',
      af_content_id: info.institutionId,
      af_content: info.institutionName,
    };
    this.genericAppsFlyer(eventName, eventValues);
  }

  static async logEventLogout() {
    await analytics().logEvent('logout');
    this.genericAppsFlyer('logout', null);
  }

  static genericAppsFlyer(eventName, eventValues) {
    if (!eventValues) {
      appsFlyer.logEvent(
        eventName,
        (res) => {
          console.log(res);
        },
        (err) => {
          console.error(err);
        },
      );
      return;
    }
    appsFlyer.logEvent(
      eventName,
      eventValues,
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      },
    );
  }
}

// const Main = new Analytics();
export default Main;
