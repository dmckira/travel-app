import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import MapView, {Marker,Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_KEY} from '@env';

const carImage = require('../assets/images/car.png');

function Map ({navigation}) {
  console.log('key, ',GOOGLE_MAPS_KEY);

  const [origin, setOrigin] = React.useState({
    latitude: 6.34001, 
    longitude: -75.54816,
  })

  const [destination, setDestination] = React.useState({
    latitude:6.33803,
    longitude: -75.55640,
  })

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
      <MapView style={styles.map}
      initialRegion={{
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04

      }}
      >
      <Marker
      image={carImage}
      draggable={true}
      coordinate={origin}
      onDragEnd={(direction) =>setOrigin(direction.nativeEvent.coordinate)}
      />
      <Marker
      draggable={true}
      coordinate={destination}
      onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
      />

      <MapViewDirections
        origin = {origin}
        destination = {destination}
        apikey = {GOOGLE_MAPS_KEY}
        strokeColor = "orange"
        strokeWidth={6}
      />
      {/* <Polyline
        coordinates = {[origin,destination]}
        strokeColor = "red"
        strokeWidth={6}
      /> */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map:{
    width: '100%',
    height:'100%'
  }
});

export default Map