import { View, Text, StyleSheet, ScrollView, Button } from 'react-native'
import React from 'react'
import CustomSelect from '../../../components/CustomSelect'
import CustomInput from '../../../components/CustomInput'
import { agences, typeCompteur, nbrFils } from '../../../datas/labels'
import ElmtPicker from '../../../components/ElmtPicker'
import Ionicons from '@expo/vector-icons/Ionicons';
import FormBranch from '../../../components/FormBranch'

const Icon = () => {
  return <Ionicons name="camera" size={24} color="white" />
}

// export default function OpexBranch() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.textHeader} >Branchements Opex</Text>
//       <ScrollView style={styles.form}>
//         <CustomSelect label="Agence" datas={agences} second='second' labelColor={"#1a5276"} handleSelect={(value) => console.log(value)} />
//         <CustomSelect label="Compteur déposé" datas={typeCompteur} second='second' labelColor={"#1a5276"} handleSelect={(value) => console.log(value)} />
//         <CustomInput label={"Numero compteur déposé"} labelColor={"#1a5276"}/>
//         <CustomSelect label="Compteur posé" datas={typeCompteur} second='second' labelColor={"#1a5276"} handleSelect={(value) => console.log(value)} />
//         <CustomInput label={"Numero compteur posé"} labelColor={"#1a5276"}/>
//         <CustomSelect label="Nbr de fil" datas={nbrFils} second='second' handleSelect={(value) => console.log(value)} labelColor={"#1a5276"} />
//         <CustomInput label={"Anomalie"} number={20} multiline={true} h={100} labelColor={"#1a5276"}/>
//         <ElmtPicker icon={<Icon />} label={'Compteur deposé'} textColor={"#943126"} btnColor={"#943126"} />
//         <ElmtPicker icon={<Icon />} label={'Compteur posé'} textColor={"#1a5276"} btnColor={"#1a5276"} />
//         <View style={{width: "70%", marginHorizontal:'auto', marginVertical: 10}}>
//           <Button title='Valider' color={'#2e86c1'} />
//         </View>

//       </ScrollView>
//     </View>
//   )
// }
export default function OpexBranch() {
  return (
    <>
      <FormBranch
        titre={"Branchements Opex"}
        action={"branch_opex"}
        album={"BranchOpex"}
        store={"branchopex"}
        headerColor='#117864'
        bgColor="#d1f2eb"
        cameraColor="#145a32"
        buttonColor="#117864"
        bordColor="#117864"
        labelColor="#117864"
      />
    </>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 5,
//     backgroundColor: '#ebf5fb'
//   },
//   textHeader: {
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: 'bold',
//     paddingVertical: 10,
//     backgroundColor: '#2e86c1',
//     color: "white"
//   },
//   form: {
//     paddingHorizontal: 5
//   }
// })