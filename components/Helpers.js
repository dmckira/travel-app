import { Linking } from 'react-native'


const Helpers = () => {


}

export const sendEmail =  (to, subject, body) => {
  Linking.openURL(`mailto:${to}?subject=${subject}&body=${body}`);
}

export default Helpers
