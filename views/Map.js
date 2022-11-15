import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import MapView, {Marker,Polyline,LatLng} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GOOGLE_MAPS_KEY } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin, selectDestination, setTravelTimeInformation } from '../slices/navSlice';
import { Icon } from 'react-native-elements/dist/icons/Icon';

//Components
import TaxiForm from "../components/TaxiForm";
import TaxiDescription from "../components/TaxiDescription";
import WaitingTaxi from '../components/WaitingTaxi';

const carImage = require('../assets/images/car.png');
const userImage = require('../assets/images/user.png');

const Map = ({navigation}) => {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);

  useEffect( () => {
    if (!origin || !destination) return;
    //Zoom
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    },1000);
  }, [origin, destination]);

  /* useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = async() => {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.location}&destinations=${destination.location}&key=${GOOGLE_MAPS_KEY}`)
      .then((res) => res.json())
      .then(data => {
        dispatch(setTravelTimeInformation(data.rows[0].elements[1]))
      })
    };

    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_KEY]); */
  
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
            />
          )}
        </MapView>
      </View>
      <View style={styles.containerForm}>
        <Stack.Navigator>
          <Stack.Screen
            name='TaxiForm'
            component={TaxiForm}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='WaitingTaxi'
            component={WaitingTaxi}
            options={{
              presentation: 'fullScreenModal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='TaxiDescription'
            component={TaxiDescription}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
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
    /*alignItems: 'stretch',
    justifyContent: 'flex-end',
    height: '30%', */
  },
  containerInput: {
    margin: 5,
  },
  map: {
    /* width: '100%',
    height:'80%' */
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
});

export default Map