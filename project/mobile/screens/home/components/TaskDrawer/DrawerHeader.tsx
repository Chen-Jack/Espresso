import React from 'react'
import {View, Text} from 'react-native'
import {Thumbnail} from 'native-base'

const DrawerHeader = ()=>{
    const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png"
    return <View style={{padding: 0, margin:0, alignItems: "center", justifyContent:"center", backgroundColor:"#222", height: "25%", width:"100%"}}>
        <Thumbnail large source={{uri:uri}}/>

        <Text style={{ fontSize:20, color:"white"}}> Unallocated Tasks </Text>
    </View>
}

export default DrawerHeader