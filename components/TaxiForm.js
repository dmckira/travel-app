import React from 'react'
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TextInput, Pressable } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_KEY} from '@env';
import { useDispatch } from 'react-redux';
import { setDestination } from '../slices/navSlice';

const TaxiForm = ({navigation}) => {

  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.containerHeader}>
      <Text style={styles.textContent}>T R A V E L A P P</Text>
      <View style={styles.border}/>
      <View style={ styles.containerInput }>
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
          onPress={() => navigation.navigate('WaitingTaxi')}
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