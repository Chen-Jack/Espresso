import React from 'react'
import {View, Text, Button} from 'native-base'

export default class extends React.Component{
    static navigationOptions = {
        title: "Test"
    }
    navigateToLanding = ()=>{
        this.props.navigation.navigate('landing')
    }

    render(){
        return <View>
            <Text> Test Screen </Text> 
            <Button onPress={this.navigateToLanding}>
                <Text>Go To Landing</Text>
            </Button>
        </View>
    }
}