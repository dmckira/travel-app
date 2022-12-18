import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { firebase } from '../firebase-config';

const WaitingTaxi = ({navigation}) => {
  const [movement, setMovement] = useState([])

  useEffect(() => {
    firebase.firestore().collection('movements').onSnapshot(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        if (doc.id === firebase.auth().currentUser.uid) {
          if(doc.data().state === 'Taken') {
            navigation.navigate('TaxiDescription');
          }
          setMovement(doc);
        }
      });
    })
  }, []);

  const handleDeleteMovement = async () => {
    await firebase.firestore().collection('movements').doc(firebase.auth().currentUser.uid)
    .delete();
    navigation.navigate('TaxiForm');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.Image
        source={require('../assets/images/waitingTaxi.gif')}
        animation='slideInUp'
        iterationCount={1}
        style={styles.waiting}
      />
      <Animatable.Text
        animation='slideInUp'
        iterationCount={1}
        style={styles.text}
      >
        Solicitando conductor!
      </Animatable.Text>
      <Pressable
        style={ styles.button }
        onPress={handleDeleteMovement}
      >
        <Text style={ styles.textButton }>Editar o Cancelar pedido</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default WaitingTaxi

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#0F6769',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waiting: {
    height: 150,
    width: 150,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 28,
    marginTop: 10,
    marginBottom: 10,
    color: '#b5b2b8',
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
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#b5b2b8',
  },
})