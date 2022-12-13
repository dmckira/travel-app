import React from 'react'
import { ScrollView, View, Text, Button, Image, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { firebase,  collection, query  } from '../firebase-config';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../slices/navSlice';

const background = require('../assets/images/imglogin.jpg');
const userIcon = require('../assets/images/user.png');
const travelLogo = require('../assets/images/logotipo-travel.png');


function Profile({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [name, setName] = React.useState(user.user.name);
  const [email, setEmail] = React.useState(user.user.email);
  const [cel, setCel] = React.useState(user.user.cel);
  const auth = firebase.auth;

  const handleUpdate = async () => {
    try {
      await firebase.firestore().collection('users').doc(auth().currentUser.uid)
      .update({
        name: name,
        email: email,
        cel: cel,
      });
      await firebase.firestore().collection('users').doc(auth().currentUser.uid).get()
        .then(user => {
          dispatch(setUser({
            user: user.data(),
          }))
        });
        Alert.alert('Su perfil ha sido actualizado correctamente')
        navigation.navigate('Home')
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.containerImage}>
        <Image style={styles.imageLogo} source={travelLogo}></Image>
      </View>
        <View style={styles.containerImage}>
          <Image style={styles.imageUserIcon} source={userIcon}></Image>
        </View>
      <ScrollView>
      <View>
          <Input
            onChangeText={(text) => setName(text)}
            placeholder='Nombre'
            autoCapitalize='none'
            autoCorrect={false}
            value={name}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: 5, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'user', size: 25, color: '#1D8385', marginLeft: 5 }}
          />
        </View>
        <View>
          <Input
            onChangeText={(email) => setEmail(email)}
            placeholder='Correo'
            autoCapitalize='none'
            autoCorrect={false}
            value={email}
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
            value={cel}
            inputStyle={{ marginLeft: 15 }}
            inputContainerStyle={{ borderColor: '#1D8385' }}
            containerStyle={{ marginTop: -10, paddingLeft: 30, paddingRight: 30 }}
            leftIcon={{ type: 'font-awesome', name: 'mobile', size: 32, color: '#1D8385', marginLeft: 5 }}
            keyboardType='numeric'
            maxLength={10}
          />
        </View>
        <View style={ styles.containerButton }>
          <TouchableOpacity
            onPress={handleUpdate}
            style={ styles.button }
          >
            <Text style={ styles.text }>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export const sendEmail =  (to, subject, body) => {
  Linking.openURL(`mailto:${to}?subject=${subject}?body=${body}`);
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
  imageUserIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: 0,
    marginBottom: '10%',
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
    backgroundColor: '#ff5042',
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

export default Profile