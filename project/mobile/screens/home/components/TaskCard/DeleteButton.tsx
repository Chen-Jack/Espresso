import React from 'react'
import {Card, CardItem, Text, Body,Button, View, Badge, Icon,Input} from 'native-base'
import {TouchableOpacity, Alert, TextInput} from 'react-native'
import {UserTaskContext, EditModeContext} from '../../Context'

interface DeleteButtonProps{
    task_id : string
}

const DeleteButton : React.FunctionComponent<DeleteButtonProps> = ({task_id})=>{

    const triggleDeletePrompt = (deleteTaskHandler)=>{
        Alert.alert('Delete Card', "Are you sure?", 
        [
            {
                text: "Cancel", 
                onPress:()=>{}, 
                style:"cancel"
            },
            {
                text: "Delete", 
                onPress:()=>{
                    deleteTaskHandler(task_id)
                }}
        ])
    }

    return <UserTaskContext.Consumer>
        { ({deleteTask} : any)=> <View>
            <TouchableOpacity onPress={triggleDeletePrompt.bind(this, deleteTask)}>
                <Icon style={{fontSize:20, marginHorizontal: 5}} name="trash"/>
            </TouchableOpacity>
            </View>
        }
    </UserTaskContext.Consumer>
    
}

export default DeleteButton