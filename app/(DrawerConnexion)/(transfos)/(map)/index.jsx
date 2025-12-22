import { View, StyleSheet, Alert, Dimensions, Text, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useTransfoStore } from '../../../../utils/store'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from 'expo-router'

const { width, height } = Dimensions.get('window')
const milieu = height * (1 / 3);
const radius = width * 0.15;

export default function Mapcollecte() {

  const [formMesures, setFormMesures] = useState(false);
  const [postSelected, setPostSelected] = useState(null)

  const navigation = useNavigation()

  const transformateurs = useTransfoStore((state) => state.transfos);

  let textD32BELABO = "../../../../assets/images/transfo_D32Belabo.png";
  let textD31BATOURI = "../../../../assets/images/transfo_D31Batouri.png";
  let textD11BERTOUA = "../../../../assets/images/transfo_D11Bertoua.png";
  let textD12BERTOUA = "../../../../assets/images/transfo_D12Bertoua.png";
  let textA32BERTOUA = "../../../../assets/images/transfo_D32Bertoua.png";
  let textD31ABONGMBANG = "../../../../assets/images/transfo_D12Bertoua.png";
  let textAutre = "../../../../assets/images/transformateur.png";


  return (
    <View style={StyleSheet.container}>
      {
        transformateurs.length == 0 && (
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
        transformateurs.length !== 0 && (
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
            {transformateurs.map((poste, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(poste.latitude),
                  longitude: parseFloat(poste.longitude)
                }}
                title={poste.nom}
                description={poste.type}
                image={
                  poste.depart == "D32 BELABO" ? require(textD32BELABO) : (
                    poste.depart == "D31 BATOURI" ? require(textD31BATOURI) : (
                      poste.depart === "D11 BERTOUA" ? require(textD11BERTOUA) : (
                        poste.depart == "D12 BERTOUA" ? require(textD12BERTOUA) : (
                          poste.depart == "A32 BERTOUA" ? require(textA32BERTOUA) : (
                            poste.depart == "D31 ABONGMBANG" ? require(textD31ABONGMBANG) : (
                              require(textAutre)
                            )))
                      )))

                }
                onPress={() => { setFormMesures(true); setPostSelected({ ...poste }) }}
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
            onPress={() => navigation.navigate('mesures', { id: postSelected.id, nom: postSelected.nom, puissance: postSelected.puissance, type: postSelected.type })}
          >
            <AntDesign name="form" size={24} color="white" />
          </TouchableOpacity>
        )
      }

      {
        formMesures && (
          <TouchableOpacity
            style={styles.tension}
            onPress={() => navigation.navigate('tension', { id: postSelected.id, nom: postSelected.nom, puissance: postSelected.puissance, latitude: postSelected.latitude, longitude: postSelected.longitude, nbrFinReseau: postSelected.finReseau })}
          >
            <MaterialCommunityIcons name="sign-pole" size={24} color="white" />
          </TouchableOpacity>
        )
      }

      {
        formMesures && (
          <TouchableOpacity
            style={styles.update}
            onPress={() => navigation.navigate('updateTransfo', { id: postSelected.id, nom: postSelected.nom, puissance: postSelected.puissance, latitude: postSelected.latitude, longitude: postSelected.longitude })}
          >
            <MaterialCommunityIcons name="update" size={24} color="white" />
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
  },
  tension: {
    position: 'absolute',
    zIndex: 100,
    bottom: milieu - (radius + 20),
    right: 20,
    width: radius,
    height: radius,
    borderRadius: radius,
    backgroundColor: '#1f618d',
    justifyContent: 'center',
    alignItems: 'center'
  },
  update: {
    position: 'absolute',
    zIndex: 100,
    bottom: milieu - (2*radius + 40),
    right: 20,
    width: radius,
    height: radius,
    borderRadius: radius,
    backgroundColor: '#1f618d',
    justifyContent: 'center',
    alignItems: 'center'
  },
})