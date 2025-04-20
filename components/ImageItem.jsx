import { View, Text, Image, Dimensions } from 'react-native'
import React, {useState} from 'react'
import { supabase } from '../utils/supabase'

const {width, height} = Dimensions.get('window')

export default function ImageItem({item, userId}) {
    const [image, setImage] = useState("");

    supabase.storage
    .from("image.supports")
    .download(`${userId}/${item.name}`)
    .then(({data}) => {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
            setImage(fr.result)
        }
    })

    // console.log("image =", image)
  return (
    <View>
      {image ? (
        <View>
            <Image style={{width: width*0.95, height: height * 1/3}} source={{uri: image}} />
        </View>
    ) : (
        <View>
            <Text> No Image</Text>
        </View>
        ) }
    </View>
  )
}