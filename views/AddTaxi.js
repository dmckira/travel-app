import React from 'react'
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { firebase } from '../firebase-config';

const background = require('../assets/images/Interfacesfondos.jpg');
const imageLogin = require('../assets/images/carro.png');
const travelLogo = require('../assets/images/logotipo-travel.png');

function AddTaxi ({navigation}) {
  const [errorPlaca, setErrorPlaca] = React.useState(null);
  const [placa, setPlaca] = React.useState('');

  const formatPlaca = (text) => {
    const regex = /^([A-Z]{3}-\d{3})$/;
    if (regex.test(text)) {
      setErrorPlaca(null);
    } else {
      setErrorPlaca('La placa debe tener el siguiente formato *AAA-111*');
    }
    setPlaca(text);
  }

  const handleCreateTaxi = async () => {
    if (placa === '') {
      alert('Debe ingresar la placa del vehículo');
    } else {
      if (errorPlaca === null) {
        await firebase.firestore().collection('taxis')
          .where("placa", "==", placa).get()
          .then(function(querySnapshot) {
            if (!querySnapshot.empty) {
              Alert.alert('Este número de placa ya se encuentra registrado');
            }
            else {
              firebase.firestore().collection('taxis').doc()
                .set({
                  placa,
                  propietario: firebase.auth().currentUser.uid,
                })
                .then(() => {
                  Alert.alert('Guardado!');
                })
                .catch((error) => {
                  Alert.alert(error.message);
                })
            }
          });
        /*  */
      } else {
        Alert.alert(errorPlaca);
      }
    }
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
      <Image style={styles.image} source={imageLogin}></Image>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.register}>
          Inicio
        </Text>
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.containerForm}>
          <Input
            onChangeText={(text) => formatPlaca(text)}
            value={placa}
            maxLength={7}
            placeholder='Placa del vehículo AAA-111'
            errorMessage={errorPlaca}
            autoCapitalize='none'
            autoCorrect={false}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: -10, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'taxi', size: 18, color: '#1D8385', marginLeft: 5 }}
          />
        </View>
        <View style={ styles.containerButton }>
          <TouchableOpacity
            onPress={handleCreateTaxi}
            style={ styles.button }
          >
            <Text style={ styles.text }>Agregar taxi</Text>
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
    alignContent: 'center',
    flexShrink: 1,
  },
  containerForm: {
    marginTop: '10%',
    marginBottom: '30%',
    flexShrink: 1,
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
})

export default AddTaxi
