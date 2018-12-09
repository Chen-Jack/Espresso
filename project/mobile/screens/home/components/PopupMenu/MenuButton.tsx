import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'


const MenuButton = ({openMenu})=>{
    return <TouchableOpacity onPress={openMenu} style={{marginRight: 15}}>
        <Icon style={{color:"white"}} name="more"/>
    </TouchableOpacity>
}

export default MenuButton