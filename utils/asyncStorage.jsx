import AsyncStorage from "@react-native-async-storage/async-storage";

export const handleStore = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.log("Erreur de setting", error)
    }
}

export const getStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        const valueParsed = JSON.parse(value)
        return valueParsed
    } catch (error) {
        console.error('Erreur de getting Item', error)
    }
}

export const mergeStorage = async (key, value) => {
    try {
        await AsyncStorage.mergeItem(key, JSON.stringify(value))
    } catch (error) {
        console.error('Erreur de merging', error)
    }
}

export const getKeysStorage = async () => {
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        setKeyTab([...allKeys])
        console.log(allKeys)
        return allKeys
    } catch (error) {
        console.error('Erreur d obtention des key', error)
    }
}

export const saveStore = async (key, value) => {
    console.log('dans savestore')
    const allKeys = await AsyncStorage.getAllKeys()
    if (allKeys.includes(key)) {
        console.log('data saving')
        const stored = await AsyncStorage.getItem(key)
        let storedTransform = JSON.parse(stored)
        storedTransform.push(value)
        let newValue = JSON.stringify(storedTransform)
        await AsyncStorage.removeItem(key)
        await AsyncStorage.setItem(key, newValue)

    } else {
        console.log('first saving')
        const first = [value]
        handleStore(key, first)
    }}

export const removeKey = async () => {
    try {
        await AsyncStorage.clear()
    } catch (error) {
        console.error('erreur clear', error)
    }
}

export const normaStorage = async ()=> {
    
}
