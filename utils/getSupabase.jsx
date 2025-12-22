import { supabase } from "./supabase"
import { typeStructureBeton, hauteurSupport } from "../datas/labels"
import poteaux from '../datas/supportsDRE.json'
import { useSupportStore } from "./store"
import { listDepart } from "./otherfunctions"

export const nbrSupGIS = poteaux.length

export let getAllDatas = async () => {
    let response = await supabase
        .from('supportCollected')
        .select('*')

    let result = response.data
    return result
}
export let getDepartDatas = async (dep) => {
    let response = await supabase
        .from('supportCollected')
        .select('*')
        .eq("depart", dep)

    let result = response.data
    return result
}
export let getSupportEffort = async (dep, value) => {
    let response = await supabase
        .from('supportCollected')
        .select("*")
        .eq('depart', dep)
        .eq('force', value + ' daN')

    let result = response.data
    return result
}

export let getDeparts = async () => {
    let response = await supabase
        .from('supportCollected')
        .select('depart')
    let result = unikDepart(response.data)
    console.log(result)
    return result
}

export let unikDepart = (tab) => {
    let result = []
    let longTab = tab.length
    for (var i = 0; i < longTab; i++) {
        result.push(tab[i].depart)
    }
    result = [...new Set(result)]
    return result
}

export let getSupportHauteurDepart = async (depart, hauteur, effort) => {
    let response = await supabase
        .from('supportCollected')
        .select("*")
        .eq('depart', depart)
        .eq('hauteurBeton', hauteur)

    let result = response.data

    let finalResult = nbrParEffort(result, effort)
    return finalResult
}

export let nbrParEffort = (tab, effort) => {
    let result = 0;
    let longTab = tab.length
    for (var i = 0; i < longTab; i++) {
        if (tab[i].force === effort) {
            if (tab[i].structBeton === "S") {
                result = result + 1
            } else if (tab[i].structBeton === "PS") {
                result = result + 2
            } else if (tab[i].structBeton === "3S") {
                result = result + 3
            }
        }
    }
    return result;
}

export let tabStructure = () => {
    const nbrStructure = typeStructureBeton.length;
    const nbrHauteur = hauteurSupport.length;
    let listStructure = [];
    let listHauteur = []

    for (var i = 0; i < nbrStructure; i++) {
        if (typeStructureBeton[i].value === "") {

        } else {
            listStructure.push(typeStructureBeton[i].value)
        }
    }
    for (var i = 0; i < nbrHauteur; i++) {
        if (hauteurSupport[i].value === "") {

        } else {
            listHauteur.push(hauteurSupport[i].value)
        }

    }
    return {
        struct: listStructure,
        haut: listHauteur
    }
}

export let getDetailStat = (dep, value, handleState, handleLoadingLine, handleNbre) => {
    handleLoadingLine(true)
    const supports = useSupportStore.getState().supports;
    const supportsEffortParDepart = supports.filter(elm => elm.depart === dep && elm.force === value + " daN");


    let struc = tabStructure().struct;
    let haut = tabStructure().haut;
    let nbrStruc = struc.length;
    let nbrHaut = haut.length;

    let response = []
    let hauteurItem = {}
    for (var i = 0; i < nbrHaut; i++) {
        hautItem = {
            hauteur: haut[i],
        }

        let listSurHauteur = supportsEffortParDepart.filter(elm => elm.hauteurBeton == haut[i])

        for (var j = 0; j < nbrStruc; j++) {
            if (listSurHauteur.length == 0) {
                hautItem.hauteur = haut[i]
                hautItem.structure = struc[j];
                hautItem.nbre = 0;
                response.push(hautItem)
                hautItem = {}

            } else {
                hautItem.hauteur = haut[i]
                hautItem.structure = struc[j]
                hautItem.nbre = listSurHauteur.filter(elmt => elmt.structBeton === struc[j]).length;
                response.push(hautItem)
                hautItem = {}
            }
        }
    }
    handleState([...response])
    sumSupport(response, handleNbre)
    handleLoadingLine(false)

}

export let sumSupport = (value, handle) => {
    const longTab = value.length
    let result = 0;
    for (var i = 0; i < longTab; i++) {
        result = result + value[i].nbre
    }
    handle(result)
}

