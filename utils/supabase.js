// import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'


const EXPO_PUBLIC_SUPABASE_URL = "https://wvqnkutrgzpmgaejuaiz.supabase.co"
const  EXPO_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2cW5rdXRyZ3pwbWdhZWp1YWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODUxODMsImV4cCI6MjA2MDA2MTE4M30.xrupssthCBRJWqxsJ3G0A2FaX1KE8UPHfsY8ioqRh0U"


// use a custom secure storage solution for the Supabase client to store the JWT

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  }
}
export const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL || "",
  EXPO_PUBLIC_SUPABASE_ANON_KEY || "", {
    auth: {
      detectSessionInUrl: false,
      storage: ExpoSecureStoreAdapter
    }
  }
)
        