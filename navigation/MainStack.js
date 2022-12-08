import React from 'react';
import * as Location from 'expo-location';
import Geolocation from 'react-native-geolocation-service';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { setOrigin } from '../slices/navSlice';
import Map from '../views/Map';
import Home from '../views/Home';
import Login from '../views/Login';
import Register from '../views/Register';
import Driver from '../views/Driver';
import DriverMap from '../views/DriverMap';
import Bus from '../views/Bus';
import Busetas from '../views/Busetas';
import RecoverPassword from '../views/RecoverPassword';

const Stack = createNativeStackNavigator();

const MainStack = () => {

  const dispatch = useDispatch();

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
      lat: location.coords.latitude,
      lng: location.coords.longitude
    }

    let address = await Location.reverseGeocodeAsync({latitude: current.lat, longitude: current.lng});
    const description = `${address[0].street}, ${address[0].streetNumber}`

    dispatch(setOrigin({
      description,
      location: current,
    }))
  }

  return (
      <NavigationContainer>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
          >
            <Stack.Navigator>
                <Stack.Screen
                  name='Login'
                  component={Login}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='Register'
                  component={Register}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='Home'
                  component={Home}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='Driver'
                  component={Driver}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='DriverMap'
                  component={DriverMap}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='Bus'
                  component={Bus}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='Busetas'
                  component={Busetas}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='Map'
                  component={Map}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='recover-password'
                  component={RecoverPassword}
                  options={{
                    headerShown: false,
                  }}
                />
            </Stack.Navigator>
          </KeyboardAvoidingView>
      </NavigationContainer>
  );
}

export default MainStack;
