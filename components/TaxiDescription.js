import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image, Alert, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { selectTravelTimeInformation, setDestination } from '../slices/navSlice'
import { firebase } from '../firebase-config';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { sendPushNotification, setNotificationMessage } from '../actions';

const travelLogo = require('../assets/images/logotipo-travel-shadow.png');

const TaxiDescription = ({navigation}) => {
  const dispatch = useDispatch();
  const [movement, setMovement] = useState([]);
  const [notifyTime, setNotifyTime] = useState(false);
  const [notifyArrive, setNotifyArrive] = useState(false);
  const time = useSelector(selectTravelTimeInformation);
  const auth = firebase.auth;

  const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await firebase.firestore().collection(collection).doc(id).get()
        result.document = response.data()
        result.document.id = response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
  }

  const sendNotificationTime = async() => {
    if (!notifyTime) {
      const resultToken = await getDocumentById("users", auth().currentUser.uid);

      if (!resultToken.statusResponse) {
        Alert.alert("No se pudo obtener el token del usuario");
        return;
      }

      const messageNotification = setNotificationMessage(
        resultToken.document.token,
        'Prepárate!',
        'Tu taxi ya esta llegando',
        { data: 'Apúrate' }
      )

      const response = await sendPushNotification(messageNotification)

      setNotifyTime(true);
    }
  }

  const sendNotificationArrive = async() => {
    if (!notifyArrive) {
      const resultToken = await getDocumentById("users", auth().currentUser.uid);

      if (!resultToken.statusResponse) {
        Alert.alert("No se pudo obtener el token del usuario");
        return;
      }
  
      const messageNotification = setNotificationMessage(
        resultToken.document.token,
        'Apúrate!',
        'Tu taxi te esta esperando',
        { data: 'Apúrate' }
      )

      const response = await sendPushNotification(messageNotification)

      setNotifyArrive(true);
    }
  }

  useEffect(() => {
    firebase.firestore().collection('movements').onSnapshot(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        if (doc.id === firebase.auth().currentUser.uid) {
          setMovement(doc.data());
          if (doc.data().state === 'Done') {
            dispatch(
              setDestination(null)
            );
            navigation.navigate('Home');
          }
        }
      });
    })
  }, []);

  return (
    <SafeAreaView style={styles.containerHeader}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
      <View style={styles.border}/>
      {movement.driver ? (
        <ScrollView style={styles.containerBody}>
          <View style={styles.titleContainer}>
            <Icon color='#0F6769' name='local-taxi' size={40} style={{marginRight: 10}} />
              <Text style={styles.title}>{movement.driver.name} - {movement.driver.placa}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.bodyText}>Desde: {movement.origin.description}</Text>
            <Text style={styles.bodyText}>Hasta: {movement.destination.description}</Text>
            {time ? (
              <View style={styles.bodyTimer}>
                <Icon color='#0F6769' name='timer' size={25} style={{marginRight: 5}} />
                <Text style={ styles.bodyText }>{time.time <= 1 ? sendNotificationTime() && time.time : time.time} Minutos de distancia</Text>
              </View>
            ) : null}
          </View>
          
        </ScrollView>
      ) : null}
      <View style={ styles.containerButton }>
        <View
          style={ styles.button } 
        >
          {movement.state === 'Arrive' ? 
          sendNotificationArrive() &&
          (
            <Text style={ styles.text }>¡Tu taxi te esta esperando!</Text>
          ) : (
            <Text style={ styles.text }>¡Tu taxi va en camino!</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    backgroundColor: '#1D8385',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  containerBody: {
    width: '90%',
    padding: '2%',
    borderRadius: 12,
    backgroundColor: '#ff4e40',
    marginBottom: '2%',
    overflow: 'hidden',
    margin: '5%',
  },
  containerButton: {
    padding: 2,
    height: 100,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: '#297273',
    flexShrink: 1,
  },
  containerImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    color: '#b5b2b8',
    fontWeight: 'bold',
  },
  textContent: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
    fontWeight: '900',
    color: '#C2645D',
    textShadowColor: 'white',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 4,
  },
  body: {
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  bodyText: {
    fontSize: 16,
    color: '#b5b2b8',
    fontWeight: 'bold',
  },
  bodyTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  border: {
    borderTopWidth: 1,
    borderColor: '#297273',
    flexShrink: 1,
  },
  button: {
    margin: 10,
    backgroundColor: '#ff4e40',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#b5b2b8',
  },
  imageLogo: {
    height: 55,
    width: 160,
    border: 0,
    borderColor: '#ffff',
    marginTop: 2,
    marginBottom: 2,
  },
})

export default TaxiDescription
