import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useLocalSearchParams } from 'expo-router';


const Anom = ({ label, icone, params }) => {
    const navigation = useNavigation()
    const handleForm = ()=>{
        if(label == "Abattage"){
            navigation.navigate("abattage", {...params})
        }
        if(label == "Elagage"){
            navigation.navigate("elagage", {...params})
        }
        if(label == "Marécage"){
            navigation.navigate("marecage", {...params})
        }
        if(label == "Débroussaillage"){
            navigation.navigate("debroussaillage", {...params})
        }
    }

    return (
        <TouchableOpacity
            style={styles.item_anomalie}
            onPress={handleForm}
        >
            <View style={{ flexDirection: "row", columnGap: 2 }}>
                {icone}
                <Text style={styles.anomalie_label}> {label} </Text>
            </View>
            <Text style={styles.anomalie_value}>  </Text>
        </TouchableOpacity>
    )
}

export default function Anomalies() {
    const params  = useLocalSearchParams()
    return (
        <View>
            <Text style={{ color: "#1e8449", textAlign: "center", fontSize: 18, fontWeight: "bold", marginVertical: 10 }} >Choix de l'anomalie</Text>
            <View style={{ paddingHorizontal: 8 }}>
                <Anom label={"Abattage"} icone={<FontAwesome name="tree" size={24} color="#1e8449" />} params={params} />
                <Anom label={"Elagage"} icone={<MaterialCommunityIcons name="tree" size={24} color="#1e8449" />} params={params} />
                <Anom label={"Marécage"} icone={<MaterialIcons name="water" size={24} color="#1e8449" />} params={params} />
                <Anom label={"Débroussaillage"} icone={<MaterialIcons name="grass" size={24} color="#1e8449" />} params={params} />
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    item_anomalie: {
        backgroundColor: "#abebc6",
        height: 60,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
        elevation: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },
    anomalie_label: {
        fontSize: 18,
        fontWeight: "bold",
        fontStyle: "italic"
    },
    anomalie_value: {
        fontSize: 16,
        color: '#c0392b',
        fontWeight: "bold"
    },
})