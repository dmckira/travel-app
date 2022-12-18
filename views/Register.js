import React from 'react'
import { ScrollView, View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { firebase } from '../firebase-config';
import { getToken } from '../actions';

const background = require('../assets/images/Interfacesfondos.jpg');
const imageLogin = require('../assets/images/carro.png');
const travelLogo = require('../assets/images/logotipo-travel.png');

const data = [
  { label: 'Propietario', value: 4 },
  { label: 'Buseta', value: 3 },
  { label: 'Conductor', value: 2 },
  { label: 'Usuario', value: 1 },
];

const Register = ({navigation}) => {
  const [errorPlaca, setErrorPlaca] = React.useState(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [cel, setCel] = React.useState('');
  const [role, setRole] = React.useState([]);
  const [placa, setPlaca] = React.useState('');
  const [password, setPassword] = React.useState('');

  const formatPlaca = (text) => {
    const regex = /^([A-Z]{3}-\d{3})$/;
    if (regex.test(text)) {
      setErrorPlaca(null);
    } else {
      setErrorPlaca('La placa debe tener el siguiente formato *AAA-111*');
    }
    setPlaca(text);
  }

  const handleCreateAccount = async () => {
    if (name === '' || email === '' || cel === '' || password === '' || role.value === undefined) {
      Alert.alert('Necesita completar todos los campos');
    } else {
      if (role.value === 1 || role.value === 2 || role.value === 3 || role.value === 4) {
        if (role.value === 1 || role.value === 4 || ((role.value === 2 || role.value === 3) && errorPlaca === null && placa !== '') ) {
          let existPlaca = true;
          let id;
          let drivers = [];
          if (role.value === 2) {
            await firebase.firestore().collection('taxis')
            .where("placa", "==", placa)
            .get()
            .then(function(querySnapshot) {
              if (querySnapshot.empty) {
                Alert.alert('Este número de placa no se encuentra registrado');
                existPlaca = false;
              } else {
                querySnapshot.docs.forEach(doc => {
                  id = doc.id
                  drivers = doc.data().drivers
                })
              }
            })
          }
          if (existPlaca) {
            const token = await getToken();
            await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
              firebase.auth().currentUser.sendEmailVerification({
                handleCodeInApp: true,
                url: 'https://travel-app-bd-47b61.firebaseapp.com',
              })
              .then(() => {
                Alert.alert('Verificación de Email enviada!');
              }).catch((error) => {
                Alert.alert(error.message);
              })
              .then(() => {
                const roleLabel = role.label;
                firebase.firestore().collection('users')
                .doc(firebase.auth().currentUser.uid)
                .set(
                  role.value === 2 || role.value === 3 ? {
                  name,
                  email,
                  cel,
                  role: roleLabel,
                  placa,
                  token,
                } : {
                  name,
                  email,
                  cel,
                  role: roleLabel,
                  token,
                })
                if (role.value === 2) {
                  let driversTmp = [];
                  if (drivers) {
                    drivers.forEach(element => {
                      const driver = element;
                      driversTmp.push(
                        driver
                      )
                    });
                    driversTmp.push(firebase.auth().currentUser.uid);
                  } else {
                    driversTmp.push(firebase.auth().currentUser.uid);
                  }
                  firebase.firestore().collection('taxis')
                  .doc(id)
                  .update({
                    drivers: driversTmp
                  });
                }
                Alert.alert('Guardado!');
                navigation.navigate('Login');
              })
              .catch((error) => {
                Alert.alert(error.message);
              })
            })
            .catch((error) => {
              Alert.alert(error.message);
            })
          }
        } else {
          Alert.alert('Debe ingresar la placa de su vehículo');
        }
      } else {
        Alert.alert('El rol debe ser *Usuario*, *Conductor*, *Bus* o *Propietario*');
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
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={{ backgroundColor: '#e9eaed', marginLeft: 15, color: '#929292' }}
            placeholder='Elige tu rol'
            data={data}
            labelField="label"
            valueField="value"
            onChange={item => {
              setRole(item);
            }}
            renderLeftIcon={() => (
              <MaterialIcons name={'groups'} size={25} color='#1D8385' style={{ marginLeft: 5, marginRight: 15}} />
            )}
          />
        </View>
        {role.value && (role.value === 2 || role.value === 3) ? (
          <View>
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
              leftIcon={{ type: 'font-awesome', name: ( role.value === 2 ? 'taxi' : 'bus' ), size: 18, color: '#1D8385', marginLeft: 5 }}
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
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: '#1D8385',
    borderBottomWidth: 1,
    marginLeft: 29,
    marginRight: 30,
    marginBottom: 30,
    color: '#1D8385'
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#929292',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
});

export default Register
