import { View, Text, ImageBackground, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import React from 'react';
/* import Icon from 'react-native-vector-icons/FontAwesome'; */
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../slices/navSlice';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { firebase } from '../firebase-config';

const background = require('../assets/images/imglogin.jpg');
const travelImage = require('../assets/images/fondoverdetravel.png');

const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
)

function Home ({navigation}) {
  const auth = firebase.auth;
  const user = useSelector(selectUser);
  const [role, setRole] = React.useState('');

  firebase.firestore().collection('users').doc(auth().currentUser.uid).get()
    .then(user => {
      setRole(user.data().role);
    })

  const logout = async () => {
    if (user.user.role === 'Conductor') {
      await firebase.firestore().collection('users').doc(auth().currentUser.uid)
      .update({
        state: 'offline',
      });
    }
    await firebase.auth().signOut();
    navigation.navigate('Login')
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <Text style={styles.bienvenidotxt}>
        Bienvenid@ {user.user.name}
      </Text>
      <Image style={styles.image} source={travelImage}></Image>
      <Text style={styles.welcome}>
        Hola, Selecciona un servicio.
      </Text>
      <View style={styles.container}>
        <Row>
        {role !== 'Propietario' && role !== '' ? (
          <View style={ styles.containerButton }>
            <TouchableOpacity 
              style={ styles.item }
              onPress={() =>
              navigation.navigate('Profile')
              }>
              <Icon name="person" size={60} color="#ff4e40" />
              <Text style={styles.bienvenidotxt}>
                Perfil
              </Text>
            </TouchableOpacity >
            <TouchableOpacity 
              style={ styles.item } 
              onPress={() =>
              navigation.navigate('Map')
              }>
              <Icon name="local-taxi" size={60} color="#1D8385" />
              <Text style={styles.bienvenidotxt}>
                Taxi
              </Text>
            </TouchableOpacity >
            <TouchableOpacity 
              style={ styles.item }
              onPress={() =>
                navigation.navigate('Busetas')
              }
              >
              <Icon name="directions-bus" size={60} color="#1D8385" />
              <Text style={styles.bienvenidotxt}>
                Busetas
              </Text>
            </TouchableOpacity >
              <TouchableOpacity 
                style={ styles.item }
                onPress={() =>
                  navigation.navigate('Support')
                  }>
                <Icon name="settings" size={60} color="#ff4e40" />
                <Text style={styles.bienvenidotxt}>
                  Soporte
                </Text>
              </TouchableOpacity >
            </View>
            ) : role === '' ? null : (
              <View style={ styles.containerButton }>
                <TouchableOpacity 
                  style={ styles.item }
                  onPress={() =>
                  navigation.navigate('Taxis')
                  }>
                  <Icon name="visibility" size={60} color="#ff4e40" />
                  <Text style={styles.bienvenidotxt}>
                    Ver taxis
                  </Text>
                </TouchableOpacity >
                <TouchableOpacity 
                  style={ styles.item } 
                  onPress={() =>
                  navigation.navigate('AddTaxi')
                  }>
                  <Icon name="local-taxi" size={60} color="#1D8385" />
                  <Text style={styles.bienvenidotxt}>
                    Agregar taxi
                  </Text>
                </TouchableOpacity >
              </View>
            )
          }
        </Row>
        <View style={ styles.containerSignOut }>
          <TouchableOpacity
            style={ styles.item }
            onPress={
              logout
            }
          >
            <Icon name="logout" size={60} color="#929292" />
            <Text style={styles.bienvenidotxt}>
              Salir
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'flex-start', // if you want to fill rows left to right
    alignContent: 'center',
  },
  containerSignOut: {
    marginTop: 'auto',
    flexShrink: 1,
    alignItems: 'center',
    marginBottom: '10%',
  },
  item: {
    alignItems: 'center',
    width: '50%' // is 50% of container width
  }
});

export default Home