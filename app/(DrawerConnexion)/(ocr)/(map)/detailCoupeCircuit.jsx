import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

const Item = ({ label, value }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    )
}

export default function DetailCoupeCircuit() {
    const { id, depart, groupe, type, etat, nbr_defec, connecteur, observation, latitude, longitude, nom } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CC - {nom}</Text>
            <ScrollView
                contentContainerStyle={{ padding: 5 }}
                showsVerticalScrollIndicator={false}
                >
                <Item label={"Départ"} value={depart} />
                <Item label={"Groupe"} value={groupe} />
                <Item label={"Type"} value={type} />
                <Item label={"État"} value={etat} />
                <Item label={"Nombre à remplacer"} value={nbr_defec} />
                <Item label={"Connecteur"} value={connecteur} />
                <Item label={"Observation"} value={observation} />
                <Item label={"Latitude"} value={latitude} />
                <Item label={"Longitude"} value={longitude} />
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    item: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
        color: "#1f618d"
    },
    value: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#333',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: "#af601a"
    },
})