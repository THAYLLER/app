import { Platform } from 'react-native'
//Imports pacotes
import BackgroundFetch from "react-native-background-fetch";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";


class Notification4 {
    configure = () => {
        PushNotification.configure({
            onRegister: function name(toke) {
                console.log("[NotificationManager] onRegister token:", token );
            },

            onNotification: function name(notification) {
                console.log("[NotificationManager] onNotification:", notification);

                notification.finish(PushNotificationIOS.FetchResult.NoData);
            }
        })
    }
    _IOSNotification4 = (id, title, message, data ={}, options ={})=>{
        return{
            alertAction: options.alertAction || "View",
            category: options.category || "",
            userInfo: {
                id: id,
                item: data,
            }
        }
    }
    showNotification4 = (id, title, message, data = {}, options ={})=>{
        PushNotification.localNotification({
            ...this._IOSNotification4(id, title, message, data, options),
            title: title || "",
            message: message || "",
            playSound: options.playSound || false,
            soundName: options. soundName || 'default',
            userInteraction: false
        })
    }

    cancelAllLocalNotification = () =>{
        if (Plataform.OS === 'ios'){
            PushNotificationIOS.removeAllDeliveredNotifications()
        } else{
            PushNotification.cancelAllLocalNotifications()
        }
    }
    
    unregister = () => {
        PushNotification.unregister
    }
}

export const notificationManager4 = new Notification4()

  //Background Fetch 

export const initBackGroundFetchRegra4 = () => {
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 21600, // <-- minutes 
      // Android options
      forceAlarmManager: true, // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Network connection needed
    },
    async taskId => {
      // Do stuff with notifications, for example:
      const notificationService = new Notification4(
         () => {/*what to do on register*/},
         () => {/*what to do on notification*/}
      )
      const date = new Date(Date.now() + 60 * 1000) // adjust according to your use case
      notificationService.scheduleNotif(date, "title", "message");
      BackgroundFetch.finish(taskId);
    },
    error => {
      console.log('[js] RNBackgroundFetch failed to start');
    },
  );
};
