//The home page for an account

import React from 'react'
import {Container, Content, Text, Button} from 'native-base'
import {AsyncStorage} from 'react-native'

class HomeScreen extends React.Component{
    constructor(props) {
        super(props)

        this._isLoggedIn()
        
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
                <Text> Home Page</Text>
            </Content>
        </Container>
    }
}

export default HomeScreen