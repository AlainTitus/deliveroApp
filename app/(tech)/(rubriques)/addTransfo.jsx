import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import CustomButton from '../../../components/CustomButton'
import CustomInput from '../../../components/CustomInput'
import CustomSelect from '../../../components/CustomSelect'
import { puissanceTransfo, typeTransfo, departs, typeSupport, protectMT, protectBT } from '../../../datas/labels'
import { db } from '../../../firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import postes from '../../../datas/postes.json'

export default function AddTransfo() {
    const listePostes = postes['dre']
    const nbrPoste = listePostes.length;

    const addTransfo = async () => {
        for (let i = 0; i < nbrPoste; i++) {
            const docRef = await addDoc(collection(db, "transfos"), listePostes[i])
        }}
        
    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>Ajouter un transfo</Text>
            <ScrollView style={styles.scrolls} showsVerticalScrollIndicator={false}>
                <CustomSelect label='Depart' datas={departs} />
                <CustomInput label="Nom poste" placeholder='Mere poule' />
                <CustomSelect label='Puissance' datas={puissanceTransfo} />
                <CustomSelect label='Type transfo' datas={typeTransfo} />
                <CustomSelect label='Type support' datas={typeSupport} />
                <CustomSelect label='Parafoudres defectueux' datas={protectMT} />
                <CustomSelect label='CC defectueux' datas={protectMT} />
                <CustomSelect label='Protection BT' datas={protectBT} />
                <CustomButton titre='Take position'  />
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        rowGap: 8
    },
    scrolls: {
        flex: 1,
    },
    textHeader: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    input: {
        height: 40,
        padding: 10,
        borderWidth: 1
    },
    label: {
        fontSize: 16,
        fontWeight: '500'
    },
    inputView: {
        marginVertical: 6
    }
})