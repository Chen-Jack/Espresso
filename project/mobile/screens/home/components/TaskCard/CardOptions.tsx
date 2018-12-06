import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import DeleteButton from './DeleteButton'
import EditTaskButton from './EditTaskButton'

const Options = ({task})=>{
    return <View style={{flexDirection:"row"}}>
        <EditTaskButton task={task}/>
        <DeleteButton task_id = {task.task_id}/>
    </View>
    
}

const CardOptions = ({task, details, isEditMode, isCollapsed, toggleDetails})=>{
    
    if(isEditMode){
        return <View style={{flexDirection:"row",alignItems:"center"}}>
            <Options task={task}/>
        </View>
    }
    else if(details){
        return <TouchableOpacity onPress={toggleDetails}>
            {isCollapsed ? <Icon type="Entypo" name="chevron-small-down"/> : <Icon type="Entypo" name="chevron-small-up"/>}  
        </TouchableOpacity>
    }
    else{
        return null
    }
}

export default CardOptions