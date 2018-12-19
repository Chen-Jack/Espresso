import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import DeleteButton from './DeleteButton'
import EditTaskButton from './EditTaskButton'
import {Taskable} from './../../../../Task'

interface EditModeOptionsProps{
    task: Taskable
}

const EditModeOptions : React.FunctionComponent<EditModeOptionsProps> = ({task})=>{
    // console.log("Called?");
    return <View style={{flexDirection:"row"}}>
        <EditTaskButton task={task}/>
        <DeleteButton task_id = {task.task_id}/>
    </View>
    
}

interface CardOptionsProps{
    task: Taskable,
    details: string | null,
    isEditMode: boolean,
    isCollapsed: boolean,
    toggleDetails : any
}

const CardOptions : React.FunctionComponent<CardOptionsProps> = ({task, details, isEditMode, isCollapsed, toggleDetails})=>{
    // console.log("receieved", isEditMode);
    if(isEditMode){
        return <View style={{flexDirection:"row",alignItems:"center"}}>
            <EditModeOptions task={task}/>
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