import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const { height, width } = Dimensions.get("window")

export default function RowTable({descript, bois, beton}) {
    return (
        <View style={styles.headTable}>
            <View style={styles.rowTableElm}>
                <Text style={styles.textrow}>{descript}</Text>
            </View>
            <View style={styles.rowTableElm}>
                <Text style={styles.textrow}>{bois}</Text>
            </View>
            <View style={styles.rowTableElm}>
                <Text style={styles.textrow}>{beton}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headTable : {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headTableElm: {
      width : width*0.32,
      backgroundColor: "#0e6655",
      padding: 4,
      borderBottomWidth: 1,
      borderBottomColor: 'white',
      // borderLeftWidth : 1,
      // borderLeftColor: 'white',
      borderStyle: "dashed"
    },
    rowTableElm: {
      width : width*0.32,
      backgroundColor: "#138d75",
      padding: 4,
      borderBottomWidth: 1,
      borderBottomColor: 'white',
      // borderLeftWidth : 1,
      // borderLeftColor: 'white',
      borderLeStyle: "dashed"
    },
    textrow:{
      color: "white"
    },
    texthead:{
      color: "white",
      fontWeight: 'bold'
    }
  })