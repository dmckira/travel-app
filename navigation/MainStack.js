import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from '../views/Map';
import Home from '../views/Home';
import Login from '../views/Login';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
              {/* <Stack.Screen name='Home' component={Home}/> */}
              {/* <Stack.Screen name='Home' component={Home}/> */}
              <Stack.Screen name='Login' component={Login}/>
              {/* <Stack.Screen name='Map' component={Map}/> */}
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default MainStack;
