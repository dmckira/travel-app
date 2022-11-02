import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from '../views/Map';
import Home from '../views/Home';

const Stack = createNativeStackNavigator();

function DetailsScreen ({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>
        Details Screen
      </Text>
    </View>
  );
}

const MainStack = () => {
  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
              <Stack.Screen name='Home' component={Home}/>
              <Stack.Screen name='Details' component={DetailsScreen}/>
              <Stack.Screen name='Map' component={Map}/>
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default MainStack;
