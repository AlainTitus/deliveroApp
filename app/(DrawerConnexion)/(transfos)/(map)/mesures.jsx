import { View, Text, StyleSheet, ScrollView, Button, Alert, ToastAndroid } from 'react-native'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import CustomInput from "../../../../components/CustomInput"
import { useState } from 'react';
import { supabase } from '../../../../utils/supabase';

export default function Mesures() {

    const [i1, setI1] = useState("")
    const [i2, setI2] = useState("")
    const [i3, setI3] = useState("")
    const [ineutre, setIneutre] = useState("")

    const { id, nom, puissance, type } = useLocalSearchParams();
    const navigation = useNavigation();

    const showToast = () => {
        ToastAndroid.show('Mesures mises à jour avec succès', ToastAndroid.SHORT, ToastAndroid.CENTER);
    }

    const maxIntensite = Math.max(parseInt(i1), parseInt(i2), parseInt(i3))
    const moyIntensite = ((parseInt(i1) + parseInt(i2) + parseInt(i3))/3).toFixed(2)

    const handleUpdate = async () => {
        const { error } = await supabase
            .from('transformateurs')
            .update({ 
                in: parseInt(ineutre),
                i1: parseInt(i1),
                i2: parseInt(i2),
                i3: parseInt(i3),
                charge: ((220 * 100 * (parseInt(i1) + parseInt(i2) + parseInt(i3)) / 1000)/puissance).toFixed(2),
                desequilibre: type === "Monophase" ? 0 : ((maxIntensite - moyIntensite)*100/moyIntensite).toFixed(2)
            })
            .eq('id', id)
            showToast()
            navigation.goBack()

        if (error) {
            Alert.alert("Erreur de mise à jour")
        }

    
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header} >
                    <Text style={styles.titre}>
                        Mesures de {nom}
                    </Text>
                </View>
                <View>
                    <CustomInput
                        label="Intensité 1"
                        placeholder="0"
                        type="numeric"
                        number={1}
                        multiline={false}
                        h={50}
                        labelColor='#1f618d'
                        handleInput={setI1}
                        val />

                    <CustomInput
                        label="Intensité 2"
                        placeholder="0"
                        type="numeric"
                        number={1}
                        multiline={false}
                        h={50}
                        labelColor='#1f618d'
                        handleInput={setI2}
                        val />

                    <CustomInput
                        label="Intensité 3"
                        placeholder="0"
                        type="numeric"
                        number={1}
                        multiline={false}
                        h={50}
                        labelColor='#1f618d'
                        handleInput={setI3}
                        val />

                    <CustomInput
                        label="Intensité neutre"
                        placeholder="0"
                        type="numeric"
                        number={1}
                        multiline={false}
                        h={50}
                        labelColor='#1f618d'
                        handleInput={setIneutre}
                        val />
                </View>
                {
                    (i1 === "" || i2 === "" || i3 === "" || ineutre === "") ? (
                        <View style={styles.containBtn}>
                            <View style={styles.btn}>
                                <Button title='Valider' onPress={handleUpdate} disabled />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.containBtn}>
                            <View style={styles.btn}>
                                <Button title='Valider' onPress={handleUpdate} />
                            </View>
                        </View>
                    )
                }

            </ScrollView >
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 5
    },
    header: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    titre: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    containBtn: {
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 20
    },
    btn: {
        width: "80%"
    }
})