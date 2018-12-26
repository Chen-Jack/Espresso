import React from 'react'
import {View} from 'react-native'

interface DotProps{
    color: string
}

const Dot : React.FunctionComponent<DotProps> =  ({color}) => {
    console.log("rendering dot");
    return <View style={{width:5, height: 5, marginHorizontal:1, backgroundColor:color, borderRadius:100}}>
    </View>
}

export default Dot