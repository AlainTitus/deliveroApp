import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../../components/CustomButton'
import CustomInput from '../../../components/CustomInput'
import CustomSelect from '../../../components/CustomSelect'
import Loader from '../../../components/Loader'
import { puissanceTransfo, typeTransfo, departs, typeSupport, protectMT, protectBT } from '../../../datas/labels'
import Message from '../../../components/Message'
import { getDocs, query, collection, where, addDoc } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'

export default function AddTransfo() {
    const [posteInput, setPosteInput] = useState(true)
    const [activeInput, setActiveInput] = useState(false)
    const [infos, setInfos] = useState(true)
    const [selectDepart, setSelectDepart] = useState('')
    const [selectPoste, setSelectPoste] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [xfoCrame, setXfoCrame] = useState('')
    const [parafoudre, setParafoudre] = useState(0)
    const [circuit, setCircuit] = useState(0);
    const [protections, setProtections] = useState('')
    const [newTransfo, setNewTransfo] = useState({})
    const [activeBtn, setActiveBtn] = useState(true)

    const loading = (data) => {
        setIsLoading(true)
        setSelectDepart(data)
    }

    const posteDepart = async () => {

        const q = query(collection(db, 'transfos'), where("depart", '==', selectDepart));
        const querySnapshot = await getDocs(q)
        const resultat = [];
        querySnapshot.forEach(doc => {
            resultat.push({
                id: doc.id,
                label: doc.data()['nom'],
                value: doc.data()['nom'],
                ...doc.data()
            })
        })
        setIsLoading(false)
        setSelectPoste([...resultat])
    }

    const handleAddXfo = async () => {
        if(newTransfo){
            const docRef = await addDoc(collection(db, 'xfocrame'), newTransfo)
            setActiveBtn(false)
        }
    }

    useEffect(() => {

        if (selectDepart == "Choix d'un depart" || selectDepart == "") {
            console.log('Vous n avez pas choisi de départ!')
            setActiveInput(false)
            setIsLoading(false)
        } else {
            setActiveInput(true)
            posteDepart()
        }

    }, [selectDepart])

    useEffect(() => {
        const transfo = selectPoste.find(elm => elm.nom == xfoCrame)
        console.log("transfo: ", transfo)
        if (transfo == undefined) {

        } else {
            const update = {
                code: transfo["code"],
                depart: transfo["depart"],
                id: transfo["id"],
                latitude: transfo["latitude"],
                longitude: transfo["longitude"],
                nom: transfo["nom"],
                phase: transfo["phase"],
                puissance: transfo["puissance"],
                regime: transfo["regime"],
                tension: transfo["tension"],
                type: transfo["type"],
                parafoudre,
                circuit,
                protections
            }
            setNewTransfo({...update})
        }

    }, [xfoCrame, parafoudre, circuit, protections])
    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>Enregistrer transfo cramé</Text>
            <CustomSelect label='Depart' datas={departs} handleLoading={(value) => loading(value)} />
            {!activeInput && <Message />}
            {isLoading && <Loader />}

            {
                activeInput && !isLoading && (
                    <>
                        <ScrollView style={styles.scrolls} showsVerticalScrollIndicator={false}>
                            <CustomSelect label='Postes' datas={selectPoste} handleLoading={setXfoCrame} />
                            <CustomSelect label='Parafoudres defectueux' datas={protectMT} second='second' handleSelect={setParafoudre} />
                            <CustomSelect label='CC defectueux' datas={protectMT} second='second' handleSelect={setCircuit} />
                            <CustomSelect label='Protection BT' datas={protectBT} second='second' handleSelect={setProtections} />
                            { activeBtn && <CustomButton titre='Ajout transfo cramé' onPress = {handleAddXfo} color='#2e86c1' />}
                            { !activeBtn && <CustomButton titre='Ajout transfo cramé'  color='#bdc3c7' />}
                        </ScrollView>
                    </>
                )
            }

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