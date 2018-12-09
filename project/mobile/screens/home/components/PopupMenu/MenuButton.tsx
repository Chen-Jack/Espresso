import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'

interface MenuButtonProps{
    onPress : ()=>void
}

const MenuButton : React.FunctionComponent<MenuButtonProps> = ({onPress})=>{
    return <TouchableOpacity onPress={onPress} style={{marginRight: 15}}>
        <Icon style={{color:"white"}} name="more"/>
    </TouchableOpacity>
}

export default MenuButton