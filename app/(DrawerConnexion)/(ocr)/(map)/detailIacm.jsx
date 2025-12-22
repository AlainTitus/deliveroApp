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

export default function DetailIacm() {
    const { id, nom, depart, type, support, malt, fonctionnel, observation, latitude, longitude } = useLocalSearchParams();


    return (
        <View style={styles.container}>
            <Text style={styles.title}>IACM-{nom}</Text>
            <ScrollView
                contentContainerStyle={{ padding: 5 }}
                showsVerticalScrollIndicator={false}
                >
                <Item label={"Départ"} value={depart} />
                <Item label={"Type"} value={type} />
                <Item label={"Support"} value={support} />
                <Item label={"Malt"} value={malt} />
                <Item label={"Fonctionnel"} value={fonctionnel} />
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