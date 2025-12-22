import { View, Text, ScrollView, Button, StyleSheet, ToastAndroid, Alert } from 'react-native'
import CustomSelect from '../../../../components/CustomSelect';
import CustomInput from '../../../../components/CustomInput';
import { departs, type_iacm, type_support_iacm, malt_iacm, defectuosite_iacm, iacm_operationnel } from '../../../../datas/labels'
import { useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function FormNouvIacm() {
  const [name, setName] = useState("");
  const [depart, setDepart] = useState(null);
  const [type, setType] = useState("");
  const [support, setSupport] = useState("");
  const [malt, setMalt] = useState("");
  const [anomalie, setAnomalie] = useState("");
  const [fontionnel, setFontionnel] = useState("");
  const [observations, setObservations] = useState("");

  const { latitude, longitude } = useLocalSearchParams();
  const navigation = useNavigation();
  const showToast = () => {
    ToastAndroid.show("Sauvegarde en local avec succès", ToastAndroid.SHORT);
  }

  const handleSave = async () => {
 
    if (name === "") {
      Alert.alert("Donnez le nom de l'IACM");
      return
    }
    if (depart === null || depart === "" || depart === "Choix d'un depart") {
      Alert.alert("Selectionner le départ du poste");
      return
    }
    if (type === "") {
      Alert.alert("Selectionner le type de l'IACM");
      return
    }
    if (support === "") {
      Alert.alert("Selectionner le type de support");
      return
    }
    if (malt === "") {
      Alert.alert("Selectionner l'état de la mise à la terre");
      return
    }
    if (anomalie === "") {
      Alert.alert("Selectionner l'état de la défectuosité");
      return
    }
    if (fontionnel === "") {
      Alert.alert("Selectionner l'état de fonctionnement");
      return
    }
  

    const toSave = {
      depart: depart,
      type: type,
      support: support,
      malt: malt,
      anomalie: anomalie,
      fonctionnel: fontionnel,
      observation: observations,
      latitude: latitude,
      longitude: longitude,
      action: "creation",
      url: '',
      nom: name,
      nature: 'iacm'
    }

    const listKeyStore = await AsyncStorage.getAllKeys();
    console.log("listKeyStore", listKeyStore)
    if (listKeyStore.includes("iacm")) {
      const dataStored = await AsyncStorage.getItem('iacm')
      let dataTransform = JSON.parse(dataStored)
      dataTransform.push(toSave)
      await AsyncStorage.removeItem('iacm')
      await AsyncStorage.setItem('iacm', JSON.stringify(dataTransform))
    } else {
      const firstData = [toSave]
      await AsyncStorage.setItem('iacm', JSON.stringify(firstData))
    }
    console.log("saved")
    showToast();
    navigation.goBack();

  }


  return (
    <View>
      <ScrollView
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ textAlign: 'center', fontSize: 20, color: '#873600', fontWeight: 'bold', marginBottom: 10 }}>Création d'un IACM</Text>
        <CustomInput
          label="Nom del'IACM"
          val={name}
          handleInput={setName}
          labelColor="#873600"
        />
        <CustomSelect
          label="Depart MT"
          datas={departs}
          placeholder="Choix d'un depart"
          handleSelect={setDepart}
          labelColor='#873600'
          second='second'
        />
        <CustomSelect
          label="Type IACM"
          datas={type_iacm}
          placeholder="Choix d'un type"
          handleSelect={setType}
          labelColor='#873600'
          second='second'
        />
        <CustomSelect
          label="Type support"
          datas={type_support_iacm}
          placeholder="Choix du support"
          handleSelect={setSupport}
          labelColor='#873600'
          second='second'
        />
        <CustomSelect
          label="Mise à la terre"
          datas={malt_iacm}
          placeholder="Etat MALT"
          handleSelect={setMalt}
          labelColor='#873600'
          second='second'
        />
        <CustomSelect
          label="Défectuosité"
          datas={defectuosite_iacm}
          placeholder="Etat de la défectuosité"
          handleSelect={setAnomalie}
          labelColor='#873600'
          second='second'
        />
        <CustomSelect
          label="Fonctionnement"
          datas={iacm_operationnel}
          placeholder="Etat de l'IACM"
          handleSelect={setFontionnel}
          labelColor='#873600'
          second='second'
        />
        <CustomInput
          label="Observations"
          placeholder={"..."}
          h={80}
          multiline={true}
          number={5}
          labelColor="#873600"
          handleInput={setObservations}
          val
        />
        <View style={styles.viewBtn}>
          <View style={{ width: "80%" }}>
            <Button title='Valider' color={"#873600"} onPress={handleSave} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewBtn: {
    marginTop: 8,
    marginBottom: 15,
    alignItems: 'center'
  }
})