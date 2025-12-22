import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import LineTable from '../../../../components/LineTable';
import HeaderTable from '../../../../components/HeaderTable';
import LoadingGraph from '../../../../components/LoadingGraph';
import LoadingLine from '../../../../components/LoadingLine';
import { getDetailStat, sumSupport, sumParHauteur, nbrCollectDepart, nbrCollectEtatDepart } from '../../../../utils/getSupabase';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSupportStore } from '../../../../utils/store';


const screenWidth = Dimensions.get("window").width;
const chartConfig = {
    backgroundGradientFrom: "#ca13f2",
    backgroundGradientFromOpacity: 0.4,
    backgroundGradientTo: "#ca13f2",
    backgroundGradientToOpacity: 0.4,
    color: (opacity = 0.1) => `rgba(255, 255, 255, 1)`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.8,
    useShadowColorFromDataset: false // optional
};

const chartConfigCircle = {
    backgroundGradientFrom: "#eacbeb",
    backgroundGradientFromOpacity: 0.4,
    backgroundGradientTo: "#eacbeb",
    backgroundGradientToOpacity: 0.4,
    color: () => `rgba(245, 28, 3, 0.2)`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

export default function Statdepart() {
    const [selectEffort, setSelectEffort] = useState({
        '300': true,
        "500": false,
        "800": false,
        "1000": false,
        "1250": false,
        "1500": false
    })

    const [filtre, setFiltre] = useState([])
    const [nbrSup, setNbrSup] = useState(0)
    const [dataGraph, setDataGraph] = useState([])
    const [errorGraph, setErrorGraph] = useState(false)
    const [loadingraph, setLoadingraph] = useState(false)
    const [loadingLine, setLoadingLine] = useState(false)


    const supports = useSupportStore(state => state.supports)
    const { key } = useLocalSearchParams();
    console.log("key:", key)
    let supDepart = supports.filter(elm => elm.depart === key)
    const supDepartMoyen = supDepart.filter(elm => elm.etatSup === "Moyen").length;
    const supDepartCritique = supDepart.filter(elm => elm.etatSup === "Critique").length;
    const nbrParhauteur = (hauteur) => {
        return supDepart.filter(elm => elm.hauteurBeton === hauteur).length
    }

    const tauxRemplacement = () => {
        if (supDepart == 0) {
            return 0
        }
        if (supDepart !== 0) {
            const value = ((supDepartMoyen + supDepartCritique) / supDepart.length) * 100
            return value.toFixed(1)
        }
    }

    const handleSelect = (val) => {
        let reset = {
            '300': false,
            "500": false,
            "800": false,
            "1000": false,
            "1250": false,
            "1500": false
        }
        reset[val] = true
        setSelectEffort({ ...reset })
        getDetailStat(key, val, setFiltre, setLoadingLine, setNbrSup)
    }


    const data = {
        labels: ["11m", "12m", "13m", "14m", "15m"],
        datasets: [
            {
                data: [nbrParhauteur("11 m"), nbrParhauteur("12 m"), nbrParhauteur("13 m"), nbrParhauteur("14 m"), nbrParhauteur("15 m")]
            }
        ]
    };

    const dataCircle = {
        labels: ["Swim"], // optional
        data: [0.5]
    };


    useEffect(() => {
        sumParHauteur(key, setDataGraph, setErrorGraph, setLoadingraph)
    }, [])


    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerHead}>
                <View style={{ marginTop: 0 }}>
                    <Text style={{ color: '#47c7cd', fontSize: 16, fontWeight: 'bold', paddingLeft: 10 }}>Total {key} </Text>
                    <Text style={{ color: '#47c7cd', fontSize: 24, fontWeight: 'bold', paddingLeft: 10 }}>BOIS - {supDepart.length} </Text>
                </View>
            </View>

            <View>
                <View style={styles.cardContainer}>
                    <View style={[styles.card, { backgroundColor: "rgba(236, 143, 61, 0.8)" }]}>
                        <View style={styles.titleCard}>
                            <MaterialIcons name="gpp-bad" size={20} color="white" />
                            <Text style={styles.textCard}>Critique</Text>
                        </View>
                        <View>
                            <Text style={styles.numberCard}> {supDepartCritique} </Text>
                        </View>
                    </View>
                    <View style={[styles.card, { backgroundColor: "rgba(13, 176, 187, 0.8)" }]}>
                        <View style={styles.titleCard}>
                            <MaterialCommunityIcons name="format-align-middle" size={20} color="white" />
                            <Text style={styles.textCard}>Moyen</Text>
                        </View>
                        <View>
                            <Text style={styles.numberCard}> {supDepartMoyen} </Text>
                        </View>
                    </View>
                </View>

                <View style={{ width: "95%", marginHorizontal: "auto", borderRadius: 5, elevation: 5, backgroundColor: '#eacbeb', flexDirection: 'row', marginVertical: 15, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                    <Text style={{ color: "#2d0237", fontSize: 18 }}>Tx remplacement <Text style={{ color: "#f51c03" }}> {tauxRemplacement()} % </Text> </Text>
                    <ProgressChart
                        data={dataCircle}
                        width={80}
                        height={70}
                        strokeWidth={10}
                        radius={18}
                        chartConfig={chartConfigCircle}
                        hideLegend={true}
                    />
                </View>

                <View style={{ borderBottomWidth: 1, borderBottomColor: 'white', paddingBottom: 3 }}>
                    <Text style={{ color: "white", fontSize: 18 }}>Statistiques hauteurs collectées</Text>
                </View>

                <View style={{ marginTop: 10, paddingVertical: 5, height: 230 }}>
                    <BarChart
                        data={data}
                        width={screenWidth}
                        height={230}
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars
                        fromZero
                    />
                </View>
                <View style={{borderBottomWidth: 1, borderBottomColor: 'white', paddingBottom: 3, marginTop: 10}}>
                    <Text style={{color: "white", fontSize: 18}}>Statistiques Efforts collectés</Text>
                </View>
                <View style={styles.boxEffort}>
                    <TouchableOpacity
                        style={[styles.touchEffort, {
                            backgroundColor: selectEffort["300"] ? "white" : "rgba(255, 255, 255, 0.18)"
                        }]}
                        onPress={() => handleSelect("300")}
                    >
                        <Text style={[styles.force, { color: selectEffort["300"] ? "#2d0237" : "white" }]}>300</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.touchEffort, {
                            backgroundColor: selectEffort["500"] ? "white" : "rgba(255, 255, 255, 0.18)"
                        }]}
                        onPress={() => handleSelect("500")}
                    >
                        <Text style={[styles.force, { color: selectEffort["500"] ? "#2d0237" : "white" }]}>500</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.touchEffort, {
                            backgroundColor: selectEffort["800"] ? "white" : "rgba(255, 255, 255, 0.18)"
                        }]}
                        onPress={() => handleSelect("800")}
                    >
                        <Text style={[styles.force, { color: selectEffort["800"] ? "#2d0237" : "white" }]}>800</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.touchEffort, {
                            backgroundColor: selectEffort["1000"] ? "white" : "rgba(255, 255, 255, 0.18)"
                        }]}
                        onPress={() => handleSelect("1000")}
                    >
                        <Text style={[styles.force, { color: selectEffort["1000"] ? "#2d0237" : "white" }]}>1000</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.touchEffort, {
                            backgroundColor: selectEffort["1250"] ? "white" : "rgba(255, 255, 255, 0.18)"
                        }]}
                        onPress={() => handleSelect("1250")}
                    >
                        <Text style={[styles.force, { color: selectEffort["1250"] ? "#2d0237" : "white" }]}>1250</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.touchEffort, {
                            backgroundColor: selectEffort["1500"] ? "white" : "rgba(255, 255, 255, 0.18)"
                        }]}
                        onPress={() => handleSelect("1500")}
                    >
                        <Text style={[styles.force, { color: selectEffort["1500"] ? "#2d0237" : "white" }]}>1500</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <HeaderTable first={"Hauteur"} second={"Structure"} third={"Qté"} />
                    {
                        loadingLine ? (
                            <LoadingLine />
                        ) : (
                            filtre.length === 0 ? (
                                <View style={{
                                    width: "96%",
                                    orderBottomWidth: 1,
                                    borderStyle: "dotted",
                                    borderBottomColor: "white",
                                    padding: 5
                                }}>
                                    <Text style={{ color: 'white', textAlign: 'center' }}> Oups! Vérifiez votre connexion ou cliquez encore sur un effort</Text>
                                </View>
                            ) : (
                                nbrSup === 0 ? (
                                    <View style={{
                                        width: "96%",
                                        orderBottomWidth: 1,
                                        borderStyle: "dotted",
                                        borderBottomColor: "white",
                                        padding: 5
                                    }}>
                                        <Text style={{ color: 'white', textAlign: 'center' }}>Aucun support collecté pour cet effort en tête</Text>
                                    </View>
                                ) : (
                                    filtre.map((elm, index) => (
                                        (elm.nbre !== 0) && <LineTable key={index} hauteur={elm.hauteur} structure={elm.structure} qte={elm.nbre} />
                                    ))
                                )

                            )
                        )
                    }

                </View>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2d0237",
        paddingBottom: 10
    },
    containerHead: {
        backgroundColor: '#f5eef8',
        paddingBottom: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    bigHead: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    bigTitle: {
        color: '#2d0237',
        fontSize: 26
    },
    cardContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 10
    },
    card: {
        width: "45%",
        height: 100,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    titleCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 4
    },
    textCard: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'semibold'
    },
    numberCard: {
        color: "white",
        fontSize: 24,
        fontWeight: 'bold'
    },
    headerTitle: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },
    headerNumber: {
        textAlign: 'center',
        color: 'white',
        fontSize: 36
    },
    smallTitle: {
        textAlign: 'center',
        color: 'white',
        fontSize: 12,
        fontStyle: 'italic'
    },
    force: {
        color: 'white'
    },
    touchEffort: {
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.5)",
        padding: 4,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxEffort: {
        marginTop: 15,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    }
})