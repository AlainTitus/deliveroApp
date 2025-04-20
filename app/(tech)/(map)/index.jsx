import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import poteaux from '../../../datas/supportsDRE.json'
import { useRouter, useNavigation } from 'expo-router'
import { supabase } from '../../../utils/supabase'
import { useAuth } from '../../../provider/AuthProvider'
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';

const { width, height } = Dimensions.get('window')
const radius = width * 0.15

export default function Mapcollecte() {
  const [supportLoaded, setSupportLoaded] = useState([])
  const [updateMap, setUpdateMap] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lookDetail, setLookDetail] = useState(false)
  const [poteau, setPoteau] = useState(null)


  const router = useRouter()
  const navigation = useNavigation()
  const { user } = useAuth()

  const handleMapPress = () => {
    setLookDetail(false)
  }

  const handleButtonView = (pot) => {
    setLookDetail(true)
    setPoteau(pot)
  }

  const handleUpdate = (pot) => {
    console.log("link", pot.imglink)
    navigation.navigate("detailSupport", {
      supbois: pot.structBois,
      hautBois: pot.hauteurBois,
      imglink: pot.imglink,
      depart: pot.depart,
      structBeton: pot.structBeton,
      hautBeton: pot.hauteurBeton,
      effort: pot.force,
      armBeton: pot.armBeton,
      nbrIso: pot.nbrIso,
      nbrChaine: pot.nbrChaine,
      access: pot.access,
      observation: pot.observ
    })
  }

  const handleUpdateMap = () => {
    setUpdateMap(prev => !prev)
  }

  const handleDetails = () => {
    setLookDetail(false)
    handleUpdate(poteau)
  }

  let textD32BELABO = "../../../assets/images/bouton-d32.png";
  let textD31BATOURI = "../../../assets/images/bouton-d31.png";
  let textD11BERTOUA = "../../../assets/images/pt_bleu2.png";
  let textD12BERTOUA = "../../../assets/images/bouton-d12.png";
  let textAutre = "../../../assets/images/bouton_64.png";

  const getSupportCollected = async () => {
    if (user) {
      const { data, error } = await supabase.from('supportCollected').select('*')
      if (error) {
        Alert.alert("Probleme d'acces à la BD")
        return;
      } else {
        return data;
      }
    } else {
      Alert.alert('Utilisateur non connecté!')
    }

  }

  useEffect(() => {
    setLoading(true)
    getSupportCollected().then(res => {
      const nbrData = res.length;
      const newData = [];
      for (var i = 0; i < nbrData; i++) {
        newData.push({ ...res[i], latitude: parseFloat(res[i].latitude), longitude: parseFloat(res[i].longitude) })
      }
      setSupportLoaded([...newData])
      setLoading(false)
    }).catch(e => {
      Alert.alert('Erreur de lecteur de la BD')
      setLoading(false)
    })
  }, [updateMap])

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
        showsUserLocation
        showsMyLocationButton
        style={styles.map}
        onPress={handleMapPress}
      >
        {
          supportLoaded.map(pot => (
            <Marker
              key={pot.id}
              coordinate={{ latitude: pot.latitude, longitude: pot.longitude }}
              image={
                pot.depart == "D32 BELABO" ? require(textD32BELABO) : (
                  pot.depart == "D31 BATOURI" ? require(textD31BATOURI) : (
                    pot.depart === "D11 BERTOUA" ? require(textD11BERTOUA) : (
                      pot.depart == "D12 BERTOUA" ? require(textD12BERTOUA) : require(textAutre)
                    )))

              }
              // onPress={() => handleUpdate(pot)}
              onPress={() => handleButtonView(pot)}
              showsMyLocationButton={true}
              showsUserLocation={true}
              showsTraffic={true}
              loadingEnabled={true}
            />
          ))
        }

      </MapView>

      {lookDetail &&
        <TouchableOpacity style={styles.details} onPress={handleDetails}>
          <Entypo name="eye" size={28} color="white" />
        </TouchableOpacity>
      }

      <TouchableOpacity style={styles.refresh} onPress={handleUpdateMap}>
        {
          loading ? (
            <ActivityIndicator size={28} color="white" />
          ) : (
            <Fontisto name="spinner-refresh" size={28} color="white" />
          )
        }

      </TouchableOpacity>
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
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    backgroundColor: 'red'
  },
  refresh: {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor: '#2980b9',
    position: 'absolute',
    zIndex: 100,
    bottom: 80,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  details: {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor: '#0e6655',
    position: 'absolute',
    zIndex: 100,
    bottom: 150,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  }
})