import React from 'react'
import { ScrollView, View, TextInput, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebase } from '../firebase-config';

const background = require('../assets/images/Interfacesfondos.jpg');
const imageLogin = require('../assets/images/carro.png');
const travelLogo = require('../assets/images/logotipo-travel.png');

const Register = () => {
  const users = firebase.firestore().collection('users');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');

  const handleCreateAccount = async () => {
    if (email === '' || password === '') {
      alert('Necesita completar todos los campos');
    } else {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().currentUser.sendEmailVerification({
          handleCodeInApp: true,
          url: 'https://travel-app-bd-47b61.firebaseapp.com',
        })
        .then(() => {
          alert('Verificación de Email enviada!');
        }).catch((error) => {
          alert(error.message);
        })
        .then(() => {
          firebase.firestore().collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
          })
        })
        .catch((error) => {
          alert(error.message);
        })
      })
      .catch((error) => {
        alert(error.message);
      })
      alert('Guardado!');
    }
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
      <Image style={styles.image} source={imageLogin}></Image>
      <Text style={styles.register}>
        Iniciar sesión
      </Text>
      <ScrollView>
      <View>
          <TextInput
            onChangeText={(text) => setName(text)}
            placeholder='Nombre de usuario'
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>
        <View>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            placeholder='Correo Electronico'
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>
        <View>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            placeholder='Contraseña'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
          />
        </View>
        <View>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  containerImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  image: {
    height: '26%',
    width: '100%',
  },
  imageLogo: {
    height: 90,
    width: 260,
    border: 0,
    marginTop: '10%',
    marginBottom: '10%',
  },
  register: {
    color: '#ffff',
    textAlign: 'center',
    fontSize: 16,
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
});

export default Register
