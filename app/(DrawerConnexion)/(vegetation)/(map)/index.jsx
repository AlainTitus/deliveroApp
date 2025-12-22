import { View, StyleSheet, Alert, Dimensions, Text, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useAbattage, useElagage, useMarecage, useDebroussaillage } from '../../../../utils/store'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from 'expo-router'

const { width, height } = Dimensions.get('window')
const milieu = height * (1 / 3);
const radius = width * 0.15;

export default function Mapcollecte() {

  const [formMesures, setFormMesures] = useState(false);
  const [elementSelected, setElementSelected] = useState(null)

  const navigation = useNavigation()

  const abattage = useAbattage((state) => state.tab_abattage)

  const elagage = useElagage((state) => state.tab_elagage)

  const marecage = useMarecage((state) => state.tab_marecage)

  const debroussaillage = useDebroussaillage((state) => state.tab_debroussaillage)




  return (
    <View style={StyleSheet.container}>
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
        showsTraffic={true}
        loadingEnabled={true}
        style={styles.map}
      >
        {
          abattage.length != 0 && (
            abattage.map(arbre => (
              <Marker
                key={arbre.id}
                coordinate={{
                  latitude: arbre.latitude,
                  longitude: arbre.longitude
                }}
                title={"Abattage " + arbre.depart}
                description={`D30=${arbre.D30} D30_50=${arbre.D30_50} D50_80=${arbre.D50_80} D80_100=${arbre.D80_100} D100=${arbre.D100}`}
                image={require('../../../../assets/images/tree.png')}
              >
              </Marker>
            ))
          )
        }
        {
          elagage.length != 0 && (
            elagage.map(elag => (
              <Marker
                key={elag.id}
                coordinate={{
                  latitude: elag.latitude,
                  longitude: elag.longitude
                }}
                title={"Elagages " + elag.depart}
                description={`${elag.nombre} branches`}
                image={require('../../../../assets/images/branches.png')}
              >
              </Marker>
            ))
          )
        }
        {
          marecage.length != 0 && (
            marecage.map(mar => (
              <Marker
                key={mar.id}
                coordinate={{
                  latitude: mar.latitude,
                  longitude: mar.longitude
                }}
                title={"marécage " + mar.nom_Mare}
                description={`${mar.longueur} metres`}
                image={require('../../../../assets/images/rond_bleu.png')}
              >
              </Marker>
            ))
          )
        }
        {
          debroussaillage.length != 0 && (
            debroussaillage.map(deb => (
              <Marker
                key={deb.id}
                coordinate={{
                  latitude: deb.latitude,
                  longitude: deb.longitude
                }}
                title={"Debroussaillage " + deb.zone}
                description={`${deb.longueur} metres`}
                image={require('../../../../assets/images/rond_vert.png')}
              >
              </Marker>
            ))
          )
        }

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
  },
  form: {
    position: 'absolute',
    zIndex: 100,
    bottom: milieu,
    right: 20,
    width: radius,
    height: radius,
    borderRadius: radius,
    backgroundColor: '#1f618d',
    justifyContent: 'center',
    alignItems: 'center'
  }
})