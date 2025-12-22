import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ToastAndroid, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { departs } from '../../../../datas/labels'
import { useNavigation } from 'expo-router';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../../../../utils/supabase';
import { useAbattage, useElagage, useMarecage, useDebroussaillage } from '../../../../utils/store';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';


const ItemDepart = ({ depart }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => { navigation.navigate("typeVegetation", { depart: depart.value }) }}
    >
      <Text style={styles.item_text}>
        {depart.label}
      </Text>
    </TouchableOpacity>
  )
}

const loadData = async (keyAsyncStore, tab, text_alert, setter) => {

  if (tab.length !== 0) {
    const showToast = () => {
      ToastAndroid.show("Transferer avec succès", ToastAndroid.SHORT);
    }
    const { data, error } = await supabase.from(keyAsyncStore).insert([...tab])

    if (!error) {
      showToast()
      setter([])
      await AsyncStorage.removeItem(keyAsyncStore)
    } else {
      Alert.alert(text_alert)
    }

  }

}

const Anomalies = ({ label, value, icone, store, setter }) => {

  const handleLoadData = async () => {

    if (label == "Abattages arbres") {
      loadData("abattage", store, "Abattage non sauvegardé, verifier connexion", setter)
    }
    if (label == "Elagages") {
      loadData("elagage", store, "Elagage non sauvegardé, verifier connexion", setter)
    }
    if (label == "Marécages") {
      loadData("marecage", store, "Marecage non sauvegardé, verifier connexion", setter)
    }
    if (label == "Débroussaillages") {
      await AsyncStorage.removeItem("debroussaillage")
      console.log("salut")
      loadData("debroussaillage", store, "Debroussaillage non sauvegardé, verifier connexion", setter)
    }
  }

  return (
    <TouchableOpacity style={styles.item_anomalie}
      onPress={handleLoadData}
    >
      <View style={{ flexDirection: "row", columnGap: 2, alignItems: 'center' }}>
        {icone}
        <Text style={styles.anomalie_label}> {label} </Text>
        {store.length == 0 ? null : <Text> {store.length} </Text>}
      </View>
      <Text style={styles.anomalie_value}> {value} </Text>
    </TouchableOpacity>
  )
}


