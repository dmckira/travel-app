import React from 'react'
import { ScrollView, View, TextInput, Text, Button, Image, ImageBackground, StyleSheet } from 'react-native';
import {getAuth, createUserWithEmailAndPassword, sigInWithEmailAndPassword} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { TouchableOpacity } from 'react-native-web';
const background = require('../assets/images/Interfacesfondos.jpg');
const imageLogin = require('../assets/images/carro.png');
const travelLogo = require('../assets/images/logotipo-travel.png');
const [email, setEmail] = React.useState(' ');
const [password, setPassword] = React.useState(' ');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const handleCreateAccount = () =>{
  createUserWithEmailAndPassword(auth, email, password)
  .then(()=>{
    console.log('account created');
    const user = userCredential.user;
    console.log(user);
  })
  .catch(error => {
    console.log(error);
  })
}

const handleSignIn = () =>{
  sigInWithEmailAndPassword(auth, email, password)
  .then(()=>{
    console.log('SIGNIN SUCCESS');
    const user = userCredential.user;
    console.log(user);
  })
  .catch(error => {
    console.log(error);
  })
}

function HomeScreen(){

}

function LoginScreen(){
  <Text>HolaMundo</Text>

}



function Login({navigation}) {
  return (
      <ImageBackground source={background} style={styles.backgroundImage}>
  <View style={styles.containerImage}>
    <Image style={styles.imageLogo} source={travelLogo}></Image>
  </View>
  <Image style={styles.image} source={imageLogin}></Image>
  <Text style={styles.register}>
    Registrarse
  </Text>
  <ScrollView>
    <View>
      <TextInput onChangeText={(text)=> setEmail(text)} placeholder='Correo Electronico' />
    </View>
    <View>
      <TextInput onChangeText={(text)=> setPassword(text)} placeholder='Contraseña' />
    </View>
    <View>
      <Button title='Continuar' ></Button>
    </View>
    <TouchableOpacity onPress={handleSignIn}>
      <Text>Login</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleCreateAccount}>
      <Text>Create account</Text>
    </TouchableOpacity>
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