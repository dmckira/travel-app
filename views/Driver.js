import { ScrollView, StyleSheet, ImageBackground, Text, View, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase } from '../firebase-config';
import { ListItem, Avatar } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import DescriptionItem from '../components/DescriptionItem';

const background = require('../assets/images/imglogin.jpg');
const travelLogo = require('../assets/images/logotipo-travel.png');
const userImage = require('../assets/images/user.png');

const Driver = () => {
  const [movements, setMovements] = useState([])

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
      setMovements(movements);
    })
  }, []);
  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
      <View style={styles.container}>
        <FlatList
          data={movements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            item.state !== 'Taken' ? (
            <DescriptionItem
              title={item.user.name}
              origin={item.origin.description}
              destination={item.destination.description}
              userId={item.id}
            />
            ) : null
          )}
        />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: '2%',
    paddingHorizontal: '3%',
    height: '100%',
  },
  containerImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    marginBottom: '10%',
  },
})

export default Driver
