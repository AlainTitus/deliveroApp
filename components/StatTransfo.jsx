import { View, Text } from 'react-native'
import React from 'react'

export default function StatTransfo({titre, soustitre, performance}) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, backgroundColor: '#ecf0f1', borderRadius: 10, marginTop: 10, elevation: 2, marginHorizontal: 4 }}>
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, color: '#2c3e50', fontWeight: 'bold' }}> {titre} </Text>
                <Text style={{ fontSize: 12, color: 'gray', fontStyle: 'italic'}}> {soustitre} </Text>
            </View>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: "red"}}> {performance} </Text>
        </View>
    )
}