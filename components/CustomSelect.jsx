import { View, StyleSheet, Text } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'

export default function CustomSelect({ label, datas, handleLoading, second, handleSelect, labelColor }) {
  const [selectedLangage, setSelectedLangage] = useState();
  if(second =='second'){
    return (
      <View style={styles.bloc}>
      <Text style={[styles.text, {color: labelColor ? labelColor : 'black'}]}> {label} </Text>
      <View style={styles.select}>
        <Picker
          selectedValue={selectedLangage}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedLangage(itemValue)
            handleSelect(itemValue)
          }}
          style={{backgroundColor: 'white'}}
        >
          {
            datas.map(elm => (
              <Picker.Item key={elm.label} label={elm.label} value={elm.value} />
            ))
          }
        </Picker>
      </View>

    </View >
    )
  }
  return (
    <View style={styles.bloc}>
      <Text style={[styles.text, {color: labelColor ? labelColor : 'black'}]}> {label} </Text>
      <View style={styles.select}>
        <Picker
          selectedValue={selectedLangage}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedLangage(itemValue)
            handleLoading(itemValue)
          }}
        >
          {
            datas.map(elm => (
              <Picker.Item key={elm.label} label={elm.label} value={elm.value} />
            ))
          }
        </Picker>
      </View>

    </View >
  )
}

const styles = StyleSheet.create({
  select: {
    borderWidth: 1,
  },
  bloc: {
    rowGap: 2,
    marginVertical: 6
  },
  text: {
    fontSize: 18,
    fontWeight: '500'
  }
})