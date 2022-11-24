import { View, Text, Alert } from 'react-native'
import React, {useState} from 'react'
import { Button, Icon,Input } from 'react-native-elements';
import { validateEmail } from './utils/helpers';
import { sendEmailResetPassword } from './utils/actions';
import Loading from '../components/Loading';

export default function RecoverPassword({navigation}) {
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [loading, setLoaading] = useState(false);

  const sendEmailPasswordReset = async(email) => {
    const result = {statusResponse : true, error : null}

    try{
      await firebase.auth().sendPasswordResetEmail(email)
    }
    catch(error){
      result.statusResponse = false
      result.error = error
    }
    return result;
  }

  const onSubmit = async () => {
    if(!validateData()){
      return
    }
    setLoaading(true);
    const result = await sendEmailPasswordReset(email);
    setLoaading(false);
    if(!result.statusResponse){
      Alert.alert("Error", "este correo no esta relacionado a ningun usuario.")
      return 
    }
    Alert.alert("Confirmacion", "se le ha enviado un email con las instrucciones para cambiar la constraseña")
  }

  const validateData = () =>{
     setErrorEmail(null)
     let valid = true

     if(!validateEmail(email)){
      setErrorEmail("debes ingresar un email valido");
      valid = false;
     }
     return valid 
  }

    return (
    <View>
      <Input
                placeholder = "ingresa tu email"
                onChange={(e)=> setEmail(e.nativeEvent.text)}
                defaultValue={email}
                errorMessage={errorEmail}
                keyboardType="email-address"
                rightIcon={
                  <Icon
                  type="material-community"
                  name="at"
                  />
                }
      />
      <Button
        title="recuperar contraseña"
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Recuperando Contraseña"/>
    </View>
  )
}