import React from 'react'
import {View} from 'react-native'
import Dot from './Dot'
import { DotMarking } from 'react-native-calendars';

interface MarkingsProps{
    markings: any
}
const Markings : React.FunctionComponent<MarkingsProps> =({markings})=>{
        const renderMarkings = (markings : any)=>{
            if(typeof markings === "object" && markings.hasOwnProperty("dots")){
                return markings.dots.map((dot: any, index: number)=>{
                    return <Dot key = {index} color={dot.color}/>
                })
            }
            else{
                return null
            }
        }

        return <View style={{ width:"95%", height:5, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
            {renderMarkings(markings)}
        </View>
}

export default Markings