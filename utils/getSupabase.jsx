import { supabase } from "./supabase"
import { typeStructureBeton, hauteurSupport } from "../datas/labels"
import poteaux from '../datas/supportsDRE.json'

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

export let tabStructure = () => {
    const nbrStructure = typeStructureBeton.length;
    const nbrHauteur = hauteurSupport.length;
    let listStructure = [];
    let listHauteur = []

    for (var i = 0; i < nbrStructure; i++) {
        if(typeStructureBeton[i].value === ""){

        } else {
            listStructure.push(typeStructureBeton[i].value)
        }
    }
    for (var i = 0; i < nbrHauteur; i++) {
        if(hauteurSupport[i].value === ""){

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
    getSupportEffort(dep, value).then(res => {
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

            let listSurHauteur = res.filter(elm => elm.hauteurBeton == haut[i])

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
    }).catch(e => {
        handleState([])
    })
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
    console.log('liste des hauteurs =>', listHaut)
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
