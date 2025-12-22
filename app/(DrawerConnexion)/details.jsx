import 'react-native-gesture-handler'
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '../../provider/AuthProvider';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const colorSymbol = "white"
const large = Dimensions.get('window').width

export default function Details() {

    const { signOut, session } = useAuth()

    const navigation = useNavigation()


    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {/* <View style={styles.head}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ backgroundColor: '#117864', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                            <Ionicons name="menu" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}> Hi Eneo</Text>
                    </View>
                    <TouchableOpacity onPress={signOut} style={styles.logout}>
                        <Entypo name="log-out" size={20} color="white" />
                    </TouchableOpacity>
                </View> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, alignItems: 'center', paddingVertical: 10 }}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', marginTop: 8, color: 'white' }}>
                        Activités techniques
                    </Text>
                    <Image source={require('../../assets/images/log.png')} style={{ width: large * 0.35, height: large * 0.35, borderRadius: 10 }} />
                </View>


                <Text style={styles.description}>
                    Cette App vous permettra de réaliser un certain nombre d'actions en rapport avec les opérations techniques de maintenance.
                    Il facilite l'inspection des ouvrages en offrant la possibilité de collecte avec géolocalisation des assets. La possibilité de
                    mettre à jour en temps réel ou en décalages les données sur les ouvrages inspectés et de suivre l'évolution des actions menées
                    grace à l'automatisation d'un dashboard facile à analyser.
                </Text>
                <Text style={styles.description}>
                    Cette première version se focalise sur l'inspection des supports bois du réseau moyenne tension. L'objectif est de pouvoir en
                    définitif collecter:
                </Text>

                <View style={{ flexDirection: 'row', columnGap: 4, alignItems: 'center' }}>
                    <AntDesign name="caretright" size={12} color={colorSymbol} />
                    <Text style={styles.title}>
                        Les Supports
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', columnGap: 4, alignItems: 'center' }}>
                    <AntDesign name="caretright" size={12} color={colorSymbol} />
                    <Text style={styles.title}>
                        Les postes de distributions
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', columnGap: 4, alignItems: 'center' }}>
                    <AntDesign name="caretright" size={12} color={colorSymbol} />
                    <Text style={styles.title}>
                        La végétation
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', columnGap: 4, alignItems: 'center' }}>
                    <AntDesign name="caretright" size={12} color={colorSymbol} />
                    <Text style={styles.title}>
                        Les OCRs
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', columnGap: 4, alignItems: 'center' }}>
                    <AntDesign name="caretright" size={12} color={colorSymbol} />
                    <Text style={styles.title}>
                        Les opérations courantes
                    </Text>
                </View>

                <Link href={'/(tech)/(rubriques)/supports'} asChild>
                    <TouchableOpacity style={styles.btn} >
                        <Text style={styles.texte}>
                            Let'us collecte
                        </Text>
                    </TouchableOpacity>
                </Link>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 6,
        backgroundColor: "#2980b9"
    },
    btn: {
        backgroundColor: '#2e86c1',
        padding: 10,
        marginTop: 16,
        width: '80%',
        marginHorizontal: 'auto',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#aed6f1"
    },
    texte: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#117864',
        paddingBottom: 4,
        marginBottom: 10
    },
    logout: {
        backgroundColor: '#117864',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    title: {
        color: 'white',
        fontSize: 18
    },
    description: {
        color: 'white',
        fontSize: 16,
        marginVertical: 8,
        textAlign: 'justify'
    }
})