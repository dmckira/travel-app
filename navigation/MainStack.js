import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from '../views/Map';
import Home from '../views/Home';
import Login from '../views/Login';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
      <NavigationContainer>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
          >
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name='Home' component={Home}/>
                <Stack.Screen name='Login' component={Login}/>
                <Stack.Screen name='Map' component={Map}/>
            </Stack.Navigator>
          </KeyboardAvoidingView>
      </NavigationContainer>
  );
}

export default MainStack;
