import 'react-native-gesture-handler'
import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function LayoutTech(){

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="(rubriques)" options={{
                tabBarIcon : ({size, color}) => {
                    return <MaterialIcons name="transform" size={24} color={'#1e8449'} />
                },
                tabBarActiveBackgroundColor: "#abebc6",
                // tabBarActiveTintColor: "#1f618d",
                tabBarShowLabel: false
            }}/>
            <Tabs.Screen name="(map)" options={{
                tabBarIcon : ({size, color}) => {
                    return <FontAwesome name="map-marker" size={size} color={"#1e8449"} />
                },
                tabBarActiveBackgroundColor: "#abebc6",
                // tabBarActiveTintColor: "#1f618d",
                tabBarShowLabel: false
            }}/>
        </Tabs>
    )
}