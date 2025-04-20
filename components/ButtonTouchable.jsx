import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react';
import { Link } from 'expo-router';

export default function ButtonTouchable({text, lien}) {
    return (
        <Link href={lien} asChild>
            <TouchableOpacity style={styles.main}>
            <Text style={styles.text}>
                {text}
            </Text>
        </TouchableOpacity>
        </Link>
        
    )
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: 'gray',
        padding: 8,
        borderRadius: 4,
        margin: 4,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    text: {
        fontSize: 16,
        color: 'white'
    }
})