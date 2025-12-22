import { View, Text, ScrollView, Button, StyleSheet, ToastAndroid, Alert } from 'react-native'
import CustomSelect from '../../../../components/CustomSelect';
import CustomInput from '../../../../components/CustomInput';
import { departs, etat_ocr, groupe_ocr, type_ocr, connecteur_ocr } from '../../../../datas/labels'
import { useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function FormNouvCoupeCircuit() {
    const [depart, setdepart] = useState(null);
    const [etat, setEtat] = useState('');
    const [groupe, setGroupe] = useState("");
    const [type, setType] = useState("");
    const [connecteur, setConnecteur] = useState("");
    const [nbrCoupeCircuit, setNbrCoupeCircuit] = useState("");
    const [observations, setObservations] = useState("");
    const [name, setName] = useState("");

    const { latitude, longitude } = useLocalSearchParams();
    const navigation = useNavigation();
    const showToast = () => {
        ToastAndroid.show("Sauvegarde en local avec succès", ToastAndroid.SHORT);
    }

    const handleSave = async () => {
        console.log("debut")

        if (name === null || name === "") {
            Alert.alert("Donnez le nom du coupe circuit");
            return
        }
        if (depart === null || depart === "" || depart === "Choix d'un depart") {
            Alert.alert("Selectionner le départ du poste");
            return
        }
        if (type === "") {
            Alert.alert("Selectionner le type de ligne");
            return
        }
        if (etat === "") {
            Alert.alert("Selectionner l'état du coupe circuit");
            return
        }
        if (groupe === "") {
            Alert.alert("Selectionner le groupe du coupe circuit");
            return
        }
        if (nbrCoupeCircuit === "") {
            Alert.alert("Selectionner le nombre de coupe circuit");
            return
        }
        if (connecteur === "") {
            Alert.alert("Selectionner le connecteur");
            return
        }
        if (observations === "") {
            Alert.alert("Faire une observation");
            return
        }
        console.log("fin if")

        const toSave = {
            depart: depart,
            groupe: groupe,
            type: type,
            etat: etat,
            nbr_defec: parseInt(nbrCoupeCircuit),
            connecteur: connecteur,
            observation: observations,
            action: "creation",
            url: '',
            latitude: latitude,
            longitude: longitude,
            nom: name,
            nature: "coupe_circuit"
        }
        console.log("save", toSave)
        const listKeyStore = await AsyncStorage.getAllKeys();
        console.log("list key", listKeyStore)

        if (listKeyStore.includes("coupe_circuit")) {
            const dataStored = await AsyncStorage.getItem('coupe_circuit')
            let dataTransform = JSON.parse(dataStored)
            dataTransform.push(toSave)
            await AsyncStorage.removeItem('coupe_circuit')
            await AsyncStorage.setItem('coupe_circuit', JSON.stringify(dataTransform))
        } else {
            const firstData = [toSave]
            await AsyncStorage.setItem('coupe_circuit', JSON.stringify(firstData))
        }
        navigation.goBack();
        showToast();

    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ padding: 10 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={{ textAlign: 'center', fontSize: 20, color: '#873600', fontWeight: 'bold', marginBottom: 10 }}>Création d'un coupe circuit</Text>
                <CustomInput
                    label="Nom du coupe circuit"
                    val={name}
                    handleInput={setName}
                    labelColor="#873600"
                />
                <CustomSelect
                    label="Depart MT"
                    datas={departs}
                    placeholder="Choix d'un depart"
                    handleSelect={setdepart}
                    labelColor='#873600'
                    second='second'
                />
                <CustomSelect
                    label="Groupe"
                    datas={groupe_ocr}
                    placeholder="Choix du groupe"
                    handleSelect={setGroupe}
                    labelColor='#873600'
                    second='second'
                />
                <CustomSelect
                    label="Type réseau"
                    datas={type_ocr}
                    placeholder="Choix du type"
                    handleSelect={setType}
                    labelColor='#873600'
                    second='second'
                />
                <CustomSelect
                    label="Etat du coupe circuit"
                    datas={etat_ocr}
                    placeholder="Choix de l'état"
                    handleSelect={setEtat}
                    labelColor='#873600'
                    second='second'
                />

                <CustomInput
                    label="Nbr coupe circuit defectueux"
                    value={nbrCoupeCircuit}
                    handleInput={setNbrCoupeCircuit}
                    labelColor="#873600"
                    type='numeric'
                />
                <CustomSelect
                    label="Connecteurs"
                    datas={connecteur_ocr}
                    placeholder="Choix des connecteurs"
                    handleSelect={setConnecteur}
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