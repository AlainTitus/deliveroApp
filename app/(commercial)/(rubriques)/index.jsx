import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import ButtonTouchable from '../../../components/ButtonTouchable';
import CardStat from '../../../components/CardStat';
import Indicateurs from '../../../components/Indicateurs';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.headTitle}>Reporting des activités commerciales</Text>
      <View>
        <Text style={styles.categorie} >Collecte terrain</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ButtonTouchable text={'Normalisations'} lien='/normalisation' />
          <ButtonTouchable text={'Illégaux'} lien='/illegaux'/>
          <ButtonTouchable text={'Branchements'} lien='/branchements'/>
          <ButtonTouchable text={'Fraudes'} lien='/fraudes'/>
        </ScrollView>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={styles.categorie} >Realisations</Text>
        <View style={styles.cards}>
          <CardStat texte={'Normalisation'} stat={0} />
          <CardStat texte={'Illégaux'} stat={0} />
          <CardStat texte={'Branchements'} stat={0}/>
          <CardStat texte={'Fraude'} stat={0}/>
        </View>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={styles.categorie} >Principaux KPI</Text>
        <View>
          <Indicateurs label={'Rd Dist %'} target={75.51} done={76.01} />
          <Indicateurs label={'Tx Rec %'} target={75.51} done={74.2} />
          <Indicateurs label={'Normal'} target={500} done={410} />
          <Indicateurs label={'Bon Rel %'} target={99} done={87} />
          <Indicateurs label={'Bon Dis %'} target={99} done={87} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  },
  headTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  categorie: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 3,
    marginBottom: 10,
    fontWeight: 'semibold'
  },
  cards: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  kpi:{
    flexDirection:'row'
  },
  value: {
    fontSize: 16,
    fontWeight: 'semibold',
    flexGrow: 1/3,
  }
})