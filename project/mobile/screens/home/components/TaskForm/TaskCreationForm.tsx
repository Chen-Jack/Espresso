import React from 'react'
import {View, Textarea, Text, Button} from 'native-base'
import {AsyncStorage, TextInput} from 'react-native'
import PropTypes from 'prop-types'
import {UserTaskContext} from './../../Context'

interface FormProps{
    onFormFinishedSubmition : ()=>void
}

interface FormState{
    form_errors : string[],
    task_title : string,
    task_detail: string
}

export default class TaskCreationForm extends React.Component<FormProps, FormState>{
    constructor(props: FormProps) {
        super(props)
        this.state = {
            form_errors : [],
            task_title: "",
            task_detail: ""
        }
    }

    _submitForm = (createTask : any)=>{
        createTask(this.state.task_title, this.state.task_detail, (err: any)=>{
            if(err){
                return console.log("ERROR WHEN CREATING TASK", err);
            }
            this.props.onFormFinishedSubmition()
        })
    }

    render(){
        return <UserTaskContext.Consumer>
        {({createTask} : any)=>{
            return <View style={{padding: 20 , backgroundColor: "white"}}>
                {this.state.form_errors.map((err)=>{
                    return <View>
                        <Text> {err} </Text>
                    </View>
                })}
                <Text> Create Task</Text>
                <TextInput 
                    clearButtonMode = {'while-editing'}
                    placeholder="Title" autoFocus={true}  
                    onChangeText={(txt)=>this.setState({task_title: txt})}/>
                <TextInput 
                    clearButtonMode = {'while-editing'}
                    placeholder="Details (Optional)" 
                    onChangeText={(txt)=>this.setState({task_detail: txt})}/>
                <Button onPress={()=>this._submitForm(createTask)}>
                    <Text>Submit</Text>
                </Button>   
            </View>
        }}
        </UserTaskContext.Consumer>
    }
}
