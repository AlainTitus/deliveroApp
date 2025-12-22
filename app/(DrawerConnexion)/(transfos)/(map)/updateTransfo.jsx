import { View, StyleSheet, ScrollView, Button, Alert, ToastAndroid } from 'react-native'
import CustomSelect from '../../../../components/CustomSelect';
import CustomInput from '../../../../components/CustomInput';
import { departs, typeTransfo, puissanceTransfo, typeSupport, protectionBT, liasonTransfo, etatLiaisonBT, etatProtectionBT, etatMALT } from '../../../../datas/labels';
import { useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateTransfo() {
    const [depart, setdepart] = useState(null)
    const [typeXfo, setTypeXfo] = useState(null)
    const [puissance, setPuissance] = useState(null)
    const [supportPoste, setSupportPoste] = useState(null);
    const [protectBT, setProtectBT] = useState(null)
    const [liaison, setLiaison] = useState(null)
    const [etatLiaison, setEtatLiaison] = useState(null)
    const [etatProtectBT, setEtatProtectBT] = useState(null)
    const [malt, setMalt] = useState(null);
    const [nbrParafoudre, setNbrParafoudre] = useState("")
    const [nbrCoupeCircuit, setNbrCoupeCircuit] = useState("")
    const [nbrDepart, setNbrDepart] = useState("")
    const [nbrSupAdjac, setNbrSupAdjac] = useState("")
    const [nbrMaltAdjac, setNbrMaltAdjac] = useState("")
    const [observation, setObservation] = useState("")
    const [nbrFinReseau, setNbrFinReseau] = useState("")

    const { id, latitude, longitude, nom } = useLocalSearchParams();
    const navigation = useNavigation();

    const showToast = () => {
        ToastAndroid.show("Données sauvegardées avec succès", ToastAndroid.SHORT);
    }

    const handleSave = async () => {

        if (depart === null || depart === "" || depart === "Choix d'un depart") {
            Alert.alert("Selectionner le départ du poste");
            return
        }

        if (typeXfo === null || typeXfo === "" || typeXfo === "Choix d'un depart") {
            Alert.alert('Selectionner le type du transfo');
            return
        }

        if (supportPoste === null || supportPoste === "" || supportPoste === "Choix d'un depart") {
            Alert.alert("Selectionner le type de support");
            return
        }

        if (puissance === null || puissance === "" || puissance === "Choix d'un depart") {
            Alert.alert("Selectionner la puissance du poste");
            return
        }

        if (liaison === null || liaison === "" || liaison === "Choix d'un depart") {
            Alert.alert("Selectionner la section de la liaison");
            return
        }

        if (etatLiaison === null || etatLiaison === "" || etatLiaison === "Choix d'un depart") {
            Alert.alert("Selectionner l'état de la liaison");
            return
        }

        if (protectBT === null || protectBT === "" || protectBT === "Choix d'un depart") {
            Alert.alert("Selectionner la protection BT");
            return
        }

        if (etatProtectBT === null || etatProtectBT === "" || etatProtectBT === "Choix d'un depart") {
            Alert.alert("Selectionner l'etat de la protection BT");
            return
        }

        if (malt === null || malt === "" || malt === "Choix d'un depart") {
            Alert.alert("Selectionner l'etat de la MALT");
            return
        }

        if (nbrParafoudre === null || nbrParafoudre === "" || nbrParafoudre === "Choix d'un depart") {
            Alert.alert("Donner le nombre de parafoudre defectueux");
            return
        }

        if (nbrCoupeCircuit === null || nbrCoupeCircuit === "" || nbrCoupeCircuit === "Choix d'un depart") {
            Alert.alert("Donner le nombre de coupe circuit defectueux");
            return
        }

        if (nbrDepart === null || nbrDepart === "" || nbrDepart === "Choix d'un depart") {
            Alert.alert("Donner le nombre de départs BT");
            return
        }

        if (nbrSupAdjac === null || nbrSupAdjac === "" || nbrSupAdjac === "Choix d'un depart") {
            Alert.alert("Donner le nombre de support BT adjacent");
            return
        }

        if (nbrMaltAdjac === null || nbrMaltAdjac === "" || nbrMaltAdjac === "Choix d'un depart") {
            Alert.alert("Donner le nombre de MALT adjacent");
            return
        }
        if (nbrFinReseau === null || nbrFinReseau === "" || nbrFinReseau === "Choix d'un depart") {
            Alert.alert("Donner le nombre de Fin de réseau");
            return
        }

        const toSave = {
            id: id,
            depart: depart,
            type: typeXfo,
            support: supportPoste,
            puissance: puissance,
            section: liaison,
            etatliaison: etatLiaison,
            protectbt: protectBT,
            etatprotect: etatProtectBT,
            malt: malt,
            parafoudre: parseInt(nbrParafoudre) || 0,
            coupecircuit: parseInt(nbrCoupeCircuit) || 0,
            nbr_depart: parseInt(nbrDepart) || 0,
            nbrSupAdjac: parseInt(nbrSupAdjac) || 0,
            nbrMaltAdjc: parseInt(nbrMaltAdjac) || 0,
            observation: observation,
            latitude: latitude,
            longitude: longitude,
            nom: nom,
            finReseau: parseInt(nbrFinReseau) || 0
        }


        /****************************** Stockage en local **********************/
        const listKeyStore = await AsyncStorage.getAllKeys();

        if (listKeyStore.includes("transformateurUpdate")) {
            const dataStored = await AsyncStorage.getItem('transformateurUpdate')
            let dataTransform = JSON.parse(dataStored)
            dataTransform.push(toSave)
            await AsyncStorage.removeItem('transformateurUpdate')
            await AsyncStorage.setItem('transformateurUpdate', JSON.stringify(dataTransform))
            // console.log('Données sauvegardées = ', dataTransform)
           showToast()
            navigation.goBack()
        } else {
            const firstData = [toSave]
            await AsyncStorage.setItem('transformateurUpdate', JSON.stringify(firstData))
            // console.log('Premier enregistrement avec succès = ', firstData)
           showToast()
            navigation.goBack()
        }
        
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 8,
                }}
            >

                <CustomSelect
                    label='Depart'
                    datas={departs}
                    second='second'
                    handleSelect={setdepart}
                    labelColor='#1f618d'
                />
                <CustomSelect
                    label='Type'
                    datas={typeTransfo}
                    second='second'
                    handleSelect={setTypeXfo}
                    labelColor='#1f618d'
                />
                <CustomSelect
                    label='Support poste'
                    datas={typeSupport}
                    second='second'
                    handleSelect={setSupportPoste}
                    labelColor='#1f618d'
                />
                <CustomSelect
                    label='Puissance'
                    datas={puissanceTransfo}
                    second='second'
                    handleSelect={setPuissance}
                    labelColor='#1f618d'
                />
                <CustomSelect
                    label='Section liasison'
                    datas={liasonTransfo}
                    second='second'
                    handleSelect={setLiaison}
                    labelColor='#1f618d'
                />
                <CustomSelect
                    label='Etat liasison'
                    datas={etatLiaisonBT}
                    second='second'
                    handleSelect={setEtatLiaison}
                    labelColor='#1f618d'
                />
                <CustomSelect
                    label='Protection BT'
                    datas={protectionBT}
                    second='second'
                    handleSelect={setProtectBT}
                    labelColor='#1f618d'
                />
                <CustomSelect
                    label='Etat Protection BT'
                    datas={etatProtectionBT}
                    second='second'
                    handleSelect={setEtatProtectBT}
                    labelColor='#1f618d'
                />
                <CustomSelect
                    label='Mise à la terre'
                    datas={etatMALT}
                    second='second'
                    handleSelect={setMalt}
                    labelColor='#1f618d'
                />
                <CustomInput
                    label="Nbr parafoudre defectueux"
                    placeholder={"0"}
                    type='numeric'
                    h={50}
                    labelColor="#1f618d"
                    handleInput={setNbrParafoudre}
                    val
                />
                <CustomInput
                    label="Nbr CC defectueux"
                    placeholder={"0"}
                    type='numeric'
                    h={50}
                    labelColor="#1f618d"
                    handleInput={setNbrCoupeCircuit}
                    val
                />
                <CustomInput
                    label="Nbr Depart BT"
                    placeholder={"0"}
                    type='numeric'
                    h={50}
                    labelColor="#1f618d"
                    handleInput={setNbrDepart}
                    val
                />
                <CustomInput
                    label="Nbr Sup Adjacent"
                    placeholder={"0"}
                    type='numeric'
                    h={50}
                    labelColor="#1f618d"
                    handleInput={setNbrSupAdjac}
                    val
                />
                <CustomInput
                    label="Nbr MALT Adjacent defectueux"
                    placeholder={"0"}
                    type='numeric'
                    h={50}
                    labelColor="#1f618d"
                    handleInput={setNbrMaltAdjac}
                    val
                />
                <CustomInput
                    label="Nbr Fin de réseau"
                    placeholder={"0"}
                    type='numeric'
                    h={50}
                    labelColor="#1f618d"
                    handleInput={setNbrFinReseau}
                    val
                />
                <CustomInput
                    label="Observations"
                    placeholder={"..."}
                    h={80}
                    multiline={true}
                    number={5}
                    labelColor="#1f618d"
                    handleInput={setObservation}
                    val
                />

                <View style={styles.viewBtn}>
                    <View style={{ width: "80%" }}>
                        <Button title='Valider' color={"#1f618d"} onPress={handleSave} />
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