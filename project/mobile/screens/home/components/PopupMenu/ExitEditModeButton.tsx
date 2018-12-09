import React from 'react'
import {TouchableOpacity, Animated} from 'react-native'
import {Icon} from 'native-base'

interface ButtonProps{
    onPress : ()=>void
}

export default class ExitEditModeButton extends React.Component<ButtonProps> {
    constructor(props: ButtonProps) {
        super(props)
    }

    render(){
        return <TouchableOpacity 
            onPress={this.props.onPress} 
            style={{marginRight: 15}}>
                <Animated.View>
                    <Icon type="MaterialIcons" style={{fontSize: 20, color:"white"}} name="done"/>
                </Animated.View>
            </TouchableOpacity>  
    }
}
