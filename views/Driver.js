import { ScrollView, StyleSheet, ImageBackground, Text, View, Image, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase } from '../firebase-config';
import { ListItem, Avatar } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import DescriptionItem from '../components/DescriptionItem';
import { useNavigation } from '@react-navigation/native';
import { selectMovement, setMovement } from '../slices/navSlice';
import { useDispatch, useSelector } from 'react-redux';

const background = require('../assets/images/imglogin.jpg');
const travelLogo = require('../assets/images/logotipo-travel.png');
const userImage = require('../assets/images/user.png');

const Driver = () => {
  //const [movements, setMovements] = useState([])
  const movement = useSelector(selectMovement);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.firestore().collection('movements').onSnapshot(querySnapshot => {
      const movements = [];
      querySnapshot.docs.forEach(doc => {
        const {state, destination, origin, user} = doc.data();
        movements.push({
          id: doc.id,
          state,
          destination,
          origin,
          user,
        });
      });
      dispatch(setMovement({
        movements,
      }))
    })
  }, []);

  const endDay = async () => {
    await firebase.auth().signOut();
    navigation.navigate('Login')
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
      <Text style={styles.textContent}>S O L I C I T U D E S</Text>
      <View style={styles.border}/>
      <View style={styles.container}>
        <FlatList
          data={movement.movements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            item.state === 'Pending' ? (
            <DescriptionItem
              id={item.id.toString()}
              title={item.user.name}
              origin={item.origin.description}
              destination={item.destination.description}
              userId={item.id}
            />
            ) : null
          )}
        />
      </View>
      <View style={ styles.containerButton }>
        <Pressable
          style={ styles.button }
          onPress={endDay}
        >
          <Text style={ styles.text }>Finalizar jornada</Text>
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

export default Driver
