import * as Notifications from 'expo-notifications';
import { Constants } from 'expo-constants';
import { Alert, Platform } from 'react-native';
 
export const getToken = async() => {
//  if(!Constants.device){
//    Alert.alert('Debes utilizar un dispositivo fisico para poder utilizar las notificaciones.')
//    return
//  }
 
 const { status: existingStatus } = await Notifications.getPermissionsAsync();
 let finalStatus =  existingStatus
 if(existingStatus !== 'granted'){
   const { status } = await Notifications.requestPermissionsAsync();
   finalStatus = status;
 }
 
 if(finalStatus !== 'granted'){
   Alert.alert('Debes dar permiso para acceder a las notificaciones.')
   return
 }
 
 const token = (await Notifications.getExpoPushTokenAsync()).data
 
 if(Platform.OS == 'android'){
   Notifications.setNotificationChannelAsync('default', {
     name : 'default',
     importance: Notifications.AndroidImportance.MAZ,
     vibrationPattern: [0,250,250,250],
     lightColor: '#FF231FC7'
   } );
 }
 return token;
}
