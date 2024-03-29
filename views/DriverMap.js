import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import MapView, {Marker,Polyline,LatLng} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GOOGLE_MAPS_KEY } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin, setTravelTimeInformation, selectMovement, selectTravelTimeInformation } from '../slices/navSlice';
import { firebase } from '../firebase-config';
import { Icon } from 'react-native-elements/dist/icons/Icon';

const carImage = require('../assets/images/car.png');
const userImage = require('../assets/images/user.png');
const travelLogo = require('../assets/images/logotipo-travel-shadow.png');

const DriverMap = ({navigation}) => {
  const dispatch = useDispatch();
  const movement = useSelector(selectMovement);
  const time = useSelector(selectTravelTimeInformation);
  const originDriver = useSelector(selectOrigin);
  const origin = movement.movement.origin;
  const destination = movement.movement.destination;
  const [arrive, setMovement] = useState(false)
  const mapRef = useRef(null);
  
  const driverArrive = async () => {
    await firebase.firestore().collection('movements').doc(movement.movement.user.id)
    .update({
      state: 'Arrive',
    });
    setMovement(true);
  }

  const requestEnd = async () => {
    await firebase.firestore().collection('movements').doc(movement.movement.user.id)
    .update({
      state: 'Done',
    });
    navigation.navigate('Driver')
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerMap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          mapType="mutedStandard"
          /* initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }} */
        >
          {originDriver?.location && (
            <Marker
              image={carImage}
              coordinate={{
                latitude: originDriver.location.lat,
                longitude: originDriver.location.lng,
              }}
            />
          )}
          {origin?.location && (
            <Marker
              image={userImage}
              coordinate={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
              }}
              identifier='origin'
            />
          )}
          {destination?.location && (
            <Marker
              coordinate={{
                latitude: destination.location.lat,
                longitude: destination.location.lng,
              }}
              identifier='destination'
            />
          )}
          {origin && destination && (
            <>
              <MapViewDirections
                origin = {{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng,
                }}
                destination = {{
                  latitude: destination.location.lat,
                  longitude: destination.location.lng,
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
              <MapViewDirections
                origin = {{
                  latitude: originDriver.location.lat,
                  longitude: originDriver.location.lng,
                }}
                destination = {{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng,
                }}
                apikey = {GOOGLE_MAPS_KEY}
                strokeColor = "orange"
                strokeWidth={3}
                onReady={result => {
                  dispatch(setTravelTimeInformation({
                    time: result.duration.toFixed(0),
                  }))
                }}
              />
            </>
          )}
        </MapView>
      </View>
      <View style={styles.containerForm}>
        <SafeAreaView style={styles.containerHeader}>
          <View style={styles.containerImage}>
            <Image style={styles.imageLogo} source={travelLogo}></Image>
          </View>
          <View style={styles.border}/>
          {movement.movement.driver ? (
            <View style={styles.containerBody}>
              <View style={styles.titleContainer}>
                <Icon color='#0F6769' name='account-circle' size={40} style={{marginRight: 10}} />
                  <Text style={styles.title}>{movement.movement.user.name} - {movement.movement.user.cel}</Text>
                  
              </View>
              <View style={styles.body}>
                <Text style={styles.bodyText}>Desde: {movement.movement.origin.description}</Text>
                <Text style={styles.bodyText}>Hasta: {movement.movement.destination.description}</Text>
                {!arrive && time ? (
                  <View style={styles.bodyTimer}>
                    <Icon color='#0F6769' name='timer' size={25} style={{marginRight: 5}} />
                    <Text style={ styles.bodyText }>{time.time} Minutos de distancia</Text>
                  </View>
                ) : null}
              </View>
              
            </View>
          ) : null}
          <View style={ styles.containerButton }>
            <Pressable
              style={ styles.button }
              onPress={!arrive ? driverArrive : requestEnd}
            >
              <Text style={ styles.text }>{!arrive ? '¡Ya llegue!' : 'Recorrido finalizado'}</Text>
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
    height: '60%',
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#0F6769',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  containerInput: {
    margin: 5,
  },
  containerHeader: {
    flex: 1,
    backgroundColor: '#1D8385',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  containerBody: {
    width: '90%',
    padding: '2%',
    borderRadius: 12,
    backgroundColor: '#ff4e40',
    marginBottom: '2%',
    overflow: 'hidden',
    margin: '5%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
  map: {
    flex: 1,
  },
  menu: {
    backgroundColor: '#1D8385',
    position: 'absolute',
    top: 44,
    left: 22,
    zIndex: 50,
    padding: 12,
    borderRadius: 9999,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    color: '#b5b2b8',
    fontWeight: 'bold',
  },
  textContent: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
    fontWeight: '900',
    color: '#C2645D',
    textShadowColor: 'white',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 4,
  },
  body: {
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  bodyText: {
    fontSize: 16,
    color: '#b5b2b8',
    fontWeight: 'bold',
  },
  bodyTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#b5b2b8',
  },
  textTime: {
    fontSize: 13,
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
});

export default DriverMap
