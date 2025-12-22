import { View, Text, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native'
import CustomInput from '../../../../components/CustomInput';
import CustomSelect from '../../../../components/CustomSelect';
import { departs } from '../../../../datas/labels'
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function Debroussaillage() {
  const [depart, setDepart] = useState(null)
  const [zone, setZone] = useState(null)
  const [base, setBase] = useState(null)
  const [observations, setObservations] = useState(null)

  const navigation = useNavigation()
  const params = useLocalSearchParams()

  const showToast = () => {
    ToastAndroid.show("Sauvegarde en local avec succès", ToastAndroid.SHORT);
  }

  const SaveInStore = async () => {

    if (depart == null || depart == "Choix d'un depart" || depart == "") {
      alert("Veuillez choisir un depart")
      return
    } else {
      const toSave = { depart, longueur: base, zone, observations, latitude: params.lat, longitude: params.long }

      const listKeyStore = await AsyncStorage.getAllKeys();

      if (listKeyStore.includes("debroussaillage")) {
        const dataStored = await AsyncStorage.getItem('debroussaillage')
        let dataTransform = JSON.parse(dataStored)
        dataTransform.push(toSave)
        await AsyncStorage.removeItem('debroussaillage')
        await AsyncStorage.setItem('debroussaillage', JSON.stringify(dataTransform))
      } else {
        const firstData = [toSave]
        await AsyncStorage.setItem('debroussaillage', JSON.stringify(firstData))
      }
      showToast();
      navigation.goBack();
    }
  }


  return (
    <View style={{ flex: 1, paddingHorizontal: 8 }}>
      <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, color: "#1e8449", marginVertical: 10 }}>Quantités à élaguer</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: 10,
          rowGap: 10
        }}
      >
        <CustomSelect
          label="Depart MT"
          datas={departs}
          placeholder="Choix d'un depart"
          handleSelect={setDepart}
          labelColor='#1e8449'
          second='second'
        />
        <CustomInput
          label="Nom zone départ"
          placeholder={"."}
          labelColor="#1e8449"
          handleInput={setZone}
          val
        />
        <CustomInput
          label="Longueur du débroussaillage en km"
          placeholder={"."}
          labelColor="#1e8449"
          handleInput={setBase}
          type={"numeric"}
          val
        />

        <CustomInput
          label="Observations"
          placeholder={"..."}
          h={80}
          multiline={true}
          number={5}
          labelColor="#1e8449"
          handleInput={setObservations}
          val
        />
        <View style={{
          justifyContent: "center",
          alignItems: "center"
        }}>
          <TouchableOpacity
            style={{ width: "60%", backgroundColor: "#1e8449", justifyContent: "center", alignItems: 'center', padding: 15, borderRadius: 5, elevation: 5 }}
            onPress={SaveInStore}
          >
            <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: 'bold' }}>Valider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}