import React from 'react'
import {View, Text, Button, Dimensions, AsyncStorage, Alert} from 'react-native'
import Carousel from 'react-native-snap-carousel'


export default class SettingScreen extends React.Component{
    
    render(){

        return (
            <View>
                <Button title="Clear All Data" onPress={()=>{
                    Alert.alert("HOLD ON", "Are you sure you want to delete all your tasks?",[
                        {text:"Keep my tasks", onPress:()=>{}, style:'cancel'},
                        {text:"Delete EVERYTHING", onPress:()=>{AsyncStorage.removeItem("espresso_app")}}
                    ])
        
                }}/>
            </View>
        )
    }
}