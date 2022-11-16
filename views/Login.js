import React from 'react'
import { ScrollView, View, TextInput, Text, Button, Image, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebase } from '../firebase-config';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/navSlice';

const background = require('../assets/images/Interfacesfondos.jpg');
const imageLogin = require('../assets/images/carro.png');
const travelLogo = require('../assets/images/logotipo-travel.png');

function Login({navigation}) {
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  handleSignIn = async (email, password) => {
    try {
      const user = await firebase.auth().signInWithEmailAndPassword(email, password)
      dispatch(setUser({
        userName: user.user.email,
      }))
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Image style={styles.image} source={imageLogin}></Image>
          <Text style={styles.register}>
            Registrarse
          </Text>
      </TouchableOpacity>
      <ScrollView>
        <View>
          <TextInput
            onChangeText={(email) => setEmail(email)}
            placeholder='Correo Electrónico'
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>
        <View>
          <TextInput
            onChangeText={(password) => setPassword(password)}
            placeholder='Contraseña'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
          />
        </View>
        <View>
          <TouchableOpacity onPress={() => handleSignIn(email, password)}>
            <Text>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
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

export default Login