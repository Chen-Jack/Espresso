// The initial screen when a user opens the app (Before Login)
import React from "react";
import {Text, Button, View} from 'native-base'
import {AsyncStorage} from 'react-native'

class LandingScreen extends React.Component{
    
    constructor(props : any){
        super(props)

       
        this._isLoggedIn();
    }

    register = ()=>{
        this.props.navigation.navigate("registration")
    }
    login = ()=>{
        this.props.navigation.navigate("login")
    }

    _isLoggedIn = ()=>{
        AsyncStorage.getItem("session_token", (err , session_token)=>{
            if(err)
                console.log("Home screen", err);
            else{
                if(session_token){
                    this.props.navigation.navigate('home')
                }
            }
        })
    }

   

    render(){
        return <View>
            <Text> ESPRESSO </Text>

            <Button onPress={this.register}>
                <Text> Register </Text>
            </Button>
            <Button onPress={this.login}>
                <Text> Login </Text>
            </Button>


        </View>
    }


}

export default LandingScreen