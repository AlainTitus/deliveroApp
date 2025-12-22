import 'react-native-gesture-handler'
import 'react-native-get-random-values'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl, Alert, Dimensions, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { departs } from '../../../../datas/labels'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../../utils/supabase'
import { BarChart } from 'react-native-chart-kit';
import { nbrSupGIS, nbrSupDepart } from '../../../../utils/getSupabase';
import { nbreSupportDepart } from '../../../../utils/otherfunctions'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { useSupportStore } from '../../../../utils/store'
import { updateSupportState } from '../../../../utils/getSupabase'

import * as XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';

const LoadComponent = () => {
    return (
        <View style={{ justifyContent: "center", alignItems: "center", height: 80, marginBottom: 10 }}>
            <ActivityIndicator size={"large"} color={"#fff"} />
            <Text style={{ fontSize: 20, color: "white" }}>Chargement en cours...</Text>
        </View>

    )
}


const screenWidth = Dimensions.get("window").width;
const chartConfig = {
    backgroundGradientFrom: "#1a5276",
    backgroundGradientFromOpacity: 0.9,
    backgroundGradientTo: "#1a5276",
    backgroundGradientToOpacity: 1,
    color: (opacity = 0.2) => `#ebf5fb`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

const ItemDepart = ({ depart, nbr }) => {
    return (
        <View style={styles.itemDepart}>
            <Text style={styles.valueItem}> {depart} </Text>
            <Text style={styles.valueItem}> {nbr} </Text>
        </View>
    )
}


export default function Supports() {
    const [store, setStore] = useState([]);
    const [getData, setGetData] = useState([]);
    const [allDepart, setAllDepart] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadGraph, setLoadGraph] = useState(true);

    const supports = useSupportStore(state => state.supports);
    const load = useSupportStore(state => state.loading);
    const departCollected = useSupportStore(state => state.departCollected);


    const router = useRouter();
    const navigation = useNavigation()
    // const { user } = useAuth()

    const sumCollecte = nbreSupportDepart("D11 BERTOUA", supports) + nbreSupportDepart("D12 BERTOUA", supports) + nbreSupportDepart("D32 BELABO", supports) + nbreSupportDepart("D31 BATOURI", supports);

    const departss = ["D11 BERTOUA", "D12 BERTOUA", "D31 BATOURI", "D32 BELABO"];
    const hauteurSup = ["11 m", "12 m", "13 m", "14 m", "15 m"];
    const effortSup = ["300 daN", "500 daN", "800 daN", "1000 daN", "1250 daN", "1500 daN"];

    const onRefresh = () => {
        setRefresh(true)
        try {
            refresDisplay();
            updateSupportState()
            setRefresh(false);

        } catch (error) {
            setRefresh(false)
            Alert.alert('Erreur de chargement des données')
        }
    }

    const data = {
        labels: ["D11 BERTOUA", "D12 BERTOUA", "D32 BELABO", "D31 BATOURI"],
        datasets: [
            {
                data: [nbreSupportDepart("D11 BERTOUA", supports), nbreSupportDepart("D12 BERTOUA", supports), nbreSupportDepart("D32 BELABO", supports), nbreSupportDepart("D31 BATOURI", supports)]
            }
        ]
    };

    const goToMap = () => {
        router.navigate('/mapcollecte')
    }

    const refresDisplay = async () => {

        const listKeyStore = await AsyncStorage.getAllKeys();
        if (listKeyStore.includes("capture")) {
            let dataStored = await AsyncStorage.getItem("capture")
            dataStored = JSON.parse(dataStored)
            setStore([...dataStored])
        }
    }

    const loadToDatabase = async () => {
        setLoading(true)
        let nbr = store.length;
        const { data, error } = await supabase.from('supportCollected').insert([...store])
        if (error) {
            Alert.alert("Erreur de transfert de données")
            setLoading(false)
            return;
        }
        for (var i = 0; i < nbr; i++) {
            // const { data, error } = await supabase.from('supportCollected').insert([store[i]]).single()
            // if (error) {
            //     Alert.alert("Erreur lors de l'ajout des données")
            //     setLoading(false)
            //     return;
            // }
            let nbrUri = store[i].uri.length
            // console.log("store => ", store)
            // console.log('nbruri =>', nbrUri)
            let img = store[i].uri
            for (var j = 0; j < nbrUri; j++) {
                const base64 = await FileSystem.readAsStringAsync(img[j].uri, { encoding: 'base64' });
                const filePath = `${store[i].imglink}/${new Date().getTime()}.png`
                const contentType = 'image/png';
                await supabase.storage.from('image.supports').upload(filePath, decode(base64), { contentType });
            }
        }

        setStore([])
        await AsyncStorage.removeItem("capture")
        setLoading(false)
    }

    const handleStat = (val) => {
        navigation.navigate("statdepart", { key: val })
    }

    const handleDetails = (val) => {
        navigation.navigate("detailSupports", { key: val })
    }

    const newSupportFormPage = () => {
        router.push('/newSupport')
    }

    let dataExcel = (datas) => {
        if (datas.length == 0) {
            return []
        } else {
            let data = datas.map((item) => {
                return [
                    item.id,
                    item.structBois,
                    item.etatSup,
                    item.hauteurBois,
                    item.armemt,
                    item.nbrIso,
                    item.nbrChaine,
                    item.access,
                    item.structBeton,
                    item.force,
                    item.armBeton,
                    item.hauteurBeton,
                    item.observ,
                    item.latitude,
                    item.longitude,
                    item.vegetation,
                    item.depart,
                    item.imglink,
                    item.etat,
                ]
            })
            data.unshift(["ID", "structure_bois", "etat_bois", "hauteur_bois", "armement_bois", "nbr_iso_defect", "nbr_elemt_chaine_defect", "acces_camion", "struct_sup_beton", "effort", "armement_beton", "hauteur_beton", "observation", "latitude", "longitude", "vegetation", "depart", "imglink", "statut"]);
            return data;
        }

    }

    let excel = dataExcel(supports);

    const generateExcel = async () => {
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([
            ...excel
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
        refresDisplay()
    }, [])


    useEffect(() => {
        updateSupportState()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }
            >

                {/*** En-tête de la page avec detail par départ ***/}
                <View style={styles.headerBlock}>

                    <Text style={styles.title}>Supports par départs</Text>
                    <ScrollView
                        horizontal
                        style={styles.scrollbtn}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 3
                        }}
                    >
                        {
                            departs.map(dep => {
                                return (
                                    dep.label == "Choix d'un depart" ? null : (
                                        <TouchableOpacity
                                            key={dep.label}
                                            style={styles.btnTouch}
                                            onPress={() => handleStat(dep.label)}
                                        >
                                            <Text style={styles.textbtn}> {dep.value} </Text>
                                        </TouchableOpacity>
                                    )
                                )
                            })
                        }
                    </ScrollView>
                </View>

                {/*** Bouton pour accéder au GIS ou créer un support ***/}
                <View style={styles.options}>
                    <TouchableOpacity style={styles.btnoption} onPress={goToMap}>
                        <FontAwesome name="map-marker" size={36} color="white" />
                        <Text style={styles.labelBntOption}>Inspection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnoption} onPress={newSupportFormPage}>
                        <FontAwesome6 name="file-waveform" size={36} color="white" />
                        <Text style={styles.labelBntOption}>Création</Text>
                    </TouchableOpacity>
                </View>

                {/*** Stockage en local des captures réalisées ***/}
                <View style={styles.synchro}>
                    <View style={styles.titleIcone}>
                        <Text style={styles.labelIcone} >Captures à synchroniser</Text>
                        <TouchableOpacity onPress={refresDisplay}>
                            <Ionicons name="refresh-circle" size={40} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 5 }}>
                        {
                            loading == false && store.length === 0 ? (
                                <View>
                                    <Text style={{ color: "white", textAlign: 'center', fontSize: 16, fontStyle: 'italic' }}>
                                        Aucune collecte pour le moment!!!
                                    </Text>
                                </View>
                            ) : (
                                loading ? <LoadComponent /> :
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{
                                            gap: 8
                                        }
                                        }
                                    >
                                        {
                                            store.map((elm, index) => (
                                                <View style={{ elevation: 5 }} key={index}>
                                                    <Image source={elm.uri[0]} style={{ width: 150, height: 150 }} />
                                                    <Text
                                                        style={{
                                                            position: "absolute",
                                                            zIndex: 100,
                                                            bottom: 10,
                                                            left: 10,
                                                            backgroundColor: 'white',
                                                            textAlign: 'center',
                                                            borderRadius: 4,
                                                            padding: 3,
                                                            borderColor: '#1a5276',
                                                            borderWidth: 1
                                                        }}
                                                    >Nbr photos: {elm.uri.length} </Text>
                                                </View>
                                            ))
                                        }
                                    </ScrollView>
                            )
                        }
                        {
                            (loading == false && store.length !== 0) && (
                                <TouchableOpacity
                                    style={styles.addBtn}
                                    onPress={loadToDatabase}
                                >
                                    <AntDesign name="pluscircle" size={36} color="rgba(5, 163, 44, 0.9)" />
                                </TouchableOpacity>
                            )
                        }

                    </View>
                </View>

                {/*** Supports contenu dans le GIS local ****/}
                <View style={styles.containerStat}>
                    <View style={styles.titreGIS}>
                        <Text style={styles.textGIS}>Statistique du GIS poteaux</Text>
                        <MaterialCommunityIcons name="google-analytics" size={26} color="white" />
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.departStat}>
                            <ItemDepart depart={"D11 BERTOUA"} nbr={nbrSupDepart("D11 BERTOUA")} />
                            <ItemDepart depart={"D12 BERTOUA"} nbr={nbrSupDepart("D12 BERTOUA")} />
                            <ItemDepart depart={"D31 BATOURI"} nbr={nbrSupDepart("D31 BATOURI")} />
                            <ItemDepart depart={"D32 BELABO"} nbr={nbrSupDepart("D32 BELABO")} />
                        </View>
                        <View style={styles.StatGlobal}>
                            <Text style={styles.valueGlobal}> {nbrSupGIS} </Text>
                            <Text style={{ color: 'white' }}>supports</Text>
                        </View>
                    </View>
                </View>

                {/*** Histogramme des supports par départ ***/}
                <View style={{ marginTop: 10, paddingVertical: 5 }}>
                    <View style={styles.titreGIS}>
                        <Text style={styles.textGIS}>Statistiques sur les collectes - {sumCollecte} </Text>
                        <Fontisto name="mobile-alt" size={24} color="white" />
                    </View>

                    <BarChart
                        data={data}
                        width={screenWidth}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={10}
                        fromZero
                        showBarTops={true}
                        showValuesOnTopOfBars={true}
                    />
                </View>

                {/*** Visualiser les statistiques par départ ***/}
                <View style={{ marginTop: 10, paddingVertical: 5 }}>
                    <View style={styles.titreGIS}>
                        <Text style={styles.textGIS}>Details par départ </Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            gap: 8,
                            padding: 4
                        }}
                    >
                        {departCollected && (
                            <>
                                {departCollected.map((elm, index) => (
                                    <TouchableOpacity style={styles.detailsDepart} key={index} onPress={() => handleDetails(elm)}>
                                        <Text style={{ color: "white" }}> {elm} </Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}
                    </ScrollView>
                </View>
                <View>
                    <View style={styles.titreGIS}>
                        <Text style={styles.textGIS}>Exporter toutes les données </Text>
                    </View>
                    <View  style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
                        {
                            supports.length === 0 ? (
                                <TouchableOpacity style={{ backgroundColor: "#cacfd2", padding: 8, borderRadius: 5 }}>
                                    <Text style={{ color: "white", fontSize: 17 }}>
                                        Exporter vers excel
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={{ backgroundColor: "#1a5276", padding: 8, borderRadius: 5 }}
                                    onPress={generateExcel}
                                >
                                    <Text style={{ color: "white", fontSize: 17 }}>
                                        Exporter vers excel
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
        </View>

    )
}




const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        backgroundColor: "rgba(214, 243, 255, 0.5)",
        flex: 1,
        paddingBottom: 10
    },
    headerBlock: {
        paddingHorizontal: 3,
        backgroundColor: "#1a5276",
        paddingTop: 5,
        paddingBottom: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 8
    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: "white"
    },
    btnTouch: {
        padding: 4,
        backgroundColor: '#cacfd2',
        margin: 3,
        borderRadius: 5,
        elevation: 5
    },
    scrollbtn: {
        marginVertical: 10
    },
    textbtn: {
        fontWeight: 'semibold',
        textAlign: 'center',
        fontSize: 16
    },
    title: {
        fontSize: 18,
        fontWeight: 'semibold',
        marginTop: 15,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#85929e",
        color: "white"
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
        backgroundColor: "#1a5276",
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    labelBntOption: {
        color: 'white'
    },
    titleIcone: {
        borderBottomWidth: 1,
        borderBottomColor: "#85929e",
        paddingBottom: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    labelIcone: {
        color: "white",
        fontSize: 18,
        fontWeight: 'semibold',
    },
    addBtn: {
        position: 'absolute',
        zIndex: 200,
        right: 6,
        bottom: 10
    },
    synchro: {
        backgroundColor: "#1a5276",
        paddingBottom: 8,
        paddingHorizontal: 8,
        elevation: 8
    },
    titreGIS: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: "#1a5276",
    },
    containerStat: {
        marginTop: 10
    },
    textGIS: {
        color: 'white',
        fontSize: 18
    },
    statCard: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#138d75",
        paddingVertical: 5
    },
    departStat: {
        width: "60%",
        padding: 5,
        borderRightWidth: 2,
        borderRightColor: "white"
    },
    StatGlobal: {
        width: "39%",
        padding: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    itemDepart: {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    valueItem: {
        color: "white"
    },
    valueGlobal: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 24
    },
    detailsDepart: {
        padding: 8,
        backgroundColor: "#1a5276",
        borderRadius: 5,
    },
    lottie: {
        width: 100,
        height: 100
    }
})