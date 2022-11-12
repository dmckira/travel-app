import React from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { useSelector } from 'react-redux'
import { selectTravelTimeInformation } from '../slices/navSlice'

const TaxiDescription = () => {

  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  return (
    <SafeAreaView>
      <Text>Distancia - {travelTimeInformation?.distance?.text}</Text>
      <Text>Tiempo - {travelTimeInformation?.duration?.text}</Text>
    </SafeAreaView>
  )
}

export default TaxiDescription

const styles = StyleSheet.create({})