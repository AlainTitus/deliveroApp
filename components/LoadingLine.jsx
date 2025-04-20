import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export default function LoadingLine() {
    return (
        <View style={{
            width: "96%",
            orderBottomWidth: 1,
            borderStyle: "dotted",
            borderBottomColor: "white",
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{ color: 'white', fontSize: 20 }}>Loading...</Text>
            <ActivityIndicator color={"white"} size={'large'} />
        </View>
    )
}