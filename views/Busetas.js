import { ScrollView, StyleSheet, ImageBackground, Text, View, Image, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase } from '../firebase-config';
import BusetasItem from '../components/BusetasItem';
import { useNavigation } from '@react-navigation/native';

const background = require('../assets/images/imglogin.jpg');
const travelLogo = require('../assets/images/logotipo-travel.png');

const Busetas = () => {
  const [buses, setBuses] = useState([])
  const navigation = useNavigation(); 

  useEffect(() => {
    firebase.firestore().collection('users').onSnapshot(querySnapshot => {
      const buses = [];
      querySnapshot.docs.forEach(doc => {
        if (doc.data().role.toLowerCase() === 'buseta' && doc.data().inRuta) {
          const {name, placa, email, role, origin} = doc.data();
          buses.push({
            id: doc.id,
            name,
            placa,
            email,
            role,
            origin,
          });
        }
      });
      setBuses(buses);
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
      <Text style={styles.textContent}>B U S E T A S</Text>
      <View style={styles.border}/>
      <View style={styles.container}>
        <FlatList
          data={buses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <BusetasItem
              title={item.name}
              origin={item.origin.description}
              placa={item.placa}
              userId={item.id}
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
  border: {
    borderTopWidth: 1,
    borderColor: '#ff4e40',
    flexShrink: 1,
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#b5b2b8',
  },
})

export default Busetas
