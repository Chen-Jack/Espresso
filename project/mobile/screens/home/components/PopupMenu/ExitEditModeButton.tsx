import React from 'react'
import {TouchableOpacity, Animated} from 'react-native'
import {Icon} from 'native-base'

interface ButtonProps{

}

export default class ExitEditModeButton<ButtonProps> extends React.Component{
    constructor(props: ButtonProps) {
        super(props)
    }

    componentDidMount(){

        // this.handler = ()=>{}
        // for(let option of this.props.options){
        //     if(option.title === "Edit"){
        //         this.handler = option.handler
        //     }
        // }
    }

    render(){
        return <TouchableOpacity 
            onPress={()=>this.handler()} 
            style={{marginRight: 15}}>
                <Animated.View style={{width:50, scaleX: this.state.scale, scaleY: this.state.scale}}>
                    <Icon type="MaterialIcons" style={{fontSize: 20, color:"white"}} name="done"/>
                </Animated.View>
            </TouchableOpacity>  
    }
}
