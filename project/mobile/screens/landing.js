// The initial screen when a user opens the app (Before Login)
import React from 'react';
import {Button, Text, View} from 'native-base'

class Landing extends React.Component{

    render(){
        return <View>
            <Text> ESPRESSO </Text>
            
            <Button>
                <Text> Register </Text>
            </Button>
            <Button>
                <Text> Login </Text>
            </Button>


        </View>
    }


}

export default Landing