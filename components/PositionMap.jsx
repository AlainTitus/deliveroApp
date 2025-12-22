import { View, Text, StyleSheet } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'


export default function PositionMap() {
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: 4.576939,
          longitude: 13.684294,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        style={styles.map}
      >

      </MapView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: '100%',
    height: "100%"
  }
})