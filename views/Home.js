import { View, Text, ImageBackground, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const background = require('../assets/images/Interfacesfondos.jpg');
const travelImage = require('../assets/images/fondoverdetravel.png');

const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
)

function Home ({navigation}) {
  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <Text style={styles.bienvenidotxt}>
        Bienvenid@ Daniel Castro
      </Text>
      <Image style={styles.image} source={travelImage}></Image>
      <Text style={styles.welcome}>
        Hola, Selecciona un servicio.
      </Text>
      <View style={styles.container}>
        <Row>
          <View style={ styles.containerButton }>
            <TouchableOpacity 
              style={ styles.item }
              onPress={() =>
              navigation.navigate('Login')
              }>
              <Icon name="user" size={60} color="#929292" />
              <Text style={styles.bienvenidotxt}>
                Perfil
              </Text>
            </TouchableOpacity >
            <TouchableOpacity 
              style={ styles.item } 
              onPress={() =>
              navigation.navigate('Map')
              }>
              <Icon name="taxi" size={60} color="#929292" />
              <Text style={styles.bienvenidotxt}>
                Taxi
              </Text>
            </TouchableOpacity >
            <TouchableOpacity style={ styles.item }>
              <Icon name="bus" size={60} color="#929292" />
              <Text style={styles.bienvenidotxt}>
                Busetas
              </Text>
            </TouchableOpacity >
            <TouchableOpacity style={ styles.item }>
              <Icon name="gear" size={60} color="#929292" />
              <Text style={styles.bienvenidotxt}>
                Soporte
              </Text>
            </TouchableOpacity >
          </View>
        </Row>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 14,
    width: '100%',
    height: 500,
  },
  map:{
    width: '100%',
    height:'100%'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  bienvenidotxt: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    fontSize: 20,
  },
  image: {
    height: '26%',
    width: '100%',
  },
  imageButton: {
    height:128,
    width: 128,
    borderRadius: 64
  },
  welcome: {
    color: '#ffff',
    textAlign: 'center',
    marginTop: '0%',
    marginBottom: 10,
    alignContent: 'center',
    height: 40,
    width: 300,
    backgroundColor: '#ff5042',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    /* Para que no se rompa en dos líneas, y lo translade tal cual. */
    marginLeft: 30,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  box: {
    flex: 1,
    height: 100,
    backgroundColor: '#333',
  },
  containerButton: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  item: {
    alignItems: 'center',
    marginTop: '5%',
    width: '50%' // is 50% of container width
  }
});

export default Home