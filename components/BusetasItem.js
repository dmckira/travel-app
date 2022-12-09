import { Animated, LayoutAnimation, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { toggleAnimation } from '../animations/toggleAnimation';
import { firebase } from '../firebase-config';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser, setMovement } from '../slices/navSlice';
import { useNavigation } from '@react-navigation/native';

const BusetasItem = ({title, origin, placa, userId}) => {
  const [showContent, setShowContent] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;
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
    await firebase.firestore().collection('users')
      .doc(userId)
      .get()
      .then(movement => {
        dispatch(setMovement({
          movement: movement.data(),
        }))
        navigation.navigate('BusetasMap');
      });
  }

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

export default BusetasItem
