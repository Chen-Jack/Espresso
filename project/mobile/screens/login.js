import React from 'react'
import {Container, Content, Input, Text, View, Button, Form, Item} from 'native-base'
import { AsyncStorage } from "react-native"

class LoginForm extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            form_errors : [],
            usernameField: "",      
            passwordField: "",
        }
    }

    _storeSessionToken = (token)=>{
        return new Promise((resolve, reject) =>{
            AsyncStorage.setItem("session_token", token, (err)=>{
                if(err){
                    console.log("Error with async storage storing token", err);
                    reject(err)
                }
                else{
                    resolve()
                    console.log("Successfully stored token");
                }
            })
        })
    }

    _submitForm = ()=>{
        const formData = {
            username: this.state.usernameField,
            password: this.state.passwordField,
        }

        fetch("http:/localhost:3000/login-account",{
            method: "POST",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((res)=>{
            if(res.ok){
                res.json().then((token)=>{
                    console.log("Login Good got token", token);
                    this._storeSessionToken(token).then(()=>{
                        this.props.successRedirect()
                    })
                })
            }
            else if(res.status === 400){
                res.json().then((errors_text)=>{
                    this.setState({
                        form_errors: errors_text
                    })
                })
            }
            else{
                console.log("Unknown status");
            }
        })
        .catch((err)=>{
            console.log("ERROR", err);
        }) 
    }

    render(){
        return <View>
            {this.state.form_errors.map((error)=>{
                return <Text> {error} </Text>
            })}

            <Form >
                <Item>
                    <Input onChangeText={(txt)=>this.setState({usernameField: txt }) } placeholder="Username" value={this.state.usernameField}/>
                </Item>
                <Item>
                    <Input onChangeText={(txt)=>this.setState({passwordField: txt})} placeholder="Password" value={this.state.passwordField}/>
                </Item>
            </Form>
            <Button onPress={this._submitForm}>
                <Text> SUBMIT </Text>
            </Button>
        </View>
    }
}

class LoginScreen extends React.Component{

    render(){
        return <Container>
            <Content>
                <Text> Login </Text>
                <LoginForm successRedirect={()=>this.props.navigation.navigate("home")}/>
            </Content>
        </Container>
    }
}


export default LoginScreen