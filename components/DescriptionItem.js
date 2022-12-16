import { Animated, LayoutAnimation, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { toggleAnimation } from '../animations/toggleAnimation';
import { firebase } from '../firebase-config';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser, setMovements, selectMovements } from '../slices/navSlice';
import { useNavigation } from '@react-navigation/native';

const DescriptionItem = ({ id, title, origin, destination, userId, hide, important }) => {
  const [showContent, setShowContent] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;
  const movements = useSelector(selectMovements);
  const navigation = useNavigation(); 
  const auth = firebase.auth;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: showContent ? 0 : 1,
      useNativeDriver: true
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setShowContent(!showContent);
  };
  const arrowTransform = animationController.interpolate({
    inputRange: [0,1],
    outputRange: ['0deg', '90deg']
  });

  const handleTakenMovement = async () => {
    await firebase.firestore().collection('users').doc(auth().currentUser.uid).get()
      .then(user => {
        dispatch(setUser({
          user: user.data(),
        }))
      })

    await firebase.firestore().collection('movements').doc(userId)
      .update({
        state: 'Taken',
        driver: {
          id: auth().currentUser.uid,
          name: user.user.name,
          email: user.user.email,
          role: user.user.role,
          placa: user.user.placa
        }
      });

    await firebase.firestore().collection('movements')
      .doc(userId)
      .get()
      .then(movement => {
        dispatch(setMovement({
          movement: movement.data(),
        }))
        navigation.navigate('DriverMap');
      });
  }

  const hiddenRequest = async () => {
    let drivers = [];
    if (hide) {
      hide.forEach(element => {
        const driver = element;
        drivers.push(
          driver
        )
      });
      drivers.push(auth().currentUser.uid);
    } else {
      drivers.push(auth().currentUser.uid);
    }

    await firebase.firestore().collection('movements').doc(userId)
      .update({
        hide: drivers,
      });
  }
  return (
    <View style={[styles.container,/*  important ? styles.important : null */]}>
      <TouchableOpacity onPress={() => toggleListItem()}>
        <View style={styles.titleContainer}>
          <Icon color='#ff4e40' name='account-circle' size={40} style={{marginRight: 10}} />
          <Text style={styles.title}>{title}</Text>
          {important ? (
            <Icon color='#FFD100' name='warning' size={40} style={{marginRight: 10}} />
          ) : null}
            <Animated.View style={{transform: [{rotateZ: arrowTransform}], marginLeft: 'auto'}}>
              <MaterialIcons name={'keyboard-arrow-right'} size={30} color='white' />
            </Animated.View>
        </View>
      </TouchableOpacity>
       {showContent ? (
        <View style={styles.body}>
          <Text style={styles.bodyText}>Desde: {origin}</Text>
          <Text style={styles.bodyText}>Hasta: {destination}</Text>
          <View style={ styles.bodyButton }>
            <Pressable
              style={ styles.button }
              onPress={handleTakenMovement}
            >
              <Text style={ styles.textButton }>Aceptar</Text>
            </Pressable>
            <Pressable
              style={ styles.button }
              onPress={() => hiddenRequest(id)}
            >
              <Text style={ styles.textButton }>Ocultar</Text>
            </Pressable>
          </View>
        </View> )
        : null }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: '2%',
    borderRadius: 12,
    backgroundColor: '#0F6769',
    marginBottom: '2%',
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  body: {
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  bodyText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bodyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#ff4e40',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 3,
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  /* important: {
    borderWidth: 1,
    borderColor: '#FF6800',
  } */
})

export default DescriptionItem
