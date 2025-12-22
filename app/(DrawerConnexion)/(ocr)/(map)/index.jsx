import { View, StyleSheet, Alert, Dimensions, Text, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useTransfoStore, useIacmStore, useCCStore } from '../../../../utils/store'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from 'expo-router'

const { width, height } = Dimensions.get('window')
const milieu = height * (1 / 3);
const radius = width * 0.15;

export default function Mapcollecte() {

  const [formMesures, setFormMesures] = useState(false);
  const [elementSelected, setElementSelected] = useState(null)

  const navigation = useNavigation()

  const iacms = useIacmStore((state) => state.iacms);
  const coupecircuit = useCCStore((state) => state.coupesCircuit);

  const handleDetailsElementSelected = () => {
    if (elementSelected) {
      if (elementSelected.nature === 'iacm') {
        navigation.navigate('detailIacm', {
          id: elementSelected.id,
          nom: elementSelected.nom,
          depart: elementSelected.depart,
          type: elementSelected.type,
          support: elementSelected.support,
          malt: elementSelected.malt,
          fonctionnel: elementSelected.fonctionnel,
          observation: elementSelected.observation,
          latitude: elementSelected.latitude,
          longitude: elementSelected.longitude,

        })
      } else if (elementSelected.nature === 'coupe_circuit') {
        navigation.navigate('detailCoupeCircuit', {
          id: elementSelected.id,
          depart: elementSelected.depart,
          groupe: elementSelected.groupe,
          type: elementSelected.type,
          etat: elementSelected.etat,
          nbr_defec: elementSelected.nbr_defec,
          connecteur: elementSelected.connecteur,
          observation: elementSelected.observation,
          latitude: elementSelected.latitude,
          longitude: elementSelected.longitude,
          nom: elementSelected.nom,
        })
      }
    }
  }

  let icone_coupe_circuit = "../../../../assets/images/rond_rose.png";
  let icone_iacm = "../../../../assets/images/rond_bleu.png";

  return (
    <View style={StyleSheet.container}>
      {
        (iacms.length == 0 || coupecircuit.length == 0) && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#2980b9" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Oups!
            </Text>
            <Text style={{ fontSize: 18 }}>
              Soit aucune inspection à date ou bien vérifier votre connexion
            </Text>
          </View>
        )
      }
      {
        (iacms.length !== 0 || coupecircuit.length !== 0) && (
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
            onPress={() => setFormMesures(false)}
          >
            {/********* Projection des IACM **********/}

            {iacms.map((iacm, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(iacm.latitude),
                  longitude: parseFloat(iacm.longitude)
                }}
                title={"IACM:" + " " + iacm.nom}
                description={iacm.type}
                onPress={() => { setFormMesures(true); setElementSelected({ ...iacm }) }}
                image={require(icone_iacm)}
              >
              </Marker>
            ))}

            {/********* Projection des Coupe Circuit **********/}

            {coupecircuit.map((cc, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(cc.latitude),
                  longitude: parseFloat(cc.longitude)
                }}
                title={"CC:" + " " +cc.nom}
                description={cc.etat}
                onPress={() => { setFormMesures(true); setElementSelected({ ...cc }) }}
                image={require(icone_coupe_circuit)}
              >
              </Marker>
            ))}
          </MapView>
        )
      }

      {
        formMesures && (
          <TouchableOpacity
            style={styles.form}
            onPress={handleDetailsElementSelected}
          >
            <AntDesign name="form" size={24} color="white" />
          </TouchableOpacity>
        )
      }

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