export default function Index() {
  const [abattage, setAbattage] = useState([])
  const [elagage, setElagage] = useState([])
  const [marecage, setMarecage] = useState([])
  const [debroussaillage, setDebroussaillage] = useState([])
  const [nbr_abattage, setNbr_abattage] = useState([])
  const [nbr_elagage, setNbr_elagage] = useState([]);
  const [nbr_marecage, setNbr_marecage] = useState([])
  const [nbr_debroussaillage, setNbr_debroussaillage] = useState([])
  const [refresh, setRefresh] = useState(false)


  const navigation = useNavigation()

  /**** Fonctions de mise à jour des états ****/
  const updateAbattage = useAbattage((state) => state.updateAbattage)
  const updateElagage = useElagage((state) => state.updateElagage)
  const updateMarecage = useMarecage((state) => state.updateMarecage)
  const updateDebroussaillage = useDebroussaillage((state) => state.updateDebroussaillage)
  /*********************************************/

  /******* Extraction excel des abattages *******/
  let dataExcelAbattage = (datas) => {
    if (datas.length == 0) {
      return []
    } else {
      let data = datas.map((item) => {
        return [
          item.id,
          item.depart,
          item.D30,
          item.D30_50,
          item.D50_80,
          item.D80_100,
          item.D100,
          item.observations,
          item.latitude,
          item.longitude,
          item.created_at
        ]
      })
      data.unshift(["ID", "Depart", "D30", "D30_50", "D50_80", "D80_100", "D100", "Observations", "Latitude", "Longitude", "Date"]);
      return data;
    }

  }
  let excelAbattage = dataExcelAbattage(nbr_abattage);

  const generateExcelAbattage = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([
      ...excelAbattage
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
  /************************************************/
  /******* Extraction excel des elagages *******/
  let dataExcelElagage = (datas) => {
    if (datas.length == 0) {
      return []
    } else {
      let data = datas.map((item) => {
        return [
          item.id,
          item.depart,
          item.nombre,
          item.observations,
          item.latitude,
          item.longitude,
          item.created_at
        ]
      })
      data.unshift(["ID", "Depart", "Nombre", "Observations", "Latitude", "Longitude", "Date"]);
      return data;
    }

  }
  let excelElagage = dataExcelElagage(nbr_elagage);

  const generateExcelElagage = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([
      ...excelElagage
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
  /************************************************/
  /******* Extraction excel des marecages *******/
  let dataExcelMarecage = (datas) => {
    if (datas.length == 0) {
      return []
    } else {
      let data = datas.map((item) => {
        return [
          item.id,
          item.depart,
          item.nom_Mare,
          item.longueur,
          item.observations,
          item.latitude,
          item.longitude,
          item.created_at
        ]
      })
      data.unshift(["ID", "Depart", "Nom_marecage", "Longueur", "Observations", "Latitude", "Longitude", "Date"]);
      return data;
    }

  }
  let excelMarecage = dataExcelMarecage(nbr_marecage);

  const generateExcelMarecage = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([
      ...excelMarecage
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
  /************************************************/
  /******* Extraction excel debroussaillage *******/
  let dataExcelDebroussaillage = (datas) => {
    if (datas.length == 0) {
      return []
    } else {
      let data = datas.map((item) => {
        return [
          item.id,
          item.depart,
          item.zone,
          item.longueur,
          item.observations,
          item.latitude,
          item.longitude,
          item.created_at
        ]
      })
      data.unshift(["ID", "Depart", "Zone", "Longueur", "Observations", "Latitude", "Longitude", "Date"]);
      return data;
    }

  }
  let excelDebroussaillage = dataExcelDebroussaillage(nbr_debroussaillage);

  const generateExcelDebroussaillage = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([
      ...excelDebroussaillage
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
  /************************************************/


  const list_depart = departs.filter((item) => item.label !== "Choix d'un depart");

  const showLocalStorage = async () => {

    const listKeyStore = await AsyncStorage.getAllKeys();

    if (listKeyStore.includes("abattage")) {
      let dataStored = await AsyncStorage.getItem("abattage")
      dataStored = JSON.parse(dataStored)
      console.log("abattage", dataStored.length)
      setAbattage([...dataStored])
    }
    if (listKeyStore.includes("elagage")) {
      let dataStored = await AsyncStorage.getItem("elagage")
      dataStored = JSON.parse(dataStored)
      setElagage([...dataStored])
    }
    if (listKeyStore.includes("marecage")) {
      let dataStored = await AsyncStorage.getItem("marecage")
      dataStored = JSON.parse(dataStored)
      setMarecage([...dataStored])
    }
    if (listKeyStore.includes("debroussaillage")) {
      let dataStored = await AsyncStorage.getItem("debroussaillage")
      dataStored = JSON.parse(dataStored)
      setDebroussaillage([...dataStored])
    }
  }

  const get_abattage = async (base) => {
    const { data, error } = await supabase.from(base).select("*")
    return data
  }

  const onRefresh = () => {
    setRefresh(true)
    /*****************************************************/
    get_abattage("abattage").then((res) => {
      setNbr_abattage(res)
      updateAbattage(res)
    }).catch(e => console.log("error fetching abattage"))
    /*****************************************************/
    get_abattage("elagage").then((res) => {
      setNbr_elagage(res)
      updateElagage(res)
    }).catch(e => console.log("error fetching elagage"))
    /*****************************************************/
    get_abattage("marecage").then((res) => {
      setNbr_marecage(res)
      updateMarecage(res)
    }).catch(e => console.log("error fetching marecage"))
    /*****************************************************/
    get_abattage("debroussaillage").then((res) => {
      setNbr_debroussaillage(res)
      updateDebroussaillage(res)
      setRefresh(false)
    }).catch(e => console.log("error fetching debroussaillage"))

  }


  useEffect(() => {
    showLocalStorage()
  }, [])

  useEffect(() => {
    get_abattage("abattage").then((res) => {
      setNbr_abattage(res)
      updateAbattage(res)
    }).catch(e => console.log("error fetching abattage"))
  }, [])

  useEffect(() => {
    get_abattage("elagage").then((res) => {
      setNbr_elagage(res)
      updateElagage(res)
    }).catch(e => console.log("error fetching elagage"))
  }, [])

  useEffect(() => {
    get_abattage("marecage").then((res) => {
      setNbr_marecage(res)
      updateMarecage(res)
    }).catch(e => console.log("error fetching marecage"))
  }, [])

  useEffect(() => {
    get_abattage("debroussaillage").then((res) => {
      setNbr_debroussaillage(res)
      updateDebroussaillage(res)
    }).catch(e => console.log("error fetching debroussaillage"))
  }, [])



  return (
    <SafeAreaView style={styles.safContainer}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 4 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text style={styles.title}>Suivi de la végétation</Text>
        </View>
        <View>
          <FlatList
            data={list_depart}
            renderItem={({ item }) => <ItemDepart depart={{ ...item }} />}
            keyExtractor={(item) => item.label}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.collecte}>
          <TouchableOpacity
            style={styles.btn_collect}
            onPress={() => { navigation.navigate('mapVegetation') }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold", }}>Collecte</Text>
            <Foundation name="trees" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn_collect}
            onPress={() => { navigation.navigate('creation') }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold", }}>Creation</Text>
            <Entypo name="new-message" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 10 }}>
          <View style={{ borderBottomColor: "#1e8449", borderBottomWidth: 1, marginVertical: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 2 }}>
            <Text style={{ fontSize: 18, color: "#1e8449", fontWeight: "bold", }}>Stats globales</Text>
            <TouchableOpacity onPress={showLocalStorage}>
              <Ionicons name="refresh-circle" size={40} color="#1e8449" />
            </TouchableOpacity>
          </View>
          <View>
            <Anomalies label={"Abattages arbres"} store={abattage} setter={setAbattage} value={nbr_abattage.length} icone={<FontAwesome name="tree" size={24} color="#1e8449" />} />
            <Anomalies label={"Elagages"} store={elagage} setter={setElagage} value={nbr_elagage.length} icone={<MaterialCommunityIcons name="tree" size={24} color="#1e8449" />} />
            <Anomalies label={"Marécages"} store={marecage} setter={setMarecage} value={nbr_marecage.length} icone={<MaterialIcons name="water" size={24} color="#1e8449" />} />
            <Anomalies label={"Débroussaillages"} store={debroussaillage} setter={setDebroussaillage} value={nbr_debroussaillage.length} icone={<MaterialIcons name="grass" size={24} color="#1e8449" />} />
          </View>
        </View>

        <View style={{ borderBottomColor: "#1e8449", borderBottomWidth: 1, marginVertical: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 2 }}>
          <Text style={{ fontSize: 18, color: "#1e8449", fontWeight: "bold", }}>Export to Excel</Text>
          <TouchableOpacity onPress={showLocalStorage}>
            <MaterialCommunityIcons name="microsoft-excel" size={24} color="#1e8449" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", columnGap: 10, paddingVertical: 10 }}>
          <TouchableOpacity
            style={styles.btn_excel}
            onPress={generateExcelAbattage}>
            <Text style={styles.text_btn}>Abattage</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn_excel}
            onPress={generateExcelElagage}>
            <Text style={styles.text_btn}>Elagage</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", columnGap: 10, paddingVertical: 10 }}>
          <TouchableOpacity
            style={styles.btn_excel}
            onPress={generateExcelMarecage}
          >
            <Text style={styles.text_btn}>Marécage</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.btn_excel}
          onPress={generateExcelDebroussaillage}>
            <Text style={styles.text_btn}>Debroussaillage</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e8449',
    marginVertical: 10,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#1e8449',
  },
  item_text: {
    fontSize: 16,
    color: '#fff',
  },
  item_anomalie: {
    backgroundColor: "#abebc6",
    height: 60,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  anomalie_label: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic"
  },
  anomalie_value: {
    fontSize: 16,
    color: '#c0392b',
    fontWeight: "bold"
  },
  btn_collect: {
    backgroundColor: "#1e8449",
    width: "45%",
    marginHorizontal: "auto",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 5,
    rowGap: 5,
    marginVertical: 5
  },
  btn_excel: {
    padding: 10,
    backgroundColor: "#1e8449",
    borderRadius: 5,
    elevation: 5,
    width: "40%"
  },
  text_btn: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  },
  collecte: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  }
})