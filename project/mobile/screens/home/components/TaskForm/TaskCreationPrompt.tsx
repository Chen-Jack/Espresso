import React from 'react'
import {View, Text, Button, Toast, Thumbnail} from 'native-base'
import {TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'
import TaskCreationForm from './TaskCreationForm'

interface PromptState{
    visible : boolean
}


export default class TaskCreationModalPrompt extends React.Component<any, PromptState>{
    constructor(props: any) {
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

    _finishFormSubmission = ()=>{
        Toast.show({
            text: 'Your task was added to your board!',
            buttonText: 'Okay'
          })
        this.togglePrompt()
    }

    render(){
        return <View>
            <TouchableOpacity onPress={this.togglePrompt}>
                {this.props.trigger}
            </TouchableOpacity>
            <Modal
                onBackdropPress= {this.togglePrompt}
                isVisible={this.state.visible}>
                <View>
                    
                    <TaskCreationForm onFormFinishedSubmition={this._finishFormSubmission}/>

                </View>
            </Modal>
        </View>
    }
}
