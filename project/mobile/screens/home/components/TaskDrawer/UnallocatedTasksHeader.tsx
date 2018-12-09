import React from 'react'
import {View, Text} from 'react-native'
import {PopupMenu} from './../PopupMenu'
import {Optionable} from './../PopupMenu'
import {Taskable} from './../../../../Task'

interface HeaderProps{
    task_list: Taskable[]
}

const UnallocatedTasksHeader : React.FunctionComponent<HeaderProps> = ({task_list})=>{

    const options : Optionable[] = []


    return <View style={{
            backgroundColor: "#222", 
            height: 35, width:"100%", 
            flexDirection:"row", 
            justifyContent:"space-between", 
            alignItems:"center", 
            borderTopLeftRadius : 10, 
            borderTopRightRadius : 10}}>

            <Text style={{color:"white", marginHorizontal: 10}}> {task_list.length} tasks </Text>
            {/* <PopupMenu date={null} options={options}/> */}

        </View>
}

export default UnallocatedTasksHeader