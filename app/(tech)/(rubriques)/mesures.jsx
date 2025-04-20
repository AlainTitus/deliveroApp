import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import CustomButton from '../../../components/CustomButton'
import CustomInput from '../../../components/CustomInput'
import CustomSelect from '../../../components/CustomSelect'
import { puissanceTransfo, typeTransfo, departs, typeSupport, protectMT, protectBT } from '../../../datas/labels'

export default function AddTransfo() {
    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>Enregistrer transfo cramé</Text>
            <ScrollView style={styles.scrolls} showsVerticalScrollIndicator={false}>
                <CustomSelect label='Depart' datas={departs} />
                <CustomInput label="Nom poste" placeholder='Mere poule' />
                <CustomInput label="I neutre" placeholder='0' type='numeric' />
                <CustomInput label="I phase 1" placeholder='0' type='numeric' />
                <CustomInput label="I phase 2" placeholder='0' type='numeric' />
                <CustomInput label="I phase 3" placeholder='0' type='numeric' />
                <CustomInput label="U1" placeholder='0' type='numeric' />
                <CustomInput label="U2" placeholder='0' type='numeric' />
                <CustomInput label="U3" placeholder='0' type='numeric' />
                <CustomInput label="fin réseau U1" placeholder='0' type='numeric' />
                <CustomInput label="Fin réseau U2" placeholder='0' type='numeric' />
                <CustomInput label="Fin réseau U3" placeholder='0' type='numeric' />
                <CustomButton titre='Take position' />
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