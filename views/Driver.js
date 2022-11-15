import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firebase from '../database/firebase';
import { ListItem, Avatar } from 'react-native-elements';

const Driver = () => {
  const [movements, setMovements] = useState([])

  useEffect(() => {
    firebase.db.collection('movements').onSnapshot(querySnapshot => {
      const movements = [];
      querySnapshot.docs.forEach(doc => {
        console.log(doc.data());
        const {state, location, user} = doc.data();
        movements.push({
          id: doc.id,
          state,
          location,
          user,
        });
      });
      setMovements(movements);
    })
  }, []);
  return (
    <ScrollView>
      {
        movements.map(movement => {
          return(
            <ListItem></ListItem>
          )
        })
      }
    </ScrollView>
  )
}

export default Driver

const styles = StyleSheet.create({})