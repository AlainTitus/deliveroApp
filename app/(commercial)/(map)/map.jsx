import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} >
        <Marker
          coordinate={{latitude: 4.572314, longitude: 13.699066}} 
         />
      </MapView>
      <View style={styles.btnMap}>
        <TouchableOpacity style={styles.press}>
          <Text style={styles.text}>Actualiser</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  btnMap: {
    position: 'absolute',
    bottom: 20,
    zIndex: 5,
    width: "100%",
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  },
  press:{
    backgroundColor: '#21618c',
    width: 150,
    padding: 5,
    borderRadius: 5
  }
});
