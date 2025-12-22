import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useIacmStore, useCCStore } from '../../../../utils/store';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from 'expo-router';


const HeadTable = ({ label, firstColumn, secondColumn, colorText, colorbcg, sizelabel, size }) => {
    return (
        <View style={styles.headtable}>
            <View style={[styles.columntable, { backgroundColor: colorbcg }]}>
                <Text style={[styles.headtitle, { color: colorText, fontSize: sizelabel }]}>
                    {label.slice(0, 11)}
                </Text>
            </View>
            <View style={[styles.columntable, { backgroundColor: colorbcg, fontSize: size }]}>
                <Text style={[styles.headtitle, { color: colorText, textAlign: 'center' }]}>
                    {firstColumn}
                </Text>
            </View>
            <View style={[styles.columntable, { backgroundColor: colorbcg, fontSize: size }]}>
                <Text style={[styles.headtitle, { color: colorText, textAlign: "center" }]}>
                    {secondColumn}
                </Text>
            </View>
        </View>
    )
}

export default function Statdepart() {

    const { depart } = useLocalSearchParams()

    const iacms = useIacmStore((state) => state.iacms);
    const coupecircuit = useCCStore((state) => state.coupesCircuit);

    const nbr_iacm_type = (type) => {
        return iacms.filter(elm => elm.type === type && elm.depart == depart).length
    }
    const nbr_iacm_defec = (type) => {
        return iacms.filter(elm => elm.fonctionnel === "non" && elm.type === type && elm.depart == depart).length
    }

    const nbr_cc_groupe = (groupe) => {
        return coupecircuit.filter(elm => elm.groupe === groupe && elm.depart == depart).length
    }
    const nbr_cc_defec = (groupe) => {
        return coupecircuit.filter(elm => elm.groupe === groupe && elm.etat !== 'RAS' && elm.depart == depart).length
    }



    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={{ textAlign: 'center', paddingTop: 5, fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>
                    {depart}
                </Text>

                <Text style={{ paddingTop: 5, fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5, marginTop: 10, marginLeft: 4 }}>
                    Statistiques IACM:
                </Text>
                <HeadTable label="Type" firstColumn="Nbr total" secondColumn="Nbr defec" colorText="white" colorbcg="#1a5276" sizelabel={14} size={14} />
                <HeadTable label={"Ligne"} firstColumn={nbr_iacm_type("ligne")} secondColumn={nbr_iacm_defec("ligne")} colorbcg="white" sizelabel={14} size={14} />
                <HeadTable label={"Grappe"} firstColumn={nbr_iacm_type("grappe")} secondColumn={nbr_iacm_defec("grappe")} colorbcg="white" sizelabel={14} size={14} />
                <HeadTable label={"Poste"} firstColumn={nbr_iacm_type("poste")} secondColumn={nbr_iacm_defec("poste")} colorbcg="white" sizelabel={14} size={14} />

                <Text style={{ paddingTop: 5, fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5, marginTop: 10, marginLeft: 4 }}>
                    Statistiques Coupes circuits:
                </Text>
                <HeadTable label="Type" firstColumn="Nbr total" secondColumn="Nbr defec" colorText="white" colorbcg="#1a5276" sizelabel={14} size={14} />
                <HeadTable label={"Derivation"} firstColumn={nbr_cc_groupe("derivation")} secondColumn={nbr_cc_defec("derivation")} colorbcg="white" sizelabel={14} size={14} />
                <HeadTable label={"Arter princ"} firstColumn={nbr_cc_groupe("artere principale")} secondColumn={nbr_cc_defec("artere principale")} colorbcg="white" sizelabel={14} size={14} />

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
    },
    headtable: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center'
    },
    columntable: {
        width: "32%",
        padding: 4,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    headtitle: {
        fontWeight: 'bold'
    },

})