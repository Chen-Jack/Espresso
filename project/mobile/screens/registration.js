import React from 'react'
import {Container, Content, Input, Text, View, Button, Form, Item} from 'native-base'

class RegistrationForm extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            form_errors : [],
            usernameField: "",
            passwordField: "",
            passwordConfirmField: "",
            emailField: ""
        }
    }
    submitForm = ()=>{
        const formData = {
            username: this.state.usernameField,
            password: this.state.passwordField,
            passwordConfirm: this.state.passwordConfirmField,
            email: this.state.emailField
        }

        fetch("http:/localhost:3000/create-account",{
            method: "POST",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((res)=>{
            console.log("THE STATUS IS", res.status);
            if(res.ok){
                //if good, save token and navigate to home
                res.json().then((token)=>{
                    console.log("Receieved token", token);
                    this.props.successRedirect()
                })
            }
            if(res.status === 400){
                //if bad, just show errors
                console.log("400 status");
                res.json().then((errors_text)=>{
                    console.log("RESPONSE", errors_text, "?");
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
                <Item>
                    <Input onChangeText={(txt)=>this.setState({passwordConfirmField:txt})} placeholder="Confirm Password" value={this.state.passwordConfirmField}/>
                </Item>
                <Item>
                    <Input onChangeText={(txt)=>this.setState({emailField:txt})} placeholder="Email" value={this.state.emailField}/>
                </Item>
            </Form>
            <Button onPress={this.submitForm}>
                <Text> SUBMIT </Text>
            </Button>
        </View>
    }
}

class RegistrationScreen extends React.Component{

    render(){
        return <Container>
            <Content>
                <Text> REGISTER </Text>
                <RegistrationForm successRedirect={()=>this.props.navigation.navigate("home")}/>
            </Content>
        </Container>
    }
}


export default RegistrationScreen