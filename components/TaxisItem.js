import { Animated, LayoutAnimation, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { toggleAnimation } from '../animations/toggleAnimation';
import { firebase } from '../firebase-config';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser, setMovement, selectDriver, setDriver } from '../slices/navSlice';
import { useNavigation } from '@react-navigation/native';

const TaxisItem = ({id, placa, propietario, drivers}) => {
  const [showContent, setShowContent] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation(); 
  const auth = firebase.auth;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const driver = useSelector(selectDriver);

  useEffect(() => {
    if (drivers) {
      drivers.forEach(dri => {
        firebase.firestore().collection('users')
        .doc(dri)
        .get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            if (docSnapshot.data().state === 'inRuta') {
              dispatch(setDriver(
                docSnapshot.data(),
              ))
            }
          }
        })
      })
    }
  }, []);

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

  const handleShowTaxi = () => {
    /* await firebase.firestore().collection('users')
      .doc(userId)
      .get()
      .then(movement => {
        dispatch(setMovement({
          movement: movement.data(),
        }))
        navigation.navigate('TaxiMap');
      }); */
      navigation.navigate('TaxiMap');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => toggleListItem()}>
        <View style={styles.titleContainer}>
          <Icon color='#ff4e40' name='local-taxi' size={40} style={{marginRight: 10}} />
          <Text style={styles.title}>{placa}</Text>
            <Animated.View style={{transform: [{rotateZ: arrowTransform}], marginLeft: 'auto'}}>
              <MaterialIcons name={'keyboard-arrow-right'} size={30} color='white' />
            </Animated.View>
        </View>
      </TouchableOpacity>
       {showContent ? (
        <View style={styles.body}>
          {drivers ? (
             driver ? (
              <>
                <Text style={styles.bodyText}>Conductor: {driver.name}</Text>
                {/* <Text style={styles.bodyText}>Estado: {placa}</Text> */}
                <Pressable
                  style={ styles.button }
                  onPress={handleShowTaxi}
                >
                  <Text style={ styles.textButton }>Ver en mapa</Text>
                </Pressable>
              </>
             ) : (
              <Text style={styles.bodyText}>No hay conductores en ruta</Text>
             )
          ) : (
            <Text style={styles.bodyText}>Este taxi no tiene ningún conductor</Text>
          )}
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
  button: {
    margin: 10,
    backgroundColor: '#ff4e40',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#b5b2b8',
  },
})

export default TaxisItem
