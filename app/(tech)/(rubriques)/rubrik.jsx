import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import ItemsRubriques from '../../../components/ItemsRubriques'

export default function IndexRubrique() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Categories de collecte</Text>
      {/* <ItemsRubriques label={'Transformateurs'} /> */}
      <ItemsRubriques label={'Les lignes'} />
      {/* <ItemsRubriques label={'Les OCRs'} />
      <ItemsRubriques label={'La végétation'} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 8
    },
    header: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
        marginTop: 6
    },
    btn_press:{
        width: '100%',
        padding: 6,
        marginVertical: 3,
        backgroundColor: '#34495e'
    },
    text_btn:{
        color: 'white',
        fontSize: 18
    }
})