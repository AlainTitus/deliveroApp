import { View, Alert, Text, StyleSheet, Pressable, TextInput, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import { supabase } from '../utils/supabase'
import { useRouter } from 'expo-router'


export default function Index() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const handleDetail = () => {
        router.push("/details")
    }

    const onSignInPress = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) Alert.alert('Erreur de connexion', error.message);
        else Alert.alert('Inscription avec succès')
        setLoading(false)
    }

    const onSignUpPress = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signUp({ email, password })

        if (error) Alert.alert('Erreur de creation de compte', error.message);
        else Alert.alert('Connexion avec succès')
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} />

            <Text style={styles.header}>
                My App
            </Text>

            <TextInput style={styles.input} autoCapitalize='none' placeholder='alain.com' value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder='password' value={password} onChangeText={setPassword} />

            <TouchableOpacity onPress={onSignInPress} style={styles.button}>
                <Text style={{ color: '#fff', fontSize: 16 }} > Sign In </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSignUpPress} style={styles.btnSignUp}>
                <Text style={{ color: '#fff', fontSize: 16 }} > Create account </Text>
            </TouchableOpacity>
        </View>
        // <View>
        //     <Text>ok</Text>
        //     <TouchableOpacity
        //         style={{
        //             backgroundColor: 'yellow',
        //             padding: 5,
        //             width: '50%',
        //             marginHorizontal : 'auto'
        //         }}
        //         onPress={handleDetail}
        //     >
        //         <Text style={{textAlign: 'center'}}>Detail</Text>
        //     </TouchableOpacity>
        // </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#154360"
    },
    btn: {
        backgroundColor: '#2e86c1',
        padding: 8,
        marginTop: 8,
    },
    texte: {
        color: 'white',
        fontSize: 18
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    header: {
        textAlign: 'center',
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
        fontSize: 30
    },
    button: {
        backgroundColor: '#117864',
        width: "80%",
        marginHorizontal: 'auto',
        padding: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15
    },
    input: {
        backgroundColor: '#cacfd2',
        padding: 8,
        borderWidth: 1,
        borderRadius: 5,
        width: "80%",
        marginHorizontal: "auto",
        marginVertical: 8,
        fontSize: 16
    },
    btnSignUp: {
        backgroundColor: '#117864',
        width: "80%",
        marginHorizontal: 'auto',
        padding: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15
    }
})