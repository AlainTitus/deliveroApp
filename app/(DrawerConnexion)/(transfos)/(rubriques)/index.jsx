import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl, Pressable, ActivityIndicator, ToastAndroid, Alert } from 'react-native'
import { departs } from '../../../../datas/labels'
import StatTransfo from '../../../../components/StatTransfo'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router'
import { useState, useEffect } from 'react';
import { useTransfoStore } from '../../../../utils/store';
import { supabase } from '../../../../utils/supabase';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

// import Animated, {
//   useSharedValue,
//   withTiming,
//   useAnimatedStyle,
//   Easing,
// } from 'react-native-reanimated';

const listDepart = () => {

  const navigation = useNavigation()

  const liste = departs.map((depart) => {

    if (depart.label === "Choix d'un depart") return null;
    return (
      <TouchableOpacity
        key={depart.label}
        style={{ padding: 10, backgroundColor: '#d7dbdd', marginVertical: 5, borderRadius: 5, elevation: 2 }}
        onPress={() => navigation.navigate('statdepart', { depart: depart.value })}
      >
        <Text style={{ fontSize: 16, color: '#2c3e50' }}>{depart.value}</Text>
      </TouchableOpacity>
    )
  })

  return liste;
}

const CardTypeTransfo = ({ label, quantite }) => {
  return (
    <View style={styles.cardElement}>
      <Text style={styles.label}>
        {label}
      </Text>
      <Text style={styles.quantite}>
        {quantite}
      </Text>
    </View>
  )
}

const HeadTable = ({ label, firstColumn, secondColumn, colorText, colorbcg, sizelabel, size }) => {
  return (
    <View style={styles.headtable}>
      <View style={[styles.columntable, { backgroundColor: colorbcg }]}>
        <Text style={[styles.headtitle, { color: colorText, fontSize: sizelabel }]}>
          {label.slice(0, 11)}
        </Text>
      </View>
      <View style={[styles.columntable, { backgroundColor: colorbcg, fontSize: size }]}>
        <Text style={[styles.headtitle, { color: colorText, textAlign: 'center' }]}>
          {firstColumn}
        </Text>
      </View>
      <View style={[styles.columntable, { backgroundColor: colorbcg, fontSize: size }]}>
        <Text style={[styles.headtitle, { color: colorText, textAlign: "center" }]}>
          {secondColumn}
        </Text>
      </View>
    </View>
  )
}

const Line = () => {
  return (
    <View style={{ borderBlockColor: '#1f618d', borderBottomWidth: 1, marginBottom: 3 }}></View>
  )
}




