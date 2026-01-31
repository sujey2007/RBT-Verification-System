import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SelectionScreen from './screens/SelectionScreen';
import VerificationScreen from './screens/VerificationScreen';

export default function App() {
  const [selectedIA, setSelectedIA] = useState(null);

  return (
    <View style={styles.container}>
      {!selectedIA ? (
        <SelectionScreen onSelect={(type) => setSelectedIA(type)} />
      ) : (
        <VerificationScreen 
          type={selectedIA} 
          onBack={() => setSelectedIA(null)} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});