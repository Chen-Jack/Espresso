import React from 'react'
import {View, Text} from 'react-native'
import {Thumbnail} from 'native-base'

const DrawerHeader = ()=>{
    const uri = "https://banner2.kisspng.com/20180305/oyq/kisspng-coffee-cup-cafe-drawing-hand-painted-brown-coffee-cup-5a9e09deee1988.8455009715203066549753.jpg"
    return <View style={{padding: 0, margin:0, alignItems: "center", justifyContent:"center", backgroundColor:"#222", height: "25%", width:"100%"}}>
        <Thumbnail large source={{uri:uri}}/>

        <Text style={{ marginVertical:10, fontSize:20, color:"white"}}> Task Board </Text>
    </View>
}

export default DrawerHeader