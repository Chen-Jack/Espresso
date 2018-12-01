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
        AsyncStorage.getItem('session_token', (err, token)=>{
            if(err || !token)
                return this.props.navigation.navigate('landing')

            const task = {
                title: this.state.task_title,
                detail: this.state.task_detail
            }
            fetch('http://localhost:3000/create-task',{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            }).then((res)=>{
                console.log("status", res.status);
                if(res.ok){
                    createTask()
                    this.props.onFormFinishedSubmition()
                }
                else if(res.status === 401){

                }
                else if(res.status === 400){
                    res.json().then(()=>{
                        this.setState({
                            form_errors : errors_txt
                        })
                    })
                }
            }).catch((err)=>{
                console.log("Error when creating task server side", err);
            })
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