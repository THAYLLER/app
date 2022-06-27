import { CiclooService } from '../../services';
import { notificationManager } from '../NotificationManager';
var localNotify = notificationManager;
var events = []
var receipts = []
  export const initBackgroundFetch = async (receipts) => {
    receipts = receipts
    localNotify.configure()
    // BackgroundFetch event handler.
    const onEvent = async (taskId) => {
      console.log('[BackgroundFetch] task: ', taskId);
      // Do your background work...
      // let receipts = await CiclooService.GetReceipts();
      // console.log({receipts})
      await addEvent(taskId);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgorundFetch.finish(taskId)
    const onTimeout = async (taskId) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure({
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
    }, onEvent, onTimeout);

    console.log('[BackgroundFetch] configure status: ', status);
  };

  // Add a BackgroundFetch event to <FlatList>
  export const addEvent = (taskId) => {
    // Simulate a possibly long-running asynchronous task with a Promise.
    // notify()
    return new Promise((resolve, reject) => {
      // interval = setInterval(() => (
        if(events.length == 0)
          events = [...state.events, {
            key: state.events.length,
            taskId: taskId,
            timestamp: (new Date()).toString()
          }]
          //Recuperar os array de notas salvas pelos Async Storage
          CiclooService.GetReceipts()
          .then(receipts => {
            console.log({events: events})
            if(receipts.length != receipts.length){
              //verificar status das notas retornadas
              // fim verificar status
              // notify(status)
              let title = "A Cicloo verificou suas notas fiscais!";
              let message = (receipts.length != receipts.length && ((receipts.pop()).status.toUpperCase().indexOf("APROVAD") > -1)) 
              ? "Suas notas foram validadas com sucesso!"
              : ("Puxa, nem todas as suas notas foram validadas com sucesso! Dê preferência aos produtos " + 
              "Unilever, como Omo, Dove, Rexona, Kibon, Knorr, AdeS, entre outras dezenas!");
              if(Platform.OS== 'ios'){
                onPressSendNotification(title, message)
              } else{
                notify(title, message)
              }
              //Setar array de notas salvas no Async Stoarage após recebido  

              console.log("started: ", new Date().toDateString());
              console.log({events: events})
            }
          })
          .catch(error => {
            console.log({error})
          })
      // ), 1*60*1000)
      resolve();
    });
    let propsObject = {};
  }
  //Parte IOS
  export const onPressSendNotification = (title, message) => {
    localNotify.showNotification(
      1,
      title,
      message,
      {},
      {}
    )
  }
  //Fim parte andre 
  
  //Parte Android
  export const notify = (title, message) => PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "local", // (required) channelId, if the channel doesn't exist, notification will not trigger.
    ticker: "My Notification Ticker", // (optional)
    showWhen: true, // (optional) default: true
    autoCancel: true, // (optional) default: true
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
    largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    // bigText: "Entre no aplicativo e confira suas notas!",
    bigText: message, // (optional) default: "message" prop
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
    title: title, // (optional)
    message: "Notificação disparada", // (required)
    userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    playSound: false, // (optional) default: true
    soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    //repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
  });