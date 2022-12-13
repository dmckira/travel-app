import React from 'react'
import { ScrollView, View, Text, Button, Image, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { firebase } from '../firebase-config';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin, setUser } from '../slices/navSlice';

const background = require('../assets/images/imglogin.jpg');
const imageLogin = require('../assets/images/carro.png');
const travelLogo = require('../assets/images/logotipo-travel.png');

function Login({navigation}) {
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const origin = useSelector(selectOrigin);
  const auth = firebase.auth;

  handleSignIn = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      await firebase.firestore().collection('users').doc(auth().currentUser.uid).get()
        .then(user => {
          dispatch(setUser({
            user: user.data(),
          }))
          if (user.data().role === 'Usuario' || user.data().role === 'Propietario') {
            navigation.navigate('Home');
          } else if(user.data().role === 'Conductor') {
            navigation.navigate('Driver');
          } else {
            setBusJornada();
            navigation.navigate('Bus');
          }
        })
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  setBusJornada = async () => {
    await firebase.firestore().collection('users').doc(auth().currentUser.uid)
      .update({
        origin,
        inRuta: true,
      });
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
        <Image style={styles.image} source={imageLogin}></Image>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.register}>
            Registrarse
          </Text>
        </TouchableOpacity>
      <ScrollView>
        <View>
          <Input
            onChangeText={(email) => setEmail(email)}
            placeholder='Correo'
            autoCapitalize='none'
            autoCorrect={false}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: 20, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'envelope', size: 18, color: '#1D8385', marginLeft: 5 }}
          />
        </View>
        <View>
          <Input
            onChangeText={(password) => setPassword(password)}
            placeholder='Contraseña'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: 5, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'lock', size: 30, color: '#1D8385', marginLeft: 5 }}
          />
        </View>
        <Text
          style={styles.recovery}
          onPress={()=> navigation.navigate("recover-password")}
        >
          ¿Olvidaste tu contraseña?
        </Text>
        <View style={ styles.containerButton }>
          <TouchableOpacity
            onPress={() => handleSignIn(email, password)}
            style={ styles.button }
          >
            <Text style={ styles.text }>Iniciar sesión</Text>
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
  containerButton: {
    padding: 2,
    marginTop: 'auto',
    flexShrink: 1,
  },
  container: {
    width: '100%',
    borderBottomColor: '#1D8385',
    marginVertical: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  image: {
    height: '20%',
    width: '100%',
  },
  imageLogo: {
    height: 90,
    width: 265,
    border: 0,
    marginTop: '10%',
    marginBottom: '10%',
  },
  button: {
    margin: 10,
    backgroundColor: '#1D8385',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  recovery: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    fontSize: 16,
  },
  register: {
    color: '#ffff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: '0%',
    marginBottom: 10,
    alignContent: 'center',
    height: 40,
    width: '83%',
    backgroundColor: '#ff5042',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    /* Para que no se rompa en dos líneas, y lo translade tal cual. */
    marginLeft: 30,
  },
});

export default Login