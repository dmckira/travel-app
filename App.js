import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from "react-redux";
import MainStack from './navigation/MainStack';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style = {{ flex: 1 }}>
        <MainStack />
      </SafeAreaView>
    </Provider>
  );
}

export default App;
