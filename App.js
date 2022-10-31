import * as React from 'react';
import { SafeAreaView } from 'react-native';
import MainStack from './navigation/MainStack';

function App() {
  return (
    <SafeAreaView style = {{ flex: 1 }}>
      <MainStack />
    </SafeAreaView>
  );
}

export default App;
