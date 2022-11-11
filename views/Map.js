import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TextInput, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import MapView, {Marker,Polyline,LatLng} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_KEY} from '@env';

const carImage = require('../assets/images/car.png');
const userImage = require('../assets/images/user.png');

function Map ({navigation}) {
  
  const [open, setOpen] = React.useState(false)

  const [destinoName, setDestinoName] = React.useState('')

  //const mapRef = React.useRef(null)

  const [origin, setOrigin] = React.useState({
    latitude: 0, 
    longitude: 0,
  })

  const [destination, setDestination] = React.useState({
    latitude: 0,
    longitude: 0,
  })

  function onPressDirection(details) {
    setDestinoName(details.name)
    setDestination(details.position);
  }

  /* React.useEffect( () => {
    if (!origin || !destination) return;
    console.log('Zoom');
    //Zoom
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [origin, destination]) */

  React.useEffect( ( ) =>{
    getLocationPermission();
  }, [])

  async function getLocationPermission(){
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      alert('Permisos denegados');
      return;
    }
    let location = await Location.getCurrentPositionAsync({})
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }
    setOrigin(current);
  }
  
  return (
    <View style={styles.container}>
      {/* <Modal 
        animationIn='slideInUp'
        isVisible={open}
        avoidKeyboard={true}
        style={styles.modal}
      >
        <View style={styles.modalBackground}>
            <View style={styles.modalView}>
            <GooglePlacesAutocomplete
                placeholder='Destino'
                fetchDetails
                onPress={(data, details = null) => {
                  onPressDirection({
                    name: details?.name,
                    position: {
                      latitude: details?.geometry.location.lat || 0,
                      longitude: details?.geometry.location.lng || 0,
                    },
                  })
                  setOpen(false);
                }}
                query={{
                  key: GOOGLE_MAPS_KEY,
                  language: 'es',
                }}
              />
              <View style={ styles.containerInput }>
              </View>
            </View>
        </View>
      </Modal> */}
      <View style={styles.containerMap}>
        <MapView
          //ref={mapRef}
          style={styles.map}
          mapType="mutedStandard"
          initialRegion={{
            latitude: origin.latitude !== 0 ? origin.latitude : null,
            longitude: origin.longitude !== 0 ? origin.longitude : null,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
        <Marker
          image={userImage}
          draggable={true}
          coordinate={origin}
          identifier='origin'
        />
        {destination.latitude !== 0 && destination.longitude !== 0 ? (
        <>
          <Marker
            draggable={true}
            coordinate={destination}
            identifier='destination'
          />
          <MapViewDirections
            origin = {origin}
            destination = {destination}
            apikey = {GOOGLE_MAPS_KEY}
            strokeColor = "orange"
            strokeWidth={3}
          />
        </>
        ) : null}
        </MapView>
      </View>
      <View style={styles.containerForm}>
        <SafeAreaView style={styles.containerHeader}>
          <Text style={styles.textContent}>Travelapp</Text>
          <View style={styles.border}/>
        </SafeAreaView>
        <View style={ styles.containerInput }>
          {/* <TextInput
            placeholderTextColor='#b5b2b8'
            style={[styles.input, styles.labelContainer]}
            placeholder='Destino'
            autoCapitalize="words"
            onPressIn={() => setOpen(true)}
            value={destinoName}
          /> */}
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
              onPressDirection({
                name: details?.name,
                position: {
                  latitude: details?.geometry.location.lat || 0,
                  longitude: details?.geometry.location.lng || 0,
                },
              })
              setOpen(false);
            }}
            query={{
              key: GOOGLE_MAPS_KEY,
              language: 'es',
            }}
          />
        </View>
        <View style={ styles.containerButton }>
          <Pressable style={ styles.button } disabled={destination === 0 ? true : false} >
            <Text style={ styles.text }>Solicitar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerMap: {
    height: '50%',
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#0F6769',
    /*alignItems: 'stretch',
    justifyContent: 'flex-end',
    height: '30%', */
  },
  containerHeader: {
    backgroundColor: '#1D8385',
  },
  textContent: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
  },
  border: {
    borderTopWidth: 1,
    borderColor: '#297273',
    flexShrink: 1,
  },
  containerInput: {
    margin: 5,
  },
  containerButton: {
    padding: 2,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: '#297273',
    flexShrink: 1,
  },
  map: {
    /* width: '100%',
    height:'80%' */
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  input: {
    height: 60,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ff4e40',
    fontWeight: 'bold',
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    border: 2,
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
  modal: {
    margin: 20,
    marginBottom: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
  },
  modalView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    padding: 0,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconTimes: {
    position: 'absolute',
    top: 15,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 5,
  },
});

export default Map