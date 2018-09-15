// The initial screen when a user opens the app (Before Login)
import React from 'react';
import {Button, Text, View} from 'native-base'

class LandingScreen extends React.Component{
    register = ()=>{
        this.props.navigation.navigate("registration")
    }
    login = ()=>{
        this.props.navigation.navigate("login")
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