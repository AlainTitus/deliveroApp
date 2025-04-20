import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

export default function LoadingGraph() {
    return (
        <View style={{ height: 230, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20 }}>Loading...</Text>
            <ActivityIndicator color={"white"} size={'large'} />
        </View>
    )
}