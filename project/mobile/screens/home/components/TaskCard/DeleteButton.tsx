import React from 'react'
import {Card, CardItem, Text, Body,Button, View, Badge, Icon,Input} from 'native-base'
import {TouchableOpacity, Alert, TextInput} from 'react-native'
import {UserTaskContext, EditModeContext} from '../../Context'

export default class DeleteButton extends React.Component{
    constructor(props) {
        super(props)
    }

    triggleDeletePrompt = (deleteTaskHandler)=>{
        Alert.alert('Delete Card', "Are you sure?", 
        [
            {text: "Cancel", onPress:()=>{}, style:"cancel"},
            {text:"Delete", onPress:()=>{deleteTaskHandler(this.props.task_id)}}
        ])
    }

    render(){
        return <UserTaskContext.Consumer>
            { ({deleteTask})=> <View>
                <TouchableOpacity onPress={this.triggleDeletePrompt.bind(this,deleteTask)}>
                    <Icon style={{fontSize:20, marginHorizontal: 5}} name="trash"/>
                </TouchableOpacity>
                </View>
            }
        </UserTaskContext.Consumer>
    }
}
