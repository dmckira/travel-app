import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Pressable, Image, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GOOGLE_MAPS_KEY } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin, selectDestination } from '../slices/navSlice';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { firebase } from '../firebase-config';

const carImage = require('../assets/images/bus.png');
const travelLogo = require('../assets/images/logotipo-travel-shadow.png');

const Bus = ({navigation}) => {
  const origin = useSelector(selectOrigin);
  const mapRef = useRef(null);
  const auth = firebase.auth;

  const logout = async () => {
    await firebase.firestore().collection('users').doc(auth().currentUser.uid)
    .update({
      inRuta: false,
    });
    await firebase.auth().signOut();
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')} 
        style={styles.menu}
      >
        <Icon color='white' name='menu' />
      </TouchableOpacity>
      <View style={styles.containerMap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          mapType="mutedStandard"
          initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {origin?.location && (
            <Marker
              image={carImage}
              coordinate={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
              }}
              identifier='origin'
            />
          )}
          {/* {destination?.location && (
            <Marker
              coordinate={{
                latitude: destination.location.lat,
                longitude: destination.location.lng,
              }}
              identifier='destination'
            />
          )} */}
          {origin && (
            <MapViewDirections
              origin = {{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
              }}
              apikey = {GOOGLE_MAPS_KEY}
              strokeColor = "orange"
              strokeWidth={3}
              onReady={result => {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: 50, right: 50, bottom: 50, left: 50
                  }
                })
              }}
            />
          )}
        </MapView>
      </View>
      <View style={styles.containerForm}>
        <SafeAreaView style={styles.containerHeader}>
          {/* <Text style={styles.textContent}>T R A V E L A P P</Text> */}
          <View style={styles.containerImage}>
            <Image style={styles.imageLogo} source={travelLogo}></Image>
          </View>
          <View style={styles.border}/>
          {/* <View>
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
          </View> */}
          <View style={ styles.containerButton }>
            <Pressable
              style={ styles.button }
              onPress={logout}
            >
              <Text style={ styles.text }>¡Terminar Jornada!</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerMap: {
    height: '80%',
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#0F6769',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  map: {
    flex: 1,
  },

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
  containerImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  imageLogo: {
    height: 55,
    width: 160,
    border: 0,
    borderColor: '#ffff',
    marginTop: 2,
    marginBottom: 2,
  },
})

export default Bus
