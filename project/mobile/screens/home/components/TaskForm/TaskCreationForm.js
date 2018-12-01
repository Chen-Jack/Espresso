import React from 'react'
import {View, Textarea, Text, Button} from 'native-base'
import {AsyncStorage} from 'react-native'
import PropTypes from 'prop-types'
import UserTaskContext from './../../UserTaskContext'

export default class TaskCreationForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            form_errors : [],
            task_title: "",
            task_detail: ""
        }
    }

    _submitForm = (createTask)=>{
        createTask(this.state.task_title, this.state.task_detail, ()=>{
            this.props.onFormFinishedSubmition()
        })
    }

    render(){
        return <UserTaskContext.Consumer>
        {({createTask})=>{
            return <View style={{padding: 20 , backgroundColor: "white"}}>
                {this.state.form_errors.map((err)=>{
                    return <View>
                        <Text> {err} </Text>
                    </View>
                })}
                <Text> Create Task</Text>
                <Textarea placeholder="Title" onChangeText={(txt)=>this.setState({task_title: txt})}/>
                <Textarea placeholder="Details (Optional)" onChangeText={(txt)=>this.setState({task_detail: txt})}/>
                <Button onPress={()=>this._submitForm(createTask)}>
                    <Text>Submit</Text>
                </Button>   
            </View>
        }}
        </UserTaskContext.Consumer>
    }
}


TaskCreationForm.propTypes = {
    onFormFinishedSubmition : PropTypes.func
}