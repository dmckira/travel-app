import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from "react-redux";
import { startNotifications } from './actions';
import MainStack from './navigation/MainStack';
import { store } from './store';

function App() {
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    startNotifications(notificationListener, responseListener);
  }, [])

  return (
    <Provider store={store}>
      <SafeAreaView style = {{ flex: 1 }}>
        <MainStack />
      </SafeAreaView>
    </Provider>
  );
}

export default App;
