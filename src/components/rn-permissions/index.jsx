import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { request, RESULTS, PERMISSIONS } from 'react-native-permissions'

export default function Permissao() {
  useEffect(() => {
        ;(async () => {
          const result = await requestPermissionTransparency()
          if (result === RESULTS.GRANTED) {
            //You need to enable analytics (fb,google,etc...)
            await firebase.analytics().setAnalyticsCollectionEnabled(true)
            console.log('Firebase Analytics: ENABLED')
          }
          //Modal
          const { status } = await requestTrackingPermissionsAsync();
          if (status === 'granted') {
            console.log('Yay! I have user permission to track data');
          }
        })()
    }, []) 
  return (
    <></>
  );
}
