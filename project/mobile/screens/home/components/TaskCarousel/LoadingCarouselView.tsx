import { View, Spinner } from "native-base";
import React from 'react'

export default ()=>{
    return <View style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center", backgroundColor:"#2460c1"}}>
        <Spinner color={"white"}/>
    </View>
}