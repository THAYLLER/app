import React, { useEffect } from 'react';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

const Configure = () => {

  const { activeProject } = useSelector(state => ({
    activeProject: state.homeReducer.activeProject,
  }), shallowEqual);
  const dispatch = useDispatch();

  //Deve estar fora de qualquer componente LifeCycle (como `componentDidMount`).
  PushNotification.configure({

    // (opcional) Chamado quando o token é gerado (iOS e Android)
    onRegister: function (token) {
      console.log("RNPNonRegistertoken:", token);
      EncryptedStorage.setItem('fcmToken', token.token);
    },

    // (obrigatório) Chamado quando um controle remoto é recebido ou aberto, ou uma notificação local é aberta
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification, activeProject);

      // processar a notificação
      if (notification?.data?.url) {
        NavigationService.navigate('HomeScreen', { Key: 'URL', urlNotas: notification.data.url })
      } else if (notification.id > 0 && notification.id < 7 && global.notifNavVar) {
        global.localPushID = notification.id
        NavigationService.navigate('AllTimersButton')
      } else if (notification.id == 7 && global.notifNavVarP) {
        NavigationService.navigate('ProjectDetail')
      }

      // (obrigatório) Chamado quando um controle remoto é recebido ou aberto, ou uma notificação local é aberta
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (opcional) Chamado quando Registered Action é pressionado e invokeApp é false, se true onNotification será chamado (Android)
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);

      // processa a ação
    },

    // (opcional) Chamado quando o usuário não consegue se registrar para notificações remotas. Normalmente ocorre quando o APNS está tendo problemas ou o dispositivo é um simulador. (iOS)
    // onRegistrationError: function (err) {
    // console.error (err.message, err);
    //},

    // SOMENTE IOS (opcional): padrão: todos - Permissões para registrar.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    largeIcon: "ic_launcher",
    smallIcon: "ic_launcher",

    // A notificação inicial deve ser exibida automaticamente
    // padrão: verdadeiro
    popInitialNotification: true,

    /**
     * (opcional) padrão: verdadeiro
     * - Especificado se as permissões (ios) e token (android e ios) serão solicitados ou não,
     * - se não, você deve chamar PushNotificationsHandler.requestPermissions () mais tarde
     * - se você não estiver usando notificação remota ou não tiver o Firebase instalado, use:
     * requestPermissions: Platform.OS === 'ios'
     */
  });

  return null

};

const LocalNotificationSchedule = () => {
  PushNotification.localNotificationSchedule({
    /* Android Only Properties */
    channelId: "local", // (required) channelId, if the channel doesn't exist, notification will not trigger.
    ticker: "My Notification Ticker", // (optional)
    showWhen: true, // (optional) default: true
    autoCancel: true, // (optional) default: true
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
    largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    // bigText: "Entre no aplicativo e confira suas notas!",
    bigText: (approved) 
    ? "Suas notas foram validadas com sucesso!"
    : ("Puxa, nem todas as suas notas foram validadas com sucesso! Dê preferência aos produtos " + 
    "Unilever, como Omo, Dove, Rexona, Kibon, Knorr, AdeS, entre outras dezenas!"), // (optional) default: "message" prop
    subText: "Informativo", // (optional) default: none
    bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
    bigLargeIcon: "ic_launcher", // (optional) default: undefined
    bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
    color: "black", // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: "some_tag", // (optional) add tag to message
    group: "group", // (optional) add group to message
    groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    priority: "high", // (optional) set notification priority, default: high
    visibility: "private", // (optional) set notification visibility, default: private
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
    shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
    onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
    
    when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
    usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
    timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
  
    messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
  
    // actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
    invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
  
    /* iOS only properties */
    category: "", // (optional) default: empty string
  
    /* iOS and Android properties */
    id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    title: "A Cicloo verificou suas notas fiscais!", // (optional)
    message: "Notificação disparada", // (required)
    userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    playSound: false, // (optional) default: true
    soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    //repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
  })
}

const CancelLocalNotifications = (id) => {
  PushNotification.cancelLocalNotifications({ id: id + '' })
}

// const LocalNotification = () => {
//   PushNotification.localNotification({
//     id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
//     autoCancel: true,
//     bigText: 'This is local notification demo in React Native app. Only shown, when expanded.',
//     subText: 'Local Notification Demo',
//     title: 'Local Notification Title',
//     message: 'Expand me to see more',
//     vibrate: true,
//     vibration: 300,
//     playSound: true,
//     soundName:'default',
//     actions: '["Yes", "No"]'
//   })
// }

export {
  Configure,
  LocalNotificationSchedule,
  CancelLocalNotifications,
  // LocalNotification
};