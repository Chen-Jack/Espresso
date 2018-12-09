import React from 'react'
import {List, Text, ListItem, View} from 'native-base'
import {TouchableOpacity} from 'react-native'
import {Optionable} from './PopupMenu'

interface MenuOptionsProps{
    onChooseOption : ()=>void
    options : Optionable[]
}

export default class MenuOptions extends React.Component<MenuOptionsProps>{
    constructor(props: MenuOptionsProps) {
        super(props)
    }

    _renderItems = ()=>{
        console.log("options", this.props.options);
        if(this.props.options){
            return this.props.options.map((option, index)=>{
                const handler = ()=>{
                    option.handler(()=>{
                        console.log("You chose an option", this.props.onChooseOption);
                        this.props.onChooseOption()
                    })
                }
                return <ListItem key={index}>
                    <TouchableOpacity onPress={handler}>
                        <Text> {option.title} </Text>
                    </TouchableOpacity>
                </ListItem>
            })
        }
        else{
            return null
        }
    }
    render(){
        return <List style={{width: 100}}>
            {this._renderItems()}
        </List>
    }
}

