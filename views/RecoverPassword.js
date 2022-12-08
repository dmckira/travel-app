import { View, Text, Alert, ImageBackground, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, {useState} from 'react'
import { Button, Icon,Input } from 'react-native-elements';
import { validateEmail } from './utils/helpers';
import { sendEmailResetPassword } from './utils/actions';
import Loading from '../components/Loading';
import { firebase } from '../firebase-config';

const background = require('../assets/images/Interfacesfondos.jpg');
const imageLogin = require('../assets/images/carro.png');
const travelLogo = require('../assets/images/logotipo-travel.png');

export default function RecoverPassword({navigation}) {
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendEmailPasswordReset = async(email) => {
    const result = {statusResponse : true, error : null}

    try{
      await firebase.auth().sendPasswordResetEmail(email)
    }
    catch(error){
      result.statusResponse = false
      result.error = error
    }
    return result;
  }

  const onSubmit = async () => {
    if(!validateData()){
      return
    }
    setLoading(true);
    const result = await sendEmailPasswordReset(email);
    setLoading(false);
    if(!result.statusResponse){
      Alert.alert("Error", "este correo no esta relacionado a ningún usuario.")
      return 
    }
    Alert.alert("Confirmación", "se le ha enviado un email con las instrucciones para cambiar la contraseña")
  }

  const validateData = () =>{
     setErrorEmail(null)
     let valid = true

     if(!validateEmail(email)){
      setErrorEmail("Debes ingresar un email valido");
      valid = false;
     }
     return valid 
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
              placeholder = "Ingresa tu email"
              onChange={(e)=> setEmail(e.nativeEvent.text)}
              defaultValue={email}
              errorMessage={errorEmail}
              keyboardType="email-address"
              inputStyle={{ marginLeft: 15 }}
              inputContainerStyle={{ borderColor: '#1D8385' }}
              containerStyle={{ marginTop: 20, paddingLeft: 30, paddingRight: 30 }}
              leftIcon={{ type: 'font-awesome', name: 'envelope', size: 18, color: '#1D8385', marginLeft: 5 }}
            />
          </View>
          <View style={ styles.containerButton }>
            <TouchableOpacity
              onPress={onSubmit}
              style={ styles.button }
            >
              <Text style={ styles.text }>Recuperar contraseña</Text>
            </TouchableOpacity>
          </View>
          <Loading isVisible={loading} text="Recuperando Contraseña"/>
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