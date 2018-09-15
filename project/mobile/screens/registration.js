import React from 'react'
import {Container, Content, Input, Text, View, Button, Form, Item} from 'native-base'

class RegistrationForm extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            errors : [],
            usernameField: "",
            passwordField: "",
            passwordConfirmField: ""
        }
    }
    submitForm = ()=>{
        const formData = {
            username: this.state.usernameField,
            password: this.state.passwordField,
            passwordConfirm: this.state.passwordConfirmField
        }

  
        //if good navigate to home
        this.props.success()
     
        
        //if bad, just show errors
    }

    render(){
        return <View>
            {this.state.errors.map((error)=>{
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
                <RegistrationForm success={()=>this.props.navigation.navigate("home")}/>
            </Content>
        </Container>
    }
}


export default RegistrationScreen