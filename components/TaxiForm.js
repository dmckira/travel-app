import React from 'react'
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TextInput, Pressable } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_KEY} from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin, selectDestination, setDestination, selectUser } from '../slices/navSlice';
import { firebase } from '../firebase-config';

const TaxiForm = ({navigation}) => {

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  const requestDriver = async () => {
    if (!origin || !destination || !user) return;

    await firebase.firestore().collection('movements')
      .doc(firebase.auth().currentUser.uid)
      .set({
        user: user.user,
        origin,
        destination,
        state: 'Pending',
      })
    navigation.navigate('WaitingTaxi')
  }

  return (
    <SafeAreaView style={styles.containerHeader}>
      <Text style={styles.textContent}>T R A V E L A P P</Text>
      <View style={styles.border}/>
      <View>
        <GooglePlacesAutocomplete
          placeholder='Destino'
          styles={inputDestinationStyles}
          fetchDetails
          nearbyPlacesAPI='GooglePlacesSearch'
          returnKeyType={"search"}
          minLength={2}
          enablePoweredByContainer={false}
          debounce={400}
          onPress={(data, details = null) => {
            dispatch(
              setDestination({
                location: details.geometry.location,
                description: data.description,
              })
            );
          }}
          query={{
            key: GOOGLE_MAPS_KEY,
            language: 'es',
          }}
        />
      </View>
      <View style={ styles.containerButton }>
        <Pressable
          style={ styles.button }
          onPress={requestDriver}
        >
          <Text style={ styles.text }>Solicitar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default TaxiForm

const inputDestinationStyles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    backgroundColor: '#DDDDDF',
    borderRadius: 0,
    fontSize: 18,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  }
});

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    backgroundColor: '#1D8385',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  containerButton: {
    padding: 2,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: '#297273',
    flexShrink: 1,
  },
  textContent: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
    fontWeight: '900',
    color: '#C2645D',
    textShadowColor: 'white',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
  },
  border: {
    borderTopWidth: 1,
    borderColor: '#297273',
    flexShrink: 1,
  },
  button: {
    margin: 10,
    backgroundColor: '#ff4e40',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#b5b2b8',
  },
})