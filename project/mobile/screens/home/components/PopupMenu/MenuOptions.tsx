import React from 'react'
import {List, Text, ListItem, View} from 'native-base'
import {TouchableOpacity} from 'react-native'

interface Option{
    title: string,
    handler: any
}

interface MenuOptionsProps{
    onChooseOption : any
    options : Option[]
}


export default class MenuOptions extends React.Component<MenuOptionsProps>{
    constructor(props) {
        super(props)
        console.log("RECEIVED OPTIONS", this.props.onChooseOption, this.props.options, );
    }

    _renderItems = ()=>{
        console.log("options", this.props.options);
        return this.props.options.map((option, index)=>{
            return <ListItem key={index}>
                <TouchableOpacity onPress={()=>option.handler(this.props.toggleMenu)}>
                    <Text> {option.title} </Text>
                </TouchableOpacity>
            </ListItem>
        })
    }
    render(){
        return <List style={{width: 100}}>
            {this._renderItems()}
        </List>
    }
}

