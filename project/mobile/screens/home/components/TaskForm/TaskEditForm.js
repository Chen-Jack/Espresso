import React from 'react'
import UserTaskContext from './../../UserTaskContext'
import PropTypes from 'prop-types'
import {View, Button, Textarea, Text} from 'native-base'


export default class TaskEditForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            form_errors : [],
            task_title: this.props.title,
            task_detail: this.props.details
        }
        console.log("taskeditform", this.props.title, this.props.details);
    }

    _submitForm = (editTask)=>{
        editTask(this.props.task_id, this.state.task_title, this.state.task_detail, (err)=>{
            if(!err) this.props.onFormFinishedSubmition()
            else alert("Problem when editing your task.")
        })
    }

    render(){
        return <UserTaskContext.Consumer>
        {({editTask})=>{
            return <View style={{padding: 20 , backgroundColor: "white"}}>
                {this.state.form_errors.map((err)=>{
                    return <View>
                        <Text> {err} </Text>
                    </View>
                })}
                <Text> Update Task </Text>
                <Textarea placeholder="Title" value = {this.state.task_title} onChangeText={(txt)=>this.setState({task_title: txt})}/>
                <Textarea placeholder="Details (Optional)" value = {this.state.task_detail}  onChangeText={(txt)=>this.setState({task_detail: txt})}/>
                <Button onPress={()=>this._submitForm(editTask)}>
                    <Text>Submit</Text>
                </Button>   
            </View>
        }}
        </UserTaskContext.Consumer>
    }

}

TaskEditForm.propTypes = {
    task_id : PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    details: PropTypes.string,
    onFormFinishedSubmition : PropTypes.func
}