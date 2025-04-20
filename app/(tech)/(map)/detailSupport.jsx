import { View, Text, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../provider/AuthProvider';
import { supabase } from '../../../utils/supabase';
import ImageItem from '../../../components/ImageItem';
import RowTable from '../../../components/RowTable';
import Ionicons from '@expo/vector-icons/Ionicons';



const { height, width } = Dimensions.get("window")

export default function DetailSupport() {
  const [img, setImg] = useState([])

  const { user } = useAuth();
  const params = useLocalSearchParams()

  const loadImages = async () => {
    const { data, error } = await supabase
      .storage
      .from('image.supports')
      .list(`${params.imglink}`, { limit: 10 })

    if (!data) {
      Alert.alert("Problème d'accès à la BD")
      return;
    } else {
      setImg([...data])
    }
    // console.log("data loaded", data)
    // console.log("error loaded", error)
  }

  useEffect(() => {
    loadImages()
  }, [])

  // console.log('img =>', img)

  return (
    <View style={styles.container}>
      <View style={styles.viewImage}>
        <ScrollView
          horizontal
          contentContainerStyle={{
            columnGap: 8,
            padding: 8,
            height: height * 1 / 3.5,
          }}
        >
          {
            img.map((item, index) => (
              <ImageItem key={item.id} item={item} userId={params.imglink} />
            ))
          }
        </ScrollView>
      </View>
      <View style={styles.description}>
        <Text style={{color: "white", fontSize: 18, fontWeight: 'bold'}}>Descriptions</Text>
        <Ionicons name="information-circle" size={24} color="white" />
      </View>

      <View style={{paddingHorizontal: 8, marginBottom : 20}}>
        <Text style={{color: "white", textAlign: 'justify', fontWeight: "bold", fontSize: 16}}>Structure bois de type {params.supbois} et de hauteur {params.hautBois} sur le {params.depart}. Le support est {params.access}. </Text>
      </View>

      <View style={styles.details}>
        <Text style={{color: "white", fontSize: 18, fontWeight: 'bold'}}>Autres détails</Text>
        <Ionicons name="settings" size={24} color="white" />
      </View>
      <View style={styles.headTable}>
        <View style={styles.headTableElm}>
          <Text style={styles.texthead}>Informations</Text>
        </View>
        <View style={styles.headTableElm}>
          <Text style={styles.texthead}>Support bois</Text>
        </View>
        <View style={styles.headTableElm}>
          <Text style={styles.texthead}>Support béton</Text>
        </View>
      </View>
      <RowTable descript={"Structure"} bois={params.supbois} beton={params.structBeton} />
      <RowTable descript={"Hauteur"} bois={params.hautBois} beton={params.hautBeton} />
      <RowTable descript={"Effort"} bois={"-"} beton={params.effort} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: 0,
    backgroundColor: '#154360',
    flex: 1
  },
  viewImage: {
    width: width,
    marginBottom: 15,
    backgroundColor: "#7fb3d5",
    paddingBottom: 5
  },
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
  textrow:{
    color: "white"
  },
  texthead:{
    color: "white",
    fontWeight: 'bold'
  },
  description:{
    marginVertical: 10,
    backgroundColor: "#0e6655",
    padding: 5,
    width: width*0.96,
    marginHorizontal: "auto",
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  details:{
    marginTop: 10,
    width: width*0.96,
    marginHorizontal: "auto",
    backgroundColor: "#0e6655",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})