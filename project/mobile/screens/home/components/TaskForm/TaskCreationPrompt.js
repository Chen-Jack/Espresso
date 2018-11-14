import React from 'react'
import {View, Text, Button} from 'native-base'
import Modal from 'react-native-modal'
import TaskCreationForm from './TaskCreationForm'

export default class TaskCreationModalPrompt extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }
    }

    togglePrompt = ()=>{
        const next_state = !this.state.visible
        this.setState({
            visible: next_state
        })
    }

    render(){
        return <View>
            <Button style={{padding:0, margin:0}} onPress={this.togglePrompt}>
                <Text>Create Task</Text>
            </Button>

            <Modal
                onBackdropPress= {()=>this.togglePrompt()}
                isVisible={this.state.visible}>
                <View>
                    
                    <TaskCreationForm onFormSubmission={this.togglePrompt}/>

                </View>
            </Modal>
        </View>
    }
}
