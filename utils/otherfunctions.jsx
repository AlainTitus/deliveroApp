
export const nbreSupportDepart = (depart, departs) => {
    let nbre = departs.filter(elm => elm.depart === depart).length;
    return nbre
}

export const listDepart = (departs) => {
    let list = departs.map(elm => elm.depart)
    let listDepart = [...new Set(list)]
    return listDepart
}