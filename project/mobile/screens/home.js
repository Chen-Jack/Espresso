//The home page for an account

import React from 'react'
import {View, InputGroup , Textarea,Container, Content, Text, Button} from 'native-base'
import {AsyncStorage, TextInput} from 'react-native'

class TaskCreationForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            form_errors : [],
            task_title: "",
            task_detail: ""
        }
    }

    _submitForm = ()=>{
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
            })
        })
    }

    render(){
        return <View>
            {this.state.form_errors.map((err)=>{
                return <View>
                        <Text> {err} </Text>
                    </View>
            })}
            <Text> Create Task</Text>
            <TextInput placeholder="Title" onChangeText={(txt)=>this.setState({task_title: txt})}/>
            <Textarea placeholder="Details" onChangeText={(txt)=>this.setState({task_detail: txt})}/>
            <Button onPress={this._submitForm}>
                <Text>Submit</Text>
            </Button>
        </View>
    }
}

class HomeScreen extends React.Component{
    constructor(props) {
        super(props)
        this._isLoggedIn()

        this.state = {
            user : {
                username: ""
            }
        }   
    }

    componentDidMount(){
        AsyncStorage.getItem("session_token", (err, session_token)=>{
            fetch("http://localhost:3000/get-user-data", {
                headers: {
                    Authorization: `Bearer ${session_token}`
                }
            }).then(
                (res)=>{
                    if(res.ok){
                        res.json().then((user_data)=>{
                            this.setState({
                                user: user_data
                            })
                        })
                    }
                }
            )
        })
    }

    _logout = ()=>{
        AsyncStorage.removeItem("session_token", (err)=>{
            this.props.navigation.navigate('landing')
        })
    }

    _isLoggedIn = ()=>{
        AsyncStorage.getItem("session_token", (err , session_token)=>{
            if(err || !session_token){
                this.props.navigation.navigate('landing')
            }
        })
    }
    

    render(){
        return <Container>
            <Content>
                <Button onPress = {this._logout}> 
                    <Text> Logout</Text>
                </Button>
                <Text> Home Page of {this.state.user.username}</Text>
               

                <TaskCreationForm/>
            </Content>
        </Container>
    }
}

export default HomeScreen