export let sumParHauteur = (dep, handleData, handleErrorGraph, handleLoading) => {
    let listHaut = tabStructure().haut;

    let nbrHaut = listHaut.length;
    let result = [];
    handleLoading(true)

    getDepartDatas(dep)
        .then(res => {
            for (var i = 0; i < nbrHaut; i++) {
                const nbre = res.filter(elm => elm.hauteurBeton == listHaut[i]).length
                result.push(nbre)
            }
            handleData([...result])
            handleLoading(false)
        })
        .catch(err => {
            handleErrorGraph(true)
        })
}

export let nbrSupDepart = (dep) => {
    const nbr = poteaux.filter(elm => elm.depart === dep).length;

    return nbr
}

export let nbrCollectDepart = async (dep) => {
    let response = await supabase.from('supportCollected').select("*").eq('depart', dep)
    let nbr = response.data.length
    return nbr
}

export let nbrCollectEtatDepart = async (dep, etat) => {
    let response = await supabase.from('supportCollected').select("*").eq('depart', dep).eq('etatSup', etat)
    let nbr = response.data.length
    return nbr
}

export let getIDSupport = async (id) => {
    const response = await supabase
        .from('supportCollected')
        .select('*')
        .eq("id", id)
    let result = response.data;
    return result
}


/**** Nouvelle version 17052025 ****/
// export const fetchFromDataBase = async () => {
//     const { data, error } = await supabase.from('supportCollected').select(
//         'id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat'
//     )

//     if (error) {
//         Alert.alert("Erreur d'accès à la BD")
//         return;
//     }

//     return data
// }

/***** mise à jour pour obtenir plus de 1000 celection *****/

async function fetchData(offset = 0, limit = 2000) {
  const { data, error } = await supabase
    .from('supportCollected')
    .select('*')
    .range(offset, offset + limit - 1); // Utiliser range pour la compatibilité avec l'API
    // .range(offset, offset + limit - 1) équivaut à .offset(offset).limit(limit) dans l'API v1
  if (error) {
    console.error("erreur range", error);
    return [];
  }
  return data;
}


async function fetchAllData() {
  let allData = [];
  let offset = 0;
  let batch = [];

  do {
    batch = await fetchData(offset);
    allData = allData.concat(batch);
    offset += batch.length;
  } while (batch.length > 0);

  return allData;
}


export const fetchFromDataBase = async () => {
    // const { data, error } = await supabase.from('supportCollected').select("*")
    const result_D11BERTOUA = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D11 BERTOUA');
    const result_D12BERTOUA = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D12 BERTOUA');
    const result_D31BATOURI = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D31 BATOURI');
    const result_D32BELABO = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D32 BELABO');
    const result_A32BERTOUA = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'A32 BERTOUA');
    const result_D31ABONGMBANG = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D31 ABONG MBANG');
    const result_D31LOMIE = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D31 LOMIE');
    const result_D31YOKADOUMA = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D11 YOKADOUMA');
    const result_D31MOLOUNDOU = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D31 MOLOUNDOU');
    const result_D31GAROUABOULAI = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D31 GAROUA BOULAI');
    const result_D31BETAREOYA = await supabase.from('supportCollected').select('id, created_at, structBois, etatSup, hauteurBois, armemt, nbrIso, nbrChaine, access, structBeton, force, armBeton, hauteurBeton, observ, latitude, longitude, vegetation, depart, imglink, nbrArmBeton, etat').eq('depart', 'D31 BETARE OYA');
    
    
    
    let result = result_D11BERTOUA.data.concat(result_D12BERTOUA.data)
    result = result.concat(result_D31BATOURI.data)
    result = result.concat(result_D32BELABO.data)
    result = result.concat(result_A32BERTOUA.data)
    result = result.concat(result_D31ABONGMBANG.data)
    result = result.concat(result_D31LOMIE.data)
    result = result.concat(result_D31YOKADOUMA.data)
    result = result.concat(result_D31MOLOUNDOU.data)
    result = result.concat(result_D31GAROUABOULAI.data)
    result = result.concat(result_D31BETAREOYA.data)

   
    

    if (!result) {
        Alert.alert("Erreur d'accès à la BD")
        return;
    }

    return result
}

export const updateSupportState = async () => {
    const active = useSupportStore.getState().activeLoading;
    const desactive = useSupportStore.getState().desactiveLoading;
    const updateSupports = useSupportStore.getState().updateSupports;
    const updateListDepartCollected = useSupportStore.getState().updateListDepartCollected;

    active();
    fetchFromDataBase()
        .then(res => {
            desactive()
            updateSupports(res)
            const list = listDepart(res)
            updateListDepartCollected(list)
        })
        .catch(e => {
            Alert.alert("Echec d'acquisition des données")
        })
}

