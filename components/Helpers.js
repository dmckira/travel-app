import { Animated, LayoutAnimation, Pressable, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import React, { useRef, useState } from 'react'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const Helpers = () => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => toggleListItem()}>
        <View style={styles.titleContainer}>
          <Icon color='#ff4e40' name='directions-bus' size={40} style={{marginRight: 10}} />
          <Text style={styles.title}>{title} - {placa}</Text>
            <Animated.View style={{transform: [{rotateZ: arrowTransform}], marginLeft: 'auto'}}>
              <MaterialIcons name={'keyboard-arrow-right'} size={30} color='white' />
            </Animated.View>
        </View>
      </TouchableOpacity>
       {showContent ? (
        <View style={styles.body}>
          <Text style={styles.bodyText}>Desde: {origin}</Text>
          {/* <Text style={styles.bodyText}>Hasta: {placa}</Text> */}
          <Pressable
            style={ styles.button }
            onPress={handleTakenMovement}
          >
            <Text style={ styles.textButton }>Ver en mapa</Text>
          </Pressable>
        </View> )
        : null }
    </View>
  )
}

export const sendEmail =  (to, subject, body) => {
  Linking.openURL(`mailto:${to}?subject=${subject}&body=${body}`);
}

export default Helpers
