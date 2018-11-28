import React from 'react'
import {View, Text, Button, Toast, Thumbnail} from 'native-base'
import {TouchableOpacity} from 'react-native'
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

    _finishFormSubmission = ()=>{
        Toast.show({
            text: 'Your task was added to your board!',
            buttonText: 'Okay'
          })
        this.togglePrompt()
    }

    render(){

        const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
        return <View>
            <TouchableOpacity style={{marginVertical: 10}} onPress={this.togglePrompt}>
                <Thumbnail small source={{uri: uri}} />
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
