import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTransfoStore } from '../../../../utils/store';

const HeadTable = ({ label, firstColumn, secondColumn, colorText, colorbcg, sizelabel, size }) => {
  return (
    <View style={styles.headtable}>
      <View style={[styles.columntable, { backgroundColor: colorbcg }]}>
        <Text style={[styles.headtitle, { color: colorText, fontSize: sizelabel }]}>
          {label}
        </Text>
      </View>
      <View style={[styles.columntable, { backgroundColor: colorbcg }]}>
        <Text style={[styles.headtitle, { color: colorText, textAlign: 'center', fontSize: size }]}>
          {firstColumn}
        </Text>
      </View>
      <View style={[styles.columntable, { backgroundColor: colorbcg, fontSize: size }]}>
        <Text style={[styles.headtitle, { color: colorText, textAlign: "center", fontSize: size }]}>
          {secondColumn}
        </Text>
      </View>
    </View>
  )
}

export default function Listetransfo() {
  const { depart, filtre } = useLocalSearchParams();
  // console.log("filtre", filtre)
  // console.log("depart", depart)
  const transformateurs = useTransfoStore(state => state.transfos)

  let resultat = []
  let testresult = transformateurs.filter(elmt => elmt.depart === "D11 BERTOUA" && elmt.charge < 60)
  console.log("testresult", testresult.length)

  if (filtre === "surcharge") {
    resultat = transformateurs.filter(elmt => elmt.depart === depart && elmt.charge > 80)
  } else if (filtre === "normal") {
    resultat = transformateurs.filter(elmt => elmt.depart === depart && (elmt.charge >= 60 && elmt.charge <= 80))
  } else if (filtre === "souscharge") {
    resultat = transformateurs.filter(elmt => elmt.depart === depart && elmt.charge < 60)
  } else if (filtre === "desequilibre") {
    resultat = transformateurs.filter(elmt => elmt.depart === depart && elmt.desequilibre >= 20)
  }
  console.log(resultat)

  return (
    <View style={{paddingHorizontal: 8}}>
      <ScrollView>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}> Transfo du {depart} en {filtre}  </Text>
        </View>
        <View>
          <HeadTable label={"Nom"} firstColumn={"Puissance"} secondColumn={"Taux(%)"} colorText="white" colorbcg="#1a5276" sizelabel={12} size={12} />
        </View>
        {
          filtre !== "desequilibre" && resultat.map(res => (
            <HeadTable key={res.id} label={res.nom ? res.nom.slice(0, 24) : 'SANS NOM'} firstColumn={res.puissance} secondColumn={res.charge} colorbcg="white" sizelabel={12} size={12} />
          ))
        }
        {
          filtre == "desequilibre" && resultat.map(res => (
            <HeadTable key={res.id} label={res.nom ? res.nom.slice(0, 24) : 'SANS NOM'} firstColumn={res.puissance} secondColumn={res.desequilibre} colorbcg="white" sizelabel={14} size={14} />
          ))
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  headtable: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
  },
  columntable: {
    width: "32%",
    padding: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    justifyContent: 'center'
  },
  headtitle: {
    fontWeight: 'bold'
  }
})