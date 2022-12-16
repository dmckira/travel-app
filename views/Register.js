import React from 'react'
import { ScrollView, View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { firebase } from '../firebase-config';
import { getToken } from '../actions';

const background = require('../assets/images/Interfacesfondos.jpg');
const imageLogin = require('../assets/images/carro.png');
const travelLogo = require('../assets/images/logotipo-travel.png');

const Register = ({navigation}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [cel, setCel] = React.useState('');
  const [role, setRole] = React.useState('');
  const [placa, setPlaca] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleCreateAccount = async () => {
    if (name === '' || email === '' || cel === '' || password === '' || role === '') {
      alert('Necesita completar todos los campos');
    } else {
      if (role.toLowerCase() === 'usuario' || role.toLowerCase() === 'conductor' || role.toLowerCase() === 'bus') {
        if (role.toLowerCase() === 'usuario' || ((role.toLowerCase() === 'conductor' || role.toLowerCase() === 'bus') && placa !== '') ) {
          const token = await getToken();
          console.log('este es eñ token de notificaciones',token);
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
              .set(role.toLowerCase() === 'conductor' || role.toLowerCase() === 'bus' ? {
                name,
                email,
                cel,
                role,
                placa,
              } : {
                name,
                email,
                cel,
                role,
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
          navigation.navigate('Login');
        } else {
          alert('Debe ingresar la placa de su vehículo');
        }
      } else {
        alert('El rol debe ser *Usuario*, *Conductor* o *Bus*');
      }
    }
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
      <Image style={styles.image} source={imageLogin}></Image>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.register}>
          Iniciar sesión
        </Text>
      </TouchableOpacity>
      <ScrollView>
      <View>
          <Input
            onChangeText={(text) => setName(text)}
            placeholder='Nombre'
            autoCapitalize='none'
            autoCorrect={false}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: 20, paddingLeft: 30, paddingRight: 30, size: 5 }}
            leftIcon={{ type: 'font-awesome', name: 'user', size: 25, color: '#1D8385', marginLeft: 5 }}
          />
        </View>
        <View>
          <Input
            onChangeText={(text) => setEmail(text)}
            placeholder='Correo'
            autoCapitalize='none'
            autoCorrect={false}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: -10, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'envelope', size: 18, color: '#1D8385', marginLeft: 5 }}
            keyboardType="email-address"
          />
        </View>
        <View>
          <Input
            onChangeText={(text) => setCel(text.replace(/[^0-9]/g, ''))}
            placeholder='Celular'
            autoCapitalize='none'
            autoCorrect={false}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: -10, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'mobile', size: 32, color: '#1D8385', marginLeft: 8 }}
            keyboardType='numeric'
            maxLength={10}
          />
        </View>
        <View>
          <Input
            onChangeText={(text) => setRole(text)}
            placeholder='Usuario, Conductor o bus?'
            autoCapitalize='none'
            autoCorrect={false}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: -10, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'users', size: 18, color: '#1D8385', marginLeft: 5 }}
          />
        </View>
        {role.toLowerCase() === 'conductor' || role.toLowerCase() === 'bus' ? (
          <View>
            <Input
              onChangeText={(text) => setPlaca(text)}
              placeholder='Placa del vehículo'
              autoCapitalize='none'
              autoCorrect={false}
              inputStyle={{ marginLeft: 15 }}
              inputContainerStyle={{ borderColor: '#1D8385' }}
              containerStyle={{ marginTop: -10, paddingLeft: 30, paddingRight: 30 }}
              leftIcon={{ type: 'font-awesome', name: 'taxi', size: 18, color: '#1D8385', marginLeft: 5 }}
            />
          </View>
        ) : null}
        <View>
          <Input
            onChangeText={(text) => setPassword(text)}
            placeholder='Contraseña'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: -10, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'lock', size: 30, color: '#1D8385', marginLeft: 5 }}
          />
        </View>
        <View style={ styles.containerButton }>
          <TouchableOpacity
            onPress={handleCreateAccount}
            style={ styles.button }
          >
            <Text style={ styles.text }>Registrarse</Text>
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
  containerButton: {
    padding: 3,
    marginTop: 'auto',
    flexShrink: 1,
  },
  containerCheck: {
    flex: 1,
    marginTop: -10,
    paddingLeft: '30%',
    paddingRight: '30%' 
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
    width: 260,
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
  register: {
    color: '#ffff',
    textAlign: 'center',
    fontWeight: 'bold',
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
