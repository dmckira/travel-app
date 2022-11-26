import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { selectTravelTimeInformation, setDestination } from '../slices/navSlice'
import { firebase } from '../firebase-config';
import { Icon } from 'react-native-elements/dist/icons/Icon';

const TaxiDescription = ({navigation}) => {
  const dispatch = useDispatch();
  const [movement, setMovement] = useState([]);
  const time = useSelector(selectTravelTimeInformation);

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
      <Text style={styles.textContent}>T R A V E L A P P</Text>
      <View style={styles.border}/>
      {movement.driver ? (
        <View style={styles.containerBody}>
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
                <Text style={ styles.bodyText }>{time.time} Minutos de distancia</Text>
              </View>
            ) : null}
          </View>
          
        </View>
      ) : null}
      <View style={ styles.containerButton }>
        <View
          style={ styles.button } 
        >
          {movement.state === 'Arrive' ? (
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
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: '#297273',
    flexShrink: 1,
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
})

export default TaxiDescription
