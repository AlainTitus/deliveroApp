import { View, Text, StyleSheet, ScrollView, Button, SafeAreaView, Image, Dimensions, Alert, Pressable } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import CustomSelect from '../../../components/CustomSelect'
import CustomInput from '../../../components/CustomInput'
import { agences, typeCompteur, nbrFils, activites } from '../../../datas/labels'
import ElmtPicker from '../../../components/ElmtPicker'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, CameraView } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library';
import { saveStore, getStorage } from '../../../utils/asyncStorage'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync } from 'expo-image-manipulator'
import Checkbox from 'expo-checkbox'
import FormNorma from '../../../components/FormNorma'

export default function Peracenom() {
  

  return (
    <>
          <FormNorma titre={"Normalisation Perace"} action={"norm_perace"} album={"NormaPerace"} store={"normaperace"} headerColor= '#2e86c1' bgColor="#ebf5fb" cameraColor="#1b4f72" buttonColor="#2e86c1" bordColor="#2e86c1" labelColor="#1a5276" checkColor="#1b4f72" />
    </>
  )
}