export default function Index() {

  const [refresh, setRefresh] = useState(false);
  const [transfoLocalStored, setTransfoLocalStored] = useState([])
  const [transUpdateStored, setTransUpdateStored] = useState([])
  const [finReseauCollected, setFinReseauCollected] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [loadingFinReseau, setLoadingFinReseau] = useState(false)

  let navigation = useNavigation();

  const transformateurs = useTransfoStore((state) => state.transfos);
  const updateTransfo = useTransfoStore((state) => state.updateTransfoCollected);

  const showToast = () => {
    ToastAndroid.show("Données sauvegardées avec succès", ToastAndroid.SHORT);
  }

  const surcharge = () => {
    if (transformateurs.length == 0) {
      return 0;
    } else {
      return transformateurs.filter(elm => elm.charge > 80).length
    }
  }
  const chargeNormale = () => {
    if (transformateurs.length == 0) {
      return 0;
    } else {
      return transformateurs.filter(elm => elm.charge >= 60 && elm.charge < 80).length
    }
  }
  const sousCharge = () => {
    if (transformateurs.length == 0) {
      return 0;
    } else {
      return transformateurs.filter(elm => elm.charge < 60).length
    }
  }

  const departCollecter = () => {
    if (transformateurs.length == 0) {
      return []
    }
    const liste = transformateurs.map(transfo => transfo.depart)
    return [...new Set([...liste])]
  }

  const statTypeTransfo = (depart, type) => {
    return transformateurs.filter(elm => elm.depart === depart && elm.type === type).length
  }

  const triphase = () => {
    if (transformateurs.length == 0) {
      return 0
    } else {
      return transformateurs.filter(elmt => elmt.type === "Triphase").length
    }
  }
  const monophase = () => {
    if (transformateurs.length == 0) {
      return 0
    } else {
      return transformateurs.filter(elmt => elmt.type === "Monophase").length
    }
  }

  const loadTransfoInDB = async () => {
    const { data, error } = await supabase.from('transformateurs').select("*")
    if (error) {
      Alert.alert('Erreur de chargement des transformateurs')
    }
    return data;
  }



  const onRefresh = () => {
    setRefresh(true)
    loadTransfoInDB()
      .then(res => {
        updateTransfo(res);
        setRefresh(false)
      })
      .catch(e => {
        Alert.alert("Problème d'accès à la BD");
        setRefresh(false)
      })

  }

  let dataExcel = (datas) => {
    if (datas.length == 0) {
      return []
    } else {
      let data = datas.map((item) => {
        return [
          item.id,
          item.depart,
          item.nom,
          item.type,
          item.support,
          item.puissance,
          item.section,
          item.etatliaison,
          item.protectbt,
          item.etatprotect,
          item.malt,
          item.parafoudre,
          item.coupecircuit,
          item.observation,
          item.latitude,
          item.longitude,
          item.in,
          item.i1,
          item.i2,
          item.i3,
          item.charge,
          item.desequilibre,
          item.created_at
        ]
      })
      data.unshift(["ID", "depart", "nom", "type", "support", "puissance", "section_liaison", "etat_liaison", "protection_bt", "etat_protect_bt", "malt", "nbr_parafoudre_defect", "nbr_cc_defect", "observation", "latitude", "Longitude", "in", "I1", "I2", "I3", "charge", "desequilibre", "date_collecte"]);
      return data;
    }

  }

  let excel = dataExcel(transformateurs);

  const generateExcel = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([
      ...excel
    ]);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1", true);
    const base64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const filename = FileSystem.documentDirectory + "test.xlsx";
    FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 })
      .then(() => {
        Sharing.shareAsync(filename, {
          dialogTitle: "Export Excel",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
      })
      .catch((error) => {
        console.error("Error writing file:", error);
      });

  }
  /******* Gestion et synchronisation des données à update ***********/
  const showUpdateStorage = async () => {

    const listKeyStore = await AsyncStorage.getAllKeys();

    if (listKeyStore.includes("transformateurUpdate")) {
      let dataStored = await AsyncStorage.getItem("transformateurUpdate")
      dataStored = JSON.parse(dataStored)
      setTransUpdateStored([...dataStored])
      console.log(dataStored)

      // await AsyncStorage.removeItem("transformateur")
      // setTransfoLocalStored([])
    }
  }
  const updateInSupabase = async () => {
    setLoadingUpdate(true)
    const nbrUpdate = transUpdateStored.length
    for (let i = 0; i < nbrUpdate; i++) {
      const { id, ...reste } = transUpdateStored[i]
      const { error } = await supabase
        .from('transformateurs')
        .update({
          ...reste
        })
        .eq('id', id)
      if (error) {
        Alert.alert("Erreur lors de la mise à jour")
        setLoadingUpdate(false)
        break
      }
    }

    showToast()
    setTransUpdateStored([])
    setLoadingUpdate(false)
    await AsyncStorage.removeItem("transformateurUpdate")
    loadTransfoInDB()
      .then(res => {
        updateTransfo(res);
      })
      .catch(e => {
        Alert.alert("Problème d'accès à la BD");
      })
  }
  /******* Fin de Gestion et synchronisation des données à update ***********/

  /******* Gestion et synchronisation des données collectées dans localstorage ***********/
  const showLocalStorage = async () => {

    const listKeyStore = await AsyncStorage.getAllKeys();

    if (listKeyStore.includes("transformateur")) {
      let dataStored = await AsyncStorage.getItem("transformateur")
      dataStored = JSON.parse(dataStored)
      setTransfoLocalStored([...dataStored])
      console.log(dataStored)

      // await AsyncStorage.removeItem("transformateur")
      // setTransfoLocalStored([])
    }
  }
  const loadInSupabase = async () => {
    setLoading(true)
    const { error } = await supabase.from('transformateurs').insert([...transfoLocalStored])
    if (!error) {
      showToast()
      setTransfoLocalStored([])
      setLoading(false)
      await AsyncStorage.removeItem("transformateur")
    } else {
      Alert.alert("Erreur de transfert de données")
      setLoading(false)
    }

  }
  /******* Fin de Gestion et synchronisation des données collectées dans localstorage ***********/

  /******* Gestion et synchronisation des fins réseau ***********/
  const showFinReseauStorage = async () => {

    const listKeyStore = await AsyncStorage.getAllKeys();

    if (listKeyStore.includes("finReseau")) {
      let dataStored = await AsyncStorage.getItem("finReseau")
      dataStored = JSON.parse(dataStored)
      setFinReseauCollected([...dataStored])
      console.log(dataStored)

      // await AsyncStorage.removeItem("transformateur")
      // setTransfoLocalStored([])
    }
  }

  const updateFinReseauInSupabase = async () => {
    setLoadingFinReseau(true)
    const nbrUpdate = finReseauCollected.length
    for (let i = 0; i < nbrUpdate; i++) {
      const { id, finResData } = finReseauCollected[i]
      const { error } = await supabase
        .from('transformateurs')
        .update({
          finResData
        })
        .eq('id', id)
      if (error) {
        Alert.alert("Erreur lors de la mise à jour")
        setLoadingUpdate(false)
        break
      }
    }

    showToast()
    setTransUpdateStored([])
    setLoadingUpdate(false)
    await AsyncStorage.removeItem("transformateurUpdate")
    loadTransfoInDB()
      .then(res => {
        updateTransfo(res);
      })
      .catch(e => {
        Alert.alert("Problème d'accès à la BD");
      })
  }
  /******* Fin de Gestion et synchronisation des fins réseau ***********/

  useEffect(() => {
    loadTransfoInDB()
      .then(res => {
        updateTransfo(res);
      })
      .catch(e => {
        Alert.alert("Problème d'accès à la BD");
      })
  }, [])

  return (
    <SafeAreaView style={styles.safContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f618d' }}>
          Transfos par départs
        </Text>

        <View style={styles.listDepart}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 10, columnGap: 10 }}
            style={{ backgroundColor: '#ecf0f1', borderRadius: 10 }}
            horizontal={true}
          >
            {listDepart()}
          </ScrollView>
        </View>

        <View style={styles.typexfo}>
          <CardTypeTransfo label={"Triphase"} quantite={triphase()} />
          <CardTypeTransfo label={"Monophase"} quantite={monophase()} />
        </View>

        <StatTransfo titre={'Surchargé'} soustitre={" sup 80%"} performance={surcharge()} />
        <StatTransfo titre={'Normal'} soustitre={" entre 60 et 80%"} performance={chargeNormale()} />
        <StatTransfo titre={'souschargé'} soustitre={" inf 60%"} performance={sousCharge()} />
        <View style={styles.options}>
          <TouchableOpacity style={styles.btnoption} onPress={() => { navigation.navigate("mapTransfo") }}>
            <FontAwesome name="map-marker" size={36} color="white" />
            <Text style={styles.labelBntOption}>Inspection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnoption} onPress={() => { navigation.navigate("nouvTransfo") }}>
            <FontAwesome6 name="file-waveform" size={36} color="white" />
            <Text style={styles.labelBntOption}>Creation</Text>
          </TouchableOpacity>
        </View>

        {/**************** Collectes à synchroniser *********************/}
        <View style={styles.titleIcone}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f618d' }}>
            Collectes à synchroniser
          </Text>
          <TouchableOpacity onPress={showLocalStorage}>
            <Ionicons name="refresh-circle" size={40} color='#1f618d' />
          </TouchableOpacity>
        </View>
        <Line />
        <View style={{ marginBottom: 10 }}>
          {
            (!loading && transfoLocalStored.length !== 0) && (
              <TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 8, backgroundColor: '#1f618d', height: 80, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>Nbre collecté</Text>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}> {transfoLocalStored.length} </Text>
                </View>
                <View style={{ backgroundColor: '#1f618d', paddingBottom: 8 }}>
                  <Pressable
                    style={{ backgroundColor: "#fff", padding: 5, width: "70%", marginHorizontal: "auto", elevation: 5, borderRadius: 5 }}
                    onPress={loadInSupabase}
                  >
                    <Text style={{ textAlign: "center", color: '#1f618d', fontSize: 18 }}>Synchroniser</Text>
                  </Pressable>
                </View>

              </TouchableOpacity>
            )
          }

          {
            (loading && transfoLocalStored.length !== 0) && (
              <TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: "center", padding: 8, backgroundColor: '#1f618d', height: 80, alignItems: "center" }}>
                  <ActivityIndicator color={"#fff"} size="large" />
                </View>
              </TouchableOpacity>
            )
          }
          {
            (!loading && transfoLocalStored.length == 0) && (
              <View style={{ flexDirection: 'row', justifyContent: "center", padding: 8, backgroundColor: '#1f618d', height: 60, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", fontStyle: "italic" }}>Aucune donnée collectée</Text>
              </View>
            )
          }
        </View>
        {/**************** Fin collectes *********************/}

        {/*************** Mise à jour à synchroniser *********************/}
        <View style={styles.titleIcone}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#430C5E' }}>
            Update à synchroniser
          </Text>
          <TouchableOpacity onPress={showUpdateStorage}>
            <MaterialIcons name="browser-updated" size={24} color='#430C5E' />
          </TouchableOpacity>
        </View>
        <Line />
        <View style={{ marginBottom: 10 }}>
          {
            (!loading && transUpdateStored.length !== 0) && (
              <TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 8, backgroundColor: '#430C5E', height: 80, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>Nbre collecté</Text>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}> {transUpdateStored.length} </Text>
                </View>
                <View style={{ backgroundColor: '#430C5E', paddingBottom: 8 }}>
                  <Pressable
                    style={{ backgroundColor: "#fff", padding: 5, width: "70%", marginHorizontal: "auto", elevation: 5, borderRadius: 5 }}
                    onPress={updateInSupabase}
                  >
                    <Text style={{ textAlign: "center", color: '#430C5E', fontSize: 18 }}>Update</Text>
                  </Pressable>
                </View>

              </TouchableOpacity>
            )
          }

          {
            (loadingUpdate && transUpdateStored.length !== 0) && (
              <TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: "center", padding: 8, backgroundColor: '#430C5E', height: 80, alignItems: "center" }}>
                  <ActivityIndicator color={"#fff"} size="large" />
                </View>
              </TouchableOpacity>
            )
          }
          {
            (!loadingUpdate && transUpdateStored.length == 0) && (
              <View style={{ flexDirection: 'row', justifyContent: "center", padding: 8, backgroundColor: '#430C5E', height: 60, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", fontStyle: "italic" }}>Aucune donnée collectée</Text>
              </View>
            )
          }
        </View>
        {/**************** Fin update *********************/}

        {/*************** Collecte fin réseau *********************/}
        <View style={styles.titleIcone}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0C5B5E' }}>
            Collecte fin réseau
          </Text>
          <TouchableOpacity onPress={showFinReseauStorage}>
            <MaterialCommunityIcons name="sign-pole" size={24} color="#0C5B5E" />
          </TouchableOpacity>
        </View>
        <Line />
        <View style={{ marginBottom: 10 }}>
          {
            (!loadingFinReseau && finReseauCollected.length !== 0) && (
              <TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 8, backgroundColor: '#0C5B5E', height: 80, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>Nbre collecté</Text>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}> {finReseauCollected.length} </Text>
                </View>
                <View style={{ backgroundColor: '#0C5B5E', paddingBottom: 8 }}>
                  <Pressable
                    style={{ backgroundColor: "#fff", padding: 5, width: "70%", marginHorizontal: "auto", elevation: 5, borderRadius: 5 }}
                    onPress={updateFinReseauInSupabase}
                  >
                    <Text style={{ textAlign: "center", color: '#0C5B5E', fontSize: 18 }}>Update</Text>
                  </Pressable>
                </View>

              </TouchableOpacity>
            )
          }

          {
            (loadingUpdate && transUpdateStored.length !== 0) && (
              <TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: "center", padding: 8, backgroundColor: '#0C5B5E', height: 80, alignItems: "center" }}>
                  <ActivityIndicator color={"#fff"} size="large" />
                </View>
              </TouchableOpacity>
            )
          }
          {
            (!loadingUpdate && transUpdateStored.length == 0) && (
              <View style={{ flexDirection: 'row', justifyContent: "center", padding: 8, backgroundColor: '#0C5B5E', height: 60, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", fontStyle: "italic" }}>Aucune donnée collectée</Text>
              </View>
            )
          }
        </View>
        {/**************** Fin collecte fin réseau *********************/}


        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f618d' }}>
            Stat des transfos collectés
          </Text>
        </View>
        <Line />

        <HeadTable label="Départ" firstColumn="Tri" secondColumn="Mono" colorText="white" colorbcg="#1a5276" sizelabel={14} size={14} />
        {
          departCollecter().length == 0 ? null : (
            departCollecter().map((depart, index) => (
              <HeadTable key={index} label={depart} firstColumn={statTypeTransfo(depart, "Triphase")} secondColumn={statTypeTransfo(depart, "Monophase")} colorbcg="white" sizelabel={14} size={14} />
            ))
          )
        }

        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
          {
            transformateurs.length === 0 ? (
              <TouchableOpacity style={{ backgroundColor: "#cacfd2", padding: 8, borderRadius: 5 }}>
                <Text style={{ color: "white", fontSize: 17 }}>
                  Exporter vers excel
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ backgroundColor: "#1a5276", padding: 8, borderRadius: 5 }}
                onPress={generateExcel}
              >
                <Text style={{ color: "white", fontSize: 17 }}>
                  Exporter vers excel
                </Text>
              </TouchableOpacity>
            )
          }

        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  listDepart: {
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20
  },
  btnoption: {
    height: 90,
    width: "40%",
    backgroundColor: "#1a5276",
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8
  },
  labelBntOption: {
    color: 'white'
  },
  typexfo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cardElement: {
    backgroundColor: 'purple',
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  label: {
    color: 'white',
    fontSize: 20
  },
  quantite: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  headtable: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center'
  },
  columntable: {
    width: "32%",
    padding: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  headtitle: {
    fontWeight: 'bold'
  },
  titleIcone: {
    borderBottomWidth: 1,
    borderBottomColor: "#85929e",
    paddingBottom: 4,
    paddingRight: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

})