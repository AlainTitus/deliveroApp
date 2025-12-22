import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl, Dimensions, Button, ToastAndroid, ActivityIndicator } from 'react-native'
import { departs } from '../../../../datas/labels'
import StatTransfo from '../../../../components/StatTransfo'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from 'expo-router'
import { useState, useEffect } from 'react';
import { useTransfoStore, useIacmStore, useCCStore } from '../../../../utils/store';
import { supabase } from '../../../../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from '@expo/vector-icons/Ionicons';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');


const listDepart = () => {

  const navigation = useNavigation()

  const liste = departs.map((depart) => {

    if (depart.label === "Choix d'un depart") return null;
    return (
      <TouchableOpacity
        key={depart.label}
        style={{ padding: 10, backgroundColor: '#873600', marginVertical: 5, borderRadius: 5, elevation: 2 }}
        onPress={() => navigation.navigate('statdepart', { depart: depart.value })}
      >
        <Text style={{ fontSize: 16, color: '#fff' }}>{depart.value}</Text>
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

const LoadComponent = () => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", height: 80, marginBottom: 10 }}>
      <ActivityIndicator size={"large"} color={"#fff"} />
      <Text style={{ fontSize: 20, color: "white" }}>Chargement en cours...</Text>
    </View>

  )
}



export default function Index() {
  const [refresh, setRefresh] = useState(false);
  const [storeCoupeCircuit, setStoreCoupeCircuit] = useState([]);
  const [storeIACM, setStoreIACM] = useState([]);
  const [loading, setLoading] = useState(false);

  let navigation = useNavigation();


  const iacms = useIacmStore((state) => state.iacms);
  const updateIACMs = useIacmStore((state) => state.updateIacms);

  const coupecircuit = useCCStore((state) => state.coupesCircuit);
  const updateCoupesCircuit = useCCStore((state) => state.updateCoupesCircuit);

  const iacm_defectueux = () => {
    if (iacms.length == 0) {
      return 0;
    } else {
      return iacms.filter(elm => elm.fonctionnel == "non").length
    }
  }
  const cc_defectueux = () => {
    if (coupecircuit.length == 0) {
      return 0;
    } else {
      return coupecircuit.filter(elm => elm.etat !== "RAS").length
    }
  }


  const loadIacmSupabase = async () => {
    const { data, error } = await supabase.from('iacm').select("*")
    if (error) {
      Alert.alert('Erreur de chargement des IACM')
    }
    return data;
  }
  const loadCCSupabase = async () => {
    const { data, error } = await supabase.from('coupe_circuit').select("*")
    if (error) {
      Alert.alert('Erreur de chargement des Coupes Circuits')
    }
    return data;
  }

  const onRefresh = () => {
    setRefresh(true)

    loadIacmSupabase()
      .then(res => {
        updateIACMs(res);

      })
      .catch(e => {
        Alert.alert("Problème d'accès à la BD IACM");
        setRefresh(false)
      })

    loadCCSupabase()
      .then(res => {
        updateCoupesCircuit(res);
        setRefresh(false)
      })
      .catch(e => {
        Alert.alert("Problème d'accès à la BD Coupes Circuits");
        setRefresh(false)
      })

    setRefresh(false)
  }

  let dataExcel_coupe_circuit = (datas) => {
    if (datas.length == 0) {
      return []
    } else {
      let data = datas.map((item) => {
        return [
          item.id,
          item.depart,
          item.groupe,
          item.type,
          item.etat,
          item.nbr_defec,
          item.connecteur,
          item.observation,
          item.action,
          item.url,
          item.latitude,
          item.longitude,
          item.nom,
          item.nature,
        ]
      })
      data.unshift(["ID", "depart", "groupe", "type", "etat", "nbr_defec", "connecteur", "observation", "action", "url", "latitude", "longitude", "nom", "nature"]);
      return data;
    }

  }

    let dataExcel_iacm = (datas) => {
    if (datas.length == 0) {
      return []
    } else {
      let data = datas.map((item) => {
        return [
          item.id,
          item.nom,
          item.depart,
          item.type,
          item.support,
          item.malt,
          item.anomalie,
          item.fonctionnel,
          item.observation,
          item.latitude,
          item.longitude,
          item.action,
          item.url,
          item.nature,
        ]
      })
      data.unshift(["ID", "nom", "depart", "type", "support", "malt", "anomalie", "fonctionnel", "observation", "latitude", "longitude", "action", "url", "nature"]);
      return data;
    }

  }


  let excel_coupecircuit = dataExcel_coupe_circuit(coupecircuit);
  let excel_iacm = dataExcel_iacm(iacms);

  const generateExcel_coupecircuit = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([
      ...excel_coupecircuit
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
  const generateExcel_iacm = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([
      ...excel_iacm
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


  useEffect(() => {
    loadIacmSupabase()
      .then(res => {
        updateIACMs(res);
      })
      .catch(e => {
        Alert.alert("Problème d'accès à la BD IACM");
      })
  }, [])

  useEffect(() => {
    loadCCSupabase()
      .then(res => {
        updateCoupesCircuit(res);
      })
      .catch(e => {
        Alert.alert("Problème d'accès à la BD Coupes Circuits");
      })
  }, [])


  /******************************************** */
  const showToast = () => {
    ToastAndroid.show("Transferer avec succès", ToastAndroid.SHORT);
  }

  const showLocalStorage = async () => {

    const listKeyStore = await AsyncStorage.getAllKeys();
    if (listKeyStore.includes("coupe_circuit")) {
      let dataStored = await AsyncStorage.getItem("coupe_circuit")
      dataStored = JSON.parse(dataStored)
      setStoreCoupeCircuit([...dataStored])
    }
    if (listKeyStore.includes("iacm")) {
      let dataStored = await AsyncStorage.getItem("iacm")
      dataStored = JSON.parse(dataStored)
      setStoreIACM([...dataStored])
    }
  }

  const handleload = async () => {
    setLoading(true)
    /***** load coupe circuit */
    if (storeCoupeCircuit.length !== 0) {
      const { data, error } = await supabase.from('coupe_circuit').insert([...storeCoupeCircuit])


      if (!error) {
        showToast()
        setStoreCoupeCircuit([])
        await AsyncStorage.removeItem("coupe_circuit")
      } else {
        Alert.alert("Erreur lors de la synchronisation des coupes circuits")
      }
    }

    /******load IACM *****/
    if (storeIACM.length !== 0) {
      const { data, error } = await supabase.from('iacm').insert([...storeIACM])

      if (!error) {
        showToast()
        setStoreIACM([])
        await AsyncStorage.removeItem("iacm")
      } else {
        Alert.alert("Erreur lors de la synchronisation des IACM")
      }
    }

    setLoading(false)
  }


  return (
    <SafeAreaView style={styles.safContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#873600', textAlign: 'center' }}>
          OCR par départs
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
          <CardTypeTransfo label={"Total IACM"} quantite={iacms.length} />
          <CardTypeTransfo label={"Total CC"} quantite={coupecircuit.length} />
        </View>

        <StatTransfo titre={'IACM'} soustitre={"Défectueux"} performance={iacm_defectueux()} />
        <StatTransfo titre={'Coupe circuit'} soustitre={"Défectueux"} performance={cc_defectueux()} />
        <View style={styles.options}>
          <TouchableOpacity style={styles.btnoption} onPress={() => { navigation.navigate("mapOCR") }}>
            <FontAwesome name="map-marker" size={36} color="white" />
            <Text style={styles.labelBntOption}>Inspection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnoption} onPress={() => { navigation.navigate("nouvOCR") }}>
            <FontAwesome6 name="file-waveform" size={36} color="white" />
            <Text style={styles.labelBntOption}>Creation</Text>
          </TouchableOpacity>
        </View>

        {/****Coupe circuit - Affichage des donnees stocké en local ************/}
        <View style={styles.titleIcone}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#873600' }}>
            OCR à synchroniser
          </Text>
          <TouchableOpacity onPress={showLocalStorage}>
            <Ionicons name="refresh-circle" size={40} color="#873600" />
          </TouchableOpacity>
        </View>

        {
          (!loading && storeCoupeCircuit.length !== 0) && (<StatTransfo titre={'Coupe circuit'} soustitre={"collecté"} performance={storeCoupeCircuit.length} />)
        }
        {
          (!loading && storeIACM.length !== 0) && (<StatTransfo titre={'IACM'} soustitre={"collecté"} performance={storeIACM.length} />)
        }

        {
          (!loading && (storeCoupeCircuit.length === 0 && storeIACM.length === 0)) && (
            <View>
              <Text style={{ color: "#1f618d", textAlign: 'center', fontSize: 16, fontStyle: 'italic' }}>
                Aucune collecte pour le moment!!!
              </Text>
            </View>
          )
        }
        {
          (!loading && (storeCoupeCircuit.length !== 0 || storeIACM.length !== 0)) && (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
              <View style={{ width: "80%" }}>
                <Button title="Synchroniser" onPress={handleload} color="#1f618d" />
              </View>
            </View>
          )
        }

        {
          loading && <LoadComponent />
        }

        {/********* Coupe circuit - Fin affichage des donnees stocké en local ************/}

        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 10, marginVertical: 10 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
            {
              coupecircuit.length === 0 ? (
                <TouchableOpacity style={{ backgroundColor: "#873600", padding: 8, borderRadius: 5 }}>
                  <Text style={{ color: "white", fontSize: 17 }}>
                    CC vers excel
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ backgroundColor: "#873600", padding: 8, borderRadius: 5 }}
                  onPress={generateExcel_coupecircuit}
                >
                  <Text style={{ color: "white", fontSize: 17 }}>
                    CC vers excel
                  </Text>
                </TouchableOpacity>
              )
            }

          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
            {
              iacms.length === 0 ? (
                <TouchableOpacity style={{ backgroundColor: "#873600", padding: 8, borderRadius: 5 }}>
                  <Text style={{ color: "white", fontSize: 17 }}>
                    Iacm vers excel
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ backgroundColor: "#873600", padding: 8, borderRadius: 5 }}
                  onPress={generateExcel_iacm}
                >
                  <Text style={{ color: "white", fontSize: 17 }}>
                    Iacm vers excel
                  </Text>
                </TouchableOpacity>
              )
            }

          </View>
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
    backgroundColor: "#873600",
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
    flexWrap: 'wrap',
    justifyContent: 'start',
    alignItems: 'center',
    paddingHorizontal: (width * 0.1 / 6) - 1
  },
  cardElement: {
    backgroundColor: 'purple',
    width: width * 0.8 / 2,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: width * 0.2 / 6,
    marginVertical: 5
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

})