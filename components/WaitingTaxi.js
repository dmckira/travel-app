import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import * as Animatable from 'react-native-animatable';

const WaitingTaxi = ({navigation}) => {

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('TaxiDescription');
    }, 4000);
  }, []);

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
})