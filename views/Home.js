import { View, Text } from 'react-native'
import React from 'react'

function Home ({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>
        Home Screen
      </Text>
      <Button
        title='Go to Details'
        onPress={() =>
        navigation.navigate('Details')
        }
      />
      <Text>
        Map Screen
      </Text>
      <Button
        title='Go to Map'
        onPress={() =>
        navigation.navigate('Map')
        }
      />
    </View>
  );
}

export default Home