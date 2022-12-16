import React, { useEffect, useState } from 'react'
import { FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { firebase } from '../firebase-config';
import TaxisItem from '../components/TaxisItem';

const background = require('../assets/images/imglogin.jpg');
const travelLogo = require('../assets/images/logotipo-travel.png');

function Taxis ({navigation}) {
  const [taxis, setTaxis] = useState([]);
  const auth = firebase.auth;

  useEffect(() => {
    firebase.firestore().collection('taxis')
      .where("propietario", "==", auth().currentUser.uid)
      .onSnapshot(querySnapshot => {
        const taxis = [];
        querySnapshot.docs.forEach(doc => {
          const {propietario, placa, drivers} = doc.data();
          taxis.push({
            id: doc.id,
            propietario,
            placa,
            drivers: drivers ? drivers : null,
          });
        });
      setTaxis(taxis);
    })
  }, []);

  const endDay = async () => {
    navigation.navigate('Home')
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
      <Text style={styles.textContent}>T A X I S</Text>
      <View style={styles.border}/>
      <View style={styles.container}>
        <FlatList
          data={taxis}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <TaxisItem
              id={item.id}
              placa={item.placa}
              propietario={item.propietario}
              drivers={item.drivers}
            />
          )}
        />
      </View>
      <View style={ styles.containerButton }>
        <Pressable
          style={ styles.button }
          onPress={endDay}
        >
          <Text style={ styles.text }>Volver</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: '2%',
    paddingHorizontal: '3%',
    height: '60%',
  },
  containerImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerButton: {
    padding: 2,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: '#ff4e40',
    flexShrink: 1,
    margin: 10,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageLogo: {
    height: 90,
    width: 260,
    border: 0,
    marginTop: '10%',
    marginBottom: '5%',
  },
  textContent: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
    fontWeight: '900',
    color: '#ff4e40',
  },
  border: {
    borderTopWidth: 1,
    borderColor: '#ff4e40',
    flexShrink: 1,
    margin: 10,
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
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#b5b2b8',
  },
})

export default Taxis
