import { Platform } from 'react-native'
//Imports pacotes
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";


class Notification {
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
    _IOSNotification = (id, title, message, data ={}, options ={})=>{
        return{
            alertAction: options.alertAction || "View",
            category: options.category || "",
            userInfo: {
                id: id,
                item: data,
            }
        }
    }
    showNotification = (id, title, message, data = {}, options ={})=>{
        PushNotification.localNotification({
            ...this._IOSNotification(id, title, message, data, options),
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

export const notificationManager = new Notification()