import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useAbattage, useElagage, useMarecage, useDebroussaillage } from '../../../../utils/store'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Header_Table = ({ label, value }) => {
  return (
    <View style={styles.headTable}>
      <View style={styles.cell}>
        <Text style={styles.text_design}> {label} </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text_value}> {value} </Text>
      </View>
    </View>
  )
}
const Row_Table = ({ label, value }) => {
  return (
    <View style={styles.headTable}>
      <View style={styles.cellRow}>
        <Text style={styles.text_design_row}> {label} </Text>
      </View>
      <View style={styles.cellRow}>
        <Text style={styles.text_value_row}> {value} </Text>
      </View>
    </View>
  )
}


export default function TypeVegetation() {
  const { depart } = useLocalSearchParams()
  const navigation = useNavigation()

  const abattage = useAbattage((state) => state.tab_abattage)
  const abattage_depart = abattage.filter(elm => elm.depart == depart)

  const elagage = useElagage((state) => state.tab_elagage)
  const elagage_depart = elagage.filter(elm => elm.depart === depart)

  const marecage = useMarecage((state) => state.tab_marecage)
  const marecage_depart = marecage.filter(elm => elm.depart === depart)

  const debroussaillage = useDebroussaillage((state) => state.tab_debroussaillage)
  const debroussaillage_depart = debroussaillage.filter(elm => elm.depart === depart)

  const somme_Diametre = (tab, column) => {
    if (tab.length !== 0) {
      const nbr_row = tab.length;
      let result = 0
      for (let i = 0; i < nbr_row; i++) {
        result = result + tab[i][column]
      }
      return result
    } else {
      return 0
    }
  }
  
  return (
    <View style={{ flex: 1, padding: 5 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 4,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}> Végétation du {depart} </Text>
        <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 5, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: "#1e8449" }}>
          <Text style={{ color: "#1e8449", fontSize: 16, fontWeight: "bold" }}>Abattages</Text>
          <FontAwesome name="tree" size={24} color="#1e8449" />
        </View>
        <View style={{ marginVertical: 5 }}>
          <Header_Table label={"Design"} value={"nbr"} />
          <Row_Table label={"D=30cm"} value={somme_Diametre(abattage_depart, "D30")} />
          <Row_Table label={"30<D<=50cm"} value={somme_Diametre(abattage_depart, "D30_50")} />
          <Row_Table label={"50<D<=80cm"} value={somme_Diametre(abattage_depart, "D50_80")} />
          <Row_Table label={"80<D<=100cm"} value={somme_Diametre(abattage_depart, "D80_100")} />
          <Row_Table label={"D>100cm"} value={somme_Diametre(abattage_depart, "D100")} />
        </View>
        <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 5, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: "#1e8449" }}>
          <Text style={{ color: "#1e8449", fontSize: 16, fontWeight: "bold" }}>Elagages</Text>
          <MaterialCommunityIcons name="tree" size={24} color="#1e8449" />
        </View>
        <View style={{ marginVertical: 5 }}>
          <Header_Table label={"Design"} value={"nbr"} />
          <Row_Table label={"Nbr branches"} value={somme_Diametre(elagage_depart, "nombre")} />
        </View>
        <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 5, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: "#1e8449" }}>
          <Text style={{ color: "#1e8449", fontSize: 16, fontWeight: "bold" }}>Marécages</Text>
          <MaterialIcons name="water" size={24} color="#1e8449" />
        </View>
        <View style={{ marginVertical: 5 }}>
          <Header_Table label={"Design"} value={"long(m)"} />
          {
            marecage_depart.length == 0 ? (
              <Row_Table label={"Aucun marécage"} value={0} />
            ) : (
              marecage_depart.map((mar) => (
                <Row_Table key={mar.id} label={mar.nom_Mare} value={mar.longueur} />
              ))
            )
          }

        </View>
        <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 5, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: "#1e8449" }}>
          <Text style={{ color: "#1e8449", fontSize: 16, fontWeight: "bold" }}>Debroussaillage</Text>
          <MaterialIcons name="water" size={24} color="#1e8449" />
        </View>
        <View style={{ marginVertical: 5 }}>
          <Header_Table label={"Design"} value={"long(km)"} />
                    {
            debroussaillage_depart.length == 0 ? (
              <Row_Table label={"RAS"} value={0} />
            ) : (
              debroussaillage_depart.map((deb) => (
                <Row_Table key={deb.id} label={deb.zone} value={deb.longueur} />
              ))
            )
          }

        </View>
      </ScrollView>


    </View>
  )
}

const styles = StyleSheet.create({
  safContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e8449',
    marginVertical: 10,
    textAlign: 'center',
  },
  headTable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

  },
  cell: {
    borderWidth: 1,
    borderColor: "black",
    padding: 4,
    width: "45%",
    backgroundColor: '#1e8449'
  },
  cellRow: {
    borderWidth: 1,
    borderColor: "black",
    padding: 4,
    width: "45%",
  },
  text_design: {
    color: "#fff",
    fontWeight: "bold"
  },

  text_value: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  text_value_row: {
    textAlign: "center",
  }
})