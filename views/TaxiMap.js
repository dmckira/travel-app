import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Pressable, Image, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GOOGLE_MAPS_KEY } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin, selectDestination, selectDriver } from '../slices/navSlice';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { firebase } from '../firebase-config';

const carImage = require('../assets/images/car.png');
const travelLogo = require('../assets/images/logotipo-travel-shadow.png');

const TaxiMap = ({navigation}) => {
  const mapRef = useRef(null);
  const driver = useSelector(selectDriver);
  const auth = firebase.auth;

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
          mapType={"mutedStandard"}
          initialRegion={{
            latitude: driver.location.location.lat,
            longitude: driver.location.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {driver?.location.location && (
            <Marker
              image={carImage}
              coordinate={{
                latitude: driver.location.location.lat,
                longitude: driver.location.location.lng,
              }}
            />
            )}
        </MapView>
      </View>
      <View style={styles.containerForm}>
        <SafeAreaView style={styles.containerHeader}>
          <View style={styles.containerImage}>
            <Image style={styles.imageLogo} source={travelLogo}></Image>
          </View>
          <View style={styles.border}/>

          {driver ? (
            <View style={styles.containerBody}>
              <View style={styles.titleContainer}>
                <Icon color='#0F6769' name='local-taxi' size={40} style={{marginRight: 10}} />
                  <Text style={styles.title}> Conductor: {driver.name}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.bodyText}>email: {driver.email}</Text>
                <Text style={styles.bodyText}>cel: {driver.cel}</Text>
              </View>
            </View>
          ) : null}
          <View style={ styles.containerButton }>
            <Pressable
              style={ styles.button }
              onPress={() => navigation.navigate('Taxis')}
            >
              <Text style={ styles.text }>Volver</Text>
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
    height: 150,
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
  body: {
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  bodyText: {
    fontSize: 16,
    color: '#b5b2b8',
    fontWeight: 'bold',
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

export default TaxiMap
