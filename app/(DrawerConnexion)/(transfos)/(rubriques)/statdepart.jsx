import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTransfoStore } from '../../../../utils/store';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from 'expo-router';


const Card = ({ titre, soustitre, valeur, couleur, filtre }) => {
    const navigation = useNavigation()
    const { depart } = useLocalSearchParams()
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('listetransfo', { depart: depart, filtre: filtre })}
        >
            <View>
                <Text style={styles.title}>
                    {titre}
                </Text>
                <Text style={styles.explain}>
                    {soustitre}
                </Text>
            </View>
            <View>
                <Text style={[styles.value, { color: couleur }]}>
                    {valeur}
                </Text>
            </View>
        </TouchableOpacity>
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

export default function Statdepart() {

    const { depart } = useLocalSearchParams()
    const transformateurs = useTransfoStore(state => state.transfos)

    const puissances = () => {
        if (transformateurs.length === 0) {
            return []
        } else {
            let transfoDuDepart = transformateurs.filter(elm => elm.depart === depart)
            if (transfoDuDepart.lengt === 0) {
                return []
            } else {
                return [...new Set([...transfoDuDepart.map(transfo => transfo.puissance)])]
            }
        }
    }
    const listPuissances = puissances()

    const dataGraph = (tab) => {
        const nbrPuissance = tab.length;
        if (nbrPuissance === 0) {
            return 0
        } else {
            let result = []
            for (var i = 0; i < nbrPuissance; i++) {
                const value = transformateurs.filter(elm => elm.depart === depart && elm.puissance === tab[i]).length
                result.push(value)
            }
            return result;
        }
    }

    const data = {
        labels: listPuissances,
        datasets: [
            {
                data: dataGraph(listPuissances)
            }
        ]
    };

    const postesDepart = () => {
        if (transformateurs.length === 0) {
            return []
        } else {
            return transformateurs.filter(elmt => elmt.depart === depart)
        }
    }

    const statTypeTransfo = (dep, type) => {
        if (transformateurs.length === 0) {
            return 0
        }
        return transformateurs.filter(elm => elm.depart === dep && elm.type === type).length
    }

    const surcharge = () => {
        if (transformateurs.length == 0) {
            return 0;
        } else {
            return transformateurs.filter(elm => elm.depart === depart && elm.charge > 80).length
        }
    }
    const chargeNormale = () => {
        if (transformateurs.length == 0) {
            return 0;
        } else {
            return transformateurs.filter(elm => elm.depart === depart && (elm.charge >= 60 && elm.charge < 80)).length
        }
    }
    const sousCharge = () => {
        if (transformateurs.length == 0) {
            return 0;
        } else {
            return transformateurs.filter(elm => elm.depart === depart && elm.charge < 60).length
        }
    }
    const desequilibre = () => {
        if (transformateurs.length == 0) {
            return 0;
        } else {
            return transformateurs.filter(elm => elm.depart === depart && elm.desequilibre > 20).length
        }
    }



    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={{ textAlign: 'center', paddingTop: 5, fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>
                    {depart}
                </Text>
                <View style={styles.classification}>
                    <View style={styles.leftCard}>
                        <View style={styles.type}>
                            <Text style={styles.texteCard}>
                                Tri
                            </Text>
                            <Text style={styles.texteCard}>
                                {postesDepart().length === 0 ? 0 : statTypeTransfo(depart, "Triphase")}
                            </Text>
                        </View>
                        <View style={styles.type}>
                            <Text style={styles.texteCard}>
                                Mono
                            </Text>
                            <Text style={styles.texteCard}>
                                {postesDepart().length === 0 ? 0 : statTypeTransfo(depart, "Monophase")}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.valueCard}>
                        <Text style={{ color: "white", fontSize: 30, fontWeight: 'bold' }}>
                            {postesDepart().length === 0 ? 0 : statTypeTransfo(depart, "Triphase") + statTypeTransfo(depart, "Monophase")}
                        </Text>
                    </View>
                </View>
                <Card titre="Surchargé" soustitre="sup 80%" valeur={postesDepart().length === 0 ? 0 : surcharge()} couleur="red" filtre={'surcharge'} />
                <Card titre="Normal" soustitre="entre 60 et 80%" valeur={postesDepart().length === 0 ? 0 : chargeNormale()} couleur="#27ae60" filtre={"normal"} />
                <Card titre="Souschargé" soustitre="inf 60%" valeur={postesDepart().length === 0 ? 0 : sousCharge()} couleur="#2471a3" filtre={"souscharge"} />
                <Card titre="Desequilibré" soustitre="sup 20%" valeur={postesDepart().length === 0 ? 0 : desequilibre()} couleur="#ba4a00" filtre={"desequilibre"} />
                <View>
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f618d' }}>
                            Transfo par puissance
                        </Text>
                    </View>
                    {
                        postesDepart().length === 0 ? (
                            <Text style={{ fontSize: 17, fontStyle: "italic", textAlign: "center", color: "#a93226" }}>
                                Aucun transformateur collecté sur le {depart} pour le moment
                            </Text>
                        ) : (
                            <BarChart
                                data={data}
                                width={screenWidth}
                                height={220}
                                yAxisLabel=""
                                chartConfig={chartConfig}
                                verticalLabelRotation={0}
                                fromZero
                                showBarTops={true}
                                showValuesOnTopOfBars={true}
                            />)
                    }
                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: "#d6eaf8",
        marginVertical: 5,
        elevation: 5,
        borderRadius: 5
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,

    },
    explain: {
        fontStyle: "italic",
        color: '#99a3a4'
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    classification: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#2c3e50',
        marginVertical: 10,
        elevation: 5
    },
    type: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftCard: {
        width: '50%',
        paddingRight: 8,
        borderRightColor: "white",
        borderRightWidth: 1
    },
    texteCard: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    valueCard: {
        width: '50%',
        justifyContent: 'center',
        alignItems: "center"
    }

})