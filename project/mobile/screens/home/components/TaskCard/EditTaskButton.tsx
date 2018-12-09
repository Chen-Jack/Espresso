import React from 'react'
import {Card, CardItem, Text, Body,Button, View, Badge, Icon,Input} from 'native-base'
import {TouchableOpacity, Alert, TextInput} from 'react-native'
import {Draggable} from './../TravelingList'
import Modal from 'react-native-modal'
import PropTypes, { string } from 'prop-types'
import {UserTaskContext, EditModeContext} from '../../Context'
import Collapsible from 'react-native-collapsible';
import {TaskEditForm} from './../TaskForm'
import CardOptions from './CardOptions'
import {Taskable} from './../../../../Task'

interface EditTaskButtonProps{
    task: Taskable
}

interface EditTaskButtonState{
    isEditing: boolean
}

class EditTaskButton extends React.Component<EditTaskButtonProps, EditTaskButtonState>{
    constructor(props) {
        super(props)

        this.state = {
            isEditing : false
        }
    }

    togglePrompt = ()=>{
        this.setState({
            isEditing: !this.state.isEditing
        })
    }
    render(){
        return <View>
            <TouchableOpacity onPress={this.togglePrompt}>
                <Icon style={{fontSize:20, marginHorizontal: 5}} type={"FontAwesome"} name="pencil"/>
            </TouchableOpacity>

            <Modal onBackdropPress={this.togglePrompt} style={{justifyContent:"center", alignItems:"center"}} isVisible={this.state.isEditing}>
                <TaskEditForm task_id={this.props.task.task_id} title={this.props.task.title} details={this.props.task.details} onFormFinishedSubmition={this.togglePrompt}/>
            </Modal>
        </View>
    }
}

export default EditTaskButton