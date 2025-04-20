import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import BtnPicker from './BtnPicker'


export default function ElmtPicker({icon, label, textColor, btnColor, onPress}) {
  return (
    <View style={styles.main} >
      <Text style={[styles.label, {color: textColor}]}> {label} </Text>
      <BtnPicker icon={icon} color={btnColor} onPress={onPress}/>
    </View>
  )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginVertical: 5
    },
    label: {
        fontSize: 18,
        fontWeight: 'semibold',
    }
})