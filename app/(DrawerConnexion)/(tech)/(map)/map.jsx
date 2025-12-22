import { View, StyleSheet, Alert, TouchableOpacity, Dimensions, ActivityIndicator, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useRouter, useNavigation } from 'expo-router'
import { useAuth } from '../../../../provider/AuthProvider'
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSupportStore } from '../../../../utils/store'

const { width, height } = Dimensions.get('window')
const radius = width * 0.15
const bottom = 100

export default function Mapcollecte() {
  const [supportLoaded, setSupportLoaded] = useState([])
  const [updateMap, setUpdateMap] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lookDetail, setLookDetail] = useState(false)
  const [poteau, setPoteau] = useState(null)
  const [search, setSearch] = useState(false)
  const [checked, setChecked] = useState(null)


  const router = useRouter()
  const navigation = useNavigation()
  const { user } = useAuth()

  const supports = useSupportStore(state => state.supports)

  const handleSupport = (id) => {
    if (checked) {
      let result = supports.find(elm => elm.id === parseInt(id))
      if (result) {
        setChecked(null)
        setSearch(false)
        navigation.navigate("mapSearch", {
          supbois: result.structBois,
          hautBois: result.hauteurBois,
          imglink: result.imglink,
          depart: result.depart,
          structBeton: result.structBeton,
          hautBeton: result.hauteurBeton,
          effort: result.force,
          armBeton: result.armBeton,
          nbrIso: result.nbrIso,
          nbrChaine: result.nbrChaine,
          access: result.access,
          observation: result.observ,
          latitude: result.latitude,
          longitude: result.longitude
        })
      }
    }
  }
  const handleMapPress = () => {
    setLookDetail(false)
  }

  const handleInput = () => {
    setSearch(!search)
  }

  const handleButtonView = (sup) => {
    setLookDetail(true)
    setPoteau(sup)
  }

  const handleUpdate = (pot) => {
    // console.log("link", pot.imglink)
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

  let textD32BELABO = "../../../../assets/images/rond_violet.png";
  let textD31BATOURI = "../../../../assets/images/rond_vert.png";
  let textD11BERTOUA = "../../../../assets/images/rond_bleu.png";
  let textD12BERTOUA = "../../../../assets/images/rond_rose.png";
  let textAutre = "../../../../assets/images/rond_autre.png";


  /**** Activer la position de l'utilisateur ****/
  useEffect(() => {
    async function getCurrentLocation() {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
    }

    getCurrentLocation();
  }, []);

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
        style={styles.map}
        onPress={handleMapPress}
      >
        {
          supports.map(sup => (
            <Marker
              key={sup.id}
              coordinate={{ latitude: parseFloat(sup.latitude), longitude: parseFloat(sup.longitude) }}
              image={
                sup.depart == "D32 BELABO" ? require(textD32BELABO) : (
                  sup.depart == "D31 BATOURI" ? require(textD31BATOURI) : (
                    sup.depart === "D11 BERTOUA" ? require(textD11BERTOUA) : (
                      sup.depart == "D12 BERTOUA" ? require(textD12BERTOUA) : require(textAutre)
                    )))

              }
              onPress={() => handleButtonView(sup)}
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
      {(supports.length !== 0 && search) && (
        <View style={styles.boxSearch}>
          <View style={styles.search}>
            <TextInput style={styles.input} onChangeText={setChecked} value={checked} placeholder='ID support' placeholderTextColor={"#d7dbdd"} />
            <TouchableOpacity style={styles.iconSearch} onPress={() => handleSupport(checked)}>
              <Ionicons name="search" size={24} color="#d7dbdd" />
            </TouchableOpacity>
          </View>
        </View>)
      }

      {supports.length !== 0 && (
        <TouchableOpacity style={styles.activeSearch} onPress={handleInput}>
          {
            search ? (
              <MaterialIcons name="search-off" size={28} color="white" />
            ) : (
              <MaterialCommunityIcons name="map-search-outline" size={24} color="white" />
            )
          }
        </TouchableOpacity>
      )}



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
    bottom: bottom + (radius) + 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  activeSearch: {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor: '#2e4053',
    position: 'absolute',
    zIndex: 100,
    bottom: bottom,
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
    bottom: bottom + radius + 20 + radius + 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  boxSearch: {
    zIndex: 100,
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    width: "80%",
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "center",

  },
  input: {
    width: "80%",
    height: 60,
    backgroundColor: "rgba(52, 73, 94, 0.9)",
    padding: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#d7dbdd",
    fontSize: 16,
    color: "white",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  iconSearch: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 73, 94, 0.9)",
    height: 60,
    width: "20%",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderColor: "#d7dbdd"
  }
})