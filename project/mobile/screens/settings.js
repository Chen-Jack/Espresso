import React from 'react'
import {View, Text, Button, Dimensions, AsyncStorage} from 'react-native'
import Carousel from 'react-native-snap-carousel'


export default class SettingScreen extends React.Component{
    
    render(){

        return (
            <View>
                <Text> Max Tasks per Day </Text>
                <Button title="Clear Cache" onPress={()=>{
                    AsyncStorage.removeItem("espresso_app")
                }}/>
            </View>
        )
    }
}